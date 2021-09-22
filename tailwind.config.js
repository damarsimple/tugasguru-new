module.exports = {
    purge: [],
    jit: true,
    purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            colors: {
                dark: "#2B2A33",
                primary: {
                    base: "#3B82F6",
                    shadow: "#FFC6D9",
                    highlight: "#FFE6EE",
                    accent: "#ff3d00",
                },
            },
        },
    },
    variants: {
        extend: {},
    },
    plugins: [],
};