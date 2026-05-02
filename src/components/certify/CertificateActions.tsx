"use client";

import { useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import { Button } from "@/components/ui/button";

export function CertificateActions({
  certificateCode,
  projectName,
}: {
  certificateCode: string;
  projectName: string;
}) {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleCopyLink = async () => {
    setMessage(null);
    setError(null);

    try {
      await navigator.clipboard.writeText(window.location.href);
      setMessage("Certificate link copied.");
    } catch {
      setError("Unable to copy the certificate link.");
    }
  };

  const handleDownload = async () => {
    setMessage(null);
    setError(null);
    setIsDownloading(true);

    try {
      const certificateElement = document.getElementById("certificate-sheet");
      if (!certificateElement) {
        throw new Error("Certificate content not found.");
      }

      const canvas = await html2canvas(certificateElement, {
        backgroundColor: "#ffffff",
        scale: 2,
        useCORS: true,
      });

      const imageData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: canvas.width > canvas.height ? "landscape" : "portrait",
        unit: "px",
        format: [canvas.width, canvas.height],
      });

      pdf.addImage(imageData, "PNG", 0, 0, canvas.width, canvas.height);
      const fileName = `${projectName}-${certificateCode}`
        .replace(/[^a-zA-Z0-9_-]+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
      pdf.save(`${fileName || certificateCode}.pdf`);
      setMessage("Certificate downloaded.");
    } catch (downloadError) {
      setError(
        downloadError instanceof Error ? downloadError.message : "Unable to download certificate."
      );
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex flex-col items-end gap-3">
      <div className="flex flex-wrap items-center justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={handleCopyLink}
          className="rounded-full border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
        >
          Copy public link
        </Button>
        <Button
          type="button"
          onClick={handleDownload}
          disabled={isDownloading}
          className="rounded-full bg-[#014051] text-white hover:bg-[#022e39]"
        >
          {isDownloading ? "Downloading..." : "Download certificate"}
        </Button>
      </div>
      {message ? <p className="text-sm text-green-700">{message}</p> : null}
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
    </div>
  );
}
