"use client";

import { useState } from "react";
import Image from "next/image";
import type { StaticImageData } from "next/image";

export type GalleryImageSource = string | StaticImageData;

type FacilityGalleryProps = {
  images: GalleryImageSource[];
  facilityName: string;
};

function GalleryImage({ src, alt }: { src: GalleryImageSource; alt: string }) {
  if (typeof src !== "string" || src.startsWith("/")) {
    return <Image src={src} alt={alt} width={800} height={600} unoptimized />;
  }

  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} width={800} height={600} />;
}

export default function FacilityGallery({
  images,
  facilityName,
}: FacilityGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const hasControls = images.length >= 2;
  const thumbnailItems = images.length <= 5
    ? images.map((src, index) => ({ src, index, overflow: 0 }))
    : [
        ...images.slice(0, 4).map((src, index) => ({ src, index, overflow: 0 })),
        { src: images[4], index: 4, overflow: images.length - 4 },
      ];

  const selectPrevious = () => {
    setSelectedIndex((current) => (current - 1 + images.length) % images.length);
  };

  const selectNext = () => {
    setSelectedIndex((current) => (current + 1) % images.length);
  };

  return (
    <div className="facility-detail__gallery">
      <div className="facility-detail__main-image">
        <GalleryImage
          src={images[selectedIndex]}
          alt={`${facilityName}の写真 ${selectedIndex + 1}`}
        />
        {hasControls && (
          <>
            <button
              type="button"
              className="facility-detail__gallery-arrow facility-detail__gallery-arrow--previous"
              onClick={selectPrevious}
              aria-label="前の写真を表示"
            >
              ‹
            </button>
            <button
              type="button"
              className="facility-detail__gallery-arrow facility-detail__gallery-arrow--next"
              onClick={selectNext}
              aria-label="次の写真を表示"
            >
              ›
            </button>
            <div className="facility-detail__gallery-dots" aria-label="写真の選択">
              {images.map((_, index) => (
                <button
                  type="button"
                  className={`facility-detail__gallery-dot${
                    selectedIndex === index ? " is-active" : ""
                  }`}
                  onClick={() => setSelectedIndex(index)}
                  aria-label={`${index + 1}枚目の写真を表示`}
                  aria-current={selectedIndex === index ? "true" : undefined}
                  key={index}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {hasControls && (
        <div className="facility-detail__thumbnails">
          {thumbnailItems.map(({ src, index, overflow }) => (
            <button
              type="button"
              className={`facility-detail__thumbnail${
                (overflow > 0 ? selectedIndex >= index : selectedIndex === index)
                  ? " is-active"
                  : ""
              }`}
              onClick={() => setSelectedIndex(index)}
              aria-label={overflow > 0 ? `残り${overflow}枚の写真を表示` : `${index + 1}枚目の写真を表示`}
              key={`${src}-${index}`}
            >
              <GalleryImage src={src} alt="" />
              {overflow > 0 && <span>+{overflow}</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
