import { loadCollectionFile, loadSettingsFile, saveCollectionFile, saveSettingsFile, type Settings } from "./localStorrge";
import type { Resistor } from "./resistor";

export function setSettings(newSettings: Settings): Settings {
  let settings: Settings = getSettings()
  settings.desiredResistance = newSettings.desiredResistance
  settings.maxComplexity = newSettings.maxComplexity
  // TODO: check only existing collection is selected
  settings.selectedCollection = newSettings.selectedCollection
  saveSettingsFile(settings)
  return settings
}

export function getSettings(): Settings {
  let settings: Settings = loadSettingsFile()
  if (settings === null) {
    settings = {
      desiredResistance: 100,
      maxComplexity: 4,
      collections: [],
      selectedCollection: null,
    }
    saveSettingsFile(settings)
    console.log("INITIALIZED SETTINGS")
  }
  return settings
}

export function addCollection(id: string, name: string, resistors: Array<Resistor>): Settings {
  let settings: Settings = getSettings()
  // TODO: check if id is no duplicate in settings
  saveCollectionFile(id, resistors)
  settings.collections.push({
    id: id,
    name: name,
  })
  saveSettingsFile(settings)
  return settings
}

export function setCollection(id: string, resistors: Array<Resistor>): Settings {
  let settings: Settings = getSettings()
  // TODO: check if collection exists in settings
  saveCollectionFile(id, resistors)
  saveSettingsFile(settings)
  return settings
}

export function getCollection(id: string): Array<Resistor> {
  let collection: Array<Resistor> = loadCollectionFile(id)
  if (collection === null) {
    collection = []
  }
  return collection
}
