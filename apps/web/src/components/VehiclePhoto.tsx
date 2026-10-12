'use client';

import { photoUrl } from '@rwm/shared';
import { useState } from 'react';
import { VehicleArt } from './VehicleArt';

/** Real photo with a graceful fallback to the placeholder if the image cannot load. */
export function VehiclePhoto({ photo, alt, width = 800, size = 64, priority = false, position }: { photo?: string; alt: string; width?: number; size?: number; priority?: boolean; position?: string }) {
  const [failed, setFailed] = useState(false);
  if (!photo || failed) return <VehicleArt label={alt} size={size} />;
  return (
    <div className="photo">
      <img
        src={photoUrl(photo, width)}
        srcSet={`${photoUrl(photo, Math.round(width / 2))} ${Math.round(width / 2)}w, ${photoUrl(photo, width)} ${width}w, ${photoUrl(photo, width * 2)} ${width * 2}w`}
        sizes={`(max-width: 700px) 100vw, ${width}px`}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        style={position ? { objectPosition: position } : undefined}
        onError={() => setFailed(true)}
      />
    </div>
  );
}
