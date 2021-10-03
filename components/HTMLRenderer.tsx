import React from "react";

export default function HTMLRenderer({
  html,
  className,
}: {
  html?: string;
  className?: string;
}) {
  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: html ?? "" }}
    />
  );
}
