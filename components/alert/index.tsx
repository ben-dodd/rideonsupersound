import { Alert, Slide, Snackbar } from '@mui/material'
import { useAppStore } from 'lib/store'

export default function SnackAlert() {
  const { alert, closeAlert } = useAppStore()
  return (
    <Snackbar
      open={alert?.open}
      onClose={closeAlert}
      autoHideDuration={alert?.type === 'info' ? 2000 : 4000}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      TransitionComponent={Slide}
      transitionDuration={{
        enter: 50,
        exit: 200,
      }}
    >
      <Alert
        severity={alert?.type || 'info'}
        action={
          alert.undo ? (
            <button
              className="bg-white p-2"
              onClick={() => {
                alert?.undo()
                closeAlert()
              }}
            >
              UNDO
            </button>
          ) : null
        }
      >
        {alert?.message || ''}
      </Alert>
    </Snackbar>
  )
}
