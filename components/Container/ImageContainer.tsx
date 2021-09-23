/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import React from "react";

interface ImageProp {
  fallback?: string;
  alt?: string;
  src?: string;
  width?: number;
  height?: number;
  className?: string;
}

export default function ImageContainer({
  width,
  height,
  fallback,
  className,
  alt,
  src,
}: ImageProp) {
  if (src) {
    return (
      <img
        alt={alt}
        className={className}
        width={width}
        height={height}
        src={src}
      />
    );
  } else {
    if (fallback) {
      return (
        <img
          alt={alt}
          className={className}
          width={width}
          height={height}
          src={`/${fallback}.jpg`}
        />
      );
    } else {
      return (
        <img
          alt={alt}
          className={className}
          width={width}
          height={height}
          src={`https://picsum.photos/seed/${alt}/${width}/${height}`}
        />
      );
    }
  }
}
