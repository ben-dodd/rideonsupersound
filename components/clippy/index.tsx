import { useAppStore } from 'lib/store'
import { motion, useMotionValue } from 'framer-motion'
import SpeechBubble from './speech-bubble'
import { useState } from 'react'

const Clippy = () => {
  const { clippy, setClippy } = useAppStore()
  console.log('Rendering clippy', clippy)
  const [isDragging] = useState(false)
  const x = useMotionValue(clippy?.position?.x)
  const y = useMotionValue(clippy?.position?.y)

  const handleTapClippy = () => {
    // console.log('Clippy clicked')
    if (!isDragging)
      setClippy({
        showMessage: true,
        message:
          'It looks like a customer is trying to buy an Adam Hattaway CD. Have you tried to sell them the Joe Sampson zine instead?',
      })
  }

  return (
    <div className="h-screen w-screen top-0 left-0 absolute pointer-events-none">
      <motion.div
        drag
        // dragMomentum={false} // Disable drag momentum to allow click events
        // onDragStart={() => setIsDragging(true)} // Set isDragging to true when dragging starts
        // onDragEnd={() => setIsDragging(false)} // Set isDragging to false when dragging ends
        onTap={handleTapClippy}
        dragConstraints={{
          left: 0,
          top: 0,
          right: window.innerWidth - (clippy?.size?.width || 0),
          bottom: window.innerHeight - (clippy?.size?.height || 0),
        }} // Optional constraint to limit dragging within the screen
        className={`${clippy?.visible ? 'absolute' : 'hidden'} z-100 pointer-events-auto`}
        dragTransition={{ bounceStiffness: 600, bounceDamping: 5 }}
        style={{ x, y }}
      >
        <img
          className="pointer-events-none"
          alt="Clippy"
          src={`${process.env.NEXT_PUBLIC_RESOURCE_URL}img/clippy/${clippy?.image || 'default.png'}`}
          height={clippy?.size?.height}
          width={clippy?.size?.width}
        />
        <SpeechBubble />
      </motion.div>
    </div>
  )
}

export default Clippy
