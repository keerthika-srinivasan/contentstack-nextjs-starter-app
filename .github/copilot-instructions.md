# GitHub Copilot Instructions - Code Review & Architecture Guidelines

## Project Overview
**Project**: Contentstack + Next.js Headless CMS Starter App
**Stack**: React 18, Next.js 14.2, Contentstack SDK, TypeScript
**Architecture**: 3-Layer Headless CMS (Presentation → API → Services → Repository)

---

## 1. ARCHITECTURAL PRINCIPLES

### Three-Layer Architecture (REQUIRED)

```
PRESENTATION LAYER (pages/)
    ↓ (HTTP/API calls)
API LAYER (pages/api/)
    ↓ (service imports)
SERVICE LAYER (lib/services/)
    ↓ (repository imports)
REPOSITORY LAYER (lib/repositories/)
    ↓ (SDK calls)
CONTENTSTACK CMS
```

### Layer Responsibilities

**Presentation Layer** (`pages/`)
- UI rendering only
- Call API endpoints for data
- Handle loading/error states
- Subscribe to live preview changes
- NO direct SDK calls
- NO business logic

**API Layer** (`pages/api/`)
- HTTP request/response handling
- Centralized error handling
- Input validation
- Response formatting
- Call service layer functions
- NO SDK calls directly

**Service Layer** (`lib/services/`)
- Business logic
- Data transformation
- Validation
- Multiple functions per domain
- Call repository layer
- NO HTTP handling
- NO SDK calls directly

**Repository Layer** (`lib/repositories/`)
- Contentstack SDK calls only
- Query building
- RTE to HTML conversion
- Live preview tag insertion
- Error logging
- NO business logic
- NO HTTP handling

### Forbidden Patterns ❌
- Direct SDK imports in pages
- SDK calls in components
- HTTP calls in services
- Business logic in API routes
- Data transformation in repository
- Circular dependencies

---

## 2. CODE REVIEW CHECKLIST FOR ARCHITECTS

### Architectural Alignment
- [ ] Code follows 3-layer architecture
- [ ] All SDK calls in repository layer only
- [ ] All HTTP endpoints in API layer
- [ ] Pages contain UI logic only
- [ ] No cross-layer violations

### Design & Scalability
- [ ] Single responsibility per function
- [ ] Reusable components/functions
- [ ] No code duplication
- [ ] No N+1 query problems
- [ ] Pagination for large datasets

### System Integration
- [ ] Consistent API design
- [ ] Clear data flow
- [ ] External service integration proper
- [ ] Error handling implemented
- [ ] Reference resolution correct

### Code Quality
- [ ] Descriptive names (no `data`, `temp`, etc.)
- [ ] Functions do one thing
- [ ] Complexity manageable
- [ ] Constants extracted
- [ ] No commented-out code

### Error Handling & Security
- [ ] All errors caught and handled
- [ ] User-friendly error messages
- [ ] No SQL injection
- [ ] No XSS vulnerabilities
- [ ] Auth checks in place

### Testing
- [ ] 70%+ coverage for critical paths
- [ ] Unit tests for services
- [ ] Integration tests for APIs
- [ ] Edge cases covered

### Documentation
- [ ] README updated for new features
- [ ] Complex logic documented
- [ ] API endpoints documented
- [ ] Breaking changes noted

---

## 3. FILE STRUCTURE (ENFORCED)

```
lib/
├── repositories/
│   ├── contentRepository.ts (SDK integration)
│   └── [domain]Repository.ts (other domains)
├── services/
│   ├── pageService.ts (page logic)
│   ├── blogService.ts (blog logic)
│   └── [domain]Service.ts (other domains)
└── utils/
    ├── validators.ts
    ├── transforms.ts
    └── errorHandler.ts

pages/
├── api/
│   ├── pages/
│   │   └── index.ts (GET /api/pages?url=... or ?all=true)
│   ├── blog/
│   │   └── index.ts (GET /api/blog?url=...)
│   └── [domain]/
│       └── index.ts
├── [page].tsx (dynamic pages)
├── blog/
│   └── [post].tsx (blog posts)
└── index.tsx (home)

components/
├── render-components.tsx
├── layout.tsx
├── header.tsx
├── footer.tsx
└── [Feature]/
    ├── [FeatureName].tsx
    └── [FeatureName].module.scss
```

---

## 4. NAMING CONVENTIONS

### Services
```typescript
// ✅ Good
pageService.getPageByUrl()
blogService.getBlogPostByUrl()
blogService.getAllBlogPosts()

// ❌ Bad
pageService.getPage()
blogService.get()
pageService.fetchPageData()
```

### Repositories
```typescript
// ✅ Good
contentRepository.fetchEntries()
contentRepository.fetchEntryByUrl()

// ❌ Bad
contentRepository.get()
contentRepository.query()
contentRepository.fetchData()
```

### API Routes
```typescript
// ✅ Good: pages/api/pages/index.ts - GET /api/pages?url=...
// ✅ Good: pages/api/blog/index.ts - GET /api/blog?url=...

// ❌ Bad: pages/api/getPage.ts
// ❌ Bad: pages/api/page.ts
```

### Components
```typescript
// ✅ Good
<RenderComponents />
<HeroBanner />
<BlogSection />

// ❌ Bad
<Section />
<Component />
<Page />
```

---

## 5. CODE PATTERNS

### Service Function Pattern
```typescript
// ✅ Good
export const getPageByUrl = async (url: string): Promise<Page> => {
  try {
    if (!url) throw new Error("URL is required");

    const page = await fetchEntryByUrl({
      contentTypeUid: "page",
      url,
      referenceFieldPath: [...],
      jsonRtePath: [...]
    });

    return page;
  } catch (error) {
    console.error("[PageService] Error:", error);
    throw error;
  }
};
```

### API Route Pattern
```typescript
// ✅ Good
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const url = req.query.url as string;
    if (!url) {
      return res.status(400).json({ error: "URL required" });
    }

    const data = await getPageByUrl(url);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("[API] Error:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error"
    });
  }
}
```

### Page Component Pattern
```typescript
// ✅ Good
export default function Page(props: Props) {
  const [data, setData] = useState(props.initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchData() {
    try {
      setLoading(true);
      const response = await fetch(`/api/pages?url=${url}`);
      const result = await response.json();

      if (!result.success) throw new Error(result.error);
      setData(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    onEntryChange(() => fetchData());
  }, []);

  return (
    <>
      {error && <ErrorBoundary message={error} />}
      {loading && <Skeleton />}
      {data && <RenderComponents {...data} />}
    </>
  );
}

export async function getServerSideProps({params}: any) {
  try {
    const data = await getPageByUrl(...);
    return { props: { initialData: data }, revalidate: 60 };
  } catch (error) {
    return { notFound: true };
  }
}
```

---

## 6. CRITICAL VALIDATION RULES

### When reviewing/writing code:

#### ❌ ALWAYS FLAG these patterns:

1. **Direct SDK imports in pages**
   ```typescript
   // ❌ WRONG
   import Stack from '../contentstack-sdk';
   pages/[page].tsx imports Stack directly
   ```

2. **HTTP calls in services**
   ```typescript
   // ❌ WRONG
   services/pageService.ts uses fetch()
   ```

3. **SDK calls in API routes**
   ```typescript
   // ❌ WRONG
   pages/api/pages/index.ts imports from contentstack SDK
   ```

4. **Business logic in components**
   ```typescript
   // ❌ WRONG
   Complex data transformation in useEffect()
   ```

5. **No error handling**
   ```typescript
   // ❌ WRONG
   const data = await fetchData();
   setData(data);  // No try/catch
   ```

6. **Hardcoded values**
   ```typescript
   // ❌ WRONG
   url: "https://api.contentstack.io" (should be env var)
   ```

---

## 7. RESPONSE FORMATS

### API Response Format (REQUIRED)
```typescript
// Success
{
  "success": true,
  "data": {...},
  "status": 200
}

// Error
{
  "success": false,
  "error": "Human-readable error message",
  "status": 400
}
```

### HTTP Status Codes
- `200` - Success
- `400` - Bad request (missing params)
- `404` - Not found
- `405` - Method not allowed
- `500` - Server error

---

## 8. PERFORMANCE REQUIREMENTS

- [ ] No N+1 queries
- [ ] References included in single query
- [ ] RTE conversion done once (in repository)
- [ ] Live preview tags added once (in repository)
- [ ] ISR (Incremental Static Regeneration): 60 second revalidate
- [ ] Bundle size: no unnecessary dependencies

---

## 9. TYPE SAFETY

### Always specify types:
```typescript
// ✅ Good
export const getPageByUrl = async (url: string): Promise<Page> => {
  // ...
};

// ❌ Bad
export const getPageByUrl = async (url) => {
  // ...
};
```

### Use interfaces for responses:
```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  status: number;
}
```

---

## 10. TESTING REQUIREMENTS

### Service Layer Tests
```typescript
// Test each service function independently
- getPageByUrl() → returns Page or throws
- getAllPages() → returns Page[]
- getPageByUrl("invalid") → throws with message
```

### API Route Tests
```typescript
// Test error handling and responses
- GET /api/pages?url=... → 200 with data
- GET /api/pages (no url) → 400 with error
- POST /api/pages → 405 Method not allowed
```

### Component Tests
```typescript
// Test UI rendering and data flow
- Component renders with initial data
- API call triggered on live preview change
- Loading state shown during fetch
- Error state shown on failure
```

---

## 11. QUICK REVIEW PRIORITIES

### 🔴 CRITICAL (Block PR)
- Architectural layer violations
- Security vulnerabilities (XSS, injection)
- Missing error handling
- SDK calls outside repository
- HTTP calls outside API

### 🟠 HIGH (Request changes)
- Code organization issues
- Incomplete error handling
- Performance concerns
- Missing tests for critical code
- Type safety issues

### 🟡 MEDIUM (Nice to have)
- Documentation gaps
- Code optimization
- Test coverage improvements
- Naming improvements

### 🟢 LOW (Optional)
- Style preferences
- Code formatting (use linter)
- Minor refactoring

---

## 12. USEFUL PROMPTS FOR COPILOT

Use these prompts when working with Copilot:

```
// Create a new service function
// Generate the getPageByUrl service function following 3-layer architecture

// Create an API route
// Generate the pages/api/pages/index.ts endpoint with error handling

// Review code
// Review this code for architecture violations and suggest fixes

// Add tests
// Add unit tests for pageService.getPageByUrl

// Create types
// Generate TypeScript interfaces for Page and BlogPost from Contentstack schema

// Optimize
// Optimize this service function - remove N+1 queries and add error handling
```

---

## 13. COMMON MISTAKES & FIXES

### Mistake 1: Direct SDK in Pages
```typescript
// ❌ Wrong
// pages/[page].tsx
import Stack from '../contentstack-sdk';
const page = await Stack.ContentType('page').Query().find();

// ✅ Fix
// pages/[page].tsx
import { getPageByUrl } from '../lib/services/pageService';
const page = await getPageByUrl(params.page);
```

### Mistake 2: Fetch in Service
```typescript
// ❌ Wrong
// lib/services/pageService.ts
const response = await fetch('/api/pages');

// ✅ Fix
// lib/repositories/contentRepository.ts
const page = await fetchEntryByUrl({...});
```

### Mistake 3: No Error Handling
```typescript
// ❌ Wrong
const data = await getPageByUrl(url);
setData(data);

// ✅ Fix
try {
  const data = await getPageByUrl(url);
  setData(data);
} catch (error) {
  setError(error.message);
}
```

### Mistake 4: Hardcoded Values
```typescript
// ❌ Wrong
const config = {
  apiHost: "https://api.contentstack.io",
  apiKey: "xyz123"
};

// ✅ Fix
const config = {
  apiHost: process.env.CONTENTSTACK_API_HOST,
  apiKey: process.env.CONTENTSTACK_API_KEY
};
```

---

## 14. DOCUMENTATION REQUIREMENTS

Every new service or API route must include:

```typescript
/**
 * Service/API DESCRIPTION
 *
 * @param {string} url - The page URL
 * @returns {Promise<Page>} Page object with resolved references
 * @throws {Error} If page not found or validation fails
 *
 * @example
 * const page = await getPageByUrl('/about');
 */
```

---

## 15. DEPENDENCIES & IMPORTS

### Allowed Imports by Layer

**Pages** can import:
- ✅ Components
- ✅ Services (in getServerSideProps)
- ✅ Types
- ❌ SDK
- ❌ Repositories

**API Routes** can import:
- ✅ Services
- ✅ Types
- ❌ SDK
- ❌ Pages

**Services** can import:
- ✅ Repositories
- ✅ Types
- ✅ Utils
- ❌ SDK directly (only via repository)
- ❌ HTTP (fetch)

**Repository** can import:
- ✅ SDK
- ✅ Types
- ✅ Utils
- ❌ Services
- ❌ HTTP (unless for SDK data)

---

## 16. CONFIGURATION MANAGEMENT

All configuration via environment variables:
```
CONTENTSTACK_API_KEY
CONTENTSTACK_DELIVERY_TOKEN
CONTENTSTACK_ENVIRONMENT
CONTENTSTACK_REGION
CONTENTSTACK_PREVIEW_TOKEN
CONTENTSTACK_API_HOST
CONTENTSTACK_LIVE_PREVIEW
CONTENTSTACK_LIVE_EDIT_TAGS
```

Never hardcode these values in code.

---

## 17. WHEN IN DOUBT

1. **Ask yourself**: "What layer should this code live in?"
2. **Check the diagram**: Follow the 3-layer architecture
3. **Review patterns**: Look at existing code
4. **Read documentation**: Check code-review-guidelines.md
5. **Consult guidelines**: This file has answers

---

## FILES TO REFERENCE

- `migration-guide.md` - Step-by-step migration
- `layered-architecture-plan.md` - Architecture diagrams
- `code-review-guidelines.md` - Detailed review checklist

---

Generated for architectural consistency and code review standards.
