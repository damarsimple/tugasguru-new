import React from "react";

interface DocumentProp {
  src?: string;
  iframeHeight?: number;
}

export default function DocumentContainer({ src, iframeHeight }: DocumentProp) {
  return (
    <embed
      src={src}
      width="100%"
      height={iframeHeight ?? "90%"}
      type="application/pdf"
    />
  );
}

//  <iframe
//    src={`https://view.officeapps.live.com/op/embed.aspx?src=${path}`}
//    width="100%"
//    height={e.iframeHeight ?? "90%"}
//  >
//    This is an embedded{" "}
//    <a target="_blank" href="http://office.com">
//      Microsoft Office
//    </a>{" "}
//    document, powered by{" "}
//    <a target="_blank" href="http://office.com/webapps">
//      Office Online
//    </a>
//    .
//  </iframe>;
