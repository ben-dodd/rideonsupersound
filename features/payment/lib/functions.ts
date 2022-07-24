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
  console.log(accountNumberObj)
  const modulus11Banks = [
    '01',
    '02',
    '03',
    '06',
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
  if (
    modulus11Banks.includes(accountNumberObj.bank) ||
    (accountNumberObj.bank === '09' && accountNumberObj.branch !== '0000')
  ) {
    // Do Modulus 11 Checks
    return modulus11ACheck(accountNumberObj)
  }
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
  let checkDigits = `${
    accountNumberObj.branch
  }${accountNumberObj.account.substring(1)}`
    .split('')
    .map((numStr) => parseInt(numStr))
  let weightings = [6, 3, 7, 9, 10, 5, 8, 4, 2, 1]
  let sum = weightings.reduce(
    (summed, weighting, i) => summed + weighting * checkDigits[i],
    0
  )
  return sum % 11 === 0
}
