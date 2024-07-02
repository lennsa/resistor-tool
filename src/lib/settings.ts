import { loadCollectionFile, loadSettingsFile, saveCollectionFile, saveSettingsFile, type Settings } from "./localStorage";
import type { Resistor } from "./resistor";

export function setSettings(settings: Settings): Settings {
  // TODO: check only modified collections not added or deleted
  // TODO: check only existing collection is selected
  saveSettingsFile(settings)
  return settings
}

export function getSettings(): Settings {
  let settings: Settings = loadSettingsFile()
  if (settings === null) {
    settings = {
      desiredResistance: 100,
      maxComplexity: 4,
      collections: {},
      selectedCollection: null,
    }
    saveSettingsFile(settings)
    console.log("INITIALIZED SETTINGS")
  }
  return settings
}

export function addCollection(settings: Settings, id: string, name: string, resistors: Array<Resistor>): Settings {
  // TODO: check if id is no duplicate in settings
  saveCollectionFile(id, resistors)
  console.log(settings)
  settings.collections[id] = name
  saveSettingsFile(settings)
  return settings
}

export function setCollection(settings: Settings, id: string, resistors: Array<Resistor>): Settings {
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
