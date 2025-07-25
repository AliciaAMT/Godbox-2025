# Deployment Guide for The Way - Godbox PWA

## Prerequisites

1. Install Firebase CLI globally:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize Firebase project (if not already done):
   ```bash
   firebase init hosting
   ```

## Building and Deploying

### Development Build
```bash
npm run build
```

### Production PWA Build
```bash
npm run build:pwa
```

### Deploy to Firebase
```bash
npm run deploy
```

Or manually:
```bash
npm run build:pwa
firebase deploy
```

## PWA Features

The application is now configured as a Progressive Web App (PWA) with the following features:

- **Service Worker**: Caches assets and provides offline functionality
- **Web App Manifest**: Enables installation on mobile devices
- **Responsive Design**: Works on all screen sizes
- **Offline Support**: Core functionality works without internet
- **App-like Experience**: Full-screen mode and native app feel

## Firebase Configuration

The `firebase.json` file is configured to:
- Serve the app from the `www` directory
- Handle client-side routing with SPA fallback
- Set proper headers for PWA files
- Cache service worker files appropriately

## Testing PWA Features

1. **Installation**: Users can install the app on their home screen
2. **Offline Mode**: Test by disabling network and refreshing
3. **Performance**: Use Lighthouse to audit PWA score
4. **Service Worker**: Check browser dev tools for SW registration

## Troubleshooting

- If service worker doesn't register, check browser console
- Ensure HTTPS is enabled for production (Firebase provides this)
- Clear browser cache if testing updates
- Check Firebase hosting logs for deployment issues 
