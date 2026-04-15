# Deploy SkillVita on a CloudClusters VPS

This guide is prefilled for:

- Domain: `skillvita.in`
- VPS IP: `77.93.152.231`
- SSH user: `administrator`

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

```bash
mkdir -p /var/www
cd /var/www
git clone https://github.com/revanth892/skillvita.git
cd skillvita
```

## 8. Configure environment variables

Create the production env file:

```bash
cp .env.example .env.production
nano .env.production
```

Set at least these values:

```env
NEXT_PUBLIC_BACKEND_LINK=https://your-backend-domain-or-api
NEXT_PUBLIC_BACKEND_URL=https://your-backend-domain-or-api
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_google_recaptcha_site_key
NEXT_PUBLIC_APP_CAPTCHA_KEY=your_google_recaptcha_site_key
NEXT_PUBLIC_RAZOR_PAY_KEY=your_razorpay_key_id
NEXT_PUBLIC_RAZOR_PAY_SECRET_KEY=your_razorpay_public_or_exposed_key_if_required
```

Important:

- `NEXT_PUBLIC_*` values are exposed to the browser by design.
- If `NEXT_PUBLIC_BACKEND_LINK` is missing, several pages and forms will fail.
- Review whether `NEXT_PUBLIC_RAZOR_PAY_SECRET_KEY` should really be public. The current frontend references it directly.

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

## 14. Useful checks

```bash
pm2 logs skillvita
systemctl status nginx
ss -tulpn | grep :80
ss -tulpn | grep :443
ss -tulpn | grep :3000
```

## Notes specific to this repo

- The app uses `next build` and `next start`.
- `netlify.toml` pins Node 20, so use Node 20 on the VPS as well.
- Multiple pages fetch data from `NEXT_PUBLIC_BACKEND_LINK`, so the backend/API must already be reachable from the browser.
- This repo was not fully build-tested in the local workspace because `npm` was not installed on the current machine.
- After SSH login, run the rest of the guide from a root shell opened with `sudo -i`.
