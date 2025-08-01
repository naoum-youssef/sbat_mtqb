import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }) {
    return (
        <html lang="ar" dir="rtl">
        <head>
            <link
                href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700&display=swap"
                rel="stylesheet"
            />
        </head>
        <body className={inter.className}>
        {children}
        </body>
        </html>
    )
}