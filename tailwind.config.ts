import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: "class",
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
            },
            animation: {
                "blur-in": "blur-in 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards",
            },
            keyframes: {
                "blur-in": {
                    "0%": { opacity: "0", filter: "blur(10px)", transform: "translateY(20px)" },
                    "100%": { opacity: "1", filter: "blur(0)", transform: "translateY(0)" }
                }
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
};
export default config;
