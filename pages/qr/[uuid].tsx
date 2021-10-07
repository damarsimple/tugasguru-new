import React from "react";
import QRCode from "react-qr-code";
import Button from "../../components/Button";

export default function Uuid() {
  return (
    <div className="flex flex-col gap-24 items-center justify-center h-screen w-screen">
      <h1 className="text-4xl">Absensi Bimbel 10 Agustus 2021</h1>
      <QRCode value={"lorem100"} size={200} />
      <Button onClick={() => window.close()} color="RED">
        TUTUP TAB INI
      </Button>
    </div>
  );
}
