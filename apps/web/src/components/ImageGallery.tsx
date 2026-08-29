import { useRef, useState } from 'react'
import { VehicleImage } from './VehicleImage'

export function ImageGallery({ images, alt }: { images: string[]; alt: string }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const trackRef = useRef<HTMLDivElement>(null)

  const handleScroll = () => {
    const el = trackRef.current
    if (!el) return
    const index = Math.round(el.scrollLeft / el.clientWidth)
    setActiveIndex(index)
  }

  const goTo = (index: number) => {
    const el = trackRef.current
    if (!el) return
    el.scrollTo({ left: index * el.clientWidth, behavior: 'smooth' })
  }

  return (
    <div className="gallery">
      <div className="gallery-track" ref={trackRef} onScroll={handleScroll}>
        {images.map((src, i) => (
          <div className="gallery-slide" key={i}>
            <VehicleImage src={src} alt={`${alt} photo ${i + 1}`} />
          </div>
        ))}
      </div>
      {images.length > 1 && (
        <div className="gallery-dots">
          {images.map((_, i) => (
            <button
              key={i}
              className={`gallery-dot ${i === activeIndex ? 'gallery-dot-active' : ''}`}
              onClick={() => goTo(i)}
              aria-label={`Go to photo ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
