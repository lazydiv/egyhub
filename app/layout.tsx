import type { Metadata } from 'next'
import { Open_Sans } from 'next/font/google'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { cn } from '@/lib/utils'
import { ModelProvider } from '@/components/providers/model-provider'
import { Socket } from 'socket.io'
import { SocketProvider } from '@/components/providers/socket-provider'
import { QueryProvider } from '@/components/providers/query-provider'

const font = Open_Sans({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'egyhub',
  description: 'egyhub is an easy to use social media platform for developers',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider
      afterSignInUrl='/setup'
      afterSignUpUrl='/setup'
    >
      <html lang="en" suppressHydrationWarning>
        <body className={cn(
          font.className,
          'bg-gray-50 dark:bg-zinc-800/50'
        )}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={true}
            storageKey='egyhub-theme'
          >
            <SocketProvider>

              <ModelProvider />
              <QueryProvider>
                {children}
              </QueryProvider>
            </SocketProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
