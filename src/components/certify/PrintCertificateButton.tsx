"use client";

import { Button } from "@/components/ui/button";

export function PrintCertificateButton() {
  return (
    <Button
      onClick={() => window.print()}
      className="rounded-full bg-[#014051] text-white hover:bg-[#022e39]"
    >
      Print or Save as PDF
    </Button>
  );
}
