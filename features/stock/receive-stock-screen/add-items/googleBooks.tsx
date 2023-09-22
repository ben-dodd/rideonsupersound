import { Search } from '@mui/icons-material'
import TextField from 'components/inputs/text-field'
import GoogleBooksOption from 'features/stock/api-google-books/google-books-option'
import { getGoogleBooksOptionsByKeyword } from 'lib/functions/googleBooks'
import { getDefaultReceiveItem } from 'lib/functions/receiveStock'
import { useAppStore } from 'lib/store'
import debounce from 'lodash/debounce'
import { useMemo, useState } from 'react'

export default function GoogleBooks() {
  const { batchReceiveSession, addBatchReceiveItem } = useAppStore()
  const [keyword, setKeyword] = useState('')
  const [googleBooksOptions, setGoogleBooksOptions] = useState([])
  const defaultItem = getDefaultReceiveItem(batchReceiveSession)
  const addItem = (item) => {
    console.log(item)
    addBatchReceiveItem({ ...defaultItem, item: { ...defaultItem?.item, ...item } })
    setGoogleBooksOptions([])
  }
  const searchGoogleBooks = async (k) => {
    const results = await getGoogleBooksOptionsByKeyword(k)
    if (results && results?.length > 0) setGoogleBooksOptions(results)
  }
  const debouncedSearch = useMemo(() => debounce(searchGoogleBooks, 2000), [])
  return (
    <div>
      <img
        src={`${process.env.NEXT_PUBLIC_RESOURCE_URL}img/google-books-logo.png`}
        alt="GoogleBooks Logo"
        width="100px"
        height="50px"
      />
      <TextField
        id="keyword"
        value={keyword || ''}
        onChange={(e) => {
          setKeyword(e.target.value)
          debouncedSearch(e.target.value)
        }}
        inputLabel="Search Keywords (e.g. 'the bible')"
        startAdornment={<Search />}
        clearButton
      />
      {googleBooksOptions?.length > 0 ? (
        googleBooksOptions?.map((googleBooksOption, k) => (
          <GoogleBooksOption
            googleBooksOption={googleBooksOption}
            key={k}
            vendorId={batchReceiveSession?.vendorId}
            isNew={true}
            setItem={addItem}
            overrideItemDetails={true}
            runDatabaseFunctions={false}
          />
        ))
      ) : keyword === '' ? (
        <div />
      ) : (
        <div>Nothing found...</div>
      )}
    </div>
  )
}
