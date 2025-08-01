import { Inter } from 'next/font/google'
import './globals.css'
import MetaPixel from './Components/MetaPixel'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
    title: 'حذاء جلد جودة عالية',
    description: 'أحذية جلدية عالية-الجودة بأفضل الأسعار',
    icons: {
        icon: 'public/favicon.ico',
    },
}

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
        <MetaPixel />
        {children}
        </body>
        </html>
    )
}