# CV Builder

A modern CV builder web application built with Next.js 14 (App Router), Tailwind CSS, and Neon Database. Features a glassmorphism UI theme, drag-and-drop section editor, and PDF export functionality.

## Features

- **User Authentication**: Email/password sign-up & login with NextAuth
- **Drag-and-Drop Section Editor**: Reorder, add, and remove CV sections using Framer Motion
- **Multiple CV Templates**: Choose from different layouts for your CV
- **Glassmorphism UI**: Modern, semi-transparent UI with blur effects
- **PDF Export**: Export your CV to PDF with proper formatting
- **Responsive Design**: Works on mobile and desktop

## Setup Instructions

1. Clone the repository:
```bash
git clone https://github.com/yourusername/cv-builder.git
cd cv-builder
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory with your credentials:
```
DATABASE_URL="postgresql://username:password@hostname:port/database"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret"
```

4. Set up your Neon database:
   - Create a new project at [neon.tech](https://neon.tech)
   - Copy your database connection string to `.env.local`
   - Push the schema to your database:
   ```bash
   npx prisma db push
   ```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Dependencies

- Next.js 14
- React 18
- Tailwind CSS
- Framer Motion
- Prisma
- NextAuth.js
- Neon Database
- html2canvas
- jsPDF

## Project Structure

- `/src/app`: Next.js App Router pages
- `/src/components`: Reusable React components
- `/src/lib`: Utility functions, hooks, and store
- `/prisma`: Database schema 