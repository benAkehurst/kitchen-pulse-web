import Image from 'next/image';

interface AvatarProps {
  src: string;
  alt: string;
  size?: number;
}

export default function Avatar({ src, alt, size = 100 }: AvatarProps) {
  return (
    <div
      className="rounded-full overflow-hidden border-2 border-gray-200 mb-4"
      style={{ width: size, height: size }}
    >
      <Image
        priority={true}
        src={src}
        alt={alt}
        width={size}
        height={size}
        className="object-cover"
      />
    </div>
  );
}
