import { pdf, Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer'

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#E4E4E4',
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
})

// Create Document Component
const VendorReport = ({ vendor }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text>Section #1</Text>
        <Text>{vendor?.name}</Text>
      </View>
      <View style={styles.section}>
        <Text>Section #2</Text>
      </View>
    </Page>
  </Document>
)

const renderUrl = (vendor) =>
  new Promise(async (resolve, reject) => {
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
          aTag.href = generatedUrl
          aTag.style = 'display: none'
          aTag.download = 'VendorReport.pdf'
          document.body.appendChild(aTag)
          aTag.click()
        } // else -> means something went wrong during pdf generation
      })
      .catch((err) => console.log(err))
  }
}
