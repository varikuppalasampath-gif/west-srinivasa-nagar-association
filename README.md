# West Srinivasa Nagar Association

A modern, responsive web application for managing and sharing information about the West Srinivasa Nagar residential community.

## Project Overview

The application aims to provide residents with a centralized platform to access association information, announcements, events, gallery images, and house-directory information.

## Features

- **Home Page** — Association overview and important announcements.
- **About Us** — Association information and objectives.
- **Notices** — Community notices and updates.
- **Events** — Upcoming and past association events.
- **Gallery** — Community photos and media.
- **Contact** — Association contact information.
- **Interactive House Map** — View house numbers on a schematic map.
- **House Search** — Search houses by house number or owner name.
- **House Details** — Display approved details when a house is selected or hovered over.
- **Admin Portal** — Intended for authorized association administrators to maintain information.

## Technology Stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- ShadCN UI
- Framer Motion
- React Hook Form
- Zod
- Firebase
- Google Sheets and Google Apps Script for data management
- Google Drive for media storage

## Getting Started

### Prerequisites

Install Node.js and npm, and ensure Git is available on your computer.

### Installation

Clone the repository:

```bash
git clone https://github.com/varikuppalasampath-gif/west-srinivasa-nagar-association.git
```

Navigate to the project directory:

```bash
cd west-srinivasa-nagar-association
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Configuration

Before enabling backend functionality, configure the required Firebase settings and Google Apps Script endpoints using environment variables.

- Keep secret keys and credentials in local environment files.
- Do not commit `.env` files or private service-account credentials.
- Configure appropriate access permissions for Google Sheets and Google Drive.

## House Map and Privacy

The house map is intended to display association-approved house information. Owner names and contact details must only be published with appropriate authorization. Private contact information should be restricted to authenticated, authorized users.

Any sample house records or schematic map positions used in the prototype are illustrative and must be replaced with verified association data before production use.

## Project Status

Development prototype. Backend integration, authentication, data validation, deployment configuration, and production readiness should be verified before public launch.

## Deployment

The application can be deployed after configuration and testing. Firebase Hosting or another compatible hosting platform may be selected based on the final Next.js deployment architecture.

## Repository

https://github.com/varikuppalasampath-gif/west-srinivasa-nagar-association

## License

A license has not yet been specified. Contact the repository owner for permission before reusing or redistributing the project.
