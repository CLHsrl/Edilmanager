import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                primary: "#1a73e8", // Google Blue
                secondary: "#5f6368", // Google Grey
            },
            fontFamily: {
                sans: ['Inter', 'Roboto', 'Arial', 'sans-serif'],
            },
        },
    },
    plugins: [],
};
export default config;
