import { motion, Variants } from 'framer-motion'

const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 0.3 },
}

const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0 },
  visible: { opacity: 1, scale: 1 },
}

export default function ModalBase({
  open = false,
  onClose = null,
  disableBackdropClick = false,
  width = 'max-w-md',
  children,
}) {
  return (
    <motion.div
      className={`${
        !open ? 'opacity-0 pointer-events-none ' : ''
      }absolute w-screen h-main top-0 left-0 flex items-center justify-center`}
    >
      <motion.div
        onClick={disableBackdropClick ? null : onClose}
        className="absolute w-full h-full bg-black opacity-50"
        initial="hidden"
        animate={open ? 'visible' : 'hidden'}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        variants={backdropVariants}
      />
      <motion.div
        className={`bg-white w-11/12 ${width} mx-auto z-50 rounded-md shadow-2xl opacity-100`}
        initial="hidden"
        animate={open ? 'visible' : 'hidden'}
        variants={modalVariants}
        transition={{ duration: 0.1, ease: 'easeInOut' }}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}
