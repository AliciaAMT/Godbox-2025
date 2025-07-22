# Admin Dashboard Documentation

## Overview

The Admin Dashboard provides a complete GUI for managing website content without requiring any coding knowledge. This system allows you to create dynamic collections, posts, and categories that automatically update the website.

## Table of Contents

1. [Collections Management](#collections-management)
2. [Posts Management](#posts-management)
3. [Categories System](#categories-system)
4. [Sequence Numbers (seqNo)](#sequence-numbers-seqno)
5. [Privacy Settings](#privacy-settings)
6. [Dynamic Content Examples](#dynamic-content-examples)
7. [Best Practices](#best-practices)

## Collections Management

### Creating a Collection

1. **Navigate to Admin Dashboard** → **Collections**
2. **Click the "+" button** to add a new collection
3. **Enter Collection Name** (e.g., "Meditation for Christians")
4. **Set Privacy Level**:
   - `public`: Visible to all users
   - `private`: Only visible to admins
   - `anonymous`: Visible but doesn't show author info

### Collection Structure

Each collection follows this structure:
- **seqNo = 1**: Cover/Overview post (appears on collection page)
- **seqNo = 2, 3, 4...**: Individual content posts (listed in table of contents)

## Posts Management

### Creating Posts

1. **Navigate to Admin Dashboard** → **Posts** → **Add Post**
2. **Fill in all required fields**:
   - **Title**: Post title
   - **Description**: Brief summary (auto-generated if left blank)
   - **Category**: Select one or more categories
   - **Privacy**: public/private/anonymous
   - **Series/Collection**: Select which collection this post belongs to
   - **Sequence Number**: Determines order and role in collection

### Post Fields Explained

| Field | Description | Required |
|-------|-------------|----------|
| **Title** | Post title displayed on website | Yes |
| **Description** | Brief summary (auto-generated from content if blank) | No |
| **Image URL** | Featured image for the post | No |
| **Preview** | Rich text preview content | Yes |
| **Content** | Main post content (rich text) | Yes |
| **Category** | One or more categories for filtering | Yes |
| **Keywords** | SEO keywords and slugs | No |
| **Privacy** | Who can see this post | Yes |
| **Series** | Which collection this belongs to | No |
| **Sequence Number** | Order and role in collection | Yes |

## Categories System

### How Categories Work

Categories determine where posts appear on the website:

- **`general`**: Appears on Growth Blog page
- **`inspirations`**: Appears on Growth Blog page
- **`meditations`**: Appears on Growth Blog page
- **`meditation for christians`**: Appears on Breath Meditation page
- **Custom categories**: Can be used for future pages

### Category Filtering Examples

```typescript
// Growth Blog filters for:
const allowedCategories = ['general', 'inspirations', 'meditations'];

// Breath Meditation filters for:
const meditationCategories = ['meditation for christians'];
```

## Sequence Numbers (seqNo)

### Understanding seqNo

The sequence number determines both the order and role of posts within a collection:

| seqNo | Role | Description |
|-------|------|-------------|
| **0** | Collection Overview | Description and table of contents |
| **1** | Cover Post | Featured content shown on collection page |
| **2+** | Content Posts | Individual posts listed in table of contents |

### Example Collection Structure

```
Collection: "Meditation for Christians"
├── seqNo: 0 (Overview)
├── seqNo: 1 (Cover Post - "Introduction to Christian Meditation")
├── seqNo: 2 (Content Post - "Breathing Techniques")
├── seqNo: 3 (Content Post - "Prayer and Meditation")
└── seqNo: 4 (Content Post - "Daily Practice Guide")
```

## Privacy Settings

### Privacy Levels

| Level | Description | Use Case |
|-------|-------------|----------|
| **public** | Visible to all users | Published content |
| **private** | Only visible to admins | Drafts, internal content |
| **anonymous** | Visible but no author info | Guest posts, anonymous content |

## Dynamic Content Examples

### Example 1: Creating a "Bible Study" Collection

1. **Create Collection**:
   - Name: "Bible Study Series"
   - Privacy: public

2. **Create Cover Post (seqNo = 1)**:
   - Title: "Introduction to Bible Study"
   - Content: Overview of the series
   - Series: "Bible Study Series"
   - seqNo: 1

3. **Create Content Posts (seqNo = 2, 3, 4...)**:
   - Title: "Genesis Study"
   - Series: "Bible Study Series"
   - seqNo: 2

### Example 2: Creating a "Daily Devotions" Collection

1. **Create Collection**:
   - Name: "Daily Devotions"
   - Privacy: public

2. **Create Cover Post**:
   - Title: "Daily Devotional Guide"
   - Content: How to use these devotions
   - seqNo: 1

3. **Create Daily Posts**:
   - seqNo: 2 (Day 1)
   - seqNo: 3 (Day 2)
   - seqNo: 4 (Day 3)
   - etc.

## Best Practices

### Content Organization

1. **Use Descriptive Collection Names**: "Meditation for Christians" vs "Meditation"
2. **Create Meaningful Cover Posts**: Explain what the collection contains
3. **Use Consistent seqNo**: Don't skip numbers (1, 2, 3, not 1, 5, 10)
4. **Add Rich Descriptions**: Help users understand what they'll find

### SEO and Keywords

1. **Use Relevant Keywords**: Add keywords for search functionality
2. **Create Descriptive Titles**: Clear, engaging titles
3. **Add Alt Text**: Describe images for accessibility

### Content Management

1. **Preview Before Publishing**: Use the preview feature
2. **Test Navigation**: Click through your collection to ensure it works
3. **Update Regularly**: Keep content fresh and relevant

## Technical Details

### How It Works

1. **Menu Generation**: Collections automatically appear in the side menu
2. **Dynamic Routing**: `/view-collection/{seriesId}` shows collection pages
3. **Content Filtering**: Categories determine where posts appear
4. **Rich Text Support**: Froala editor provides full formatting options

### Database Structure

```typescript
// Series/Collection
interface Serie {
  id?: string;
  serieName: string;
  privacy: string;
}

// Posts
interface Post {
  id?: string;
  title: string;
  description: string;
  imageUrl: string;
  preview: string;
  category: string;
  content: string;
  keywords: string;
  author: string;
  date: string;
  likes: string;
  views: string;
  privacy: string;
  series: string;  // References serieName
  seqNo: number;   // Order and role
}
```

## Troubleshooting

### Common Issues

1. **Posts Not Appearing**: Check privacy settings and categories
2. **Collection Not Showing**: Ensure privacy is set to "public"
3. **Wrong Order**: Verify seqNo values are correct
4. **Missing Images**: Check image URL is valid and accessible

### Debug Steps

1. **Check Console Logs**: Browser console shows data flow
2. **Verify Database**: Ensure posts exist in Firestore
3. **Test Navigation**: Click through menu items
4. **Check Categories**: Verify posts have correct categories

## Future Development

### Adding New Pages

To add new pages that display filtered content:

1. **Create the page component**
2. **Add category filtering logic**
3. **Update routing**
4. **Add menu link**

Example:
```typescript
// Filter posts by category
this.dataService.getPublicPosts().subscribe(res => {
  this.posts = res.filter(post => {
    const allowedCategories = ['your-category'];
    return post.category && allowedCategories.includes(post.category);
  });
});
```

### Extending the System

The system is designed to be extensible:
- **New Categories**: Add to filtering logic
- **New Collection Types**: Create specialized collection pages
- **Custom Fields**: Extend the Post interface
- **Advanced Filtering**: Add more complex query logic

---

**Note**: This system allows non-technical users to create and manage website content entirely through the GUI, with no coding required for most use cases. 
