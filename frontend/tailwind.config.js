const colors = require("tailwindcss/colors");

module.exports = {
    mode: "jit",
    purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
    darkMode: false,
    theme: {
        extend: {
            colors: {
                button: colors.white,
                primary: {
                    50: colors.trueGray[50],
                    100: colors.trueGray[100],
                    200: colors.trueGray[200],
                    300: colors.trueGray[300],
                    400: colors.trueGray[400],
                    500: colors.trueGray[500],
                    600: "#2A2A2A",
                    700: "#222222",
                    800: "#181818",
                    900: "#121212",
                },
                secondary: {
                    DEFAULT: colors.lightBlue[900],
                    500: colors.lightBlue[500],
                    600: colors.lightBlue[600],
                    700: colors.lightBlue[700],
                    800: colors.lightBlue[800],
                    900: colors.lightBlue[900],
                },
                error: colors.red[200],
                success: colors.emerald[100],
            },
        },
    },
    variants: {
        extend: {
            display: ["group-hover"],
        },
    },
    plugins: [require("@tailwindcss/aspect-ratio")],
};
