# Go Ride

Go Ride is a ride-booking application with separate experiences for riders and captains. The frontend is a React/Vite single-page app; the backend is an Express API backed by MongoDB, with Socket.IO for ride updates and Google Maps services for location search and routing.

## Features

- Rider and captain registration, login, and protected pages
- Pickup and destination search
- Fare estimates for car, auto, and moto rides
- Ride requests, captain assignment, and ride status updates
- Live location and route views

## Repository Layout

```text
Go Ride/
|-- go-ride-backend/   Express API, MongoDB models, maps and ride services
|-- go-ride-frontend/  React application built with Vite
`-- README.md
```

The backend endpoint documentation is in [go-ride-backend/README.md](go-ride-backend/README.md).

## Requirements

- Node.js 20 or later and npm
- A MongoDB connection string
- A Google Maps Platform project with billing enabled and the APIs listed under [Google Maps setup](#google-maps-setup)

Install and run the backend and frontend in separate terminals.

### Backend

```powershell
cd go-ride-backend
npm install
npm start
```

The backend listens on `PORT` when configured; otherwise it uses port `3000`. The local `.env` in this repository sets port `4000`.

For automatic restarts while editing, run:

```powershell
npx nodemon server.js
```

### Frontend

```powershell
cd go-ride-frontend
npm install
npm run dev
```

Open the Vite URL shown in the terminal (normally `http://localhost:5173`). The local [go-ride-frontend/.env](go-ride-frontend/.env) points API and Socket.IO traffic to `http://localhost:4000`.

## Environment Variables

Create local `.env` files in the corresponding project directories. Do not commit secret values.

### Backend: `go-ride-backend/.env`

| Variable | Purpose |
| --- | --- |
| `PORT` | HTTP server port. Defaults to `3000`. |
| `DB_CONNECT` | MongoDB connection URI. |
| `JWT_SECRET` | Secret used to sign and verify authentication tokens. |
| `GOOGLE_MAPS_API` | Server-side Google Maps Platform key for geocoding, Places search, and route calculations. |
| `FRONTEND_URL` | Exact frontend origin allowed by Express and Socket.IO CORS, such as `http://localhost:5173`. Do not add a trailing slash. |

### Frontend: `go-ride-frontend/.env`

| Variable | Purpose |
| --- | --- |
| `VITE_BASE_URL` | Backend origin, for example `http://localhost:4000`. Do not append an API path. |
| `VITE_GOOGLE_MAPS_API` | Browser key used to load the Google Maps JavaScript API. |

Vite exposes variables prefixed with `VITE_` to browser code. Use a browser-restricted Maps key for `VITE_GOOGLE_MAPS_API`; never put database credentials, JWT secrets, or unrestricted server keys in frontend variables.

The tracked [go-ride-frontend/.env.production](go-ride-frontend/.env.production) sets `VITE_BASE_URL` to the deployed backend URL. Vercel project environment variables can override it. Set `VITE_GOOGLE_MAPS_API` in the frontend's Vercel project settings before deploying.

## Google Maps Setup

Enable billing for the Google Cloud project associated with the keys, then enable the APIs used by this app:

- Maps JavaScript API
- Places API (New)
- Geocoding API
- Routes API
- Directions API

Restrict the browser key by allowed website referrers and the server key by the APIs it needs. A `BillingNotEnabledMapError` or Google API 500 response must be resolved in Google Cloud; changing application code cannot enable billing.

## Deployment

1. Deploy the frontend from `go-ride-frontend` and set `VITE_GOOGLE_MAPS_API` in the Vercel project environment. The production API base URL is configured in `.env.production`.
2. Deploy the backend with `DB_CONNECT`, `JWT_SECRET`, `GOOGLE_MAPS_API`, and `FRONTEND_URL` configured in the hosting provider. Set `FRONTEND_URL` to the exact deployed frontend origin.
3. Redeploy the frontend whenever its environment variables change. Redeploy the backend whenever its server-side environment variables change.

The backend uses Socket.IO for live ride updates. Its Socket.IO server needs a host that supports persistent WebSocket connections; serverless HTTP routing alone does not provide a persistent Socket.IO server. If deploying the API on a serverless platform, host realtime connections on a WebSocket-capable service or change the realtime architecture.

## Useful Commands

Run these from the relevant project directory:

| Command | Project | Description |
| --- | --- | --- |
| `npm start` | `go-ride-backend` | Start the API server. |
| `npx nodemon server.js` | `go-ride-backend` | Start the API with file watching (Nodemon may be installed via `npx`). |
| `npm run dev` | `go-ride-frontend` | Start the Vite development server. |
| `npm run build` | `go-ride-frontend` | Build the production frontend into `dist/`. |
| `npm run preview` | `go-ride-frontend` | Preview a production build locally. |
| `npm run lint` | `go-ride-frontend` | Run ESLint. |

The backend currently has no automated test suite configured.

## Troubleshooting

- **`EADDRINUSE` on port 4000:** Another backend process is already running. Stop that process or use the existing server; do not start a second Nodemon process on the same port.
- **Browser requests still go to localhost after deployment:** Confirm the Vercel frontend was redeployed and that its production bundle uses `https://go-ride-x3yh.vercel.app` as `VITE_BASE_URL`.
- **Google map or address search errors:** Check Google Cloud billing, enabled APIs, and API key restrictions. The browser Maps key and backend Maps key serve different environments.
- **Socket.IO fails on the deployed backend:** Confirm the backend host supports persistent WebSocket connections and that its CORS origin exactly matches `FRONTEND_URL`.
- **CORS errors:** Set `FRONTEND_URL` to the exact browser origin, including scheme and host, with no trailing slash.
