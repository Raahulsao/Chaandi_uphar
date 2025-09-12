// Utility functions for handling Firebase User IDs with Supabase

/**
 * Simple hash function to convert string to number
 */
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

/**
 * Converts a Firebase user ID to a deterministic UUID-like string
 * This allows us to use Firebase IDs with Supabase UUID fields
 */
export function firebaseIdToUuid(firebaseId: string): string {
  // Create a deterministic UUID-like string from Firebase ID
  const hash1 = simpleHash(firebaseId).toString(16).padStart(8, '0').substring(0, 8);
  const hash2 = simpleHash(firebaseId + 'salt1').toString(16).padStart(4, '0').substring(0, 4);
  const hash3 = simpleHash(firebaseId + 'salt2').toString(16).padStart(4, '0').substring(0, 4);
  const hash4 = simpleHash(firebaseId + 'salt3').toString(16).padStart(4, '0').substring(0, 4);
  const hash5 = simpleHash(firebaseId + 'salt4').toString(16).padStart(12, '0').substring(0, 12);
  
  return `${hash1}-${hash2}-4${hash3.substring(1)}-8${hash4.substring(1)}-${hash5}`;
}

/**
 * Validates if a string is a valid UUID format
 */
export function isValidUuid(str: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

/**
 * Handles user ID for database operations
 * Converts Firebase ID to UUID if needed, or returns original if already UUID
 */
export function normalizeUserId(userId: string): string {
  if (isValidUuid(userId)) {
    return userId;
  }
  return firebaseIdToUuid(userId);
}

/**
 * Enhanced error handler for UUID-related database errors
 */
export function handleUuidError(error: any, userId: string, fallbackData: any = []) {
  // Check if it's a UUID format error
  if (error && typeof error === 'object' && 'code' in error && error.code === '22P02') {
    console.warn(`UUID format error for userId: ${userId}. Using fallback data.`);
    return fallbackData;
  }
  
  // Re-throw other errors
  throw error;
}