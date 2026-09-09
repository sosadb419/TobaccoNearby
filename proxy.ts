import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const password = process.env.MODERATION_ADMIN_PASSWORD;
  const username = process.env.MODERATION_ADMIN_USER || "admin";

  if (!password) {
    return new NextResponse("Moderation admin access is not configured.", { status: 503 });
  }

  const authorization = request.headers.get("authorization");

  if (isValidBasicAuth(authorization, username, password)) {
    return NextResponse.next();
  }

  return new NextResponse("Authentication required.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="TobaccoNearby moderation", charset="UTF-8"'
    }
  });
}

export const config = {
  matcher: ["/admin/:path*"]
};

function isValidBasicAuth(authorization: string | null, username: string, password: string) {
  if (!authorization?.startsWith("Basic ")) {
    return false;
  }

  try {
    const decoded = atob(authorization.slice("Basic ".length));
    const separatorIndex = decoded.indexOf(":");

    if (separatorIndex === -1) {
      return false;
    }

    const providedUsername = decoded.slice(0, separatorIndex);
    const providedPassword = decoded.slice(separatorIndex + 1);

    return providedUsername === username && providedPassword === password;
  } catch {
    return false;
  }
}
