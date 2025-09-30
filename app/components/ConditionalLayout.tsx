'use client'

import { usePathname } from 'next/navigation'
import { Footer, Header } from "../config/inital"
import ChatWidget from "@/components/ChatWidget"

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  
  // No mostrar header/footer en rutas admin
  const isAdminRoute = pathname?.startsWith('/admin')
  
  if (isAdminRoute) {
    return <>{children}</>
  }
  
  return (
    <>
      <Header />
      {children}
      <Footer />
      <ChatWidget />
    </>
  )
}