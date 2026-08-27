const DEFAULT_RETURN_PATH = "/dashboard";

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

// Local route that starts the OIDC authorization flow against the provider.
export function buildAuthRedirectUrl(returnPath?: string | null) {
  const params = new URLSearchParams({
    redirectUrl: normalizeReturnPath(returnPath),
  });
  return `/api/auth/login?${params.toString()}`;
}
