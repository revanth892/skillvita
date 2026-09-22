# Deploy SkillVita on a CloudClusters VPS

This guide is prefilled for:

- Domain: `skillvita.in`
- VPS IP: `77.93.152.231`
- SSH user: `administrator`
- Backend API: `https://api.skillvita.in` (separate server; not on this VPS)

This project is a Next.js 15 app. On a Linux VPS, the simplest production setup is:

- Node.js 20
- `npm run build`
- PM2 to keep the app running
- Nginx as the reverse proxy
- A domain pointed to the VPS IP
- SSL via Let's Encrypt

## 1. Provision the VPS

Use an Ubuntu 22.04 or 24.04 VPS on CloudClusters.

Minimum recommended size:

- 2 vCPU
- 4 GB RAM
- 40+ GB disk

## 2. Point your domain

In CloudClusters or your DNS provider, point these records to the VPS public IP:

- `@` -> `A` -> `77.93.152.231`
- `www` -> `A` -> `77.93.152.231`

If you use CloudClusters DNS/application tooling, the same domain mapping flow is described here:

- https://www.cloudclusters.io/docs/runtime/Adding%20Your%20Domain1608099880.html

## 3. Connect to the server

```bash
ssh administrator@77.93.152.231
sudo -i
```

Your VPS does not allow direct `root` SSH login. Log in as `administrator`, then elevate with `sudo -i` before continuing.

## 4. Install system packages

```bash
apt update
apt install -y nginx git curl build-essential
```

## 5. Install Node.js 20

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
node -v
npm -v
```

## 6. Install PM2

```bash
npm install -g pm2
pm2 -v
```

## 7. Clone the project

Use the org repo if you need **Certify** (`/certify`, `/certify/review`). The public fork `revanth892/skillvita` does not include that feature.

```bash
mkdir -p /var/www
cd /var/www
git clone https://github.com/skillvita/landing.git skillvita
cd skillvita
```

If the folder already exists from an older clone of `revanth892/skillvita`, point it at the org repo instead:

```bash
cd /var/www/skillvita
git remote set-url origin https://github.com/skillvita/landing.git
git fetch origin
git checkout main
git pull origin main
```

## 8. Configure environment variables

Environment files are **not in git**. After `git clone`, you will not see `.env` or `.env.production` until you create them yourself.

Work from the app directory, not your home folder:

```bash
cd /var/www/skillvita
ls -la | grep env
```

Notes:

- Plain `ls` hides dotfiles. Always use `ls -la` when checking for env files.
- `.env*` is gitignored, so there is no `.env.example` on the server to copy from.
- You only need `.env.production` for this VPS setup. PM2 runs with `NODE_ENV=production`, and Next.js loads that file during `npm run build` and `npm start`.
- Do not create the file in `/root` or `~/backups`. It must live in `/var/www/skillvita`.

### Create `.env.production` from scratch

```bash
cd /var/www/skillvita
nano .env.production
```

Paste this template and replace every `your_*` placeholder:

```env
# Site + backend API
NEXT_PUBLIC_APP_URL=https://skillvita.in
NEXT_PUBLIC_BACKEND_LINK=https://api.skillvita.in
NEXT_PUBLIC_BACKEND_URL=https://api.skillvita.in

# Payments + captcha
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_google_recaptcha_site_key
NEXT_PUBLIC_APP_CAPTCHA_KEY=your_google_recaptcha_site_key
NEXT_PUBLIC_RAZOR_PAY_KEY=your_razorpay_key_id
NEXT_PUBLIC_RAZOR_PAY_SECRET_KEY=your_razorpay_public_or_exposed_key_if_required

# Certify (required if /certify is deployed — see CERTIFY_SETUP.md)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_ID=your_google_oauth_client_id
AUTH_SECRET=replace_with_a_long_random_secret
ADMIN_GOOGLE_EMAIL=hemanth@skillvita.in
SMTP_HOST=email-smtp.ap-south-1.amazonaws.com
SMTP_PORT=587
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password
CERTIFY_FROM_EMAIL=reachus@skillvita.in
CERTIFY_FROM_NAME=SkillVita
```

Generate a strong `AUTH_SECRET`:

```bash
openssl rand -base64 32
```

Save in nano with `Ctrl+O`, Enter, then exit with `Ctrl+X`.

Verify the file exists:

```bash
ls -la /var/www/skillvita/.env.production
```

Important:

- `NEXT_PUBLIC_*` values are exposed to the browser by design.
- `NEXT_PUBLIC_BACKEND_LINK` must be set **before** `npm run build`. Next.js bakes it into the client bundle at build time.
- The live backend is at [api.skillvita.in](https://api.skillvita.in). It runs on a separate host from the frontend VPS. Events, blogs, careers, checkout, and forms all call this API.
- If `NEXT_PUBLIC_BACKEND_LINK` is missing or still set to a placeholder, dynamic pages and forms will fail in production.
- Review whether `NEXT_PUBLIC_RAZOR_PAY_SECRET_KEY` should really be public. The current frontend references it directly.
- If you skip Certify for now, you can omit the Google OAuth and SMTP lines. Add them before deploying `/certify`.

## 9. Install dependencies and build

```bash
cd /var/www/skillvita
npm install
npm run build
```

## 10. Start the app with PM2

```bash
cd /var/www/skillvita
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

If PM2 prints another command after `pm2 startup`, run that command too.

Verify the app:

```bash
pm2 status
curl http://127.0.0.1:3000
```

## 11. Configure Nginx

Create the site config:

```bash
nano /etc/nginx/sites-available/skillvita
```

Paste:

```nginx
server {
    listen 80;
    server_name skillvita.in www.skillvita.in;

    client_max_body_size 25M;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable it:

```bash
ln -s /etc/nginx/sites-available/skillvita /etc/nginx/sites-enabled/skillvita
nginx -t
systemctl restart nginx
systemctl enable nginx
```

## 12. Enable SSL

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d skillvita.in -d www.skillvita.in
systemctl status certbot.timer
```

## 13. Updating the app later

```bash
cd /var/www/skillvita
git pull origin main
npm ci
npm run build
pm2 restart skillvita
```

After the build finishes, confirm Certify routes were included:

```bash
ls .next/server/app/certify
curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:3000/certify
```

You should see route folders under `.next/server/app/certify` and HTTP `200` from the local curl.

If you change any `NEXT_PUBLIC_*` value in `.env.production`, you must run `npm run build` again before restarting PM2. A restart alone is not enough.

Quick backend check from the VPS:

```bash
curl -s https://api.skillvita.in
curl -s -o /dev/null -w "%{http_code}\n" https://api.skillvita.in/api/getAllEvents
```

You should see `{"message":"Hi coursevita"}` and HTTP `200` for events.

## 14. Useful checks

```bash
pm2 logs skillvita
systemctl status nginx
ss -tulpn | grep :80
ss -tulpn | grep :443
ss -tulpn | grep :3000
```

## 15. Troubleshooting `/certify` returns 404

Symptoms:

- `https://skillvita.in/` and `/events` work
- `https://skillvita.in/certify` returns 404
- `https://skillvita.in/api/certify/submissions` returns 404

Diagnose on the VPS:

```bash
cd /var/www/skillvita
ls src/app/certify
git remote -v
git log -1 --oneline
ls .next/server/app/certify 2>/dev/null || echo "certify not in current build"
curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:3000/certify
```

Common cause: the server is running a build from `revanth892/skillvita`, which has no Certify routes. Fix:

```bash
cd /var/www/skillvita
git remote set-url origin https://github.com/skillvita/landing.git
git fetch origin
git checkout main
git pull origin main
ls src/app/certify
npm ci
npm run build
pm2 restart skillvita
curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:3000/certify
```

If `git pull` asks for credentials, use a GitHub personal access token for the `skillvita/landing` repo.

If source files exist but curl is still 404, PM2 may be serving a stale build. Rebuild from `/var/www/skillvita` and restart:

```bash
cd /var/www/skillvita
rm -rf .next
npm run build
pm2 restart skillvita
```

## Notes specific to this repo

- The app uses `next build` and `next start`.
- `netlify.toml` pins Node 20, so use Node 20 on the VPS as well.
- Multiple pages fetch data from `NEXT_PUBLIC_BACKEND_LINK` (`https://api.skillvita.in`), so that API must be reachable from the browser.
- This repo was not fully build-tested in the local workspace because `npm` was not installed on the current machine.
- After SSH login, run the rest of the guide from a root shell opened with `sudo -i`.
