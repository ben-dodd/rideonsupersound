import { useState, useEffect, useRef } from 'react'

export default function ScreenSaver() {
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const [direction, setDirection] = useState({ x: 1, y: 1 })
  const [hue, setHue] = useState(0)
  const imageRef = useRef(null)

  useEffect(() => {
    const moveImage = () => {
      const imageWidth = imageRef.current?.clientWidth || 0
      const imageHeight = imageRef.current?.clientHeight || 0
      const containerWidth = window.innerWidth
      const containerHeight = window.innerHeight

      setPosition((prev) => {
        let newTop = prev.top + 2 * direction.y
        let newLeft = prev.left + 2 * direction.x

        if (newTop <= 0 || newTop + imageHeight >= containerHeight) {
          setDirection((prevDir) => ({ ...prevDir, y: -prevDir.y }))
          newTop = prev.top + 2 * -direction.y
        }
        if (newLeft <= 0 || newLeft + imageWidth >= containerWidth) {
          setDirection((prevDir) => ({ ...prevDir, x: -prevDir.x }))
          newLeft = prev.left + 2 * -direction.x
        }

        return { top: newTop, left: newLeft }
      })
    }

    const changeHue = () => {
      setHue((prevHue) => (prevHue + 1) % 360) // Gradually change the hue
    }

    const moveInterval = setInterval(moveImage, 10)
    const hueInterval = setInterval(changeHue, 50) // Change color every 50ms

    return () => {
      clearInterval(moveInterval)
      clearInterval(hueInterval)
    }
  }, [direction])

  return (
    <div className="w-full h-screen bg-gray-900 relative overflow-hidden">
      <img
        ref={imageRef}
        src="https://ross.syd1.cdn.digitaloceanspaces.com/img/pyramid.png"
        alt="RIDEONSUPERSOUND"
        className="absolute"
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`,
          filter: `hue-rotate(${hue}deg)`,
        }}
      />
    </div>
  )
}
