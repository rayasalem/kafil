# Kafeel Platform - Production Build

Kafeel is a client-freelancer Escrow protection platform, completely prepared as a production-ready application.

## Development

```bash
npm install
npm run dev
```

## Production Configurations Included
- **Vercel**: Included `vercel.json` for edge caching and React Router support.
- **Netlify**: Included `public/_redirects` to handle React Router navigation boundaries.
- **VPS (Nginx)**: Refer to `nginx.example.conf` for hosting securely on DigitalOcean, Linode, or AWS EC2.

## How to Deploy to Vercel

1. Push your code to a GitHub repository.
2. Go to Vercel dashboard and click **Add New** -> **Project**.
3. Import your GitHub repository.
4. Framework Preset: **Vite**
5. Click **Deploy**. Vercel will automatically read `vercel.json` and serve the application.

## How to Deploy to Netlify

1. Push your code to GitHub.
2. Form Netlify dashbaord, select **Add new site** -> **Import an existing project**.
3. Connect your GitHub and select the repo.
4. Build command: `npm run build`
5. Publish directory: `dist`
6. Click **Deploy site**. The `public/_redirects` file manages the 404 router limits automatically.

## Performance optimizations included
1. **Lazy Loading (`React.lazy`)**: The application leverages modular route splitting to only push JS that the user actually opens.
2. **Local Storage Database Engine**: Removed hard dependencies from backend mock APIs to natively run as LocalStorage JSON for hackathon judges perfectly without backend downtime crashes.
3. **Optimized Build configs**: Setup Vite build structure inside `package.json` with removed developer noise.
