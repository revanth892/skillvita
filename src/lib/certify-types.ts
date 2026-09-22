export type SubmissionStatus = "pending" | "approved";

export interface ProofFileRecord {
  id: string;
  originalName: string;
  storedName: string;
  mimeType: string;
  size: number;
  relativePath: string;
}

export interface CertificateRecord {
  code: string;
  issuedAt: string;
  reviewNotes?: string;
  reviewerEmail: string;
}

export interface CertifySubmission {
  id: string;
  projectName: string;
  projectId: string;
  teamMemberName: string;
  institutionName: string;
  proofText: string;
  proofLinks: string[];
  proofFiles: ProofFileRecord[];
  projectStartDate: string;
  projectEndDate: string;
  email: string;
  mobileNumber: string;
  dob: string;
  status: SubmissionStatus;
  submittedAt: string;
  updatedAt: string;
  reviewedAt?: string;
  certificate?: CertificateRecord;
}

export interface CreateCertifySubmissionInput {
  projectName: string;
  projectId: string;
  teamMemberName: string;
  institutionName: string;
  proofText: string;
  proofLinks: string[];
  projectStartDate: string;
  projectEndDate: string;
  email: string;
  mobileNumber: string;
  dob: string;
}
