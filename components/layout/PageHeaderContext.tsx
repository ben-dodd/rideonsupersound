import React, { createContext, useContext, useState, ReactNode } from 'react'

interface PageHeaderContextType {
  menuItems: any[] | null
  actionButtons: ReactNode | null
  setMenuItems: (items: any[] | null) => void
  setActionButtons: (buttons: ReactNode | null) => void
}

const PageHeaderContext = createContext<PageHeaderContextType | undefined>(undefined)

export const PageHeaderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [menuItems, setMenuItems] = useState<any[] | null>(null)
  const [actionButtons, setActionButtons] = useState<ReactNode | null>(null)

  return (
    <PageHeaderContext.Provider value={{ menuItems, actionButtons, setMenuItems, setActionButtons }}>
      {children}
    </PageHeaderContext.Provider>
  )
}

export const usePageHeader = () => {
  const context = useContext(PageHeaderContext)
  if (!context) {
    throw new Error('usePageHeader must be used within PageHeaderProvider')
  }
  return context
}
