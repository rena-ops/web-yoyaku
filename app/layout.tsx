import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'WEB予約 マスター編集ツール',
  description: 'メディカルフォース WEB予約マスターシート編集ツール',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  )
}
