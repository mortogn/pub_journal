# Role-Based Field Filtering Utility

A simple, minimal solution for filtering object fields based on user roles in your multi-role application.

## The Problem

In a multi-role system (ADMIN, AUTHOR, EDITOR, REVIEWER), different users should see different fields:

- **AUTHORS** should only see `commentsToAuthor` in reviews
- **EDITORS/ADMINS** should see all review fields including `commentsToEditor`, `recommendation`, `score`
- **REVIEWERS** might have different visibility rules

## The Solution

Use the `filterByRole` and `filterArrayByRole` utility functions.

## Installation

The utilities are already created in:

- `src/common/utils/role-filter.util.ts`

## Usage

### Basic Example

```typescript
import { filterArrayByRole } from 'src/common/utils/role-filter.util';

async getSubmissionById(user: AuthTokenPayload, id: string) {
  const submission = await this.prisma.submission.findFirst({
    where: { id },
    include: { reviews: true },
  });

  // Filter reviews based on user role
  if (submission.reviews && submission.reviews.length > 0) {
    submission.reviews = filterArrayByRole(submission.reviews, user.role, {
      commentsToEditor: ['EDITOR', 'ADMIN'],  // Only EDITOR and ADMIN can see this
      recommendation: ['EDITOR', 'ADMIN'],     // Only EDITOR and ADMIN can see this
      score: ['EDITOR', 'ADMIN'],              // Only EDITOR and ADMIN can see this
      // commentsToAuthor is visible to everyone (no rule = default visible)
    }) as any[];
  }

  return submission;
}
```

### What Each Role Will See

**AUTHOR viewing a review:**

```json
{
  "id": "123",
  "submissionId": "456",
  "reviewerId": "789",
  "commentsToAuthor": "Great work!",
  "createdAt": "2025-11-11T10:00:00Z",
  "updatedAt": "2025-11-11T10:00:00Z"
  // commentsToEditor, recommendation, score are filtered out
}
```

**EDITOR/ADMIN viewing the same review:**

```json
{
  "id": "123",
  "submissionId": "456",
  "reviewerId": "789",
  "commentsToAuthor": "Great work!",
  "commentsToEditor": "I have concerns about methodology",
  "recommendation": "MINOR_REVISION",
  "score": 75,
  "createdAt": "2025-11-11T10:00:00Z",
  "updatedAt": "2025-11-11T10:00:00Z"
  // All fields visible
}
```

## How It Works

1. **Define field rules** - Specify which roles can see which fields
2. **Fields without rules** are visible to everyone by default
3. **Fields with rules** are only visible to specified roles

### Field Rule Options

```typescript
{
  // Array of roles that can see this field
  fieldName: ['ADMIN', 'EDITOR'],

  // OR use a custom function for complex logic
  fieldName: (role) => role === 'ADMIN' || someComplexCondition,
}
```

## Advanced Usage

### Custom Logic

```typescript
submission.reviews = filterArrayByRole(submission.reviews, user.role, {
  // Only editors and admins
  commentsToEditor: ['EDITOR', 'ADMIN'],

  // Custom function
  recommendation: (role) => role === 'EDITOR' || role === 'ADMIN',

  // Everyone except reviewers
  score: (role) => role !== 'REVIEWER',
}) as any[];
```

### Single Object vs Array

```typescript
// For a single object
const filtered = filterByRole(review, user.role, rules);

// For an array of objects
const filtered = filterArrayByRole(reviews, user.role, rules);
```

## Benefits

✅ **Simple** - Easy to understand and use  
✅ **Minimal** - No dependencies, just pure TypeScript  
✅ **Flexible** - Supports both array-based and function-based rules  
✅ **Type-safe** - Works with TypeScript  
✅ **Reusable** - Use across different models (submissions, reviews, users, etc.)

## Important Notes

- Apply filtering **AFTER** fetching data from the database
- Fields without rules are **visible by default**
- The utility returns a new object/array, doesn't mutate the original
- Cast the result as needed for TypeScript: `as any[]` or proper type
