// data.ts
export type ThemeVariant = "orange" | "dark" | "light" | "green" | "multi";

export interface OpeningData {
  baseThemes: ThemeVariant[];
  themes: ThemeVariant[];
  animationDuration: number;
  logoSrc: string;
  logoAlt: string;
  logoWidth: number;
  logoHeight: number;
  themeColors: Record<ThemeVariant, string>;
}

export const openingData: OpeningData = {
  baseThemes: ["dark", "orange"],
  themes: ["dark", "orange", "green"],
  animationDuration: 400, // (3 + 1) * 100
  logoSrc: "/logo_blanco.png",
  logoAlt: "Logo",
  logoWidth: 64,
  logoHeight: 64,
  themeColors: {
    green: "#285C4D",
    orange: "#F4633A",
    dark: "#212322",
    light: "#F2F2F2",
    multi: "#285C4D",
  },
};