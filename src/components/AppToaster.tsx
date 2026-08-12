'use client'

import { useEffect, useState } from 'react'
import { Toaster as SonnerToaster } from 'sonner'

export function AppToaster() {
  const [position, setPosition] = useState<'bottom-right' | 'top-center'>('bottom-right')

  useEffect(() => {
    function updatePosition() {
      if (window.innerWidth < 768) {
        setPosition('top-center')
      } else {
        setPosition('bottom-right')
      }
    }

    updatePosition()
    window.addEventListener('resize', updatePosition)
    return () => window.removeEventListener('resize', updatePosition)
  }, [])

  return <SonnerToaster position={position} theme="dark" richColors />
}
