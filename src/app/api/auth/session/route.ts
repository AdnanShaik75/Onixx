import { getSessionUser } from "@/lib/session";
import { jsonResponse, handleApiError } from "@/lib/api";
import { generateCsrfToken, setCsrfCookie } from "@/lib/csrf";

export async function GET() {
  try {
    const user = await getSessionUser();

    if (!user) {
      return jsonResponse({ authenticated: false }, 401);
    }

    const response = jsonResponse({ authenticated: true, user });

    const csrfToken = generateCsrfToken(user.uid);
    response.headers.append("Set-Cookie", setCsrfCookie(csrfToken));

    return response;
  } catch (error) {
    return handleApiError(error);
  }
}
