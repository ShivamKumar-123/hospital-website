import { createContext, useContext, useEffect, useState } from 'react'
import { getData, saveData } from '../utils/storage.js'

const SettingsContext = createContext(null)

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => getData('settings', {}))

  useEffect(() => {
    saveData('settings', settings)
  }, [settings])

  const updateSettings = (patch) => setSettings((s) => ({ ...s, ...patch }))

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  )
}

export const useSettings = () => useContext(SettingsContext)
