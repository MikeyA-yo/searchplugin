module.exports = {
    content: [
        './src/**/*.{js,jsx,ts,tsx,php}',
    ],
    theme: {
        extend: {
            colors: {
                '--color-primary': '#ef4444', // red-500
                '--color-secondary': '#f472b6', // pink-400
                '--color-accent': '#f472b6',
            }
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
};
