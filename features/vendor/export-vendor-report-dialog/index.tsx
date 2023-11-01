import Modal from 'components/modal'
import { useAppStore } from 'lib/store'
import { ViewProps } from 'lib/store/types'
import { ModalButton } from 'lib/types'
// import { getVendorReport } from './create-report'

// eslint-disable-next-line unused-imports/no-unused-vars
const ExportVendorReportDialog = ({ vendor }) => {
  const { view, closeView } = useAppStore()
  const buttons: ModalButton[] = [
    {
      type: 'ok',
      // onClick: () => getVendorReport(vendor),
      onClick: null,
      text: 'DOWNLOAD',
    },
  ]
  return (
    <Modal
      open={view?.exportVendorReportDialog}
      closeFunction={() => closeView(ViewProps.exportVendorReportDialog)}
      buttons={buttons}
      title="EXPORT VENDOR REPORT"
    >
      <div></div>
    </Modal>
  )
}

export default ExportVendorReportDialog
