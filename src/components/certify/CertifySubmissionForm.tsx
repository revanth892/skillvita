"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const emptyForm = {
  projectName: "",
  projectId: "",
  teamMemberName: "",
  institutionName: "",
  proofText: "",
  proofLinks: "",
  projectStartDate: "",
  projectEndDate: "",
  email: "",
  mobileNumber: "",
  dob: "",
};

const lightInputClass =
  "border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 [color-scheme:light] focus-visible:border-[#014051] focus-visible:ring-[#014051]/10";

export function CertifySubmissionForm() {
  const [form, setForm] = useState(emptyForm);
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selectedFileLabel = useMemo(() => {
    if (files.length === 0) {
      return "Attach PDF, DOC, DOCX, or supporting files";
    }

    return `${files.length} file${files.length > 1 ? "s" : ""} selected`;
  }, [files]);

  const updateField = (key: keyof typeof emptyForm, value: string) => {
    setForm(current => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage(null);
    setError(null);

    try {
      const payload = new FormData();
      Object.entries(form).forEach(([key, value]) => payload.append(key, value));
      files.forEach(file => payload.append("proofFiles", file));

      const response = await fetch("/api/certify/submissions", {
        method: "POST",
        body: payload,
      });

      const result = (await response.json()) as { error?: string; message?: string };

      if (!response.ok) {
        throw new Error(result.error || "Unable to submit right now.");
      }

      setForm(emptyForm);
      setFiles([]);
      setMessage(
        result.message ||
          "Submission has been made successfully. Your application will be reviewed and certificate will be updated accordingly."
      );
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "Unable to submit right now."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-12 md:px-6 md:py-16">
      <div className="overflow-hidden rounded-[32px] border border-white/10 bg-[#071923] shadow-[0_30px_80px_rgba(0,0,0,0.18)]">
        <div className="grid gap-0 lg:grid-cols-[0.95fr_1.25fr]">
          <div className="bg-[radial-gradient(circle_at_top,_rgba(50,254,107,0.18),_transparent_40%),linear-gradient(180deg,#0b2c39_0%,#071923_100%)] p-8 text-white md:p-10">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.24em] text-accent-500">
              SkillVita Certify
            </p>
            <h1 className="max-w-sm text-4xl font-semibold leading-tight md:text-5xl">
              Submit your project for proof-of-work certification
            </h1>
            <p className="mt-6 max-w-md text-base leading-7 text-gray-300">
              Share your project context, timeline, and working proof. Once the review is
              approved, SkillVita can issue a certificate to the email you provide.
            </p>
            <div className="mt-10 space-y-4 text-sm text-gray-200">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="font-semibold text-white">What counts as proof</p>
                <p className="mt-2 leading-6 text-gray-300">
                  GitHub links, live demos, writeups, Loom videos, PDFs, docs, design files,
                  or concise text describing the work you completed.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="font-semibold text-white">What happens next</p>
                <p className="mt-2 leading-6 text-gray-300">
                  The SkillVita review panel sees your submission in the internal dashboard.
                  Approved submissions receive a certificate email.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 md:p-10">
            <form className="grid gap-6" onSubmit={handleSubmit}>
              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Project Name" htmlFor="projectName" required>
                  <Input
                    id="projectName"
                    className={lightInputClass}
                    value={form.projectName}
                    onChange={event => updateField("projectName", event.target.value)}
                    placeholder="AI Resume Screener"
                    required
                  />
                </Field>

                <Field label="Project ID" htmlFor="projectId" required>
                  <Input
                    id="projectId"
                    className={lightInputClass}
                    value={form.projectId}
                    onChange={event => updateField("projectId", event.target.value)}
                    placeholder="SV-PROJ-2401"
                    required
                  />
                </Field>

                <Field label="Team Member Name" htmlFor="teamMemberName" required>
                  <Input
                    id="teamMemberName"
                    className={lightInputClass}
                    value={form.teamMemberName}
                    onChange={event => updateField("teamMemberName", event.target.value)}
                    placeholder="Hemanth Kumar"
                    required
                  />
                </Field>

                <Field label="Institution Name" htmlFor="institutionName" required>
                  <Input
                    id="institutionName"
                    className={lightInputClass}
                    value={form.institutionName}
                    onChange={event => updateField("institutionName", event.target.value)}
                    placeholder="SNIST"
                    required
                  />
                </Field>

                <Field label="Project Start Date" htmlFor="projectStartDate" required>
                  <Input
                    id="projectStartDate"
                    className={lightInputClass}
                    type="date"
                    value={form.projectStartDate}
                    onChange={event => updateField("projectStartDate", event.target.value)}
                    required
                  />
                </Field>

                <Field label="Project End Date" htmlFor="projectEndDate" required>
                  <Input
                    id="projectEndDate"
                    className={lightInputClass}
                    type="date"
                    value={form.projectEndDate}
                    onChange={event => updateField("projectEndDate", event.target.value)}
                    required
                  />
                </Field>

                <Field label="Email" htmlFor="email" required>
                  <Input
                    id="email"
                    className={lightInputClass}
                    type="email"
                    value={form.email}
                    onChange={event => updateField("email", event.target.value)}
                    placeholder="name@example.com"
                    required
                  />
                </Field>

                <Field label="Mobile Number" htmlFor="mobileNumber" required>
                  <Input
                    id="mobileNumber"
                    className={lightInputClass}
                    value={form.mobileNumber}
                    onChange={event => updateField("mobileNumber", event.target.value)}
                    placeholder="+91 9876543210"
                    required
                  />
                </Field>
              </div>

              <Field label="Date of Birth" htmlFor="dob" required>
                <Input
                  id="dob"
                  className={lightInputClass}
                  type="date"
                  value={form.dob}
                  onChange={event => updateField("dob", event.target.value)}
                  required
                />
              </Field>

              <Field label="Proof of Work Summary" htmlFor="proofText">
                <textarea
                  id="proofText"
                  value={form.proofText}
                  onChange={event => updateField("proofText", event.target.value)}
                  placeholder="Describe what you built, your contribution, stack used, outcomes, and where a reviewer should focus."
                  className="min-h-32 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#014051] focus:ring-4 focus:ring-[#014051]/10"
                />
              </Field>

              <Field label="Proof Links" htmlFor="proofLinks">
                <textarea
                  id="proofLinks"
                  value={form.proofLinks}
                  onChange={event => updateField("proofLinks", event.target.value)}
                  placeholder={"One link per line\nhttps://github.com/...\nhttps://drive.google.com/..."}
                  className="min-h-28 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#014051] focus:ring-4 focus:ring-[#014051]/10"
                />
              </Field>

              <div className="grid gap-2">
                <Label htmlFor="proofFiles">Proof Files</Label>
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-[#014051]/20 bg-[#f8fbfc] px-6 py-8 text-center transition hover:border-[#014051]/40 hover:bg-[#f0f8fa]">
                  <input
                    id="proofFiles"
                    type="file"
                    multiple
                    className="hidden"
                    onChange={event => setFiles(Array.from(event.target.files ?? []))}
                  />
                  <span className="text-sm font-medium text-[#014051]">{selectedFileLabel}</span>
                  <span className="mt-2 text-xs text-gray-500">
                    Accepted: PDFs, docs, images, zipped proof, or any review material
                  </span>
                </label>
              </div>

              {message && (
                <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                  {message}
                </div>
              )}
              {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-12 rounded-full bg-[#014051] text-white hover:bg-[#022e39]"
              >
                {isSubmitting ? "Submitting..." : "Submit for certification review"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  htmlFor,
  required,
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={htmlFor} className="text-sm font-medium text-gray-800">
        {label}
        {required ? <span className="ml-1 text-red-500">*</span> : null}
      </Label>
      {children}
    </div>
  );
}
