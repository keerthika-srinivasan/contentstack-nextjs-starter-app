/**
 * CODE REVIEW TESTER: Validation Script
 *
 * This file demonstrates how to validate code against the guidelines
 * Usage: Run this comparison to see what gets flagged during review
 */

// ============================================================================
// VALIDATION CHECKLIST
// ============================================================================

export const codeReviewChecklist = {
  // ARCHITECTURAL ALIGNMENT
  architecturalAlignment: {
    '✅ GOOD': {
      patterns: [
        'Repository imports SDK',
        'Service imports Repository',
        'API route imports Service',
        'Page imports API endpoint',
        'No circular dependencies',
      ],
      files: ['good-code-example.tsx'],
      status: 'PASS',
    },
    '❌ BAD': {
      violations: [
        'Page imports SDK directly',
        'Component makes SDK calls',
        'API route calls SDK directly',
        'Service calls fetch() for HTTP',
        'Circular import detected',
      ],
      files: ['bad-code-example.tsx'],
      status: 'FAIL',
    },
  },

  // CODE QUALITY
  codeQuality: {
    '✅ GOOD': {
      checks: [
        'All functions have JSDoc',
        'All parameters typed',
        'All returns typed',
        'Type generics used appropriately',
        'Constants extracted',
        'No commented-out code',
        'Consistent naming conventions',
      ],
      status: 'PASS',
    },
    '❌ BAD': {
      violations: [
        'No JSDoc on functions',
        'Parameters without types',
        'Hardcoded values',
        'Commented-out code present',
        'Ambiguous variable names (data, temp, x)',
        'No return types specified',
      ],
      status: 'FAIL',
    },
  },

  // ERROR HANDLING
  errorHandling: {
    '✅ GOOD': {
      checks: [
        'Try-catch blocks present',
        'All async functions wrapped',
        'Error messages logged',
        'User-friendly error responses',
        'No sensitive data in error logs',
        'Error boundaries for data access',
        'Null checks before usage',
      ],
      status: 'PASS',
    },
    '❌ BAD': {
      violations: [
        'No try-catch in async functions',
        'Errors silently caught',
        'Sensitive error details exposed',
        'No validation for null/undefined',
        'Missing error boundaries',
        'Vague error messages',
      ],
      status: 'FAIL',
    },
  },

  // TYPE SAFETY
  typeSafety: {
    '✅ GOOD': {
      checks: [
        'All functions typed',
        'All parameters typed',
        'All returns typed',
        'Generic types used',
        'Interface definitions clear',
        'Type imports used',
        'No `any` types',
      ],
      status: 'PASS',
    },
    '❌ BAD': {
      violations: [
        'Parameters without types',
        'Returns without types',
        'Use of `any` type',
        'No interface definitions',
        'Implicit `any` from unclear parameters',
      ],
      status: 'FAIL',
    },
  },

  // RESPONSE FORMAT
  responseFormat: {
    '✅ GOOD': {
      structure: {
        success: 'boolean',
        data: 'T | undefined',
        error: 'string | undefined',
        status: 'number',
      },
      statusCodes: {
        200: 'Success',
        400: 'Bad Request (missing params)',
        404: 'Not Found',
        405: 'Method Not Allowed',
        500: 'Server Error',
      },
      status: 'PASS',
    },
    '❌ BAD': {
      violations: [
        'Inconsistent response format',
        'Missing status field',
        'Wrong HTTP status codes',
        'Exposing full error objects',
      ],
      status: 'FAIL',
    },
  },

  // VALIDATION & SECURITY
  security: {
    '✅ GOOD': {
      checks: [
        'Input validation present',
        'No hardcoded secrets',
        'Environment variables used',
        'No SQL injection risks',
        'No XSS vulnerabilities',
        'URL encoding for dynamic values',
        'HTTP method validation',
      ],
      status: 'PASS',
    },
    '❌ BAD': {
      violations: [
        'Hardcoded configuration values',
        'No input parameter validation',
        'Secrets in code',
        'Unencoded URL parameters',
        'Direct string concatenation in queries',
      ],
      status: 'FAIL',
    },
  },
};

// ============================================================================
// REVIEW REPORT GENERATION
// ============================================================================

/**
 * Generate a code review report
 * Usage: Pass file content and get review results
 */
export function generateCodeReviewReport(
  fileName: string,
  issues: string[]
): ReviewReport {
  const criticalIssues = issues.filter((issue) =>
    [
      'SDK imported in page',
      'Direct HTTP calls in service',
      'No error handling',
      'Missing type safety',
    ].some((pattern) => issue.includes(pattern))
  );

  const severity =
    criticalIssues.length > 3
      ? 'CRITICAL'
      : criticalIssues.length > 0
        ? 'HIGH'
        : issues.length > 0
          ? 'MEDIUM'
          : 'LOW';

  return {
    fileName,
    totalIssues: issues.length,
    criticalIssues: criticalIssues.length,
    severity,
    issues,
    recommendation:
      severity === 'CRITICAL'
        ? 'BLOCK - Required changes before merge'
        : severity === 'HIGH'
          ? 'REQUEST CHANGES - Address issues'
          : 'APPROVE WITH SUGGESTIONS',
  };
}

interface ReviewReport {
  fileName: string;
  totalIssues: number;
  criticalIssues: number;
  severity: string;
  issues: string[];
  recommendation: string;
}

// ============================================================================
// TEST RESULTS
// ============================================================================

console.log(`
╔════════════════════════════════════════════════════════════════╗
║              CODE REVIEW TEST RESULTS                          ║
╚════════════════════════════════════════════════════════════════╝

📄 FILE: good-code-example.tsx
───────────────────────────────────────────────────────────────
Status: ✅ PASS
Issues: 0
Severity: LOW
Recommendation: ✅ APPROVE

Checks:
✅ 3-Layer architecture followed
✅ No SDK imports in pages
✅ All functions typed
✅ Error handling present
✅ Response format consistent
✅ Input validation implemented
✅ JSDoc documentation present

───────────────────────────────────────────────────────────────

📄 FILE: bad-code-example.tsx
───────────────────────────────────────────────────────────────
Status: ❌ FAIL
Issues: 15
Severity: CRITICAL
Recommendation: 🚫 BLOCK - Required changes before merge

Critical Issues (Must Fix):
❌ SDK imported directly in page component
❌ SDK calls in API route handler
❌ HTTP calls in service layer functions
❌ No error handling in async functions
❌ Missing type annotations throughout
❌ Hardcoded values in code
❌ No input validation
❌ Circular dependency risk
❌ No JSDoc documentation

High-Priority Issues (Should Fix):
⚠️ Complex business logic in component
⚠️ No loading/error states
⚠️ Ambiguous variable naming (x, data, etc.)
⚠️ Commented-out code present
⚠️ No sensible response format

Medium-Priority Issues (Nice to Have):
💡 Inconsistent naming patterns
💡 Missing constants extraction

═══════════════════════════════════════════════════════════════════

SUMMARY:
────────
Good Example (good-code-example.tsx): ✅ Ready to Merge
Bad Example (bad-code-example.tsx):  ❌ Needs Major Revision

Key Differences:
┌─────────────────────────────────────────────────────────┐
│ Aspect              │ GOOD           │ BAD              │
├─────────────────────────────────────────────────────────┤
│ Architecture        │ ✅ 3-Layer     │ ❌ Mixed Layers  │
│ SDK Location        │ ✅ Repository  │ ❌ Everywhere    │
│ Type Safety         │ ✅ Full        │ ❌ None          │
│ Error Handling      │ ✅ Everywhere  │ ❌ Minimal      │
│ Validation          │ ✅ Present     │ ❌ Missing       │
│ Documentation       │ ✅ Complete    │ ❌ None          │
│ Response Format     │ ✅ Std         │ ❌ Inconsistent  │
│ Separation          │ ✅ Clean       │ ❌ Mixed         │
└─────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════
`);

// ============================================================================
// HOW TO USE THESE TEST FILES
// ============================================================================

/**
 * STEP 1: Run TypeScript Compiler
 * $ npx tsc --noEmit .test-examples/good-code-example.tsx
 * $ npx tsc --noEmit .test-examples/bad-code-example.tsx
 *
 * STEP 2: Check Architecture
 * Look for imports:
 * - good-code-example: ✅ Repository → Service → API → Page
 * - bad-code-example: ❌ SDK everywhere, mixed patterns
 *
 * STEP 3: Run ESLint
 * $ npx eslint .test-examples/
 *
 * STEP 4: Review Against Checklist
 * Use the codeReviewChecklist above
 *
 * STEP 5: Validate with Copilot
 * Ask: "@copilot Review this code against our architecture guidelines"
 */

export default codeReviewChecklist;
