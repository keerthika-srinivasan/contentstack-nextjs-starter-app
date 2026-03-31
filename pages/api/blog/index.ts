import type { NextApiRequest, NextApiResponse } from "next";
import {
  getBlogPostByUrl,
  getAllBlogPosts,
  getBlogPostList,
} from "../../../lib/services/blogService";
import { BlogPosts } from "../../../typescript/pages";

type ResponseData = {
  success: boolean;
  data?: BlogPosts | BlogPosts[];
  error?: string;
  status?: number;
};

/**
 * API Routes for Blog Operations
 *
 * Supports:
 * - GET /api/blog?url=/blog/post-slug (get single post)
 * - GET /api/blog?list=true (get all posts with preview)
 * - GET /api/blog?all=true (get all posts with full content)
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
    // Get blog post list (for archive/listing pages)
    if (req.query.list === "true") {
      const posts = await getBlogPostList();
      return res.status(200).json({
        success: true,
        data: posts,
        status: 200,
      });
    }

    // Get all blog posts with full content
    if (req.query.all === "true") {
      const posts = await getAllBlogPosts();
      return res.status(200).json({
        success: true,
        data: posts,
        status: 200,
      });
    }

    // Get single blog post by URL
    const url = req.query.url as string;
    if (!url) {
      return res.status(400).json({
        success: false,
        error: "URL parameter is required",
        status: 400,
      });
    }

    const post = await getBlogPostByUrl(url);
    return res.status(200).json({
      success: true,
      data: post,
      status: 200,
    });
  } catch (error: any) {
    console.error("[API] Error in blog endpoint:", error);

    // Handle 404 errors
    if (error.message?.includes("not found")) {
      return res.status(404).json({
        success: false,
        error: error.message || "Blog post not found",
        status: 404,
      });
    }

    // Handle validation errors
    if (error.message?.includes("required")) {
      return res.status(400).json({
        success: false,
        error: error.message || "Invalid request parameters",
        status: 400,
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
