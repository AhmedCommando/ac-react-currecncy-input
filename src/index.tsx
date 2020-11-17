import Big from 'big.js'
import React, { useCallback, useMemo, useState, useEffect } from 'react'

export function formatCurrency(
  value: number,
  localeConfig: any,
  currencyName: string
) {
  const numberConfig = localeConfig.formats.number[currencyName]
  const formatter = new global.Intl.NumberFormat(
    localeConfig.locale,
    numberConfig
  )

  return formatter.format(Number(Big(value)))
}

const defaultConfig = {
  locale: 'en-US',
  formats: {
    number: {
      USD: {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }
    }
  }
}
interface ReactCurrencyInputInterface {
  component?: any
  currency?: string
  value: number
  defaultValue?: number
  max?: number
  config?: any
  autoFocus?: boolean
  autoSelect?: boolean
  autoReset?: boolean
  onChange?: (event: any, value: any, maskedValue: any) => void
  onBlur?: (event: any, value: any, maskedValue: any) => void
  onFocus?: (event: any, value: any, maskedValue: any) => void
  onKeyPress?: (event: any, key: any, code: any) => void
}

const ReactCurrencyInput: React.FC<ReactCurrencyInputInterface> = ({
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
  const inputRef = useCallback(
    (node) => {
      const isActive = node === document.activeElement

      if (node && autoFocus && !isActive) {
        node.focus()
      }
    },
    [autoFocus]
  )

  const [maskedValue, setMaskedValue] = useState('0')

  // to prevent a malformed config object
  const safeConfig = useMemo(
    () => () => {
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

  const handleChange = (event: any) => {
    event.preventDefault()

    const [value, maskedValue] = updateValues(event.target.value)

    if (maskedValue) {
      onChange && onChange(event, value, maskedValue)
    }
  }

  const handleBlur = (event: any) => {
    const [value, maskedValue] = updateValues(event.target.value)

    if (autoReset) {
      calculateValues(0)
    }

    if (maskedValue) {
      onBlur && onBlur(event, value, maskedValue)
    }
  }

  const handleFocus = (event: any) => {
    if (autoSelect) {
      event.target.select()
    }

    const [value, maskedValue] = updateValues(event.target.value)

    if (maskedValue) {
      onFocus && onFocus(event, value, maskedValue)
    }
  }

  const handleKeyUp = (event: any) =>
    onKeyPress && onKeyPress(event, event.key, event.keyCode)

  useEffect(() => {
    const currentValue = value || defaultValue || 0
    const [, maskedValue] = calculateValues(currentValue)

    setMaskedValue(maskedValue.toString())
  }, [currency, value, defaultValue, config])

  return (
    <input
      ref={inputRef}
      value={maskedValue}
      onChange={handleChange}
      onBlur={handleBlur}
      onFocus={handleFocus}
      onKeyUp={handleKeyUp}
    />
  )
}

export default ReactCurrencyInput
