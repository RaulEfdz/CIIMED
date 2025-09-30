/**
 * Utilities for UploadThing URL generation
 */

// Base URL for UploadThing files
const UPLOADTHING_BASE = 'https://2dprahnec4.ufs.sh/f/';

/**
 * UploadThing file keys and their full URLs
 */
export const UPLOADTHING_IMAGES = {
  NEWS_IMAGE: `${UPLOADTHING_BASE}wZmqwzPtkJiVuAAauFYjwQ9ARjyai65NGfCLqVcr7hPBM4oI`,
  EVENT_IMAGE: `${UPLOADTHING_BASE}wZmqwzPtkJiVDdpecIA9kyapnAKgdwxfhL6SZi204sYFEB53`, 
  ABOUT_IMAGE: `${UPLOADTHING_BASE}wZmqwzPtkJiVU5nnfae0leBtOpcTh7do6P5iSMJjsfnvgQF8`
} as const;

/**
 * Generate a full UploadThing URL from a file key
 * @param key - The UploadThing file key
 * @returns Full URL to the UploadThing file
 */
export function getUploadThingUrl(key: string): string {
  return `${UPLOADTHING_BASE}${key}`;
}