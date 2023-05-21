import { useAppStore } from 'lib/store'
import { motion, useAnimation } from 'framer-motion'
import { useEffect } from 'react'

const SpeechBubble = () => {
  const { clippy, setClippy } = useAppStore()
  // const { message } = clippy || {}
  const controls = useAnimation()
  const bubbleX = 100
  const bubbleY = -280
  console.log('Rending message', clippy?.message)

  // // Animate the speech bubble on mount
  useEffect(() => {
    controls.start({ opacity: 1, y: bubbleY, x: bubbleX, transition: { duration: 0.5 } })
  }, [])

  // // Animate the speech bubble on message change
  useEffect(() => {
    async function hideClippy() {
      await controls.start({ opacity: 0, transition: { duration: 0.1 } })
      setClippy({ message: null })
    }
    if (clippy?.showMessage) controls.start({ opacity: 1, y: bubbleY, x: bubbleX, transition: { duration: 0.3 } })
    else hideClippy()
  }, [clippy?.showMessage, clippy?.message])

  // Animate the speech bubble on unmount
  const hideSpeechBubble = () => {
    // await controls.start({ opacity: 0, y: -20, transition: { duration: 0.3 } })
    setClippy({ showMessage: false })
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20, y: -20 }}
      animate={controls}
      exit={{ opacity: 0, x: 20, y: -20 }}
      className="speech-bubble"
    >
      <p>{clippy?.message}</p>
      <button className="icon-text-button" onClick={hideSpeechBubble}>
        Close
      </button>
    </motion.div>
  )
}

export default SpeechBubble
