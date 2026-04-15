import { randomUUID } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

import type {
  CertifySubmission,
  CreateCertifySubmissionInput,
  ProofFileRecord,
} from "@/lib/certify-types";

const DATA_DIR = path.join(process.cwd(), "data", "certify");
const UPLOADS_DIR = path.join(DATA_DIR, "uploads");
const SUBMISSIONS_FILE = path.join(DATA_DIR, "submissions.json");

function sanitizeFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "-");
}

async function ensureStore() {
  await mkdir(DATA_DIR, { recursive: true });
  await mkdir(UPLOADS_DIR, { recursive: true });

  try {
    await readFile(SUBMISSIONS_FILE, "utf8");
  } catch {
    await writeFile(SUBMISSIONS_FILE, "[]", "utf8");
  }
}

async function readSubmissions() {
  await ensureStore();
  const raw = await readFile(SUBMISSIONS_FILE, "utf8");
  return JSON.parse(raw) as CertifySubmission[];
}

async function writeSubmissions(submissions: CertifySubmission[]) {
  await ensureStore();
  await writeFile(SUBMISSIONS_FILE, JSON.stringify(submissions, null, 2), "utf8");
}

export async function listCertifySubmissions() {
  const submissions = await readSubmissions();
  return submissions.sort(
    (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
  );
}

export async function getCertifySubmissionById(id: string) {
  const submissions = await readSubmissions();
  return submissions.find(submission => submission.id === id) ?? null;
}

export async function getCertifySubmissionByCertificateCode(code: string) {
  const submissions = await readSubmissions();
  return submissions.find(submission => submission.certificate?.code === code) ?? null;
}

export async function createCertifySubmission(
  input: CreateCertifySubmissionInput,
  files: File[]
) {
  const submissions = await readSubmissions();

  const id = randomUUID();
  const submissionDir = path.join(UPLOADS_DIR, id);
  await mkdir(submissionDir, { recursive: true });

  const proofFiles: ProofFileRecord[] = [];

  for (const file of files) {
    const fileId = randomUUID();
    const originalName = file.name || `proof-${fileId}`;
    const storedName = `${fileId}-${sanitizeFileName(originalName)}`;
    const absolutePath = path.join(submissionDir, storedName);

    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(absolutePath, buffer);

    proofFiles.push({
      id: fileId,
      originalName,
      storedName,
      mimeType: file.type || "application/octet-stream",
      size: file.size,
      relativePath: path.join("uploads", id, storedName),
    });
  }

  const timestamp = new Date().toISOString();
  const submission: CertifySubmission = {
    id,
    projectName: input.projectName,
    projectId: input.projectId,
    teamMemberName: input.teamMemberName,
    institutionName: input.institutionName,
    proofText: input.proofText,
    proofLinks: input.proofLinks,
    proofFiles,
    projectStartDate: input.projectStartDate,
    projectEndDate: input.projectEndDate,
    email: input.email,
    mobileNumber: input.mobileNumber,
    dob: input.dob,
    status: "pending",
    submittedAt: timestamp,
    updatedAt: timestamp,
  };

  submissions.push(submission);
  await writeSubmissions(submissions);

  return submission;
}

export async function approveCertifySubmission(
  id: string,
  reviewerEmail: string,
  reviewNotes?: string
) {
  const submissions = await readSubmissions();
  const submission = submissions.find(entry => entry.id === id);

  if (!submission) {
    return null;
  }

  const reviewedAt = new Date().toISOString();

  submission.status = "approved";
  submission.reviewedAt = reviewedAt;
  submission.updatedAt = reviewedAt;
  submission.certificate = {
    code: `SV-${new Date().getFullYear()}-${randomUUID().slice(0, 8).toUpperCase()}`,
    issuedAt: reviewedAt,
    reviewNotes,
    reviewerEmail,
  };

  await writeSubmissions(submissions);

  return submission;
}

export async function getCertifyProofFile(submissionId: string, fileId: string) {
  const submission = await getCertifySubmissionById(submissionId);
  const proofFile = submission?.proofFiles.find(file => file.id === fileId);

  if (!proofFile) {
    return null;
  }

  const absolutePath = path.join(DATA_DIR, proofFile.relativePath);
  return {
    proofFile,
    absolutePath,
  };
}
