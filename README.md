# StudioSpace

StudioSpace is a peer-to-peer marketplace for discovering and booking creative
workspaces. Photographers, filmmakers, podcasters, musicians, and other
creators can explore studios, review their details, and submit booking
requests. Hosts can publish and manage their studio listings.

> **Live application:** [https://studio-space-client-ashen.vercel.app](https://studio-space-client-ashen.vercel.app)

## Highlights

- **Explore creative spaces:** Browse studios, search and filter listings, and
  explore spaces by category.
- **Detailed studio pages:** Review pricing, capacity, location, amenities,
  host details, photos, and booking options.
- **Accounts and sign-in:** Register with email and password or sign in with
  Google when the required OAuth configuration is available.
- **Host tools:** Create, edit, and delete studio listings from a personal
  listings page.
- **Booking management:** Submit booking requests and review their status from
  the bookings page.
- **Responsive interface:** Navigate the marketplace on desktop, tablet, and
  mobile, with branded loading indicators, toast feedback, and helpful empty
  states.
- **Personalized appearance:** Switch between light and dark themes while
  keeping the StudioSpace orange accent.

## Technology

| Area | Technologies |
| --- | --- |
| Application | Next.js App Router, React, TypeScript |
| Styling and UI | Tailwind CSS, shadcn/ui, Base UI |
| Authentication | Better Auth, MongoDB adapter, JWT plugin |
| API | Express API hosted separately from this client |
| Feedback and icons | Sonner, Lucide React |

The client uses the StudioSpace API at
`https://studio-space-server-nine.vercel.app` by default only when configured
as `NEXT_PUBLIC_API_BASE_URL`. The API service is deployed independently from
this repository.

## Source Organization

Shared static content and UI configuration live in [`src/Data`](./src/Data),
with focused modules for studio categories and amenities, home-page content,
navigation, listing filters, and the How It Works page. Import these exports
where needed instead of duplicating section data inside components.

## Getting Started

### Prerequisites

- Node.js 20 or later
- npm
- A MongoDB connection string for Better Auth
- Google OAuth credentials if Google sign-in is required
- Access to a StudioSpace API deployment

### Install

```bash
git clone https://github.com/moniruzzaman-tasrif/studio-space-client.git
cd studio-space-client
npm ci
```

### Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the local development server |
| `npm run lint` | Run ESLint |
| `npm run build` | Create an optimized production build |
| `npm run start` | Serve the production build locally |

## Application Routes

| Route | Purpose | Access |
| --- | --- | --- |
| `/` | Home page and featured studios | Public |
| `/studios` | Explore studio listings | Public |
| `/studios/[id]` | Studio details and booking request form | Public |
| `/catagoris` | Browse studio categories | Public |
| `/catagoris/[id]` | Studios in a selected category | Public |
| `/about` | About StudioSpace | Public |
| `/How-It-Works` | Platform guide | Public |
| `/sign-in` | Email/password sign-in and Google sign-in | Public |
| `/sign-up` | Create an account | Public |
| `/dashboard` | Account overview | Signed-in users |
| `/add-studio` | Publish a studio listing | Signed-in users |
| `/my-listings` | Manage studio listings | Signed-in users |
| `/my-bookings/[id]` | View bookings | Signed-in users |

## Examiner Access

No examiner account credentials are maintained in this repository. For a
review, use an account provisioned specifically for demonstration and share
its credentials through a private channel—not in this README, source code, or
Git history. Google sign-in also requires valid OAuth configuration.

## Project Scope

This repository contains the StudioSpace **client application**. The API is
maintained and deployed separately. Server-side authorization, database
operations, and booking availability rules must be verified against that API
implementation; they cannot be established from the client alone.

## Repository

[moniruzzaman-tasrif/studio-space-client](https://github.com/moniruzzaman-tasrif/studio-space-client)
