import { DeleteOutline } from '@mui/icons-material'
import CheckCircleOutline from '@mui/icons-material/CheckCircleOutline'
import ActionButton from 'components/button/action-button'

const Actions = ({ defaultAction, secondaryAction = null }) => {
  const completeButton = {
    icon: defaultAction?.icon || <CheckCircleOutline />,
    text: defaultAction?.label,
    onClick: defaultAction?.onClick,
    useEnterKey: defaultAction?.useEnterKey,
    type: 'ok',
  }
  const secondaryButton = {
    icon: secondaryAction?.icon || <DeleteOutline />,
    text: secondaryAction?.label,
    onClick: secondaryAction?.onClick,
    type: 'cancel',
  }

  return defaultAction ? (
    <div>
      <ActionButton button={completeButton} />
      {secondaryAction ? <ActionButton button={secondaryButton} /> : <div />}
    </div>
  ) : (
    <div />
  )
}

export default Actions
