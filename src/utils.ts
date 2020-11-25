import Big from 'big.js'

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

export interface ConfigInterface {
  locale: string
  formats: {
    number: {
      [currency: string]: {
        style: string
        currency: string
        minimumFractionDigits: number
        maximumFractionDigits: number
      }
    }
  }
}

export const defaultConfig: ConfigInterface = {
  locale: 'en-US',
  formats: {
    number: {
      EUR: {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      },
      USD: {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      },
      HUF: {
        style: 'currency',
        currency: 'HUF',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      },
      CAD: {
        style: 'currency',
        currency: 'CAD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      },
      CNY: {
        style: 'currency',
        currency: 'CNY',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      },
      JPY: {
        style: 'currency',
        currency: 'JPY',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      },
      TND: {
        style: 'currency',
        currency: 'TND',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }
    }
  }
}
