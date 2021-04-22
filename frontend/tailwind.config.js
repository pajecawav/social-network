const colors = require("tailwindcss/colors");

module.exports = {
    purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
    darkMode: false,
    theme: {
        extend: {
            colors: {
                emerald: colors.emerald,
            },
        },
    },
    variants: {},
    plugins: [],
};
