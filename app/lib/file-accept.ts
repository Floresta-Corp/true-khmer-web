/**
 * Whether `file` satisfies an `<input accept>` string such as
 * `"application/pdf"`, `".pdf,.doc,.docx"` or `"image/*"`. Dropped and pasted
 * files bypass the picker's own filter, so uploaders check them with this.
 */
export function fileMatchesAccept(file: File, accept: string): boolean {
  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();

  return accept
    .split(",")
    .map((token) => token.trim().toLowerCase())
    .filter(Boolean)
    .some((token) => {
      if (token.startsWith(".")) return name.endsWith(token);
      if (token.endsWith("/*")) return type.startsWith(token.slice(0, -1));
      return type === token;
    });
}
