import TextField from 'components/inputs/text-field'
import { useAppStore } from 'lib/store'
import PayButtons from './pay-buttons'
import Summary from './summary'
import Actions from './actions'
import Image from 'next/image'

export default function Pay({ totalRemaining }) {
  const { cart, setCartSale } = useAppStore()
  const { sale = {} } = cart || {}
  // TODO if totalRemaining hasn't loaded it should show loading screen

  return (
    <div className="flex flex-col justify-between h-main">
      {totalRemaining !== undefined && totalRemaining !== null ? (
        <>
          <div>
            <Summary totalRemaining={totalRemaining} />
            {totalRemaining !== 0 && <PayButtons totalRemaining={totalRemaining} />}
            {/* <CustomerForm />
      <MailOrderForm /> */}
            {totalRemaining !== 0 && (
              <TextField
                inputLabel="Note"
                multiline
                rows={2}
                value={sale?.note}
                onChange={(e: any) => setCartSale({ note: e.target.value })}
              />
            )}
          </div>
          {totalRemaining === 0 && (
            <Image
              className="m-auto inline-block"
              src={`${process.env.NEXT_PUBLIC_RESOURCE_URL}img/reaper.png`}
              alt="Sale Completed"
              width={200}
              height={200}
            />
          )}
          <Actions totalRemaining={totalRemaining} />
        </>
      ) : (
        <div className="w-full h-full flex justify-center items-center">...</div>
      )}
    </div>
  )
}

// TODO Add refund items/ refund transactions
// TODO Add split sale for when person wants to take one layby item etc.
