// src/features/auth/services/query.ts
// 
// ⚠️  MIGRATION NOTE:
// GET_ME and ReadProfileData were GraphQL artifacts used with Apollo Client.
// They have been replaced by:
//   - profileService.getProfile()  →  GET /users/profile
//   - useEnrichedCompanyProfile()  →  src/features/public/cart/hooks/useEnrichedCompanyProfile.ts
//
// These exports are kept temporarily to avoid breaking other imports during migration.
// Once all consumers are confirmed removed, delete this file entirely.

/** @deprecated — use profileService.getProfile() instead */
export const GET_ME = null;

/** @deprecated — use ProfileResponse from profile-service.ts instead */
export const ReadProfileData = null;