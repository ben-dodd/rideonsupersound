import { VendorObject } from 'lib/types/vendor'
import CreateableSelect from 'components/inputs/createable-select'
import { useAppStore } from 'lib/store'
import { useVendors, createVendor, useVendor } from 'lib/api/vendor'
import SettingsSelect from 'components/inputs/settings-select'
import SectionPanel from 'components/container/section-panel'
import { ArrowRight, Info, Money, Save, Storefront } from '@mui/icons-material'
import RadioButton from 'components/inputs/radio-button'
import ChangePriceForm from '../change-price-form'
import GeneralDetails from 'features/vendor/item-vendor/general-details'
import Loading from 'components/placeholders/loading'
import { saveReceiveBatch } from 'lib/api/stock'
import { useSWRConfig } from 'swr'
import { useRouter } from 'next/router'

export default function SetupReceive({ setStage, setBypassConfirmDialog }) {
  const { batchReceiveSession, setBatchReceiveSession } = useAppStore()
  const { vendors, mutateVendors } = useVendors()
  const { vendor, isVendorLoading } = useVendor(`${batchReceiveSession?.vendorId}`)
  const { mutate } = useSWRConfig()
  const router = useRouter()

  return (
    <div>
      <div className="flex justify-between p-2">
        <div className="text-2xl">SETUP VENDOR AND DEFAULTS</div>
        <div className="px-4">
          <button
            className="icon-text-button-highlight"
            disabled={!batchReceiveSession?.vendorId}
            onClick={() => setStage('add')}
          >
            ADD ITEMS <ArrowRight />
          </button>
          <button
            className="icon-text-button"
            disabled={!batchReceiveSession?.vendorId}
            onClick={() => {
              saveReceiveBatch(batchReceiveSession).then((savedBatchPayment) => {
                mutate(`vendor/payment/batch/${savedBatchPayment?.id}`, savedBatchPayment)
                setBypassConfirmDialog(true).then(() => router.push(`/stock`))
                // router.push('/stock')
              })
            }}
          >
            SAVE AND CLOSE <Save />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <SectionPanel icon={<Storefront />} title="Vendor" collapsible={false}>
            <CreateableSelect
              autoFocus
              inputLabel="SELECT VENDOR"
              value={batchReceiveSession?.vendorId}
              label={vendors?.find((v: VendorObject) => v?.id === batchReceiveSession?.vendorId)?.name || ''}
              onChange={(vendorObject: any) => {
                setBatchReceiveSession({
                  vendorId: parseInt(vendorObject?.value),
                })
              }}
              onCreateOption={async (vendorName: string) => {
                const vendorId = await createVendor({ name: vendorName })
                await mutateVendors()
                setBatchReceiveSession({ vendorId })
              }}
              options={vendors?.map((val: VendorObject) => ({
                value: val?.id,
                label: val?.name || '',
              }))}
            />
            {batchReceiveSession?.vendorId ? (
              isVendorLoading ? (
                <Loading />
              ) : (
                <GeneralDetails vendor={vendor} />
              )
            ) : (
              <div />
            )}
          </SectionPanel>
        </div>
        <div>
          <SectionPanel icon={<Info />} title="Default Stock Details">
            <div className="help-text pb-4">
              Select the default information for the batch. You can still edit information for individual items.
            </div>
            <SettingsSelect
              object={batchReceiveSession}
              onEdit={setBatchReceiveSession}
              inputLabel="TYPE"
              dbField="media"
              isCreateDisabled={true}
            />
            <SettingsSelect
              object={batchReceiveSession}
              onEdit={setBatchReceiveSession}
              inputLabel="FORMAT"
              dbField="format"
            />
            <div className="flex items-end">
              <RadioButton
                key={`isNew${batchReceiveSession?.isNew}`}
                inputLabel="CONDITION"
                group="isNew"
                value={batchReceiveSession?.isNew ? 'true' : 'false'}
                onChange={(value: string) => setBatchReceiveSession({ isNew: value === 'true' ? 1 : 0 })}
                options={[
                  { id: 'new', value: 'true', label: 'New' },
                  { id: 'used', value: 'false', label: 'Used' },
                ]}
              />
              <SettingsSelect
                className="w-full"
                object={batchReceiveSession}
                onEdit={setBatchReceiveSession}
                dbField="cond"
                isCreateDisabled={true}
                sorted={false}
              />
            </div>
            <div className="grid grid-cols-2 gap-2 items-center justify-center">
              <SettingsSelect
                object={batchReceiveSession}
                onEdit={setBatchReceiveSession}
                inputLabel="SECTION"
                dbField="section"
                isCreateDisabled={true}
              />
              <SettingsSelect
                object={batchReceiveSession}
                onEdit={setBatchReceiveSession}
                inputLabel="COUNTRY"
                dbField="country"
              />
            </div>
            <SettingsSelect
              object={batchReceiveSession}
              onEdit={setBatchReceiveSession}
              inputLabel="GENRE / TAGS"
              isMulti
              dbField="genre"
            />
            <div className="flex items-center mt-4">
              <input
                type="checkbox"
                className="cursor-pointer"
                checked={batchReceiveSession?.doReorder}
                onChange={(e) => setBatchReceiveSession({ doReorder: e.target.checked ? 1 : 0 })}
              />
              <div className="ml-2">Reorder items from vendor when stocks are low</div>
            </div>
            <div className="flex items-center my-2">
              <input
                type="checkbox"
                className="cursor-pointer"
                checked={batchReceiveSession?.doListOnWebsite}
                onChange={(e) => setBatchReceiveSession({ doListOnWebsite: e.target.checked ? 1 : 0 })}
              />
              <div className="ml-2">List items on website</div>
            </div>
          </SectionPanel>
          <SectionPanel title={'Default Prices'} icon={<Money />}>
            {/* <div className="flex items-center">
              <input
                type="checkbox"
                className="cursor-pointer"
                checked={batchReceiveSession?.lockToMargin}
                onChange={(e) => setBatchReceiveSession({ lockToMargin: e.target.checked ? 1 : 0 })}
              />
              <div className="ml-2">Lock prices to default margin</div>
            </div>
            <TextField
              inputLabel="Default Margin To Lock Prices To"
              divClass="text-4xl w-full bg-green-200 hover:bg-green-300"
              endAdornment="%"
              inputClass="text-center"
              valueNum={parseInt(batchReceiveSession?.defaultMargin) || 25}
              inputType="number"
              max={100}
              min={0}
              error={batchReceiveSession?.defaultMargin && isNaN(parseInt(batchReceiveSession?.defaultMargin))}
              onChange={(e) => setBatchReceiveSession({ defaultMargin: e.target.value })}
            /> */}
            <div className="help-text pb-4">
              Select the default prices for the batch. You can still edit prices individually.
            </div>
            <ChangePriceForm obj={batchReceiveSession} setObj={setBatchReceiveSession} />
          </SectionPanel>
        </div>
      </div>
    </div>
  )
}