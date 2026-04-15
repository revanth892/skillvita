# SkillVita Certify Setup

This feature adds:

- Public submission page: `/certify`
- Admin review page: `/certify/review`
- Public certificate page: `/certify/certificate/[certificateCode]`

## What it needs

Add these environment variables:

```env
NEXT_PUBLIC_APP_URL=https://skillvita.in
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_ID=your_google_oauth_client_id
AUTH_SECRET=replace_with_a_long_random_secret
ADMIN_GOOGLE_EMAIL=hemanth@skillvita.in
SMTP_HOST=email-smtp.ap-south-1.amazonaws.com
SMTP_PORT=587
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password
CERTIFY_FROM_EMAIL=hemanth@skillvita.in
CERTIFY_FROM_NAME=SkillVita
```

## Google login setup

Create a Google OAuth client for the review console.

Use these JavaScript origins:

- `http://localhost:3000`
- `https://skillvita.in`

The review page only accepts the email in `ADMIN_GOOGLE_EMAIL`.

## Email delivery

The approval email now uses SMTP.

Recommended production option:

- AWS SES SMTP credentials

Supported alternative:

- Google Workspace or Gmail SMTP

For AWS SES, use values like:

- `SMTP_HOST=email-smtp.ap-south-1.amazonaws.com`
- `SMTP_PORT=587`
- `SMTP_USER=your_ses_smtp_username`
- `SMTP_PASS=your_ses_smtp_password`

For Google, typical values are:

- `SMTP_HOST=smtp.gmail.com`
- `SMTP_PORT=587`
- `SMTP_USER=your_google_email`
- `SMTP_PASS=your_app_password`

AWS SES is the safer production choice because Gmail has tighter sending limits and can be more fragile for automated mail.

## Storage model

Submissions are stored on disk in this repo:

- `data/certify/submissions.json`
- `data/certify/uploads/...`

This works well for a single VPS deployment.

If you later move to serverless or multiple instances, switch this feature to a database/object storage setup.

## Review flow

1. User submits the form on `/certify`.
2. Submission is saved with status `pending`.
3. Admin signs in on `/certify/review` using Google.
4. Admin approves a submission.
5. SkillVita emails the certificate link to the learner.
