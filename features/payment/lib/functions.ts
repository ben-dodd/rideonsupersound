import dayjs from 'dayjs'
import { isValidBankAccountNumber } from 'lib/utils'
import { KiwiBankTransactionObject } from './types'

interface KiwiBankBatchFileProps {
  transactions: KiwiBankTransactionObject[]
  batchNumber: string
  sequenceNumber: string
}

export function writeKiwiBankBatchFile({
  transactions,
  batchNumber,
  sequenceNumber,
}: KiwiBankBatchFileProps) {
  let transactionAmount = 0
  let transactionCount = 0
  let hashTotal = 0
  let kbb = []
  kbb.push(writeKBBHeaderRecord({ batchNumber, sequenceNumber }))
  transactions
    ?.filter((t) => isValidBankAccountNumber(t?.accountNumber) && t?.amount)
    .forEach((transaction: KiwiBankTransactionObject) => {
      transactionAmount += transaction?.amount
      transactionCount += 1

      let accountNumber = `${transaction?.accountNumber}`.replace(/\D/g, '')
      // remove bank number
      accountNumber = accountNumber.substring(2)
      // remove suffix
      accountNumber = accountNumber.slice(0, 11)
      // add to hash total
      hashTotal += parseInt(accountNumber)
      kbb.push(writeKBBTransactionRecord({ transaction, batchNumber }))
    })

  let paddedHashTotal = getPaddedHashTotal(hashTotal)

  kbb.push(
    writeKBBFooter({ transactionAmount, transactionCount, paddedHashTotal })
  )

  let csvContent = 'data:text/csv;charset=utf-8,'
  kbb.forEach((rowArray) => {
    let row = rowArray?.join(',')
    csvContent += row + '\r\n'
  })
  return encodeURI(csvContent)
}

export function writeKBBHeaderRecord({ batchNumber, sequenceNumber }) {
  // Example: 1,,,,389016070450500,7,210216,210421,
  const storeAccountNumber = process.env.NEXT_PUBLIC_STORE_ACCOUNT_NUMBER
  return [
    1, // Record Type. 1 denotes the header. Max length 1
    '', // Auth Code. Blank for DC batches. Max length 7
    parseInt(batchNumber?.substring(0, 2)) || '', // Batch Number. Max length 2, optional
    parseInt(sequenceNumber?.substring(0, 4)) || '', // Batch Sequence Number. Max length 4, optional
    parseInt(storeAccountNumber?.substring(0, 16)), // Account Number to be debited. Max length 16.
    7, // Batch Type. Always 7 for DC batches. Max length 1.
    parseInt(dayjs.utc().format('YYMMDD')), // Batch Due Date. YYMMDD. Max length 6. Valid date and not in the past. Can be up to 65 days in advance.
    parseInt(dayjs.utc().format('YYMMDD')), // File Date. YYMMDD. Max length 6. Valid date and not in the future.
    '', // Indicator. Not used. Left blank.
  ]
}

export function writeKBBTransactionRecord({ transaction, batchNumber }) {
  return [
    2, // Record Type. 2 denotes transaction record. Max length 1
    `${transaction?.accountNumber}`.replace(/\D/g, '')?.substring(0, 16), // Account number. Max 16.
    50,
    transaction?.amount,
    transaction?.name?.substring(0, 20),
    'RideOn Pay',
    `${transaction?.vendor_id} ${transaction?.name}`?.substring(0, 12),
    '',
    `Reg ${batchNumber}`?.substring(0, 12),
    'Ride On Super Sound',
    `Reg ${batchNumber}`?.substring(0, 12),
    `${transaction?.vendor_id} ${transaction?.name}`?.substring(0, 12),
    `Seq ${dayjs.utc().format('YYMMDD')}`?.substring(0, 12),
  ]
}

export function writeKBBFooter({
  transactionAmount,
  transactionCount,
  paddedHashTotal,
}) {
  return [3, transactionAmount, transactionCount, parseInt(paddedHashTotal)]
}

export function getPaddedHashTotal(hashTotal) {
  let paddedHashTotal = `00000000000${hashTotal}`
  return paddedHashTotal.slice(paddedHashTotal.length - 11)
}

export function writePaymentNotificationEmail({
  vendors,
  includeUnchecked,
  includeNoBank,
}: any) {
  let csvContent = 'data:text/csv;charset=utf-8,'
  csvContent +=
    'CODE,NAME,RECIPIENT,ACCOUNT,OWING,LINK,DATE,CHECKED,VALID BANK NUM,STORE CREDIT ONLY\r\n'
  // console.log(vendors);
  let vendorArrays = vendors
    ?.filter(
      (v) =>
        (includeUnchecked || v?.is_checked) &&
        (includeNoBank || isValidBankAccountNumber(v?.bank_account_number))
    )
    ?.map((v) => [
      v?.id,
      v?.name,
      v?.email,
      v?.bank_account_number,
      v?.payAmount,
      `https://rideonsupersound.vercel.app/vendor/${v?.uid}`,
      dayjs().format('DD/MM/YYYY'),
      v?.is_checked,
      isValidBankAccountNumber(v?.bank_account_number),
      Boolean(v?.store_credit_only),
    ])
  // console.log(vendorArrays);
  vendorArrays?.forEach((vendorArray) => {
    let row = vendorArray?.join(',')
    csvContent += row + '\r\n'
  })
  return encodeURI(csvContent)
}

export function splitAccountNumber(accountNumber) {
  let number = accountNumber?.replace(/\D/g, '')
  return {
    bank: number.substring(0, 2),
    branch: number.substring(2, 6),
    account: number.substring(6, 13),
    suffix: number.substring(13),
  }
}

export function modulusCheck(accountNumber) {
  // Get bank number, branch number, account number, and suffix
  let accountNumberObj = splitAccountNumber(accountNumber)
  const modulus11Banks = [
    '01',
    '02',
    '03',
    '06',
    '09',
    '11',
    '12',
    '13',
    '14',
    '15',
    '16',
    '17',
    '18',
    '19',
    '20',
    '21',
    '22',
    '23',
    '24',
    '27',
    '30',
    '31',
    '34',
    '36',
    '38',
  ]
  if (accountNumberObj.bank === '08') {
    // Do Modulus 11B Checks
    return modulus11BCheck(accountNumberObj)
  } else if (accountNumberObj.bank === '25') {
    // Do Modulus 10A Checks
    return modulus10ACheck(accountNumberObj)
  } else if (
    accountNumberObj.bank === '09' &&
    accountNumberObj.branch === '0000'
  ) {
    // Do Modulus 11D Checks
    return modulus11DCheck(accountNumberObj)
  } else if (
    parseInt(accountNumberObj.account) >= 990000 &&
    parseInt(accountNumberObj.account) <= 999999 &&
    modulus11Banks.includes(accountNumberObj.bank)
  ) {
    // Do Modulus 11C Checks
    return modulus11CCheck(accountNumberObj)
  } else if (modulus11Banks.includes(accountNumberObj.bank)) {
    // Do Modulus 11A Checks
    return modulus11ACheck(accountNumberObj)
  } else {
    return false
  }
}

export function modulusNumCheck(weightings, checkDigits, modulus = 11) {
  let sum = weightings.reduce(
    (summed, weighting, i) => summed + weighting * checkDigits[i],
    0
  )
  return sum % modulus === 0
}

export function modulus11ACheck(accountNumberObj) {
  // Format 11A
  //   (i) This format is used by bank numbers 01, 02, 03, 06, 09 (where branch number is not 0000), 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 27, 30, 31, 34, 36 and 38
  //   (ii) The account structure is:
  //    2 digit bank 4 digit branch 6 digit account 2 digit suffix
  //   (iii) The account check digits are performed over the four digits of the branch number and six digits of the account number
  //   (iv) The weightings for the calculation are from left to right: 6, 3, 7, 9, 10, 5, 8, 4, 2, 1
  //    The products are added together and the sum divided by 11. If the remainder is zero the account check digits, e.g.  Account Number 01-0902-0068389-00
  // (vi) Dividing by 11 gives 16 with a remainder of 0 (no remainder). Thus, the check digit is correct.
  let checkDigits = `${accountNumberObj.branch}${accountNumberObj.account.slice(
    1
  )}`
    .split('')
    .map((numStr) => parseInt(numStr))
  let weightings = [6, 3, 7, 9, 10, 5, 8, 4, 2, 1]
  return modulusNumCheck(weightings, checkDigits)
}

export function modulus11BCheck(accountNumberObj) {
  // Format 11B
  //   (i) This format is used by bank 08
  //   (ii) The account structure is:
  //    2 digit bank 4 digit branch 7 digit account 3 digit suffix
  //   (iii) The account check digits are performed over the seven digits of the account number only
  //   (iv) The weightings for the calculation are from left to right: 7, 6, 5, 4, 3, 2, 1
  //    The products are added together and the sum divided by 11. If the remainder is zero the account check digits, e.g.  Account Number 08-6523-1954512-001
  // (vi) Dividing by 11 gives 11 with a remainder of 0 (no remainder). Thus, the check digit is correct.
  let checkDigits = accountNumberObj.account
    .split('')
    .map((numStr) => parseInt(numStr))
  let weightings = [7, 6, 5, 4, 3, 2, 1]
  return modulusNumCheck(weightings, checkDigits)
}

export function modulus11CCheck(accountNumberObj) {
  // Format 11C
  // This format is used by bank numbers, 01, 02, 03, 06, 09 (where branch number is not 0000), 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 27, 30, 31, 34, 36 and 38 but only for accounts that fall within the range 990000 - 999999.
  //   (ii) The account structure is:
  //    2 digit bank 4 digit branch 6 digit account 2 digit suffix
  //   (iii) The account check digits are performed over the six digits of the account number only
  //   (iv) The weightings for the calculation are from left to right: 10, 5, 8, 4, 2, 1
  //    The products are added together and the sum divided by 11. If the remainder is zero the account check digits, e.g.  Account Number 01-0902-0998907-00
  // (vi) Dividing by 11 gives 22 with a remainder of 0 (no remainder). Thus, the check digit is correct.
  let checkDigits = accountNumberObj.account
    .slice(1)
    .split('')
    .map((numStr) => parseInt(numStr))
  let weightings = [10, 5, 8, 4, 2, 1]
  return modulusNumCheck(weightings, checkDigits)
}

export function modulus11DCheck(accountNumberObj) {
  // Format 11C
  // This format is reserved for use by bank 09 where the branch number is 0000
  //   (ii) The account structure is:
  //    2 digit bank 4 digit branch 4 digit account 1 digit suffix
  //   (iii) The account check digits are performed over the four digits of the account and one digit of the suffix
  //   (iv) The weightings for the calculation are from left to right: 5, 4, 3, 2, 1
  //    The digits of each product are added together. This step is repeated for any result that has more than one digit. The results of these additions are added and the sum is divided by 11. If the remainder is zero the account check digits, e.g. Account Number: 09-0000-00007471-2
  // (vi) Dividing by 11 gives 2 with a remainder of 0 (no remainder). Thus, the check digit is correct.
  //  (vii) In addition to checking the account number it also necessary to check the serial number
  let checkDigits = `${accountNumberObj.account.slice(-3)}${
    accountNumberObj.suffix
  }`
    .split('')
    .map((numStr) => parseInt(numStr))
  let weightings = [5, 4, 3, 2, 1]
  let sum = weightings.reduce((summed, weighting, i) => {
    let product = weighting * checkDigits[i]
    // Add digits together
    product = (--product % 9) + 1
    return summed + product
  }, 0)
  return sum % 11 === 0
}

export function modulus10ACheck(accountNumberObj) {
  // Format 10A
  // This format is used by bank 25
  //   (ii) The account structure is:
  //    2 digit bank 4 digit branch 7 digit account 3 digit suffix
  //   (iii) The account check digits are performed over the account number only
  //   (iv) The weightings for the calculation are from left to right: 1, 7, 3, 1, 7, 3, 1
  //    The products are added together and the sum divided by 10. If the remainder is zero the account check digits, e.g Account Number: 25-2500-2608486-001
  // (vi) Dividing by 10 gives 11 with a remainder of 0 (no remainder). Thus, the check digit is correct.
  let checkDigits = accountNumberObj.account
    .split('')
    .map((numStr) => parseInt(numStr))
  let weightings = [1, 7, 3, 1, 7, 3, 1]
  return modulusNumCheck(weightings, checkDigits, 10)
}
