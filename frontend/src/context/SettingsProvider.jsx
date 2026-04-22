import React, { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'

const defaultSettings = { shippingFee: 199, freeShipping: false, globalSale: 0, saleBanner: { enabled: false, title: '', subtitle: '', bgColor: 'green' } }

const SettingsContext = createContext(defaultSettings)

export const useSettings = () => useContext(SettingsContext)

const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(defaultSettings)

  useEffect(() => {
    axios.get("http://localhost:8000/settings/shipping")
      .then(r => setSettings(r.data)).catch(() => {})
  }, [])

  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  )
}

export default SettingsProvider
