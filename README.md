# Godbox

A modern, feature-rich web application built with Ionic and Angular for content management and spiritual resources.

## 🚀 Technology Stack

### Core Framework
- **Node.js**: 18.x or higher
- **Angular**: 20.0.0
- **Ionic**: 8.0.0
- **TypeScript**: 5.8.0

### Backend & Services
- **Firebase**: 10.7.0
- **Angular Fire**: 18.0.0
- **Firestore**: Real-time database
- **Firebase Auth**: User authentication

### UI & Components
- **Ionic Angular**: 8.0.0
- **Ionicons**: 7.0.0
- **Capacitor**: 7.4.2 (for mobile deployment)

### Additional Libraries
- **RxJS**: 7.8.0
- **HebCal**: 3.50.4 (Hebrew calendar integration)
- **Quill**: 1.3.7 (Rich text editor)
- **ngx-image-cropper**: 6.2.2
- **ng-lazyload-image**: 9.1.3

## 📋 Prerequisites

Before running this project, ensure you have:

- **Node.js**: 18.x or higher
- **npm**: 9.x or higher
- **Ionic CLI**: Latest version
- **Firebase CLI**: For deployment (optional)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Godbox
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Ionic CLI globally** (if not already installed)
   ```bash
   npm install -g @ionic/cli
   ```

## 🚀 Development

### Start Development Server
```bash
ionic serve
```
The application will be available at `http://localhost:8100`

### Build for Production
```bash
ionic build
```

### Run Tests
```bash
npm test
```

### Lint Code
```bash
npm run lint
```

## 📱 Features

### Core Functionality
- **Daily Readings**: Automated daily scripture readings
- **Sabbath Readings**: Weekly Torah and Haftarah portions
- **Content Management**: Admin dashboard for managing posts and content
- **User Authentication**: Secure login and registration system
- **Responsive Design**: Works on desktop, tablet, and mobile

### Admin Dashboard
- **User Management**: Manage user roles and permissions
- **Content Management**: Create and manage posts, categories, and collections
- **Notes System**: Admin notes and to-do lists
- **Collection Management**: Organize content into themed collections

### Technical Features
- **Real-time Updates**: Live data synchronization with Firestore
- **Offline Support**: Progressive Web App capabilities
- **Image Optimization**: Lazy loading and cropping
- **Rich Text Editing**: Advanced content creation tools

## 🏗️ Project Structure

```
src/
├── app/
│   ├── components/          # Reusable UI components
│   ├── services/           # Business logic and API calls
│   ├── guards/             # Route guards
│   ├── auth/               # Authentication pages
│   ├── daily-readings/     # Daily readings feature
│   ├── home/               # Home page
│   ├── landing/            # Landing page
│   └── view-collection/    # Collection viewing
├── assets/                 # Static assets
├── environments/           # Environment configuration
└── theme/                 # Global styles
```

## 🔧 Configuration

### Environment Setup
1. Create a Firebase project
2. Enable Firestore and Authentication
3. Copy Firebase configuration to `src/environments/environment.ts`
4. Set up Firestore security rules

### Firebase Configuration
```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  firebase: {
    // Your Firebase config here
  }
};
```

## 📚 Documentation

### Core Documentation
- **Admin Dashboard**: See `docs/ADMIN_DASHBOARD_DOCUMENTATION.md`
- **API Documentation**: See `docs/API_DOCUMENTATION.md`
- **Developer Notes**: See `docs/DEVNOTES.md`

### Feature Documentation
- **Sabbath Readings**: See `docs/SABBATH_READINGS_DOCUMENTATION.md`
- **Automated Readings**: See `docs/AUTOMATED_READINGS_README.md`
- **Database Updates**: See `docs/DATABASE_UPDATE_GUIDE.md`

### Additional Resources
- **License**: See `docs/LICENSE.md`
- **Old README**: See `docs/oldREADME.md` (for reference)

## 🚀 Deployment

### Web Deployment
```bash
ionic build
# Deploy the www folder to your hosting service
```

### Mobile Deployment
```bash
ionic capacitor add android
ionic capacitor add ios
ionic capacitor build android
ionic capacitor build ios
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the documentation files
- Review the admin dashboard documentation
- Open an issue for bugs or feature requests

---

**Built with ❤️ using Ionic and Angular** 
