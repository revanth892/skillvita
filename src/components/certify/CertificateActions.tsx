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
      const patternX = pageWidth - 124;
      const contentLeft = 56;
      const contentRight = patternX - 44;
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

      const drawSignatureBlock = () => {
        const blockWidth = 180;
        const blockX = contentLeft + 4;
        const baseY = pageHeight - 128;

        pdf.addImage(signatureDataUrl, "PNG", blockX + 8, baseY - 32, 90, 30);
        pdf.setDrawColor(180, 185, 194);
        pdf.setLineWidth(1);
        pdf.line(blockX, baseY, blockX + blockWidth, baseY);

        pdf.setTextColor(15, 23, 42);
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(15);
        pdf.text("Hemanth Guthala", blockX + blockWidth / 2, baseY + 22, { align: "center" });

        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(11);
        pdf.setTextColor(71, 85, 105);
        pdf.text("Technical Lead, SkillVita", blockX + blockWidth / 2, baseY + 40, {
          align: "center",
        });
      };

      const drawVerificationBlock = () => {
        const blockWidth = 208;
        const blockX = contentRight - blockWidth;
        const baseY = pageHeight - 128;

        pdf.setDrawColor(180, 185, 194);
        pdf.setLineWidth(1);
        pdf.line(blockX, baseY, blockX + blockWidth, baseY);

        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(14);
        pdf.setTextColor(15, 23, 42);
        pdf.text("Verified by SkillVita", blockX + blockWidth / 2, baseY + 22, {
          align: "center",
        });

        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(11);
        pdf.setTextColor(71, 85, 105);
        pdf.text(reviewerEmail, blockX + blockWidth / 2, baseY + 40, { align: "center" });

        pdf.setFontSize(10);
        pdf.text(`Certificate Code: ${certificateCode}`, blockX + blockWidth / 2, baseY + 58, {
          align: "center",
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
      pdf.setFontSize(34);
      pdf.text("CERTIFICATE", contentLeft, 144);

      pdf.setFontSize(20);
      pdf.text("OF SKILL", contentLeft, 172);

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(15);
      pdf.setTextColor(55, 65, 81);
      pdf.text("This is to certify that", contentLeft + 8, 220);

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(26);
      pdf.setTextColor(95, 68, 255);
      pdf.text(teamMemberName.toUpperCase(), contentLeft + 8, 266, {
        maxWidth: contentRight - contentLeft - 16,
      });

      pdf.setDrawColor(160, 168, 180);
      pdf.setLineWidth(1.2);
      pdf.line(contentLeft + 8, 280, contentRight - 8, 280);

      pdf.setTextColor(31, 41, 55);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(15);
      const statementX = contentLeft + 8;
      pdf.text("has completed the project -", statementX, 320);

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(20);
      const projectLines = pdf.splitTextToSize(
        projectName,
        Math.max(280, contentWidth - 32)
      );
      pdf.text(projectLines, statementX, 348, { lineHeightFactor: 1.25 });

      const detailLines = pdf.splitTextToSize(
        `conducted by SkillVita, held from ${formatCertificateDate(projectStartDate)} to ${formatCertificateDate(projectEndDate)}.`,
        contentRight - contentLeft - 16
      );
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(13);
      pdf.setTextColor(55, 65, 81);
      const detailStartY = 348 + projectLines.length * 26 + 14;
      pdf.text(detailLines, statementX, detailStartY, { lineHeightFactor: 1.55 });

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(10);
      pdf.setTextColor(71, 85, 105);
      pdf.text(`Issued on ${formatCertificateDate(issuedAt)}`, contentLeft + 8, pageHeight - 86);

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      pdf.setTextColor(107, 114, 128);
      pdf.text(`Institution: ${institutionName}`, contentLeft + 8, pageHeight - 68);
      pdf.text(`Project ID: ${projectId}`, contentLeft + 8, pageHeight - 52);

      drawSignatureBlock();
      drawVerificationBlock();

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
