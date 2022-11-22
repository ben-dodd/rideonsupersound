import { alertAtom } from 'lib/atoms'
import Alert from '@mui/material/Alert'
import Slide from '@mui/material/Slide'
import Snackbar from '@mui/material/Snackbar'
import { useAtom } from 'jotai'

export default function SnackAlert() {
  const [alert, setAlert] = useAtom(alertAtom)
  return (
    <Snackbar
      open={alert?.open}
      onClose={() => setAlert(null)}
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
                setAlert(null)
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
