import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { ConfigInterface, defaultConfig, formatCurrency } from './utils'

interface CurrencyInputInterface {
  component?: any
  currency?: string
  value: number
  defaultValue?: number
  max?: number
  config?: ConfigInterface
  autoFocus?: boolean
  autoSelect?: boolean
  autoReset?: boolean
  onChange?: (event: any, value: any, maskedValue: any) => void
  onBlur?: (event: any, value: any, maskedValue: any) => void
  onFocus?: (event: any, value: any, maskedValue: any) => void
  onKeyPress?: (event: any, key: any, code: any) => void
}

const CurrencyInput: React.FC<CurrencyInputInterface> = ({
  currency = 'USD',
  value,
  defaultValue = 0,
  max,
  config = defaultConfig,
  autoFocus = false,
  autoSelect = false,
  autoReset = false,
  onChange,
  onBlur,
  onFocus,
  onKeyPress
}) => {
  const [maskedValue, setMaskedValue] = useState('0')
  const [cursor, setCursor] = useState(0)

  useEffect(() => {
    const currencyList = {
      ...config.formats.number,
      ...defaultConfig.formats.number
    }

    config = {
      ...defaultConfig,
      ...config,
      formats: {
        number: currencyList
      },
      locale: navigator.language
    }
  }, [navigator.language])

  const inputRef = useCallback(
    (node) => {
      const isActive = node === document.activeElement
      if (node) {
        if (autoFocus && !isActive) {
          node.focus()
        }

        cursor > 0 && node.setSelectionRange(cursor, cursor)
      }
    },
    [autoFocus, value]
  )

  const safeConfig = useMemo(
    () => () => {
      if (!config.formats.number[currency]) throw Error('Missing currency')
      const {
        formats: {
          number: {
            [currency]: { maximumFractionDigits }
          }
        }
      } = config

      const finalConfig = {
        ...defaultConfig,
        ...config
      }

      // at the moment this prevents problems when converting numbers
      // with zeroes in-between, otherwise 205 would convert to 25.
      finalConfig.formats.number[
        currency
      ].minimumFractionDigits = maximumFractionDigits

      return finalConfig
    },
    [defaultConfig, config]
  )

  const clean = (number: any) => {
    if (typeof number === 'number') {
      return number
    }

    // strips everything that is not a number (positive or negative)
    return Number(number.toString().replace(/[^0-9-]/g, ''))
  }

  const normalizeValue = (number: any) => {
    const {
      formats: {
        number: {
          [currency]: { maximumFractionDigits }
        }
      }
    } = safeConfig()
    let safeNumber = number

    if (typeof number === 'string') {
      safeNumber = clean(number)

      if (safeNumber % 1 !== 0) {
        safeNumber = safeNumber.toFixed(maximumFractionDigits)
      }
    } else {
      // all input numbers must be a float point (for the cents portion). This is a fallback in case of integer ones.
      safeNumber = Number.isInteger(number)
        ? Number(number) * 10 ** maximumFractionDigits
        : number.toFixed(maximumFractionDigits)
    }

    // divide it by 10 power the maximum fraction digits.
    return clean(safeNumber) / 10 ** maximumFractionDigits
  }

  const calculateValues = (inputFieldValue: any) => {
    const value = normalizeValue(inputFieldValue)
    const maskedValue = formatCurrency(value, safeConfig(), currency)

    return [value, maskedValue]
  }

  const updateValues = (value: any) => {
    const [calculatedValue, calculatedMaskedValue] = calculateValues(value)

    if (!max || calculatedValue <= max) {
      setMaskedValue(calculatedMaskedValue.toString())

      return [calculatedValue, calculatedMaskedValue]
    } else {
      return [normalizeValue(maskedValue), maskedValue]
    }
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()
    const cursor = event.target.selectionStart
    const [value, maskedValue] = updateValues(event.target.value)

    event.target.value.length <= 5 ? setCursor(-1) : cursor && setCursor(cursor)

    if (maskedValue) {
      onChange && onChange(event, value, maskedValue)
    }
  }

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const [value, maskedValue] = updateValues(event.target.value)

    if (autoReset) {
      calculateValues(0)
    }

    if (maskedValue) {
      onBlur && onBlur(event, value, maskedValue)
    }
  }

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    if (autoSelect) {
      event.target.select()
    }

    const [value, maskedValue] = updateValues(event.target.value)

    if (maskedValue) {
      onFocus && onFocus(event, value, maskedValue)
    }
  }

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) =>
    onKeyPress && onKeyPress(event, event.key, event.keyCode)

  useEffect(() => {
    const currentValue = value || defaultValue || 0
    const [, maskedValue] = calculateValues(currentValue)

    setMaskedValue(maskedValue.toString())
  }, [currency, value, defaultValue, config])

  return (
    <input
      className='react-currency-input'
      ref={inputRef}
      value={maskedValue}
      onChange={handleChange}
      onBlur={handleBlur}
      onFocus={handleFocus}
      onKeyUp={handleKeyUp}
    />
  )
}

export default CurrencyInput
