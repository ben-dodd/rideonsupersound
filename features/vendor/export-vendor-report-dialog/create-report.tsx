import { pdf, Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer'
import dayjs from 'dayjs'
import { getItemDisplayName } from 'lib/functions/displayInventory'
import { dateSimple } from 'lib/types/date'
import { priceCentsString } from 'lib/utils'

// Create styles
const styles = StyleSheet.create({
  page: {
    backgroundColor: '#E4E4E4',
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  tableHeader: {
    flex: 'row',
    backgroundColor: 'brown',
    color: 'white',
    fontSize: 8,
    alignItems: 'center',
  },
  tableRow: {
    flex: 'row',
    fontSize: 12,
    alignItems: 'center',
  },
})

// Create Document Component
const VendorReport = ({ vendor }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text>{vendor?.name}</Text>
      </View>
      <View style={styles.tableHeader}>
        <Text>ID</Text>
        <Text>DATE</Text>
        <Text>ITEMS</Text>
        <Text>FORMAT</Text>
        <Text>TOTAL RETAIL</Text>
        <Text>VENDOR CUT</Text>
      </View>
      {vendor?.sales?.map((sale) => (
        <View key={sale?.id} style={styles.tableRow}>
          <Text>#{sale?.saleId}</Text>
          <Text>{dayjs(sale?.dateSaleClosed).format(dateSimple)}</Text>
          <Text>{`${sale?.quantity} x ${getItemDisplayName(sale)}${sale?.isRefunded ? ' [REFUNDED]' : ''}`}</Text>
          <Text>{sale?.format}</Text>
          <Text>{priceCentsString(sale?.itemTotalSell)}</Text>
          <Text>{`${priceCentsString(sale?.itemVendorCut)}${
            sale?.vendorDiscount ? ` (${sale?.vendorDiscount}% DISCOUNT)` : ''
          }`}</Text>
        </View>
      ))}
    </Page>
  </Document>
)

const renderUrl = (vendor) =>
  new Promise(async (resolve) => {
    const blob = await pdf(<VendorReport vendor={vendor} />).toBlob()
    const url = URL.createObjectURL(blob)
    if (url && url.length > 0) {
      resolve(url)
    }
  })
    .then((res) => res)
    .catch((err) => console.log(err))

export const getVendorReport = (vendor) => {
  let sampleTab = window.open()
  if (sampleTab) {
    renderUrl(vendor)
      .then((generatedUrl) => {
        if (generatedUrl) {
          let aTag = document.createElement('a')
          aTag.href = `${generatedUrl}`
          aTag.style = 'display: none'
          aTag.download = 'VendorReport.pdf'
          document.body.appendChild(aTag)
          aTag.click()
        } // else -> means something went wrong during pdf generation
      })
      .catch((err) => console.log(err))
  }
}
