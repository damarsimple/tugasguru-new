import React from "react";

interface VideoProp {
  src?: string;
  className?: string;
}

export default function AudioContainer({ src, className }: VideoProp) {
  return (
    <audio controls className={className}>
      <source src={src} type="audio/ogg" />
    </audio>
  );
}
