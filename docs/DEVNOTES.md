# Developer Notes

## 🛠️ Development Environment

### Prerequisites
- **Node.js**: 18.x or higher
- **npm**: 9.x or higher
- **Ionic CLI**: Latest version
- **Git**: For version control
- **VS Code**: Recommended IDE with Angular/Ionic extensions

### IDE Extensions (Recommended)
- **Angular Language Service**
- **Ionic Snippets**
- **TypeScript Importer**
- **ESLint**
- **Prettier**
- **Firebase Explorer**

## 🚀 Development Workflow

### Initial Setup
```bash
# Clone repository
git clone <repository-url>
cd Godbox

# Install dependencies
npm install

# Install Ionic CLI globally
npm install -g @ionic/cli

# Start development server
ionic serve
```

### Daily Development
```bash
# Start development server
ionic serve

# Run tests
npm test

# Lint code
npm run lint

# Build for production
ionic build
```

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "feat: add new feature"

# Push to remote
git push origin feature/new-feature

# Create pull request
# Merge after review
```

## 🏗️ Project Architecture

### Component Structure
- **Standalone Components**: All components use Angular 17 standalone architecture
- **Lazy Loading**: Routes are lazy-loaded for better performance
- **Service Layer**: Business logic separated into services
- **TypeScript**: Strict typing throughout the application

### Key Directories
```
src/
├── app/
│   ├── components/          # Reusable UI components
│   │   ├── admin-dash/     # Admin dashboard components
│   │   ├── date/           # Date display components
│   │   ├── dynamic-layout/ # Layout components
│   │   ├── footer-landing/ # Footer components
│   │   └── menu-header/    # Navigation components
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

### Service Architecture
- **DataService**: Firebase/Firestore operations
- **BibleApiService**: Bible API integration
- **AuthService**: User authentication
- **HaftarahService**: Haftarah readings
- **SabbathReadingsService**: Sabbath readings
- **ConfigService**: Application configuration

## 🔧 Configuration Management

### Environment Files
- **environment.ts**: Development configuration
- **environment.prod.ts**: Production configuration

### Firebase Configuration
```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  firebase: {
    projectId: 'the-way-417',
    // ... other Firebase config
  },
  apiBible: {
    apiKey: 'your-api-key'
  }
};
```

### API Keys Management
- **Development**: Use development API keys
- **Production**: Use production API keys
- **Security**: Never commit API keys to version control
- **Rotation**: Regular key updates for security

## 🐛 Debugging and Troubleshooting

### Common Issues

#### Build Errors
```bash
# Clear Angular cache
rm -rf .angular

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear browser cache
# Hard refresh in browser (Ctrl+Shift+R)
```

#### Firebase Issues
```typescript
// Test Firebase connection
this.dataService.getPosts().pipe(take(1)).subscribe({
  next: (posts) => console.log('Firebase working:', posts.length),
  error: (error) => console.error('Firebase error:', error)
});
```

#### Bible API Issues
```typescript
// Test Bible API
this.bibleApiService.testApiConnection().subscribe(
  (success) => console.log('Bible API working:', success)
);
```

#### Real-time Data Issues
- **Multiple Emissions**: Use `take(1)` or proper subscription management
- **UI Not Updating**: Force change detection with `ChangeDetectorRef`
- **Memory Leaks**: Always unsubscribe in `ngOnDestroy`

### Debug Tools

#### Console Logging
```typescript
// Add debug logging
console.log('🔍 Debug message:', data);
console.error('❌ Error:', error);
console.warn('⚠️ Warning:', warning);
```

#### Browser DevTools
- **Network Tab**: Monitor API requests
- **Console**: View logs and errors
- **Application**: Check localStorage and sessionStorage
- **Performance**: Monitor app performance

## 📱 Mobile Development

### Capacitor Setup
```bash
# Add platforms
ionic capacitor add android
ionic capacitor add ios

# Build for mobile
ionic capacitor build android
ionic capacitor build ios

# Open in native IDE
ionic capacitor open android
ionic capacitor open ios
```

### Mobile Testing
- **Android Studio**: For Android development
- **Xcode**: For iOS development (Mac only)
- **Device Testing**: Test on physical devices
- **Emulator Testing**: Use Android/iOS emulators

## 🧪 Testing

### Unit Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test -- --include="**/component.spec.ts"
```

### E2E Tests
```bash
# Install Playwright
npm install -D @playwright/test

# Run E2E tests
npx playwright test
```

### Test Structure
```typescript
// Example test file
describe('Component', () => {
  beforeEach(() => {
    // Setup
  });

  it('should work correctly', () => {
    // Test logic
  });
});
```

## 🚀 Deployment

### Web Deployment
```bash
# Build for production
ionic build

# Deploy to hosting service
# Upload www/ folder to your hosting provider
```

### Mobile Deployment
```bash
# Build for mobile
ionic capacitor build android
ionic capacitor build ios

# Submit to app stores
# Follow platform-specific guidelines
```

### Environment Setup
1. **Development**: Use development Firebase project
2. **Staging**: Use staging Firebase project
3. **Production**: Use production Firebase project

## 🔒 Security Best Practices

### Code Security
- **Input Validation**: Validate all user inputs
- **XSS Prevention**: Sanitize HTML content
- **CSRF Protection**: Use Angular's built-in protection
- **API Key Security**: Never expose keys in client-side code

### Firebase Security
- **Security Rules**: Proper Firestore security rules
- **Authentication**: Secure user authentication
- **Data Validation**: Validate data on server side
- **Access Control**: Role-based access control

### API Security
- **Rate Limiting**: Implement request throttling
- **Error Handling**: Don't expose sensitive information
- **HTTPS**: Always use secure connections
- **Key Rotation**: Regular API key updates

## 📊 Performance Optimization

### Code Optimization
- **Lazy Loading**: Load components on demand
- **Tree Shaking**: Remove unused code
- **Bundle Analysis**: Monitor bundle size
- **Caching**: Implement proper caching strategies

### Firebase Optimization
- **Indexing**: Proper Firestore indexes
- **Query Optimization**: Efficient queries
- **Pagination**: Implement pagination for large datasets
- **Offline Support**: Handle offline scenarios

### Image Optimization
- **Lazy Loading**: Load images on demand
- **Compression**: Compress images appropriately
- **Responsive Images**: Use appropriate sizes
- **CDN**: Use content delivery networks

## 🔄 Version Control

### Git Best Practices
- **Meaningful Commits**: Use conventional commit messages
- **Feature Branches**: Work on feature branches
- **Pull Requests**: Review code before merging
- **Clean History**: Maintain clean git history

### Commit Message Format
```
type(scope): description

feat(auth): add user authentication
fix(api): resolve Bible API timeout issue
docs(readme): update installation instructions
style(ui): improve button styling
refactor(services): simplify data service
test(components): add unit tests for posts
```

## 📚 Learning Resources

### Angular/Ionic
- **Angular Documentation**: https://angular.io/docs
- **Ionic Documentation**: https://ionicframework.com/docs
- **TypeScript Handbook**: https://www.typescriptlang.org/docs

### Firebase
- **Firebase Documentation**: https://firebase.google.com/docs
- **Firestore Documentation**: https://firebase.google.com/docs/firestore

### APIs
- **Bible API Documentation**: https://scripture.api.bible/docs
- **HebCal Documentation**: https://github.com/hebcal/hebcal-js

## 🤝 Contributing Guidelines

### Code Standards
- **TypeScript**: Use strict typing
- **ESLint**: Follow linting rules
- **Prettier**: Consistent code formatting
- **Comments**: Document complex logic

### Review Process
1. **Self Review**: Review your own code first
2. **Peer Review**: Get feedback from team members
3. **Testing**: Ensure all tests pass
4. **Documentation**: Update relevant documentation

### Pull Request Checklist
- [ ] Code follows project standards
- [ ] All tests pass
- [ ] Documentation updated
- [ ] No console errors
- [ ] Mobile testing completed
- [ ] Performance impact considered

---

*These notes should be updated as the project evolves and new patterns emerge.* 
