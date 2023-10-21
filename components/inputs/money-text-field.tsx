import TextField, { TextFieldProps } from './text-field'
import { centsToDollars, dollarsToCents } from 'lib/utils'

export default function MoneyTextField(textFieldProps: TextFieldProps) {
  const moneyTextProps = {
    ...textFieldProps,
    startAdornment: '$',
    onChange: textFieldProps?.onChange ? textFieldProps?.onChange((e) => dollarsToCents(e?.target?.value)) : null,
    value: textFieldProps?.value ? `${centsToDollars(textFieldProps?.value)}` : '',
  }
  return <TextField {...moneyTextProps} />
}
