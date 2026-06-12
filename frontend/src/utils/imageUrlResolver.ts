/**
 * Resolves image URLs to ensure they point to the correct backend server
 */
export const resolveImageUrl = (src?: string): string => {
  if (!src) {
    return "/images/OMEGA_BAU_3-_WEB_1365x601.webp";
  }

  // If it's already a full URL to the backend, use it as-is
  if (src.startsWith("http://localhost:4000") || src.startsWith("http://backend:4000")) {
    return src; 
  }

  // If it's already an absolute URL (external), use it as-is
  if (src.startsWith("http://") || src.startsWith("https://")) {
    return src;
  }

  // If it's a relative path starting with /, prefix with backend URL
  if (src.startsWith("/")) {
    const backendUrl = process.env.NEXT_PUBLIC_GRAPHQL_URL?.replace("/graphql", "") || "http://localhost:4000";
    return `${backendUrl}${src}`;
  }

  // Otherwise, assume it's a relative path and prefix with backend URL
  const backendUrl = process.env.NEXT_PUBLIC_GRAPHQL_URL?.replace("/graphql", "") || "http://localhost:4000";
  return `${backendUrl}/${src}`;
};
