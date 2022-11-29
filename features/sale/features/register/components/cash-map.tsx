// Components
import TextField from 'components/inputs/text-field'
import { TillObject } from 'lib/types'

export default function CashMap({
  till,
  setTill,
}: {
  till: TillObject
  setTill: Function
}) {
  // Functions
  function isError(val: string) {
    return val && (isNaN(parseInt(val)) || parseInt(val) < 0)
  }

  return (
    <div className="bg-col1 p-2 mt-2 rounded-md">
      <div className="text-2xl">Notes</div>
      <div className="grid grid-cols-5 gap-2 mb-2">
        <TextField
          inputLabel="$100s"
          divClass="text-3xl"
          inputClass="w-full"
          selectOnFocus
          error={isError(`${till?.oneHundredDollar}`)}
          value={`${till?.oneHundredDollar}`}
          onChange={(e: any) =>
            setTill({ ...till, oneHundredDollar: e.target.value })
          }
        />
        <TextField
          inputLabel="$50s"
          divClass="text-3xl"
          selectOnFocus
          value={`${till?.fiftyDollar}`}
          error={isError(`${till?.fiftyDollar}`)}
          onChange={(e: any) =>
            setTill({ ...till, fiftyDollar: e.target.value })
          }
        />
        <TextField
          inputLabel="$20s"
          divClass="text-3xl"
          selectOnFocus
          value={`${till?.twentyDollar}`}
          error={isError(`${till?.twentyDollar}`)}
          onChange={(e: any) =>
            setTill({ ...till, twenty_dollar: e.target.value })
          }
        />
        <TextField
          inputLabel="$10s"
          divClass="text-3xl"
          selectOnFocus
          value={till?.ten_dollar}
          error={isError(till?.ten_dollar)}
          onChange={(e: any) =>
            setTill({ ...till, ten_dollar: e.target.value })
          }
        />
        <TextField
          inputLabel="$5s"
          divClass="text-3xl"
          selectOnFocus
          value={till?.five_dollar}
          error={isError(till?.five_dollar)}
          onChange={(e: any) =>
            setTill({ ...till, five_dollar: e.target.value })
          }
        />
      </div>
      <div className="text-2xl">Coins</div>
      <div className="grid grid-cols-5 gap-2">
        <TextField
          inputLabel="$2s"
          divClass="text-3xl"
          selectOnFocus
          value={till?.two_dollar}
          error={isError(till?.two_dollar)}
          onChange={(e: any) =>
            setTill({ ...till, two_dollar: e.target.value })
          }
        />
        <TextField
          inputLabel="$1s"
          divClass="text-3xl"
          selectOnFocus
          value={till?.one_dollar}
          error={isError(till?.one_dollar)}
          onChange={(e: any) =>
            setTill({ ...till, one_dollar: e.target.value })
          }
        />
        <TextField
          inputLabel="50¢s"
          divClass="text-3xl"
          selectOnFocus
          value={till?.fifty_cent}
          error={isError(till?.fifty_cent)}
          onChange={(e: any) =>
            setTill({ ...till, fifty_cent: e.target.value })
          }
        />
        <TextField
          inputLabel="20¢s"
          divClass="text-3xl"
          selectOnFocus
          value={till?.twenty_cent}
          error={isError(till?.twenty_cent)}
          onChange={(e: any) =>
            setTill({ ...till, twenty_cent: e.target.value })
          }
        />
        <TextField
          inputLabel="10¢s"
          divClass="text-3xl"
          selectOnFocus
          value={till?.ten_cent}
          error={isError(till?.ten_cent)}
          onChange={(e: any) => setTill({ ...till, ten_cent: e.target.value })}
        />
      </div>
    </div>
  )
}
