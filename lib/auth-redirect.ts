const DEFAULT_RETURN_PATH = "/";

function getRequiredEnv(
  key: "AUTH_URL" | "NEXT_PUBLIC_WEBSITE_URL" | "AUTH_WEBSITE_ID"
) {
  const value = process.env[key];
  if (!value) {
    throw new Error(`${key} environment variable is not set`);
  }
  return value;
}

function normalizeReturnPath(target?: string | null) {
  if (!target) {
    return DEFAULT_RETURN_PATH;
  }
  const trimmed = target.trim();
  if (!trimmed) {
    return DEFAULT_RETURN_PATH;
  }
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    const url = new URL(trimmed);
    return `${url.pathname}${url.search}${url.hash}`;
  }
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}

export function buildAuthRedirectUrl(returnPath?: string | null) {
  const websiteUrl = getRequiredEnv("NEXT_PUBLIC_WEBSITE_URL");
  const authUrl = getRequiredEnv("AUTH_URL");
  const websiteId = getRequiredEnv("AUTH_WEBSITE_ID");

  const websiteOrigin = websiteUrl.replace(/\/$/, "");
  const normalizedPath = normalizeReturnPath(returnPath);

  const callbackUrl = new URL("/api/auth/callback", websiteOrigin);
  callbackUrl.searchParams.set("redirectUrl", normalizedPath);

  const loginUrl = new URL("/login", authUrl);
  loginUrl.searchParams.set("id", websiteId);
  loginUrl.searchParams.set("callbackUrl", callbackUrl.toString());

  return loginUrl.toString();
}
