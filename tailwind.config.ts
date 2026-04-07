import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        // Using a template literal for the 4-quadrant gradient
        'quad-accent': "linear-gradient(to bottom right, var(--Colors-Accent-100, #D5EDFF) 0%, #FFF 50%) bottom right / 50% 50% no-repeat, linear-gradient(to bottom left, var(--Colors-Accent-100, #D5EDFF) 0%, #FFF 50%) bottom left / 50% 50% no-repeat, linear-gradient(to top left, var(--Colors-Accent-100, #D5EDFF) 0%, #FFF 50%) top left / 50% 50% no-repeat, linear-gradient(to top right, var(--Colors-Accent-100, #D5EDFF) 0%, #FFF 50%) top right / 50% 50% no-repeat",
      },
    },
  },
  plugins: [],
};

export default config;
