# SmartParcours - Educational AI Platform (Vue.js)

A comprehensive educational platform built with Vue.js 3 and Firebase that provides AI-powered academic guidance and student management.

## Features

### Student Features
- **Dashboard**: Academic progress overview with charts and statistics
- **Profile Management**: Personal information and academic preferences
- **Bulletin Management**: Upload and manage school reports
- **AI Recommendations**: Personalized career guidance powered by DeepSeek AI

### Admin Features
- **Dashboard**: School-wide analytics and student management
- **User Management**: Create and manage student accounts
- **Settings**: Configure school information and system parameters
- **Reports**: Academic performance analytics

## Technology Stack

- **Frontend**: Vue.js 3 (Composition API with script setup), Tailwind CSS
- **Authentication**: Firebase Auth
- **Database**: Firestore
- **Charts**: Chart.js with vue-chartjs
- **State Management**: Pinia
- **Routing**: Vue Router 4
- **AI Integration**: DeepSeek API

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Firebase project

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd smartparcours-vue
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment:
```bash
cp .env.example .env
```

4. Configure Firebase:
   - Create a Firebase project at https://console.firebase.google.com
   - Enable Authentication (Email/Password)
   - Create a Firestore database
   - Copy your Firebase config to `.env`

5. Set up environment variables in `.env`:
```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef

# AI Configuration (choose one)
VITE_DEEPSEEK_API_KEY=sk-your-deepseek-api-key
# OR
VITE_OPENROUTER_API_KEY=sk-your-openrouter-api-key
```

### Getting API Keys

**Option 1: Direct DeepSeek API**
1. Visit [DeepSeek Platform](https://platform.deepseek.com/)
2. Create an account and get your API key
3. Add it as `VITE_DEEPSEEK_API_KEY` in your `.env` file

**Option 2: OpenRouter (Recommended)**
1. Visit [OpenRouter](https://openrouter.ai/)
2. Create an account and get your API key
3. Add it as `VITE_OPENROUTER_API_KEY` in your `.env` file
4. OpenRouter provides access to DeepSeek and many other models

6. Start the development server:
```bash
npm run dev
```

### Demo Accounts

The platform includes demo accounts for testing:

**Student Account:**
- Email: eleve@test.com
- Password: password123

**Admin Account:**
- Email: direction@test.com
- Password: adminsecure

## Project Structure

```
src/
├── components/         # Reusable Vue components
│   ├── Layout/         # Navigation and layout components
│   └── UI/             # Basic UI elements (Button, Card, etc.)
├── config/             # Configuration files
│   └── firebase.js     # Firebase configuration
├── pages/              # Page components
│   ├── Auth/           # Authentication pages
│   ├── Student/        # Student-facing pages
│   └── Admin/          # Admin-facing pages
├── services/           # External service integrations
│   ├── firebaseService.js   # Firestore operations
│   └── orientationService.js # AI recommendation service
├── stores/             # Pinia state management
│   ├── auth.js         # Authentication state
│   └── app.js          # Application state
└── router/             # Vue Router configuration
```

## Firebase Setup

### Firestore Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Bulletins are accessible by the student and admins
    match /bulletins/{bulletinId} {
      allow read, write: if request.auth != null && (
        resource.data.studentId == request.auth.uid ||
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin'
      );
    }
    
    // Recommendations are accessible by the student and admins
    match /recommendations/{recommendationId} {
      allow read, write: if request.auth != null && (
        resource.data.studentId == request.auth.uid ||
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin'
      );
    }
    
    // Admins can access all data
    match /{document=**} {
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

## AI Integration

The platform integrates with DeepSeek AI for personalized educational recommendations. The AI service:

1. Analyzes student profiles and academic performance
2. Generates personalized career guidance
3. Suggests educational paths based on strengths and interests
4. Provides improvement recommendations

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Install new packages
npm install package-name
```

## Deployment

### Build for Production
```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment to any static hosting service.

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support or questions, please contact the development team or create an issue in the repository.