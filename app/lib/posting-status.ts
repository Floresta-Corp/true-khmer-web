/**
 * Turns a launchpad or volunteer posting status (`IN_PROGRESS`) into the
 * words shown on its detail cover (`In progress`).
 */
export function formatPostingStatus(status: string): string {
  const words = status.toLowerCase().replaceAll("_", " ");
  return words.charAt(0).toUpperCase() + words.slice(1);
}
