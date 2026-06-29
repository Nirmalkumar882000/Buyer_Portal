# VelaanBay - Buyer Portal

The **Buyer Portal** is a modern, responsive web application built with React, TypeScript, and Vite. It serves as the dedicated interface for buyers on the VelaanBay platform, allowing them to manage their purchases, track auction wins, view market sales, and generate invoices seamlessly.

## 🚀 Features

- **Dynamic Purchase History**: View all completed purchases including both Direct Market Sales and Auction Wins.
- **Advanced Filtering**: Filter purchase history by Date Range, Commodity Type, and Seller Name.
- **Invoice Generation**: Instantly view and download detailed PDF invoices for any completed order.
- **Real-Time Data**: Integrates directly with the VelaanBay backend APIs to ensure up-to-date order statuses and pricing.
- **Responsive Design**: Built with a mobile-first approach using Tailwind CSS, ensuring a great user experience on both desktop and mobile devices.
- **Multi-language Support (i18n)**: Seamless language switching (e.g., English and Tamil) for better accessibility.

## 🛠️ Technology Stack

- **Framework**: React 18
- **Build Tool**: Vite (Lightning fast HMR & optimized builds)
- **Language**: TypeScript
- **Styling**: Tailwind CSS & Lucide React Icons
- **State Management & Routing**: React Router DOM, Context API
- **Networking**: Axios
- **Internationalization**: i18next

## ⚙️ Setup Instructions

### Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) or [pnpm](https://pnpm.io/)

### Installation

1. Clone the repository and navigate to the Buyer Portal directory:
   ```bash
   cd "e:\SKANDAVEL PROJECT\Buyer_Portal"
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Configure Environment Variables:
   Create or modify the `.env` file in the root of the Buyer Portal directory to include the required variables, for example:
   ```env
   VITE_APP_TITLE=Buyer Portal
   VITE_APP_VERSION=1.0.0
   VITE_API_URL=http://localhost:6200
   ```

### Running the Development Server

Start the development server with Hot Module Replacement (HMR):

```bash
npm run dev
# or
yarn dev
```

The application will typically run at `http://localhost:5173` (or the port specified by Vite in your terminal).

### Building for Production

To create an optimized production build:

```bash
npm run build
```

This will generate a `dist` directory containing the minified and bundled static assets ready for deployment.

## 📂 Project Structure

- `src/api/` - API integration services (e.g., reports, auth)
- `src/components/` - Reusable UI components
- `src/context/` - React Context providers (Auth, Toast, etc.)
- `src/layouts/` - Page layouts (e.g., AppShell sidebar & header)
- `src/locales/` - i18n translation files
- `src/pages/` - Core application pages (Dashboard, Purchase History, etc.)
- `public/` - Static assets like logos and icons

## 🤝 Contributing

When contributing to this frontend, ensure that:
- Any new API calls are properly typed and placed within `src/api/`.
- Styling adheres to the existing Tailwind CSS conventions.
- All new UI strings are added to the localization JSON files (`src/locales/`) to maintain multi-language support.
