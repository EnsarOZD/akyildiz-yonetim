# 🏢 Akyıldız Yönetim

Akyıldız Yönetim is a modern tenant and expense tracking system developed with **Vue.js** and **Firebase**. This web-based application helps building managers track tenants, payments, expenses, and financial summaries easily.

## 🚀 Features

- ✅ Add, update, and delete tenants
- 💸 Record payments and track payment history
- 📄 Manage various expenses (e.g. Rent, Electricity, Water, Other)
- 📊 Calculate total debt and balance per tenant
- 🧾 View detailed tenant summary and history
- 🌙 Light/Dark theme support
- 🔐 Role-based access control (Admin, Manager, Viewer)
- 🛡️ Firebase Security Rules implementation

## 🛠 Tech Stack

- **Frontend**: Vue 3 (Composition API), TailwindCSS, DaisyUI
- **Backend**: Firebase Firestore
- **Authentication**: Firebase Auth (Google Sign-In)
- **State Management**: Pinia
- **Build Tool**: Vite
- **Routing**: Vue Router

## 📂 Project Structure

```
src/
├── components/
│   ├── common/
│   │   ├── Header.vue
│   │   └── LoadingSpinner.vue
├── features/
│   ├── dashboard/
│   ├── expenses/
│   ├── owners/
│   ├── payments/
│   └── tenants/
├── stores/
│   └── auth.js
├── utils/
│   ├── errorHandler.js
│   └── excelUtils.js
├── router/
│   └── index.js
├── App.vue
├── main.js
└── firebase.js
```

## 📸 Screenshots
![image](https://github.com/user-attachments/assets/6030ade5-2292-4e8a-a166-a684d9251589)
![image](https://github.com/user-attachments/assets/e43ccda8-0f0a-4d22-9c53-b161bf099728)

![image](https://github.com/user-attachments/assets/5bf24f78-177f-43b6-8bbe-9eec71694bed)
![image](https://github.com/user-attachments/assets/af5702a7-3adf-41e5-ad20-321772548476)
![image](https://github.com/user-attachments/assets/7718d6a2-9ac7-4b40-b513-ebeddb7e3286)


## 🔧 Setup Instructions

```bash
# Clone the repository
git clone https://github.com/your-username/akyildiz-yonetim.git
cd akyildiz-yonetim

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env file with your Firebase credentials

# Start development server
npm run dev

# Build for production
npm run build
```

> 🔐 **Important**: Configure your Firebase credentials in the `.env` file before running the application. Never commit the `.env` file to version control.

## 🔒 Security Configuration

1. **Environment Variables**: Copy `.env.example` to `.env` and add your Firebase configuration
2. **Firebase Console**: Apply API restrictions and domain restrictions to your API keys
3. **Deploy Security Rules**: Deploy the included `firestore.rules` and `storage.rules` to Firebase

For detailed security information, see [SECURITY_IMPROVEMENTS.md](./SECURITY_IMPROVEMENTS.md)

## 📋 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
VITE_FIREBASE_PROJECT_ID=your_project_id_here
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
VITE_FIREBASE_APP_ID=your_app_id_here
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id_here
```

## 📝 License

This project is licensed under the MIT License.

---

Developed with ❤️ by Ensar Özdemir
