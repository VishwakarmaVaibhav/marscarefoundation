# Mars Care Foundation - NGO Website & Admin CMS

A modern, full-stack NGO website with donation management, built with Next.js, Express.js, and MongoDB.

## 🚀 Features

### Public Website (Client)
- **Modern Design** - Dark theme with glassmorphism, animations, and premium UI
- **Donation System** - Razorpay payment integration with 80G tax receipt
- **Programs Showcase** - Display causes with fundraising progress
- **Blog/News** - SEO-optimized blog with categories
- **Gallery** - Event photo galleries with albums
- **Volunteer Registration** - Online volunteer signup form
- **Contact Form** - Inquiry management system

### Admin Panel
- **Dashboard** - Analytics with donation charts and stats
- **Blog Manager** - Full CMS for blog posts
- **Gallery Manager** - Multi-image upload with Cloudinary
- **Donor CRM** - Complete donor management with export
- **Program Manager** - Create and manage campaigns
- **Volunteer Manager** - Track and approve volunteers
- **SEO Control Room** - Meta tags, analytics, robots.txt
- **Settings** - Site configuration

### Backend API
- **Authentication** - JWT with role-based access (admin/editor/viewer)
- **Donations** - Razorpay integration with receipt generation
- **Email** - Resend API for transactional emails
- **File Upload** - Cloudinary for images
- **Full REST API** - For all entities

## 📁 Project Structure

```
Mars Care NGO/
├── server/          # Express.js Backend API
│   ├── src/
│   │   ├── config/       # Database & Cloudinary config
│   │   ├── controllers/  # Route controllers
│   │   ├── middleware/   # Auth, upload, validation
│   │   ├── models/       # MongoDB schemas
│   │   ├── routes/       # API routes
│   │   ├── services/     # Email service
│   │   └── index.js      # Entry point
│   └── package.json
│
├── client/          # Next.js Public Website
│   ├── src/
│   │   ├── app/          # Pages (App Router)
│   │   ├── components/   # React components
│   │   ├── lib/          # API & utilities
│   │   └── styles/       # CSS
│   └── package.json
│
└── admin/           # Next.js Admin Panel
    ├── src/
    │   ├── app/          # Admin pages
    │   ├── lib/          # API & utilities
    │   └── styles/       # CSS
    └── package.json
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Razorpay Account
- Cloudinary Account
- Resend Account

### 1. Clone and Install

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install

# Install admin dependencies
cd ../admin
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env` in the server folder:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/mars-care

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Razorpay
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret

# Resend
RESEND_API_KEY=re_your-resend-api-key

# Frontend URLs
CLIENT_URL=http://localhost:3000
ADMIN_URL=http://localhost:3001
```

### 3. Seed Database

```bash
cd server
npm run seed
```

This creates:
- Admin user: `admin@marscarefoundation.org` / `admin123`
- Sample programs
- Default settings

### 4. Run Development Servers

```bash
# Terminal 1 - Backend API
cd server
npm run dev
# Runs on http://localhost:5000

# Terminal 2 - Public Website
cd client
npm run dev
# Runs on http://localhost:3000

# Terminal 3 - Admin Panel
cd admin
npm run dev
# Runs on http://localhost:3001
```

## 🔑 API Endpoints

### Auth
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register (admin only)
- `GET /api/auth/me` - Get current user

### Donations
- `POST /api/donations/create-order` - Create Razorpay order
- `POST /api/donations/verify` - Verify payment
- `GET /api/donations` - List donations (admin)
- `GET /api/donations/stats` - Donation statistics

### Programs
- `GET /api/programs` - List programs
- `GET /api/programs/featured` - Featured programs
- `GET /api/programs/:slug` - Single program
- `POST /api/programs` - Create (admin)
- `PUT /api/programs/:id` - Update (admin)
- `DELETE /api/programs/:id` - Delete (admin)

### Blogs, Gallery, Volunteers, Donors, Contact, Settings
Similar CRUD endpoints following REST conventions.

## 🎨 Tech Stack

- **Frontend**: Next.js 14, React 18, Tailwind CSS, Framer Motion
- **Backend**: Express.js, MongoDB, Mongoose
- **Payments**: Razorpay
- **Email**: Resend
- **Storage**: Cloudinary
- **Charts**: Recharts

## 📄 License

MIT License - Free to use for NGO projects.

---

Built with ❤️ for Mars Care Foundation
