interface ImageSectionProps {
  imageSrc: string;
  altText: string;
}

export function ImageSection({ imageSrc, altText }: ImageSectionProps) {
  return (
    <div className="md:w-1/2 flex items-start justify-start p-4 md:pl-4 md:pt-4">
      <img
        src={imageSrc}
        alt={altText}
        className="object-cover h-40 sm:h-60 md:h-170 lg:h-170 w-full md:w-full lg:w-auto"
      />
    </div>
  );
}
