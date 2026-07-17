import { NextResponse } from "next/server";
import { AuthError } from "@/lib/auth";
import { logger } from "@/lib/logger";

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export function jsonResponse<T>(data: T, status = 200): NextResponse {
  return NextResponse.json({ success: true, data } satisfies ApiResponse<T>, { status });
}

export function errorResponse(error: string, status = 500): NextResponse {
  return NextResponse.json({ success: false, error } satisfies ApiResponse, { status });
}

export function handleApiError(error: unknown): NextResponse {
  if (error instanceof AuthError) {
    const status = error.code === "UNAUTHENTICATED" ? 401 : 403;
    return errorResponse(error.message, status);
  }

  logger.error("Unexpected API error", error);
  return errorResponse("Internal server error", 500);
}
