import { Icon } from './Icon';

/**
 * Placeholder for vehicle photography. Swap the inner element for <Image src=... />
 * once real photos are available; the surrounding frame, sizing and hover effect stay.
 */
export function VehicleArt({ label = 'Vehicle photo', size = 64 }: { label?: string; size?: number }) {
  return (
    <div className="art" role="img" aria-label={label}>
      <Icon name="car" size={size} color="var(--color-art-icon)" strokeWidth={0.9} />
      <span className="art-label">{label.toUpperCase()}</span>
    </div>
  );
}
