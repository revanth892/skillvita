"use client";

import { useState } from "react";
import jsPDF from "jspdf";

import { Button } from "@/components/ui/button";
import { formatCertificateDate } from "@/components/certify/CertificateSheet";

export function CertificateActions({
  certificateCode,
  projectName,
  teamMemberName,
  institutionName,
  projectId,
  projectStartDate,
  projectEndDate,
  issuedAt,
  reviewerEmail,
}: {
  certificateCode: string;
  projectName: string;
  teamMemberName: string;
  institutionName: string;
  projectId: string;
  projectStartDate: string;
  projectEndDate: string;
  issuedAt: string;
  reviewerEmail: string;
}) {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const loadImageDataUrl = async (url: string) => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Unable to load asset: ${url}`);
    }

    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);

    try {
      const image = await new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`Unable to decode image: ${url}`));
        img.src = objectUrl;
      });

      const canvas = document.createElement("canvas");
      canvas.width = image.naturalWidth || image.width;
      canvas.height = image.naturalHeight || image.height;
      const context = canvas.getContext("2d");

      if (!context) {
        throw new Error("Unable to prepare image canvas.");
      }

      context.drawImage(image, 0, 0);
      return canvas.toDataURL("image/png");
    } finally {
      URL.revokeObjectURL(objectUrl);
    }
  };

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
      const [logoDataUrl, signatureDataUrl] = await Promise.all([
        loadImageDataUrl("/skillvita.svg"),
        loadImageDataUrl("/images/certify/sign_HG.jpg"),
      ]);

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      pdf.setFillColor(255, 250, 244);
      pdf.rect(0, 0, pageWidth, pageHeight, "F");

      pdf.setDrawColor(242, 216, 202);
      pdf.setLineWidth(28);
      pdf.circle(pageWidth - 35, 120, 150, "S");
      pdf.setDrawColor(247, 232, 223);
      pdf.setLineWidth(14);
      pdf.circle(pageWidth - 20, 140, 125, "S");

      pdf.setFillColor(242, 154, 97);
      pdf.ellipse(95, pageHeight - 55, 235, 95, "F");
      pdf.setFillColor(217, 111, 54);
      pdf.ellipse(170, pageHeight - 20, 320, 120, "F");

      pdf.setFillColor(18, 18, 18);
      pdf.roundedRect(pageWidth / 2 - 48, 40, 96, 44, 18, 18, "F");
      pdf.addImage(logoDataUrl, "PNG", pageWidth / 2 - 34, 50, 68, 22);

      pdf.setTextColor(23, 23, 23);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(30);
      pdf.text("CERTIFICATE", pageWidth / 2, 155, { align: "center" });

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(22);
      pdf.text(teamMemberName, pageWidth / 2, 212, { align: "center" });

      pdf.setFontSize(14);
      pdf.setTextColor(72, 72, 72);
      pdf.text("has successfully completed", pageWidth / 2, 248, { align: "center" });

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(17);
      pdf.setTextColor(217, 111, 54);
      pdf.text(projectName.toUpperCase(), pageWidth / 2, 278, { align: "center", maxWidth: 330 });

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(13);
      pdf.setTextColor(86, 86, 86);
      pdf.text("under SkillVita review and project verification", pageWidth / 2, 306, {
        align: "center",
      });

      pdf.setTextColor(255, 255, 255);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(11);
      pdf.text(formatCertificateDate(issuedAt), 48, pageHeight - 92);

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(11);
      pdf.text(institutionName, 48, pageHeight - 72);
      pdf.setFont("helvetica", "bold");
      pdf.text(projectName, 48, pageHeight - 54);
      pdf.setFont("helvetica", "normal");
      pdf.text(projectId, 48, pageHeight - 36);

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(10);
      pdf.setTextColor(255, 237, 226);
      pdf.text("REVIEWED BY", pageWidth / 2, pageHeight - 92, { align: "center" });
      pdf.setFontSize(14);
      pdf.setTextColor(255, 255, 255);
      pdf.text("SkillVita", pageWidth / 2, pageHeight - 70, { align: "center" });
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(11);
      pdf.text(reviewerEmail, pageWidth / 2, pageHeight - 50, { align: "center" });

      const cardX = pageWidth - 192;
      const cardY = pageHeight - 170;
      pdf.setFillColor(23, 23, 23);
      pdf.roundedRect(cardX, cardY, 150, 118, 18, 18, "F");
      pdf.addImage(signatureDataUrl, "PNG", cardX + 28, cardY + 10, 92, 38);
      pdf.setDrawColor(92, 92, 92);
      pdf.line(cardX + 16, cardY + 60, cardX + 134, cardY + 60);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(13);
      pdf.setTextColor(255, 255, 255);
      pdf.text("Hemanth Guthala", cardX + 75, cardY + 80, { align: "center" });
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      pdf.setTextColor(248, 215, 195);
      pdf.text("Technical Lead, SkillVita", cardX + 75, cardY + 96, { align: "center" });
      pdf.setFontSize(8);
      pdf.text(certificateCode, cardX + 75, cardY + 110, { align: "center" });

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(8);
      pdf.setTextColor(255, 245, 238);
      pdf.text(
        `${formatCertificateDate(projectStartDate)} - ${formatCertificateDate(projectEndDate)}`.toUpperCase(),
        pageWidth - 44,
        pageHeight - 16,
        { align: "right" }
      );

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
