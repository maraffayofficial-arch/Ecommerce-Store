import React, { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'
import API_URL from '../config'

const defaultSettings = { shippingFee: 199, freeShipping: false, globalSale: 0, saleBanner: { enabled: false, title: '', subtitle: '', bgColor: 'green' }, contactInfo: { email: 'urbanpickle@gmail.com', phone: '+92 323-5073652', location: '26000, Multan, Pakistan' }, paymentDetails: { bank: { bankName: '', accountTitle: '', accountNumber: '', iban: '' }, jazzcash: { accountName: '', number: '' }, easypaisa: { accountName: '', number: '' } } }

const SettingsContext = createContext(defaultSettings)

export const useSettings = () => useContext(SettingsContext)

const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(defaultSettings)

  useEffect(() => {
    axios.get(`${API_URL}/settings/shipping`)
      .then(r => setSettings(r.data)).catch(() => {})
  }, [])

  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  )
}

export default SettingsProvider
