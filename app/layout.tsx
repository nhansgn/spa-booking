export const metadata = {
  title: 'Spa Booking',
  description: 'Đặt lịch hẹn dễ dàng và nhanh chóng',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <head />
      <body>{children}</body>
    </html>
  )
}
