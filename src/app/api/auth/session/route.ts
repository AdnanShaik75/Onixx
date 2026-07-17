import { getSessionUser } from "@/lib/session";
import { jsonResponse, handleApiError } from "@/lib/api";

export async function GET() {
  try {
    const user = await getSessionUser();

    if (!user) {
      return jsonResponse({ authenticated: false }, 401);
    }

    return jsonResponse({ authenticated: true, user });
  } catch (error) {
    return handleApiError(error);
  }
}
