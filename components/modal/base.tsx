import { motion, Variants } from 'framer-motion'

const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 0.3 },
}

const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
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
      className={`fixed inset-0 flex items-center justify-center z-50 ${open ? '' : 'opacity-0 pointer-events-none'}`}
    >
      {/* Backdrop */}
      <motion.div
        onClick={!disableBackdropClick && onClose ? onClose : undefined}
        className="absolute inset-0 bg-black"
        initial="hidden"
        animate={open ? 'visible' : 'hidden'}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        variants={backdropVariants}
      />

      {/* Modal */}
      <motion.div
        className={`bg-white w-11/12 ${width} mx-auto z-50 rounded-md shadow-2xl`}
        initial="hidden"
        animate={open ? 'visible' : 'hidden'}
        variants={modalVariants}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}
