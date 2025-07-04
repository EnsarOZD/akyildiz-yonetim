# Akyıldız Yönetim

Akyıldız Yönetim is a modern tenant and expense tracking system developed with **Vue.js** and **Backend API**. This web-based application helps building managers track tenants, payments, expenses, and financial summaries easily.

## Features

- **Tenant Management**: Add, edit, and manage tenant information
- **Payment Tracking**: Record and track tenant payments
- **Expense Management**: Manage building expenses and utilities
- **Financial Reports**: Generate detailed financial reports
- **User Authentication**: Secure login system with role-based access
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: Vue.js 3 with Composition API
- **Routing**: Vue Router 4
- **State Management**: Pinia
- **Styling**: Tailwind CSS + DaisyUI
- **Backend**: REST API
- **Build Tool**: Vite

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd akyildiz-yonetim
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp env.example .env.local
```

4. Configure your environment variables in `.env.local`:
```env
VITE_API_BASE_URL=https://www.akyildizyonetim.com/api
```

5. Start the development server:
```bash
npm run dev
```

6. Open your browser and navigate to `http://localhost:3000`

## Environment Variables

Configure the following environment variables in your `.env.local` file:

```env
# Backend API Configuration
VITE_API_BASE_URL=https://api.akyildizyonetim.com
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/          # Reusable Vue components
├── features/           # Feature-based modules
│   ├── dashboard/      # Dashboard components
│   ├── tenants/        # Tenant management
│   ├── payments/       # Payment tracking
│   └── expenses/       # Expense management
├── services/           # API services
├── stores/             # Pinia stores
├── router/             # Vue Router configuration
├── utils/              # Utility functions
└── views/              # Page components
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

---

Developed with ❤️ by Ensar Özdemir
