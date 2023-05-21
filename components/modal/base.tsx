import { motion, Variants } from 'framer-motion'

const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

const modalVariants: Variants = {
  hidden: { scale: 0 },
  visible: { scale: 1 },
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
      initial="hidden"
      animate={open ? 'visible' : 'hidden'}
      variants={backdropVariants}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      <motion.div
        onClick={disableBackdropClick ? null : onClose}
        className="absolute w-full h-full bg-black opacity-50"
      />
      <motion.div
        className={`bg-white w-11/12 ${width} mx-auto z-50 rounded-md shadow-2xl`}
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
