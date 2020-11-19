import React from 'react'

import ReactCurrencyInput from 'react-currency-input'
import 'react-currency-input/dist/index.css'
import { ConfigInterface } from '../../dist/utils'

const App = () => {
  const config: ConfigInterface = {
    locale: 'en-US',
    formats: {
      number: {
        TRY: {
          style: 'currency',
          currency: 'TRY',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }
      }
    }
  }

  return <ReactCurrencyInput value={123456} currency="EUR" config={config} autoFocus={true} onChange={() => {}} />
}

export default App
