import type { NextApiRequest, NextApiResponse } from "next";
import { getPageByUrl, getAllPages } from "../../lib/services/pageService";
import { Page } from "../../typescript/pages";

type ResponseData = {
  success: boolean;
  data?: Page | Page[];
  error?: string;
  status?: number;
};

/**
 * API Route: pages/api/pages/[url].ts
 *
 * GET /api/pages/[url]
 * Fetches a single page by URL
 *
 * GET /api/pages/all
 * Fetches all pages
 */

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

/**
 * Handler for page API endpoints
 * Supports two query patterns:
 * - ?url=/page-name (get specific page)
 * - ?all=true (get all pages)
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  // Only allow GET requests
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed",
      status: 405,
    });
  }

  try {
    // Get all pages
    if (req.query.all === "true") {
      const pages = await getAllPages();
      return res.status(200).json({
        success: true,
        data: pages,
        status: 200,
      });
    }

    // Get specific page by URL
    const url = req.query.url as string;
    if (!url) {
      return res.status(400).json({
        success: false,
        error: "URL parameter is required",
        status: 400,
      });
    }

    const page = await getPageByUrl(url);
    return res.status(200).json({
      success: true,
      data: page,
      status: 200,
    });
  } catch (error: any) {
    console.error("[API] Error in pages endpoint:", error);

    // Handle 404 errors
    if (error.message?.includes("not found")) {
      return res.status(404).json({
        success: false,
        error: error.message || "Page not found",
        status: 404,
      });
    }

    // Handle other errors
    return res.status(500).json({
      success: false,
      error: error.message || "Internal server error",
      status: 500,
    });
  }
}
