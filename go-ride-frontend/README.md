# Go Ride Frontend

The Go Ride rider and captain web application, built with React, Vite, and React Router. It communicates with the Express backend over REST and Socket.IO and uses Google Maps for map and route features.

## Run Locally

```powershell
npm install
npm run dev
```

Vite prints the local URL when ready (normally `http://localhost:5173`). Run the backend separately from `../go-ride-backend`.

## Configuration

Set these variables in `.env` for local development:

| Variable | Purpose |
| --- | --- |
| `VITE_BASE_URL` | Backend origin, normally `http://localhost:4000`. |
| `VITE_GOOGLE_MAPS_API` | Browser-restricted Google Maps JavaScript API key. |

Production builds also read `.env.production`. Vite `VITE_` variables are included in browser code; do not put secrets in them. See the [workspace README](../README.md) for full backend setup, Google Maps requirements, and deployment guidance.

## Scripts

- `npm run dev` starts the development server.
- `npm run build` creates the production build in `dist/`.
- `npm run preview` serves the production build locally.
- `npm run lint` runs ESLint.
