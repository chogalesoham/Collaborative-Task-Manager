# Collaborative Task Manager - Frontend UI

A modern, production-quality SaaS UI for a collaborative task management application built with React, TypeScript, Tailwind CSS, and Redux Toolkit.

## 🎨 Features

### Pages & Routing

#### Public Pages

- `/` - Landing Page with hero section, features, and CTA
- `/login` - Login page with form validation
- `/register` - Registration page with account creation

#### Protected Pages

- `/dashboard` - Main dashboard with task overview and statistics
- `/tasks` - Task list with advanced filtering and sorting
- `/tasks/new` - Create new task form
- `/tasks/:id` - Task detail view
- `/tasks/:id/edit` - Edit existing task
- `/profile` - User profile and account management

### 🔔 Notification System

- **Notification Bell Icon** in top navbar
- **Dropdown/Popover** on click showing:
  - Task assignment notifications
  - Task update notifications
  - Read/unread UI states
  - Timestamps (e.g., "30m ago", "2h ago")
  - Click to navigate to related task
  - Mark individual or all notifications as read

### 🧭 Layout Structure

- **Top Navbar**: App branding, navigation links, notification bell, profile menu
- **Responsive Design**: Mobile-first approach with desktop optimization
- **Main Content Area**: Clean, spacious layout for content

### 📊 Dashboard Features

- **Task Statistics Cards**: Assigned, In Progress, Completed, Overdue counts
- **Tasks Assigned to Me**: Grid of task cards
- **Tasks Created by Me**: Grid of task cards
- **Overdue Tasks**: Highlighted section with special styling
- **Skeleton Loaders**: For loading states
- **Empty States**: When no tasks exist

### 📋 Task Management

#### Task List Page

- **Filters**:
  - Status (All, To Do, In Progress, Completed)
  - Priority (All, Low, Medium, High)
  - Search by title/description
- **Sorting**: By due date, priority, or status
- **Table View**: With all task details
- **Clear Filters** button

#### Task Forms (Create/Edit)

- Title (required)
- Description (required)
- Due Date (required)
- Priority (Low/Medium/High)
- Assignee (dropdown with all users)
- Status (To Do/In Progress/Completed)
- Form validation
- Loading states on submit
- Cancel functionality

#### Task Detail Page

- Full task information
- Status and priority badges
- Overdue indicator
- Assignee and creator info with avatars
- Timeline (created/updated dates)
- Edit and delete actions
- Delete confirmation modal

### 👤 Profile Page

- User avatar (initials in gradient circle)
- Cover image with gradient
- Profile information display
- Edit profile functionality
- Account statistics
- Logout button

### 🎨 Design System

#### Modern SaaS Aesthetic

- **Inspired by**: Linear, Notion, Asana
- **Light Theme**: Clean and professional
- **Typography**: Clear hierarchy with proper font sizing
- **Spacing**: Consistent padding and margins
- **Cards**: Rounded corners with subtle shadows
- **Colors**:
  - Blue (#3B82F6) - Primary actions
  - Purple (#A855F7) - Accents
  - Green (#10B981) - Success/completed
  - Yellow (#F59E0B) - Medium priority/warnings
  - Red (#EF4444) - High priority/errors
  - Gray scale for neutrals

#### UI Components

- **Status Badges**: Color-coded (todo/in-progress/completed)
- **Priority Badges**: Color-coded (low/medium/high)
- **Avatars**: Gradient circles with initials
- **Buttons**: Primary, secondary, danger states
- **Forms**: Focus states with ring animations
- **Hover States**: Smooth transitions on all interactive elements
- **Loading States**: Spinner animations for async operations
- **Empty States**: Helpful messages with icons
- **Skeleton Loaders**: For data loading states

### 📱 Responsive Design

- **Mobile First**: Optimized for mobile devices
- **Breakpoints**:
  - Mobile: < 768px
  - Tablet: 768px - 1024px
  - Desktop: > 1024px
- **Adaptive Layouts**: Grid and flexbox for responsive behavior
- **Touch Friendly**: Appropriate touch targets
- **Collapsible Menus**: On mobile devices

## 🛠️ Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Utility-first styling
- **Redux Toolkit** - State management
- **RTK Query** - Data fetching with mock data
- **React Router DOM** - Client-side routing
- **Vite** - Build tool and dev server

## 🏗️ Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   └── Navbar.tsx           # Main navigation with notifications
│   ├── layouts/
│   │   ├── PublicLayout.tsx     # Layout for public pages
│   │   └── ProtectedLayout.tsx  # Layout for authenticated pages
│   ├── pages/
│   │   ├── LandingPage.tsx      # Marketing landing page
│   │   ├── LoginPage.tsx        # Login form
│   │   ├── RegisterPage.tsx     # Registration form
│   │   ├── DashboardPage.tsx    # Main dashboard
│   │   ├── TasksPage.tsx        # Task list with filters
│   │   ├── CreateTaskPage.tsx   # New task form
│   │   ├── EditTaskPage.tsx     # Edit task form
│   │   ├── TaskDetailPage.tsx   # Task details view
│   │   └── ProfilePage.tsx      # User profile
│   ├── store/
│   │   ├── index.ts             # Store configuration
│   │   ├── hooks.ts             # Typed Redux hooks
│   │   └── slices/
│   │       ├── tasksApi.ts      # RTK Query API with mock data
│   │       └── uiSlice.ts       # UI state (notifications, user)
│   ├── App.tsx                  # Main app with routing
│   ├── main.tsx                 # App entry point
│   └── index.css                # Global styles
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
cd frontend
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5174/`

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 📝 Mock Data

The application uses RTK Query with `fakeBaseQuery` to simulate API calls with mock data:

- **7 Tasks** with various statuses, priorities, and assignees
- **3 Users** (John Doe, Jane Smith, Bob Johnson)
- **3 Notifications** with different types and read states
- **Current User**: John Doe (can be changed in `uiSlice.ts`)

All CRUD operations work with the mock data stored in memory.

## 🎯 Key Features Implemented

✅ Complete routing with public and protected routes
✅ Modern navbar with notification bell and profile menu
✅ Notification dropdown with real-time-like updates
✅ Landing page with hero, features, and CTAs
✅ Login and registration forms with validation
✅ Dashboard with statistics and task sections
✅ Advanced task filtering and sorting
✅ Create/Edit task forms with validation
✅ Task detail view with full information
✅ Profile page with edit functionality
✅ Skeleton loaders for loading states
✅ Empty states for better UX
✅ Fully responsive design
✅ Modern SaaS aesthetic
✅ Smooth animations and transitions
✅ Type-safe with TypeScript
✅ No API integration (UI only)
✅ No auth logic (navigation only)

## 🎨 Design Principles

1. **Clarity**: Clear visual hierarchy and readable typography
2. **Consistency**: Uniform spacing, colors, and components
3. **Feedback**: Loading states, hover effects, and transitions
4. **Accessibility**: Semantic HTML, keyboard navigation, focus states
5. **Performance**: Optimized renders, code splitting, lazy loading
6. **Responsive**: Mobile-first with desktop enhancements

## 🔒 Notes

- **No Backend Integration**: This is a UI-only implementation
- **No Authentication**: Login/register just navigate to dashboard
- **Mock Data**: All data stored in Redux state (memory)
- **No API Calls**: RTK Query uses fakeBaseQuery
- **Production-Ready UI**: Interview and demo ready

## 📄 License

This project is for demonstration purposes.
