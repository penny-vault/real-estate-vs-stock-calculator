export interface ValidationResult {
  valid: boolean
  message?: string
}

export function required(value: number): ValidationResult {
  if (value === null || value === undefined || isNaN(value)) {
    return { valid: false, message: 'This field is required' }
  }
  return { valid: true }
}

export function minValue(min: number) {
  return (value: number): ValidationResult => {
    if (value < min) {
      return { valid: false, message: `Must be at least ${min}` }
    }
    return { valid: true }
  }
}

export function maxValue(max: number) {
  return (value: number): ValidationResult => {
    if (value > max) {
      return { valid: false, message: `Must be at most ${max}` }
    }
    return { valid: true }
  }
}

export function range(min: number, max: number) {
  return (value: number): ValidationResult => {
    if (value < min || value > max) {
      return { valid: false, message: `Must be between ${min} and ${max}` }
    }
    return { valid: true }
  }
}

export function positive(value: number): ValidationResult {
  if (value <= 0) {
    return { valid: false, message: 'Must be positive' }
  }
  return { valid: true }
}

export function nonNegative(value: number): ValidationResult {
  if (value < 0) {
    return { valid: false, message: 'Cannot be negative' }
  }
  return { valid: true }
}
