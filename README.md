# react-currency-input

> React currency input
> This component handles currency format across browser locales and languages

[![NPM](https://img.shields.io/npm/v/react-currency-input.svg)](https://www.npmjs.com/package/react-currency-input) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save ac-react-currency-input
```

## Usage

```tsx
import React, { Component } from 'react'

import ReactCurrencyInput from 'react-currency-input'
import 'react-currency-input/dist/index.css' // or use class react-currency-input for your own styles

class Example extends Component {
  render() {
    return <ReactCurrencyInput value={150} currency="EUR"  autoFocus={true} />
  }
}
```

### Custom config

```tsx
const config: ConfigInterface = {
  locale: 'de-De' // en || en-US || ....
  formats: {
    number: {
      EUR: {
        style: "currency"
        currency: 'EUR'
        minimumFractionDigits: 2
        maximumFractionDigits: 2
      }
    }
  }

  <ReactCurrencyInput value={150} currency="EUR"  autoFocus={true} config={config}/>
```

### Custom styling

```scss
.react-currency-input {
  margin: 0 auto;
  align-items: center;
  align-self: center;
  text-align: center;
  ...
}
```

## License

MIT © [AhmedCommando](https://github.com/AhmedCommando)
