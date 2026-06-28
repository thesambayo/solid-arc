export function shortUrl(u: string): string {
  try {
    const url = new URL(u);
    return url.host + (url.pathname !== "/" ? url.pathname : "");
  } catch {
    return u.replace(/^[a-z]+:\/\//, "");
  }
}
