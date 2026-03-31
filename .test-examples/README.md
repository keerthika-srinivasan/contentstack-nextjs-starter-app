# Code Review Test Files

## Overview

These test files demonstrate how the code review guidelines work in practice.

```
.test-examples/
├── good-code-example.tsx        ✅ Follows all guidelines
├── bad-code-example.tsx          ❌ Intentionally violates guidelines
├── review-validation.ts          📋 Validation checklist & results
└── README.md                      📖 This file
```

---

## 🎯 Purpose

These files help you:
1. **Understand** the 3-layer architecture
2. **Verify** the code review guidelines work
3. **Compare** good vs bad patterns
4. **Train** Copilot on your standards
5. **Reference** when writing new code

---

## 📊 Test Results Summary

### ✅ Good Example (`good-code-example.tsx`)
Status: **PASS** ✅
- Issues: 0
- Severity: LOW
- Recommendation: **APPROVE**

```
✅ 3-Layer architecture followed
✅ No SDK imports in pages
✅ All functions typed
✅ Error handling present
✅ Response format consistent
✅ Input validation implemented
✅ JSDoc documentation present
```

### ❌ Bad Example (`bad-code-example.tsx`)
Status: **FAIL** ❌
- Issues: 15+
- Severity: CRITICAL
- Recommendation: **BLOCK** (Required changes before merge)

```
❌ SDK imported directly in page
❌ SDK calls in API route
❌ HTTP calls in service
❌ No error handling
❌ Missing type annotations
❌ Hardcoded values
❌ No input validation
❌ Circular dependencies
❌ No JSDoc documentation
```

---

## 🔍 What Each File Demonstrates

### 1. Good Example (good-code-example.tsx)

**Layer 1: REPOSITORY LAYER**
```typescript
// fetchEntryByUrlExample()
// ✅ SDK calls only
// ✅ Error handling
// ✅ Type-safe response
// ✅ Clean input validation
```

**Layer 2: SERVICE LAYER**
```typescript
// getPageByUrlExample()
// ✅ Business logic
// ✅ Calls repository (not SDK)
// ✅ Comprehensive error handling
// ✅ Full type safety
```

**Layer 3: API LAYER**
```typescript
// exampleHandler()
// ✅ HTTP request handling
// ✅ Input validation
// ✅ Standard response format
// ✅ Proper status codes
```

**Layer 4: PRESENTATION LAYER**
```typescript
// GoodPageExample()
// ✅ UI rendering only
// ✅ Calls API (not service/repository)
// ✅ Loading/error states
// ✅ Type-safe
```

### 2. Bad Example (bad-code-example.tsx)

**Problems Demonstrated:**

```typescript
// ❌ SDK imported in page
import Stack from '../contentstack-sdk';

// ❌ Direct SDK calls in component
const Stack = initializeContentStackSdk();
const result = await query.find();

// ❌ HTTP calls in service
export const badGetPageByUrl = async (url) => {
  const response = await fetch(`/api/pages?url=${url}`);
};

// ❌ No error handling
const data = await fetchData();
setData(data);

// ❌ No type safety
const getData = async (x) => {};

// ❌ Hardcoded values
CONTENTSTACK_API_HOST: 'https://api.contentstack.io'

// ❌ Circular imports risk
// Service imports repository, repository imports service

// ❌ Commented-out code
// const oldMethodName = async () => { ... };

// ❌ Magic strings and numbers
const timeout = 5000;
```

### 3. Validation Checklist (review-validation.ts)

Provides:
- Architecture alignment checks
- Code quality metrics
- Error handling validation
- Type safety verification
- Response format validation
- Security checks
- Review report generator

---

## 🧪 How to Test

### Option 1: TypeScript Compiler
```bash
npx tsc --noEmit .test-examples/good-code-example.tsx
# Should pass ✅

npx tsc --noEmit .test-examples/bad-code-example.tsx
# Should fail ❌ (missing types, SDK imports, etc.)
```

### Option 2: ESLint
```bash
npx eslint .test-examples/
# good-code-example.tsx: ✅ No issues
# bad-code-example.tsx: ❌ Multiple issues
```

### Option 3: Ask Copilot
```
@copilot Review this code against our code-review guidelines
// Paste good-code-example.tsx
// Result: ✅ PASS

@copilot Review this code against our code-review guidelines
// Paste bad-code-example.tsx
// Result: ❌ FAIL - Lists all violations
```

### Option 4: Manual Review
Use the checklist in `review-validation.ts`:
```typescript
const report = generateCodeReviewReport(
  'bad-code-example.tsx',
  violations
);
console.log(report);
// {
//   fileName: 'bad-code-example.tsx',
//   totalIssues: 15,
//   criticalIssues: 9,
//   severity: 'CRITICAL',
//   recommendation: 'BLOCK - Required changes before merge'
// }
```

---

## 📋 Comparison Table

| Aspect | Good Example | Bad Example |
|--------|--------------|------------|
| **Architecture** | ✅ 3-Layer | ❌ Mixed |
| **SDK Usage** | ✅ Repository only | ❌ Everywhere |
| **HTTP Calls** | ✅ API layer | ❌ In service |
| **Type Safety** | ✅ Full | ❌ None |
| **Error Handling** | ✅ Comprehensive | ❌ Missing |
| **Input Validation** | ✅ Present | ❌ Missing |
| **Response Format** | ✅ Standardized | ❌ Inconsistent |
| **Documentation** | ✅ JSDoc present | ❌ No docs |
| **Code Clarity** | ✅ Clear | ❌ Ambiguous |
| **Reusability** | ✅ High | ❌ Low |

---

## 🚀 How Your Code Review Works

### When you push code:

1. **Copilot sees** the `.github/copilot-instructions.md`
2. **Copilot knows** the 3-layer architecture rules
3. **Copilot checks** against patterns like `good-code-example.tsx`
4. **Copilot flags** violations like in `bad-code-example.tsx`
5. **PR gets reviewed** with consistent standards

### Code flows through:

```
Developer Code
    ↓
Copilot Review (using these guidelines)
    ↓
GitHub Actions (runs checks)
    ↓
Architecture Validation (against bad-code patterns)
    ↓
PASS ✅ or FAIL ❌
```

---

## 📚 Learn from Examples

### Pattern 1: Correct Service Function
```typescript
// FROM: good-code-example.tsx (COPY THIS)
export const getPageByUrlExample = async (url: string): Promise<Page> => {
  try {
    if (!url) throw new Error('Page URL is required');
    const result = await fetchEntryByUrlExample<Page>({
      contentTypeUid: 'page',
      url: normalizedUrl,
      referenceFieldPath: ['page_components'],
      jsonRtePath: ['page_components.description'],
    });
    if (!result.success || !result.data) {
      throw result.error || new Error('Failed to fetch page');
    }
    return validatedPage;
  } catch (error) {
    console.error('[PageService] Error:', error);
    throw error;
  }
};
```

### Pattern 2: Correct API Route
```typescript
// FROM: good-code-example.tsx (COPY THIS)
export default async function exampleHandler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Page>>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
      status: 405,
    });
  }

  try {
    const url = req.query.url as string;
    if (!url) {
      return res.status(400).json({
        success: false,
        error: 'URL parameter is required',
        status: 400,
      });
    }
    const page = await getPageByUrlExample(url);
    return res.status(200).json({
      success: true,
      data: page,
      status: 200,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      status: 500,
    });
  }
}
```

### Pattern 3: Correct Page Component
```typescript
// FROM: good-code-example.tsx (COPY THIS)
export default function GoodPageExample() {
  const [page, setPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchPageData(url: string) {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/example?url=${encodeURIComponent(url)}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const result: ApiResponse<Page> = await response.json();
      if (!result.success) throw new Error(result.error);
      setPage(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPageData('/example-page');
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  return <article>{page && <h1>{page.title}</h1>}</article>;
}
```

---

## ✅ Checklist: Are Your Reviews Working?

Use this checklist after implementing code reviews:

- [ ] Copilot suggests 3-layer pattern approaches
- [ ] TypeScript errors caught for missing types
- [ ] SDK imports in wrong places flagged
- [ ] HTTP calls in services flagged
- [ ] Missing error handling flagged
- [ ] Review comments reference these test files
- [ ] Good patterns copied from `good-code-example.tsx`
- [ ] Bad code looks like `bad-code-example.tsx` issues
- [ ] Team uses patterns consistently

---

## 🎓 Training Team Members

### Share These Files

1. **For architects**: Show `layered-architecture-plan.md`
2. **For developers**: Show this `README.md`
3. **For code review**: Use `good-code-example.tsx` as reference
4. **For Copilot**: It reads `.github/copilot-instructions.md`

### Discussion Points

1. "Why do we separate layers?" → See good-code-example.tsx layers
2. "Where should this code go?" → Check bad-code-example.tsx violations
3. "What's the correct pattern?" → Copy from good-code-example.tsx

---

## 🔗 Related Files

- `.github/copilot-instructions.md` - Copilot guidelines
- `migration-guide.md` - Implementation steps
- `layered-architecture-plan.md` - Architecture diagrams
- `code-review-guidelines.md` - Detailed checklist

---

## 📝 Notes

- These are **example files** - don't commit them to production
- They're in `.test-examples/` directory
- Reference them during code reviews
- Update examples as your standards evolve
- Keep them in sync with actual code patterns

---

Generated for architectural consistency and code review training.
