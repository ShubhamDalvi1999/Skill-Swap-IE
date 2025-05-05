'use client'

import React from 'react'
import MainLayout from '@/components/layout/MainLayout'
import type { ReactNode } from 'react'

export default function ProfileLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <MainLayout>
      {children}
    </MainLayout>
  )
} 