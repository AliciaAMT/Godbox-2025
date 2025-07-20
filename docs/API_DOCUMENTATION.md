# API Documentation

## Overview

This document details all external APIs and services used in the Godbox application, including configuration, usage patterns, and troubleshooting information.

## 🔥 Firebase Services

### Firebase Configuration
- **Project ID**: `the-way-417`
- **Authentication**: Firebase Auth for user management
- **Database**: Firestore for real-time data storage
- **Storage**: Firebase Storage for file uploads

### Firebase Services Used

#### Authentication
- **Purpose**: User login, registration, and session management
- **Features**: Email/password, Google OAuth, role-based access
- **Configuration**: Automatic user role assignment

#### Firestore Database
- **Collections**:
  - `users` - User profiles and roles
  - `posts` - Blog posts and articles
  - `categories` - Content categorization
  - `collections` - Themed content groups
  - `notes` - Admin notes and to-do lists
  - `readings` - Daily and Sabbath readings

#### Security Rules
```javascript
// Example Firestore security rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Posts are publicly readable, but only admins can write
    match /posts/{postId} {
      allow read: if true;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.userRole == 'admin';
    }
  }
}
```

## 📖 Bible API (api.bible)

### Configuration
- **Base URL**: `https://api.scripture.api.bible/v1`
- **API Key**: Required for all requests
- **Primary Bible ID**: `65eec8e0b60e656b-01` (KJV)
- **Alternative Bible IDs**: Multiple fallback options

### Available Bible Translations
- **KJV**: `65eec8e0b60e656b-01`
- **ESV**: `de4e12af7f28f599-02`
- **NASB**: `9879dbb7cfe39e4d-01`
- **NKJV**: `179568874c45066f-01`

### API Endpoints

#### Get Bible Passage
```typescript
GET /bibles/{bibleId}/passages/{reference}
Headers: {
  'api-key': 'your-api-key',
  'Content-Type': 'application/json'
}
```

#### Get Single Verse
```typescript
GET /bibles/{bibleId}/verses/{reference}
Headers: {
  'api-key': 'your-api-key'
}
```

#### Search Verses
```typescript
GET /bibles/{bibleId}/search?query={searchTerm}
Headers: {
  'api-key': 'your-api-key'
}
```

#### List Available Bibles
```typescript
GET /bibles
Headers: {
  'api-key': 'your-api-key'
}
```

### Reference Formatting
The API requires specific reference formats:

#### Supported Formats
- **Single Verse**: `Gen.1.1`
- **Verse Range**: `Gen.1.1-5`
- **Chapter Range**: `1Kgs.18.46-19.21`
- **Book Names**: Abbreviated (Gen, Exo, Lev, etc.)

#### Book Name Mappings
```typescript
const bookMappings = {
  'Genesis': 'Gen',
  'Exodus': 'Exo',
  'Leviticus': 'Lev',
  'Numbers': 'Num',
  'Deuteronomy': 'Deut',
  // ... complete mapping in bible-api.service.ts
};
```

### Error Handling
- **API Key Missing**: Graceful fallback with warning
- **Invalid Reference**: Error logging and user notification
- **Bible ID Failure**: Automatic fallback to alternative translations
- **Network Errors**: Retry logic and user feedback

## 📅 Hebrew Calendar API (HebCal)

### Configuration
- **Library**: `@hebcal/core` v3.50.4
- **Purpose**: Hebrew calendar calculations and parashot
- **Features**: Date conversion, holiday detection, Torah portions

### Key Features

#### Date Conversion
```typescript
import { HebrewCalendar, Location } from '@hebcal/core';

// Convert Gregorian to Hebrew date
const hebrewDate = HebrewCalendar.greg2abs(2024, 1, 15);
const hebrewMonth = HebrewCalendar.abs2hebrew(hebrewDate);
```

#### Parashot (Torah Portions)
```typescript
import { Parashah } from '@hebcal/core';

// Get parashah for a specific date
const parashah = Parashah.getParashah(2024, 1, 15);
// Returns: { name: 'Bo', hebrew: 'בא', book: 'Exodus' }
```

#### Holiday Detection
```typescript
import { HebrewCalendar, Event } from '@hebcal/core';

// Get holidays for a date range
const events = HebrewCalendar.calendar({
  start: new Date(2024, 0, 1),
  end: new Date(2024, 11, 31),
  location: Location.lookup('Jerusalem')
});
```

### Integration with Sabbath Readings
- **Automatic Parashah Detection**: Uses HebCal to determine weekly Torah portions
- **Date Range Calculations**: Calculates reading periods for daily and Sabbath readings
- **Holiday Integration**: Incorporates Jewish holidays into reading schedules

## 🔧 Environment Configuration

### Environment Variables
```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  firebase: {
    projectId: 'your-project-id',
    appId: 'your-app-id',
    storageBucket: 'your-storage-bucket',
    locationId: 'us-central',
    apiKey: 'your-firebase-api-key',
    authDomain: 'your-auth-domain',
    messagingSenderId: 'your-sender-id',
    measurementId: 'your-measurement-id',
  },
  apiBible: {
    apiKey: 'your-bible-api-key'
  }
};
```

### Production Environment
```typescript
// src/environments/environment.prod.ts
export const environment = {
  production: true,
  firebase: {
    // Production Firebase config
  },
  apiBible: {
    // Production Bible API key
  }
};
```

## 🚀 API Usage Patterns

### Bible API Service
```typescript
// Get a passage
this.bibleApiService.getPassage('Genesis 1:1-5').subscribe({
  next: (passage) => {
    console.log('Passage:', passage);
  },
  error: (error) => {
    console.error('Error:', error);
  }
});

// Test API connection
this.bibleApiService.testApiConnection().subscribe(
  (success) => console.log('API working:', success)
);
```

### Firebase Service
```typescript
// Get posts with real-time updates
this.dataService.getPosts().subscribe({
  next: (posts) => {
    console.log('Posts updated:', posts);
  }
});

// Add new post
this.dataService.addPost(newPost).then(() => {
  console.log('Post added successfully');
});
```

## 🔍 Troubleshooting

### Common Issues

#### Bible API Issues
1. **Invalid API Key**: Check environment configuration
2. **Reference Format**: Ensure proper book name abbreviations
3. **Bible ID Failure**: Check alternative Bible IDs
4. **Rate Limiting**: Implement request throttling

#### Firebase Issues
1. **Authentication Errors**: Check Firebase project configuration
2. **Permission Denied**: Verify Firestore security rules
3. **Real-time Updates**: Check network connectivity
4. **Data Loading**: Verify collection names and document structure

#### HebCal Issues
1. **Date Conversion**: Verify input date format
2. **Parashah Detection**: Check Hebrew calendar calculations
3. **Holiday Detection**: Verify location settings

### Debug Tools

#### Bible API Testing
```typescript
// Test API configuration
this.bibleApiService.testApiConfiguration().subscribe(
  (result) => console.log('Available Bibles:', result)
);

// Test specific reference formats
this.bibleApiService.testReferenceFormats('Numbers 25:10').subscribe(
  (result) => console.log('Reference test:', result)
);
```

#### Firebase Testing
```typescript
// Test Firestore connection
this.dataService.getPosts().pipe(take(1)).subscribe({
  next: (posts) => console.log('Firestore working:', posts.length),
  error: (error) => console.error('Firestore error:', error)
});
```

## 📊 API Limits and Quotas

### Bible API
- **Rate Limits**: Varies by plan
- **Request Size**: Maximum 1000 characters per request
- **Bible Availability**: Depends on subscription level

### Firebase
- **Read Operations**: 50,000/day (free tier)
- **Write Operations**: 20,000/day (free tier)
- **Storage**: 5GB (free tier)
- **Bandwidth**: 1GB/day (free tier)

### HebCal
- **No Rate Limits**: Client-side calculations
- **Memory Usage**: Minimal for date calculations
- **Accuracy**: High precision for Hebrew calendar

## 🔐 Security Considerations

### API Key Management
- **Environment Variables**: Store keys in environment files
- **Production Security**: Use different keys for dev/prod
- **Key Rotation**: Regular key updates for security

### Data Validation
- **Input Sanitization**: Validate all user inputs
- **Reference Formatting**: Proper Bible reference validation
- **Date Validation**: Ensure valid date ranges

### Error Handling
- **Graceful Degradation**: App continues working without APIs
- **User Feedback**: Clear error messages for users
- **Logging**: Comprehensive error logging for debugging

---

*This documentation should be updated when new APIs are added or existing ones are modified.* 
