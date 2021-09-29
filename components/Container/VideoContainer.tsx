import React from "react";

interface VideoProp {
  width?: number;
  height?: number;
  src?: string;
  className?: string;
}

export default function VideoContainer({
  src,
  className,
  height,
  width,
}: VideoProp) {
  return (
    <video width={width} height={height} className={className} controls>
      <source src={src} type="video/mp4" />
    </video>
  );
}
