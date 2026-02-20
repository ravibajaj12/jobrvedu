# JobRVEdu.in Educational Portal Requirements Document

## 1. Application Overview

### 1.1 Application Name
JobRVEdu.in

### 1.2 Application Description
A complete production-ready educational portal for government job seekers, providing comprehensive information about jobs, results, admit cards, and answer keys with full admin management capabilities.

### 1.3 Application Type
Web-based educational portal with admin dashboard

## 2. Core Functional Requirements

### 2.1 Public User Features

#### 2.1.1 Homepage
- Hero section with heading: Your Gateway to Government Jobs
- Working search bar with orange search button
- Four statistics cards displaying:
  - Active Jobs count
  - Results count
  - Admit Cards count
  - Answer Keys count
- Latest Jobs section (display latest 5 from database)
- Latest Results section (display latest 5 from database)
- Latest Admit Cards section (display latest 5 from database)
- Latest Answer Keys section (display latest 5 from database)
- Each section must include View All button
- All data must be dynamic from database

#### 2.1.2 Jobs Module
- Jobs listing page with category filter
- Sort by newest first
- Working search functionality
- Individual job detail pages
- Display: title, organization, description, category, total posts, publish date, last date, important flag, apply link

#### 2.1.3 Results Module
- Results listing page
- Individual result detail pages
- Display: exam name, organization, result date, description, result link

#### 2.1.4 Admit Cards Module
- Admit cards listing page
- Individual admit card detail pages
- Display: exam name, organization, release date, exam date, download link

#### 2.1.5 Answer Keys Module
- Answer keys listing page
- Individual answer key detail pages
- Display: exam name, release date, objection last date, PDF link

### 2.2 Admin Features

#### 2.2.1 Authentication System
- One-time admin setup (first user becomes admin)
- Disable signup after first admin creation
- Login page at /admin/login
- JWT-based authentication
- Password hashing using bcrypt
- Protected admin routes

#### 2.2.2 Admin Dashboard
- Sidebar navigation with sections:
  - Manage Jobs
  - Manage Results
  - Manage Admit Cards
  - Manage Answer Keys

#### 2.2.3 CRUD Operations
All modules must support:
- Create new entries
- Read/view entries
- Update existing entries
- Delete entries

## 3. Database Schema

### 3.1 Users Table
- id (primary key)
- name
- email (unique)
- password (hashed)
- role

### 3.2 Jobs Table
- id (primary key)
- title
- organization
- description
- category
- totalPosts
- publishDate
- lastDate
- important (boolean)
- applyLink
- createdAt

### 3.3 Results Table
- id (primary key)
- examName
- organization
- resultDate
- description
- resultLink
- createdAt

### 3.4 AdmitCards Table
- id (primary key)
- examName
- organization
- releaseDate
- examDate
- downloadLink
- createdAt

### 3.5 AnswerKeys Table
- id (primary key)
- examName
- releaseDate
- objectionLastDate
- pdfLink
- createdAt

## 4. UI Design Specifications

### 4.1 Header
- Logo text: JobRVEdu.in (left side)
- Navigation links (right side): Home, Jobs, Results, Admit Cards, Answer Keys, Admin (highlighted button)
- Sticky navbar
- Background color: #1e40af (blue)
- Accent color: #f97316 (orange)

### 4.2 Design Requirements
- Mobile responsive layout
- No horizontal scroll
- Smooth transitions
- Loading states for all data fetching
- Success and error messages for all operations
- No broken links or empty buttons

## 5. Routing Structure

### 5.1 Public Routes
- / (Homepage)
- /jobs (Jobs listing)
- /jobs/[id] (Job detail)
- /results (Results listing)
- /results/[id] (Result detail)
- /admit-cards (Admit cards listing)
- /admit-cards/[id] (Admit card detail)
- /answer-keys (Answer keys listing)
- /answer-keys/[id] (Answer key detail)

### 5.2 Admin Routes
- /admin (Admin dashboard)
- /admin/login (Admin login)

## 6. API Requirements

### 6.1 API Routes
Each module requires:
- GET endpoint for listing
- GET endpoint for single item detail
- POST endpoint for creation (admin only)
- PUT endpoint for updates (admin only)
- DELETE endpoint for deletion (admin only)

### 6.2 Search API
- Search functionality for jobs and results
- Category filtering for jobs

## 7. SEO Requirements
- Dynamic meta tags for all pages
- robots.txt file
- sitemap.xml file

## 8. Technical Requirements

### 8.1 Technology Stack
- Next.js with App Router
- Tailwind CSS for styling
- Node.js API routes
- SQLite database
- JWT for authentication
- bcrypt for password hashing

### 8.2 Deployment
- Fully compatible with Vercel deployment
- No console errors
- All functionality must work in production

## 9. Quality Assurance Checklist
- All navbar links navigate correctly
- All API routes connected and functional
- Admin create/edit/delete operations work
- Dynamic data appears on homepage
- Search functionality works
- Category filters work
- All buttons are functional
- No static UI elements
- No dead navigation
- Database operations complete successfully
- Mobile responsive on all devices
- Loading states display properly
- Error handling implemented