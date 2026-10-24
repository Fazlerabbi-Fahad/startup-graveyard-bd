import Image from 'next/image';

const OPTIMIZABLE = /^https:\/\/res\.cloudinary\.com\//;

/** Cloudinary images go through next/image; other pasted URLs render as a lazy plain <img>. */
export function RemoteImage({ src, alt, width, height, className, priority = false, sizes }) {
  if (!src) return null;
  if (OPTIMIZABLE.test(src)) {
    return <Image src={src} alt={alt} width={width} height={height} className={className} priority={priority} sizes={sizes} />;
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      referrerPolicy="no-referrer"
    />
  );
}

/** Logo or, when missing, a quiet monogram tile. */
export function Logo({ src, name, size = 44, className = '', tone = 'bg-paper' }) {
  if (src) {
    return (
      <RemoteImage
        src={src}
        alt={`${name} logo`}
        width={size}
        height={size}
        className={`shrink-0 rounded-xl bg-white object-contain p-1 ${className}`}
      />
    );
  }
  return (
    <span
      aria-hidden="true"
      style={{ width: size, height: size }}
      className={`grid shrink-0 place-items-center rounded-xl ${tone} font-display text-lg font-extrabold text-muted ${className}`}
    >
      {name?.trim()?.[0]?.toUpperCase() ?? '·'}
    </span>
  );
}
