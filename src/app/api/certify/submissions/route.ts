import { NextResponse } from "next/server";

import { createCertifySubmission } from "@/lib/certify-store";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidDate(value: string) {
  return !Number.isNaN(Date.parse(value));
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const projectName = String(formData.get("projectName") || "").trim();
    const projectId = String(formData.get("projectId") || "").trim();
    const teamMemberName = String(formData.get("teamMemberName") || "").trim();
    const institutionName = String(formData.get("institutionName") || "").trim();
    const proofText = String(formData.get("proofText") || "").trim();
    const projectStartDate = String(formData.get("projectStartDate") || "").trim();
    const projectEndDate = String(formData.get("projectEndDate") || "").trim();
    const email = String(formData.get("email") || "").trim().toLowerCase();
    const mobileNumber = String(formData.get("mobileNumber") || "").trim();
    const dob = String(formData.get("dob") || "").trim();
    const proofLinks = String(formData.get("proofLinks") || "")
      .split("\n")
      .map(link => link.trim())
      .filter(Boolean);
    const proofFiles = formData
      .getAll("proofFiles")
      .filter((entry): entry is File => entry instanceof File && entry.size > 0);

    if (
      !projectName ||
      !projectId ||
      !teamMemberName ||
      !institutionName ||
      !projectStartDate ||
      !projectEndDate ||
      !email ||
      !mobileNumber ||
      !dob
    ) {
      return NextResponse.json(
        { error: "Please fill in all required fields." },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    if (!isValidDate(projectStartDate) || !isValidDate(projectEndDate) || !isValidDate(dob)) {
      return NextResponse.json({ error: "Please provide valid dates." }, { status: 400 });
    }

    if (
      new Date(projectStartDate).getTime() > new Date(projectEndDate).getTime()
    ) {
      return NextResponse.json(
        { error: "Project end date must be after the start date." },
        { status: 400 }
      );
    }

    if (!proofText && proofLinks.length === 0 && proofFiles.length === 0) {
      return NextResponse.json(
        { error: "Please include at least one proof of work entry." },
        { status: 400 }
      );
    }

    const submission = await createCertifySubmission(
      {
        projectName,
        projectId,
        teamMemberName,
        institutionName,
        proofText,
        proofLinks,
        projectStartDate,
        projectEndDate,
        email,
        mobileNumber,
        dob,
      },
      proofFiles
    );

    return NextResponse.json(
      {
        message:
          "Submission has been made successfully. Your application will be reviewed and certificate will be updated accordingly.",
        submissionId: submission.id,
      },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something went wrong.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
