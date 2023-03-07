// Components
import TextField from 'components/inputs/text-field'
import { TillObject } from 'lib/types/register'

export default function CashMap({ till, setTill }: { till: TillObject; setTill: Function }) {
  function isError(val: string) {
    return val && (isNaN(parseInt(val)) || parseInt(val) < 0)
  }

  const noteInputs = [
    { label: '$100s', field: 'oneHundredDollar' },
    { label: '$50s', field: 'fiftyDollar' },
    { label: '$20s', field: 'twentyDollar' },
    { label: '$10s', field: 'tenDollar' },
    { label: '$5s', field: 'fiveDollar' },
  ]
  const coinInputs = [
    { label: '$2s', field: 'twoDollar' },
    { label: '$1s', field: 'oneDollar' },
    { label: '50c', field: 'fiftyCent' },
    { label: '20c', field: 'twentyCent' },
    { label: '10c', field: 'tenCent' },
  ]

  return (
    <div className="border-2 p-2 mt-2 rounded-md">
      <div className="text-2xl">Notes</div>
      <div className="grid grid-cols-5 gap-2 mb-2">
        {noteInputs.map((input) => (
          <TextField
            key={input.label}
            inputLabel={input.label}
            labelClass="text-lg"
            divClass="text-3xl"
            inputClass="w-full"
            selectOnFocus
            error={isError(`${till[input.field] || 0}`)}
            value={`${till[input.field] || ''}`}
            onChange={(e: any) => setTill({ ...till, [input.field]: e.target.value })}
          />
        ))}
      </div>
      <div className="text-2xl">Coins</div>
      <div className="grid grid-cols-5 gap-2">
        {coinInputs.map((input) => (
          <TextField
            key={input.label}
            inputLabel={input.label}
            labelClass="text-lg"
            divClass="text-3xl"
            inputClass="w-full"
            selectOnFocus
            error={isError(`${till[input.field] || 0}`)}
            value={`${till[input.field] || ''}`}
            onChange={(e: any) => setTill({ ...till, [input.field]: e.target.value })}
          />
        ))}
      </div>
    </div>
  )
}
