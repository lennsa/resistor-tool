import type { Resistor } from "./resistor"

export type Settings = {
  desiredResistance: number
  maxComplexity: number
  collections: Array<{name: string, id: string}>
  selectedCollection: string
}

export function saveSettingsFile(settings: Settings) {
  let json: string = JSON.stringify(settings)
  localStorage.setItem('settings', json)
}

export function loadSettingsFile(): Settings {
  let json: string = localStorage.getItem('settings')
  let settings: Settings = JSON.parse(json)
  return settings
}

export function saveCollectionFile(id: string, resistors: Array<Resistor>) {
  let json: string = JSON.stringify(resistors)
  localStorage.setItem(id, json)
}

export function loadCollectionFile(id: string): Array<Resistor> {
  let json: string = localStorage.getItem(id)
  let resistors: Array<Resistor> = JSON.parse(json)
  return resistors
}
