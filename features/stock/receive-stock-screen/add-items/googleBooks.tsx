import TextField from 'components/inputs/text-field'
import DiscogsOption from 'features/stock/api-discogs/discogs-option'
import { getDiscogsOptions } from 'lib/functions/discogs'
import { useAppStore } from 'lib/store'
import debounce from 'lodash/debounce'
import { useMemo, useState } from 'react'
import { v4 as uuid } from 'uuid'

export default function GoogleBooks() {
  const [barcode, setBarcode] = useState('')
  const [keyword, setKeyword] = useState('')
  const [discogsOptions, setDiscogsOptions] = useState([])
  const [key, setKey] = useState(uuid())
  const handleChange = async (barcode) => {
    if (barcode !== '') {
      const results: any = await getDiscogsOptions({ barcode })
      if (results && results?.length > 0) {
        setDiscogsOptions(results)
      }
    }
  }
  const { batchReceiveSession, addBatchReceiveItem } = useAppStore()
  const addItem = (item) => {
    addBatchReceiveItem(item)
    setBarcode('')
    setKey(uuid())
    setDiscogsOptions([])
  }
  const searchDiscogs = async (k) => {
    const results = await getDiscogsOptions({ query: k })
    if (results && results?.length > 0) setDiscogsOptions(results)
  }
  const debouncedSearch = useMemo(() => debounce(searchDiscogs, 2000), [])
  const debouncedBarcode = useMemo(() => debounce(handleChange, 2000), [])

  return (
    <div>
      <div className="helper-text mb-2">
        Use the barcode scanner to scan the item and select the correct option from Discogs.
      </div>
      <TextField
        key={key}
        id="barcode"
        value={barcode || ''}
        onChange={(e) => {
          setBarcode(e.target.value)
          debouncedBarcode(e.target.value)
        }}
        inputLabel="Barcode"
        autoFocus
        selectOnFocus
      />
      <TextField
        id="keyword"
        value={keyword || ''}
        onChange={(e) => {
          setKeyword(e.target.value)
          debouncedSearch(e.target.value)
        }}
        inputLabel="Search Keywords (e.g. 'palace of wisdom common threads cdr')"
      />
      {discogsOptions?.length > 0 ? (
        discogsOptions?.map((discogsOption, k) => (
          <DiscogsOption
            discogsOption={discogsOption}
            key={k}
            vendorId={batchReceiveSession?.vendorId}
            isNew={true}
            setItem={addItem}
            overrideItemDetails={true}
          />
        ))
      ) : barcode === '' ? (
        <div />
      ) : (
        <div>Nothing found...</div>
      )}
    </div>
  )
}
