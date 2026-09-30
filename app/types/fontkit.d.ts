// fontkit ships no types — only the surface the certificate PDF uses and It shapes Khmer text
declare module "fontkit" {
  export interface Glyph {
    id: number;
    name?: string;
    codePoints: number[];
    advanceWidth: number;
  }

  export interface Font {
    characterSet: number[];
    numGlyphs: number;
    glyphForCodePoint(codePoint: number): Glyph;
    getGlyph(id: number, codePoints?: number[]): Glyph;
    layout(text: string, features?: unknown): { glyphs: Glyph[] };
  }

  export function create(data: Uint8Array): Font;
}
