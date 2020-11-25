import React from 'react'

import ReactCurrencyInput from 'react-currency-input'
import 'react-currency-input/dist/index.css'

const App = () => {
  
  return <ReactCurrencyInput value={0} currency="EUR"  autoFocus={true} />
}

export default App
