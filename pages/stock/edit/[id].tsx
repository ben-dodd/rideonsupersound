// Packages
import { useEffect, useState } from 'react'
import { ModalButton, StockObject } from 'lib/types'
import InventoryItemForm from 'features/inventory/features/item-stock/components/stock-item-form'
import { useRouter } from 'next/router'
import { useStockItem } from 'lib/api/stock'
import Layout from 'components/layout'
import ScreenContainer from 'components/container/screen'
import { isEqual } from 'lodash'
import { useAppStore } from 'lib/store'

export default function InventoryItemScreen() {
  const router = useRouter()
  const { id } = router.query
  const { openConfirm } = useAppStore()
  const { stockItem, isStockItemLoading } = useStockItem(`${id}`)
  const [item, setItem]: [StockObject, Function] = useState({})

  useEffect(() => {
    if (stockItem) setItem(stockItem)
  }, [stockItem])

  const saveStockItem = () => {
    console.log('Saving item...')
  }

  useEffect(() => {
    const exitingFunction = () => {
      if (!isEqual(stockItem, item)) {
        // https://github.com/vercel/next.js/issues/2476
        openConfirm({
          open: true,
          title: 'Discard Changes?',
          message: 'You have unsaved changes. Do you want to save them?',
          action: saveStockItem,
        })
      }
    }
    router.events.on('routeChangeStart', exitingFunction)
    return () => router.events.off('routeChangeStart', exitingFunction)
  }, [])

  const handleCancelClick = () => {
    router.push(`../${id}`)
  }

  const handleSaveClick = () => {
    router.push(`../${id}`)
  }

  const buttons: ModalButton[] = [
    {
      type: 'cancel',
      onClick: handleCancelClick,
      text: 'CANCEL',
    },
    {
      type: 'ok',
      onClick: handleSaveClick,
      text: 'SAVE',
    },
  ]

  return (
    <ScreenContainer
      title="Edit Stock Item"
      loading={isStockItemLoading}
      buttons={buttons}
    >
      <InventoryItemForm item={item} setItem={setItem} />
    </ScreenContainer>
  )
}

InventoryItemScreen.getLayout = (page) => <Layout>{page}</Layout>

// import { useState } from 'react';
// import useSWR from 'swr';

// function EditPage() {
//   // Use the useSWR hook to load the object from the database
//   const { data: initialObject } = useSWR('/api/getObject');

//   // Use the useState hook to manage the state of the object being edited
//   const [object, setObject] = useState(initialObject);

//   // Update the object state whenever a form field is changed
//   const handleChange = (event) => {
//     const { name, value } = event.target;
//     setObject({ ...object, [name]: value });
//   };

//   return (
//     <form>
//       {/* Render the form fields, passing the object state and change handler to the form component */}
//       <FormFields object={object} onChange={handleChange} />
//       <Button onClick={() => saveObject(object)}>Save</Button>
//     </form>
//   );
// }
