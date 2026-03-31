# Copilot Instructions

## Quick Start for Copilot

This project uses a **3-Layer Architecture** for clean separation of concerns.

### The 3 Layers

```
PAGES (UI) → API ROUTES (HTTP) → SERVICES (Logic) → REPOSITORY (SDK)
```

### What Each Layer Does

| Layer | Location | Does | Doesn't |
|-------|----------|------|---------|
| **Presentation** | `pages/` | Render UI, call API | Business logic, SDK calls |
| **API Routes** | `pages/api/` | Handle HTTP, call services | SDK calls, business logic |
| **Services** | `lib/services/` | Business logic, validation | HTTP, SDK calls |
| **Repository** | `lib/repositories/` | SDK calls, data parsing | Business logic, HTTP |

### Key Rules

✅ DO:
- Import services in API routes
- Import repositories in services
- Handle errors at API layer
- Type everything with TypeScript

❌ DON'T:
- Import SDK in pages
- Call SDK in API routes
- Use HTTP in services
- Leave data without types

---

## When Creating Code

### New Service Function
Ask Copilot:
```
Create a new [domain]Service.ts file with a get[Feature] function
following the 3-layer architecture pattern.
```

### New API Route
Ask Copilot:
```
Generate pages/api/[domain]/index.ts with proper error handling
and calling the service layer.
```

### Update a Page
Ask Copilot:
```
Update this page component to call the API instead of importing helpers,
including loading and error states.
```

---

## Code Review Focus

**Critical Issues** (block PR):
- SDK imports outside repository
- HTTP calls in services
- Business logic in components
- Missing error handling

**High Priority** (request changes):
- Types missing
- Inconsistent naming
- No error handling
- Test gaps

---

## File Locations

- 📋 **Guidelines**: `.github/copilot-instructions.md` (this file)
- 📚 **Migration**: `memory/migration-guide.md`
- 🏗️ **Architecture**: `memory/layered-architecture-plan.md`
- ✅ **Review checklist**: `memory/code-review-guidelines.md`

---

## Common Commands

```bash
# Check architecture violations
"Review this code for layer violations"

# Generate tests
"Generate unit tests for this service function"

# Improve code
"Optimize this API route - check for N+1 queries"

# Document
"Add JSDoc comments to all functions in this service"
```

---

See `.github/copilot-instructions.md` for detailed guidelines.
