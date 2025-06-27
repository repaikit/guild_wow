# 🏰 Guild WoW - Guild Management System

## Overview

Guild WoW is a web application for managing gaming guilds. It allows users to create, join, and manage guilds, view guild details, and interact with other guild members.

## Features

- **User Authentication**: Register, login, and guest login functionality
- **Guild Management**: Create, join, and leave guilds
- **Guild Dashboard**: View your guilds and explore other guilds
- **Guild Details**: View guild information and members
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Python (FastAPI)
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)

## Project Structure

```
├── client/                # Frontend code
│   ├── public/            # Static assets
│   └── src/
│       ├── components/    # Reusable UI components
│       ├── context/       # React context providers
│       ├── hooks/         # Custom React hooks
│       ├── pages/         # Next.js pages
│       ├── services/      # API service functions
│       ├── styles/        # Global styles
│       └── utils/         # Utility functions
└── server/                # Backend code (Python/FastAPI)
```

## Installation

### 1. Client

```bash
cd client
npm install
npm run dev
```

### 2. Server

Requirements: Python 3.10+ installed

```bash
cd server
pip install -r requirements.txt
python main.py
```

## Code Quality Improvements

The codebase has been enhanced with several quality improvements:

1. **Type Safety**: Replaced `any` types with specific interfaces and type definitions
2. **Error Handling**: Improved error handling with proper type checking
3. **Code Organization**: Created service modules to centralize API calls
4. **Reusable Components**: Developed reusable UI components for consistency
5. **Custom Hooks**: Created custom hooks for form handling, API calls, and authentication
6. **Context Providers**: Implemented context providers for global state management
7. **Utility Functions**: Added helper functions for common operations

## Best Practices

- **Component Structure**: Each component has a single responsibility
- **Error Boundaries**: Implemented error boundaries to prevent app crashes
- **Loading States**: Added loading indicators for better user experience
- **Responsive Design**: Ensured the UI works well on different screen sizes
- **Accessibility**: Included proper ARIA attributes and keyboard navigation
- **Type Safety**: Leveraged TypeScript for better code quality and developer experience


