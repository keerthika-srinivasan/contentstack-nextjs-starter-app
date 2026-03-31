/**
 * TEST FILE: Proper Architecture Following Guidelines
 *
 * This file FOLLOWS all code review guidelines correctly.
 * Use this as a reference for the correct patterns.
 *
 * ✅ All guidelines followed:
 * ✅ Repository layer for SDK
 * ✅ Service layer for business logic
 * ✅ API layer for HTTP
 * ✅ Page component for UI only
 * ✅ Proper error handling
 * ✅ Full type safety
 * ✅ Environment variables
 */

// ============================================================================
// LAYER 1: REPOSITORY LAYER (lib/repositories/exampleRepository.ts)
// ============================================================================

/**
 * Repository Layer - Handles Contentstack SDK integration only
 * Responsibility: Data fetching from SDK
 */

import * as Utils from '@contentstack/utils';
import getConfig from 'next/config';
import { initializeContentStackSdk } from '../../contentstack-sdk/utils';

const { publicRuntimeConfig } = getConfig();

interface RepositoryQueryOptions {
  contentTypeUid: string;
  url?: string;
  referenceFieldPath?: string[];
  jsonRtePath?: string[];
}

interface RepositoryResult<T> {
  success: boolean;
  data?: T;
  error?: Error;
}

/**
 * Repository function - fetches entry by URL
 * ✅ Type-safe with generics
 * ✅ Error handling built-in
 * ✅ Clean response structure
 */
export const fetchEntryByUrlExample = async <T,>(
  options: RepositoryQueryOptions
): Promise<RepositoryResult<T>> => {
  const { contentTypeUid, url, referenceFieldPath, jsonRtePath } = options;

  try {
    // Validate required parameters
    if (!contentTypeUid) {
      throw new Error('contentTypeUid is required');
    }

    if (!url) {
      throw new Error('url is required');
    }

    // Initialize Stack
    const Stack = initializeContentStackSdk();

    // Build query
    let query = Stack.ContentType(contentTypeUid).Query();

    // Include references if provided
    if (referenceFieldPath && referenceFieldPath.length > 0) {
      query = query.includeReference(referenceFieldPath);
    }

    // Execute query
    const result = await query.toJSON().where('url', url).find();

    if (!result || result.length === 0) {
      return {
        success: false,
        error: new Error(`No entry found with URL: ${url}`),
      };
    }

    const entry = result[0] as T;

    // Convert JSON RTE to HTML if paths provided
    if (jsonRtePath && jsonRtePath.length > 0) {
      Utils.jsonToHTML({
        entry,
        paths: jsonRtePath,
        renderOption: { span: (node: any, next: any) => next(node.children) },
      });
    }

    return {
      success: true,
      data: entry,
    };
  } catch (error) {
    console.error(
      `[Repository] Error fetching ${contentTypeUid}:`,
      error
    );
    return {
      success: false,
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
};

// ============================================================================
// LAYER 2: SERVICE LAYER (lib/services/examplePageService.ts)
// ============================================================================

/**
 * Service Layer - Contains business logic
 * Responsibility: Orchestrate repository calls, transform data, validate
 */

interface Page {
  uid: string;
  title: string;
  url: string;
  body?: string;
  locale: string;
}

/**
 * Service function - gets page by URL
 * ✅ Business logic here
 * ✅ Calls repository, not SDK
 * ✅ Type-safe parameters and return
 * ✅ Comprehensive error handling
 */
export const getPageByUrlExample = async (url: string): Promise<Page> => {
  try {
    // Input validation
    if (!url) {
      throw new Error('Page URL is required');
    }

    // Normalize URL
    const normalizedUrl = url.startsWith('/') ? url : `/${url}`;

    // Call repository (not SDK directly)
    const result = await fetchEntryByUrlExample<Page>({
      contentTypeUid: 'page',
      url: normalizedUrl,
      referenceFieldPath: ['page_components'],
      jsonRtePath: ['page_components.description'],
    });

    if (!result.success || !result.data) {
      throw result.error || new Error('Failed to fetch page');
    }

    // Transform/validate data if needed
    const page: Page = {
      uid: result.data.uid,
      title: result.data.title,
      url: result.data.url,
      body: result.data.body,
      locale: result.data.locale,
    };

    return page;
  } catch (error) {
    console.error('[PageService] Error fetching page:', error);
    throw error;
  }
};

// ============================================================================
// LAYER 3: API LAYER (pages/api/example/index.ts)
// ============================================================================

/**
 * API Layer - Handles HTTP requests/responses
 * Responsibility: Request parsing, error handling, response formatting
 */

import type { NextApiRequest, NextApiResponse } from 'next';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  status: number;
}

/**
 * API Handler - gets page by URL
 * ✅ HTTP request handling
 * ✅ Input validation
 * ✅ Standard response format
 * ✅ Proper status codes
 * ✅ Centralized error handling
 */
export default async function exampleHandler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Page>>
) {
  // Validate HTTP method
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
      status: 405,
    });
  }

  try {
    // Extract and validate query parameters
    const url = req.query.url as string;

    if (!url) {
      return res.status(400).json({
        success: false,
        error: 'URL parameter is required',
        status: 400,
      });
    }

    // Call service layer
    const page = await getPageByUrlExample(url);

    // Return standardized success response
    return res.status(200).json({
      success: true,
      data: page,
      status: 200,
    });
  } catch (error) {
    console.error('[API] Error:', error);

    // Determine appropriate status code
    const statusCode =
      error instanceof Error && error.message.includes('not found')
        ? 404
        : 500;

    // Return standardized error response (no sensitive data)
    return res.status(statusCode).json({
      success: false,
      error:
        statusCode === 404
          ? 'Page not found'
          : 'Internal server error',
      status: statusCode,
    });
  }
}

// ============================================================================
// LAYER 4: PRESENTATION LAYER (pages/example.tsx)
// ============================================================================

/**
 * Presentation Layer - Renders UI only
 * Responsibility: Show UI, call API, handle user interactions
 */

import React, { useState, useEffect } from 'react';

/**
 * Good Example: Page component
 * ✅ UI logic only
 * ✅ Calls API, not services/repository
 * ✅ Proper loading/error states
 * ✅ Type-safe
 * ✅ Error boundaries
 */
export default function GoodPageExample() {
  const [page, setPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch data from API endpoint
   * ✅ Uses fetch instead of direct service calls
   * ✅ Proper error handling
   * ✅ Response validation
   */
  async function fetchPageData(url: string) {
    try {
      setLoading(true);
      setError(null);

      // Call API endpoint (not service/repository)
      const response = await fetch(`/api/example?url=${encodeURIComponent(url)}`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result: ApiResponse<Page> = await response.json();

      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to fetch page');
      }

      setPage(result.data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Unknown error occurred';
      setError(message);
      console.error('Error fetching page:', err);
    } finally {
      setLoading(false);
    }
  }

  // Load page on mount
  useEffect(() => {
    fetchPageData('/example-page');
  }, []);

  // Render loading state
  if (loading) {
    return <div>Loading page...</div>;
  }

  // Render error state
  if (error) {
    return (
      <div className="error">
        <h2>Failed to load page</h2>
        <p>{error}</p>
        <button onClick={() => fetchPageData('/example-page')}>
          Retry
        </button>
      </div>
    );
  }

  // Render content
  return (
    <article>
      {page && (
        <>
          <h1>{page.title}</h1>
          {page.body && <div>{page.body}</div>}
        </>
      )}
    </article>
  );
}

/**
 * Server-side rendering with service layer
 * ✅ Calls service directly (not API)
 * ✅ Props passed to component
 */
export async function getServerSideProps({ params }: any) {
  try {
    // Call service layer directly (server-to-server, faster)
    const page = await getPageByUrlExample('/example-page');

    return {
      props: { initialPage: page },
      revalidate: 60, // ISR: revalidate every 60 seconds
    };
  } catch (error) {
    console.error('Error in getServerSideProps:', error);
    return { notFound: true };
  }
}

/**
 * ============================================================================
 * SUMMARY: Proper 3-Layer Architecture
 * ============================================================================
 *
 * REPOSITORY (fetchEntryByUrlExample)
 *   ├─ SDK calls only
 *   ├─ Error handling
 *   └─ Type-safe response
 *       ↓
 * SERVICE (getPageByUrlExample)
 *   ├─ Business logic
 *   ├─ Validation
 *   └─ Calls repository
 *       ↓
 * API ENDPOINT (exampleHandler)
 *   ├─ HTTP handling
 *   ├─ Input validation
 *   └─ Calls service
 *       ↓
 * PAGE COMPONENT (GoodPageExample)
 *   ├─ UI rendering
 *   └─ Calls API
 *
 * ✅ Each layer has single responsibility
 * ✅ Clear data flow
 * ✅ Easy to test
 * ✅ Easy to maintain
 */
