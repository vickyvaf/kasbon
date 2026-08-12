import { useState, useCallback } from 'react'

export function useDisclosure<T = undefined>(
  initialState = false,
  initialData: T | null = null
) {
  const [isOpen, setIsOpen] = useState(initialState)
  const [data, setData] = useState<T | null>(initialData)

  const onOpen = useCallback((payload?: T | null) => {
    if (payload !== undefined) {
      setData(payload)
    } else {
      setData(null)
    }
    setIsOpen(true)
  }, [])

  const onClose = useCallback(() => {
    setIsOpen(false)
    setData(null)
  }, [])

  const onToggle = useCallback(() => setIsOpen((prev) => !prev), [])

  return { isOpen, data, onOpen, onClose, onToggle, setData, setIsOpen }
}
