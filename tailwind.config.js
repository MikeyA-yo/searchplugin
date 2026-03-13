module.exports = {
    content: [
        './src/**/*.{js,jsx,ts,tsx,php}',
    ],
    theme: {
        extend: {
            colors: {
                '--color-primary': '#d62e2f',
                '--color-secondary': '#f472b6',
                '--color-accent': '#f472b6',
                // Override Tailwind's default red scale so existing `bg-red-600`, `text-red-500` etc use the exact brand color organically
                red: {
                    50: '#fbf4f4',
                    100: '#f6e8e8',
                    200: '#eccbcb',
                    300: '#e0a5a5',
                    400: '#d07677',
                    500: '#c55354',
                    600: '#d62e2f', // Core brand red
                    700: '#9b2021',
                    800: '#811e1f',
                    900: '#6d1d1f',
                    950: '#3a0c0c',
                },
            }
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
};
