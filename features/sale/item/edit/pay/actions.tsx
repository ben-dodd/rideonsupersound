import CheckCircleOutline from '@mui/icons-material/CheckCircleOutline'
import ActionButton from 'components/button/action-button'

const Actions = ({ defaultAction }) => {
  const completeButton = {
    icon: defaultAction?.icon || <CheckCircleOutline />,
    text: defaultAction?.label,
    onClick: defaultAction?.onClick,
    type: 'ok',
  }

  return defaultAction ? (
    <div>
      <ActionButton button={completeButton} />
    </div>
  ) : (
    <div />
  )
}

export default Actions
