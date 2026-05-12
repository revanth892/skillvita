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
        orientation: "landscape",
        unit: "pt",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const patternX = pageWidth - 132;
      const contentLeft = 56;
      const contentRight = patternX - 52;
      const contentWidth = contentRight - contentLeft;

      const drawRightPattern = () => {
        pdf.setFillColor(245, 247, 250);
        pdf.rect(patternX, 0, 124, pageHeight, "F");

        const cols = 3;
        const tileW = 24;
        const tileH = 34;
        const xGap = 10;
        const yGap = 10;
        const startX = patternX + 14;
        const darkGrey = [37, 43, 56] as const;
        const green = [50, 254, 107] as const;
        const muted = [198, 205, 214] as const;

        const drawTile = (x: number, y: number, stroke: readonly number[], fill?: readonly number[]) => {
          if (fill) {
            pdf.setFillColor(fill[0], fill[1], fill[2]);
          }
          pdf.setDrawColor(stroke[0], stroke[1], stroke[2]);
          pdf.setLineWidth(1.4);
          pdf.lines(
            [
              [8, -8],
              [12, 0],
              [0, 20],
              [-8, 8],
              [-12, 0],
              [0, -20],
            ],
            x,
            y + 10,
            [1, 1],
            fill ? "FD" : "S",
            true
          );
        };

        for (let row = 0; row < 11; row += 1) {
          for (let col = 0; col < cols; col += 1) {
            const x = startX + col * (tileW + xGap);
            const y = 16 + row * (tileH + yGap);
            const isAccent = (row + col) % 5 === 1;
            const isFilled = (row + col) % 2 === 0;

            if (isAccent) {
              drawTile(x, y, darkGrey, green);
            } else if (isFilled) {
              drawTile(x, y, muted, [226, 232, 240]);
            } else {
              drawTile(x, y, darkGrey);
            }
          }
        }
      };

      const drawVerificationStrip = () => {
        const stripX = contentLeft + 4;
        const stripY = pageHeight - 148;
        const stripWidth = contentRight - contentLeft - 8;
        const stripHeight = 108;
        const signatureAreaWidth = 170;
        const dividerX = stripX + signatureAreaWidth + 28;

        pdf.setFillColor(248, 250, 252);
        pdf.roundedRect(stripX, stripY, stripWidth, stripHeight, 16, 16, "F");

        pdf.setDrawColor(224, 229, 236);
        pdf.setLineWidth(1);
        pdf.roundedRect(stripX, stripY, stripWidth, stripHeight, 16, 16, "S");

        pdf.addImage(signatureDataUrl, "PNG", stripX + 18, stripY + 18, 100, 34);
        pdf.setDrawColor(180, 185, 194);
        pdf.line(stripX + 12, stripY + 58, stripX + signatureAreaWidth, stripY + 58);

        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(13);
        pdf.setTextColor(15, 23, 42);
        pdf.text("Technical Lead, SkillVita", stripX + 14, stripY + 78);
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(10);
        pdf.setTextColor(71, 85, 105);
        pdf.text(reviewerEmail, stripX + 14, stripY + 96);

        pdf.setDrawColor(224, 229, 236);
        pdf.line(dividerX, stripY + 16, dividerX, stripY + stripHeight - 16);

        const metaLeft = dividerX + 18;
        const metaRight = stripX + stripWidth - 18;

        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(14);
        pdf.setTextColor(15, 23, 42);
        pdf.text("Verified by SkillVita", metaLeft, stripY + 34);

        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(10);
        pdf.setTextColor(71, 85, 105);
        pdf.text(`Issued on ${formatCertificateDate(issuedAt)}`, metaLeft, stripY + 56);
        pdf.text(`Institution: ${institutionName}`, metaLeft, stripY + 74);
        pdf.text(`Project ID: ${projectId}`, metaLeft, stripY + 92);

        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(10);
        pdf.setTextColor(51, 65, 85);
        pdf.text(`Certificate Code: ${certificateCode}`, metaRight, stripY + 56, {
          align: "right",
        });
      };

      pdf.setFillColor(255, 255, 255);
      pdf.rect(0, 0, pageWidth, pageHeight, "F");
      drawRightPattern();

      pdf.setDrawColor(236, 239, 244);
      pdf.setLineWidth(1);
      pdf.roundedRect(18, 18, pageWidth - 36, pageHeight - 36, 14, 14, "S");

      pdf.addImage(logoDataUrl, "PNG", contentLeft, 40, 176, 42);

      pdf.setTextColor(23, 23, 23);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(36);
      pdf.text("CERTIFICATE", contentLeft, 146);

      pdf.setFontSize(20);
      pdf.text("OF SKILL", contentLeft, 176);

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(15);
      pdf.setTextColor(55, 65, 81);
      pdf.text("This is to certify that", contentLeft + 8, 228);

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(28);
      pdf.setTextColor(95, 68, 255);
      pdf.text(teamMemberName.toUpperCase(), contentLeft + 8, 276, {
        maxWidth: contentRight - contentLeft - 16,
      });

      pdf.setDrawColor(160, 168, 180);
      pdf.setLineWidth(1.2);
      pdf.line(contentLeft + 8, 292, contentRight - 8, 292);

      pdf.setTextColor(31, 41, 55);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(16);
      const statementX = contentLeft + 8;
      pdf.text("has completed the project -", statementX, 330);

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(22);
      const projectLines = pdf.splitTextToSize(
        projectName,
        Math.max(280, contentWidth - 40)
      );
      pdf.text(projectLines, statementX, 362, { lineHeightFactor: 1.2 });

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(13);
      pdf.setTextColor(55, 65, 81);
      const detailStartY = 362 + projectLines.length * 24 + 16;
      pdf.text("conducted by SkillVita", statementX, detailStartY);

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(12);
      pdf.setTextColor(71, 85, 105);
      pdf.text(
        `${formatCertificateDate(projectStartDate)} - ${formatCertificateDate(projectEndDate)}`,
        statementX,
        detailStartY + 22
      );

      drawVerificationStrip();

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
