import { reactive, watch } from 'vue'
import type { AllInputs, PresetName } from '../types/inputs'
import { DEFAULT_INPUTS, PRESETS } from '../constants/defaults'

function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

const STORAGE_KEY = 'rental-calc-inputs'

function loadFromStorage(): AllInputs | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    // ignore
  }
  return null
}

function saveToStorage(inputs: AllInputs) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(inputs))
  } catch {
    // ignore
  }
}

export function useInputs() {
  const saved = loadFromStorage()
  const inputs = reactive<AllInputs>(saved || deepClone(DEFAULT_INPUTS))

  watch(inputs, (val) => {
    saveToStorage(val as AllInputs)
  }, { deep: true })

  function applyPreset(name: PresetName) {
    const preset = PRESETS[name]
    if (!preset) return
    const base = deepClone(DEFAULT_INPUTS)
    // Merge preset over defaults
    for (const key of Object.keys(preset) as (keyof AllInputs)[]) {
      const val = preset[key]
      if (val && typeof val === 'object') {
        Object.assign(base[key] as object, val)
      } else if (val !== undefined) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(base as any)[key] = val
      }
    }
    Object.assign(inputs, base)
  }

  function reset() {
    Object.assign(inputs, deepClone(DEFAULT_INPUTS))
  }

  return {
    inputs,
    applyPreset,
    reset,
  }
}
