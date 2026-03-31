/**
 * TEST FILE: Intentional Architecture Violations
 *
 * This file VIOLATES the code review guidelines intentionally.
 * Use this to verify the review process catches issues.
 *
 * 🚨 Red Flags Present:
 * ❌ SDK imported in page
 * ❌ Direct HTTP calls
 * ❌ Missing error handling
 * ❌ Hardcoded values
 * ❌ No type safety
 * ❌ Business logic in component
 */

import React, { useState } from 'react';
import Stack from '../contentstack-sdk'; // ❌ VIOLATION: SDK in page
import { initializeContentStackSdk } from '../contentstack-sdk/utils';

/**
 * BAD EXAMPLE: Violates 3-layer architecture
 */
export default function BadPageExample() {
  const [data, setData] = useState(null);

  async function fetchData() {
    // ❌ VIOLATION: SDK call in component
    const Stack = initializeContentStackSdk();

    const query = Stack.ContentType('page').Query();
    const result = await query.find(); // ❌ No try/catch

    // ❌ VIOLATION: Hardcoded values
    const filteredData = result.filter(
      (item) => item.url === '/hardcoded-url'
    );

    // ❌ VIOLATION: Complex business logic in component
    const transformedData = filteredData.map((item) => ({
      title: item.title + '_processed',
      content: item.body?.replace(/<[^>]*>/g, ''),
      metadata: {
        created: new Date(item.created_at),
        special: item.special_flag === 'true',
      },
    }));

    setData(transformedData);
  }

  // ❌ VIOLATION: No JSDoc, no types
  const handleClick = (e) => {
    fetchData();
  };

  return (
    <div>
      <button onClick={handleClick}>Load Data</button>
      {/* ❌ No loading state, no error state */}
      {data && data.map((item) => <div key={item.title}>{item.title}</div>)}
    </div>
  );
}

/**
 * BAD API ROUTE: Direct SDK calls in API
 */
// ❌ pages/api/pages/bad-example.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function badHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // ❌ VIOLATION: SDK imported and used directly in API
  const Stack = initializeContentStackSdk();

  try {
    const query = Stack.ContentType('page').Query();
    const result = await query.find();

    // ❌ VIOLATION: No input validation
    const filtered = result.filter((item) => item.url === req.query.url);

    // ❌ VIOLATION: No standardized response format
    res.json(filtered[0]); // Could be undefined
  } catch (error) {
    // ❌ VIOLATION: Vague error message exposed to client
    res.status(500).json({ error: error.message });
  }
}

/**
 * BAD SERVICE: HTTP calls in service layer
 */
// ❌ lib/services/bad-page-service.ts
export const badGetPageByUrl = async (url) => {
  // ❌ VIOLATION: HTTP call in service
  const response = await fetch(`/api/pages?url=${url}`);
  const data = await response.json();

  // ❌ VIOLATION: No error handling
  // ❌ VIOLATION: No types
  return data;
};

/**
 * BAD PATTERNS: Various violations
 */

// ❌ Circular imports
// lib/services/bad-service.ts could import lib/repositories
// lib/repositories could import lib/services

// ❌ No validation
export const badFetchPage = async (url) => {
  return await fetch(`/api/pages?url=${url}`).then((r) => r.json());
};

// ❌ Magic numbers and strings
const CONFIG = {
  timeout: 5000,
  retries: 3,
  url: 'https://api.contentstack.io', // ❌ Hardcoded
};

// ❌ Commented-out code
// const oldMethodName = async () => { ... };

// ❌ Ambiguous naming
const getData = async (x) => {
  // What is x? No documentation
  return x;
};

// ❌ No error boundaries
export const risky = (data) => {
  return data.map((item) => item.nested.deeply.value);
};
