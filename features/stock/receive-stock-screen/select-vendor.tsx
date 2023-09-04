import { VendorObject } from 'lib/types/vendor'
import CreateableSelect from 'components/inputs/createable-select'
import { useAppStore } from 'lib/store'
import { useVendors, createVendor } from 'lib/api/vendor'
import SettingsSelect from 'components/inputs/settings-select'
import SectionPanel from 'components/container/section-panel'
import { Info, Money, Storefront } from '@mui/icons-material'
import RadioButton from 'components/inputs/radio-button'
import ChangePriceForm from '../change-price-form'

export default function SelectVendor() {
  const { receiveBasket, setReceiveBasket } = useAppStore()
  const { vendors, mutateVendors } = useVendors()
  console.log(receiveBasket)

  return (
    <div className="grid grid-cols-2 gap-2">
      <div>
        <SectionPanel icon={<Storefront />} title="Vendor">
          <CreateableSelect
            inputLabel="SELECT VENDOR"
            value={receiveBasket?.vendorId}
            label={vendors?.find((v: VendorObject) => v?.id === receiveBasket?.vendorId)?.name || ''}
            onChange={(vendorObject: any) => {
              setReceiveBasket({
                vendorId: parseInt(vendorObject?.value),
              })
            }}
            onCreateOption={async (vendorName: string) => {
              const vendorId = await createVendor({ name: vendorName })
              await mutateVendors()
              setReceiveBasket({ vendorId })
            }}
            options={vendors?.map((val: VendorObject) => ({
              value: val?.id,
              label: val?.name || '',
            }))}
          />
        </SectionPanel>
      </div>
      <div>
        <SectionPanel icon={<Info />} title="Default Stock Details">
          <div className="help-text pb-4">
            Select the default information for the batch. You can still edit information for individual items.
          </div>
          <SettingsSelect
            object={receiveBasket}
            onEdit={setReceiveBasket}
            inputLabel="TYPE"
            dbField="media"
            isCreateDisabled={true}
          />
          <SettingsSelect object={receiveBasket} onEdit={setReceiveBasket} inputLabel="FORMAT" dbField="format" />
          <div className="flex items-end">
            <RadioButton
              key={`isNew${receiveBasket?.isNew}`}
              inputLabel="CONDITION"
              group="isNew"
              value={receiveBasket?.isNew ? 'true' : 'false'}
              onChange={(value: string) => setReceiveBasket({ isNew: value === 'true' ? 1 : 0 })}
              options={[
                { id: 'new', value: 'true', label: 'New' },
                { id: 'used', value: 'false', label: 'Used' },
              ]}
            />
            <SettingsSelect
              className="w-full"
              object={receiveBasket}
              onEdit={setReceiveBasket}
              dbField="cond"
              isCreateDisabled={true}
              sorted={false}
            />
          </div>
          <div className="grid grid-cols-2 gap-2 items-center justify-center">
            <SettingsSelect
              object={receiveBasket}
              onEdit={setReceiveBasket}
              inputLabel="SECTION"
              dbField="section"
              isCreateDisabled={true}
            />
            <SettingsSelect object={receiveBasket} onEdit={setReceiveBasket} inputLabel="COUNTRY" dbField="country" />
          </div>
          <SettingsSelect
            object={receiveBasket}
            onEdit={setReceiveBasket}
            inputLabel="GENRE / TAGS"
            isMulti
            dbField="genre"
          />
        </SectionPanel>
        <SectionPanel title={'Default Prices'} icon={<Money />}>
          <ChangePriceForm obj={receiveBasket} setObj={setReceiveBasket} />
        </SectionPanel>
      </div>
    </div>
  )
}
