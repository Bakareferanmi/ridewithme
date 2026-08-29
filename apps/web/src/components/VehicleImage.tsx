import { useState } from 'react'

export function VehicleImage({ src, alt }: { src: string; alt: string }) {
  const [loaded, setLoaded] = useState(false)

  return (
    <>
      {!loaded && <div className="img-skeleton" />}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={`img-real ${loaded ? 'img-loaded' : ''}`}
      />
    </>
  )
}
