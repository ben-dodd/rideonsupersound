import TextField from '@/components/_components/inputs/text-field'
import { receiveStockAtom } from '@/lib/atoms'
import {
  getDiscogsOptionsByBarcode,
  getDiscogsOptionsByKeyword,
  getGoogleBooksOptionsByBarcode,
  getGoogleBooksOptionsByKeyword,
} from '@/lib/data-functions'
import { useAtom } from 'jotai'
import { useCallback, useState } from 'react'
import DiscogsOption from '../../discogs-panel/discogs-option'
import { v4 as uuid } from 'uuid'
import debounce from 'lodash/debounce'
import GoogleBooksOption from '../../google-books-panel/google-books-option'

export default function GoogleBooks() {
  const [barcode, setBarcode] = useState('')
  const [keyword, setKeyword] = useState('')
  const [googleBooksOptions, setGoogleBooksOptions] = useState([])
  const [key, setKey] = useState(uuid())
  const handleChange = async (val) => {
    console.log(val)
    if (val !== '') {
      const results: any = await getGoogleBooksOptionsByBarcode(val)
      console.log(results)
      if (results && results?.length > 0) {
        setGoogleBooksOptions(results)
      }
    }
  }
  const [basket, setBasket] = useAtom(receiveStockAtom)
  const addItem = (item) => {
    setBasket({
      ...basket,
      items: basket?.items
        ? [...basket?.items, { key: uuid(), item }]
        : [{ key: uuid(), item }],
    })
    setBarcode('')
    setKey(uuid())
    setGoogleBooksOptions([])
  }
  const searchGoogleBooks = async (k) => {
    const results = await getGoogleBooksOptionsByKeyword(k)
    if (results && results?.length > 0) setGoogleBooksOptions(results)
  }
  const debouncedSearch = useCallback(debounce(searchGoogleBooks, 2000), [])
  const debouncedBarcode = useCallback(debounce(handleChange, 2000), [])

  return (
    <div>
      <div className="helper-text mb-2">
        Use the barcode scanner to scan the item and select the correct option
        from GoogleBooks.
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
      {googleBooksOptions?.length > 0 ? (
        googleBooksOptions?.map((opt, k) => (
          <GoogleBooksOption
            opt={opt}
            key={k}
            item={{ vendor_id: basket?.vendor_id }}
            setItem={addItem}
            override={true}
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
