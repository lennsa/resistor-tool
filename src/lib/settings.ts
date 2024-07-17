import type { CollectionItem, Resistor } from "./resistor";

export type Settings = {
  desiredResistance: number
  maxComplexity: number
  collections: {[key: string]: string}
  selectedCollection: string | null
}

function saveSettingsFile(settings: Settings) {
  let json: string = JSON.stringify(settings)
  localStorage.setItem('settings', json)
}

function loadSettingsFile(): Settings | null {
  let json: string | null = localStorage.getItem('settings')
  if (!json) return null
  return JSON.parse(json) as Settings
}

function saveCollectionFile(id: string, collection: CollectionItem[]) {
  let json: string = JSON.stringify(collection)
  localStorage.setItem(id, json)
}

function loadCollectionFile(id: string): CollectionItem[] | null {
  let json: string | null = localStorage.getItem(id)
  if (!json) return null
  return JSON.parse(json) as CollectionItem[]
}

export function setSettings(settings: Settings): Settings {
  // TODO: check only modified collections not added or deleted
  // TODO: check only existing collection is selected
  saveSettingsFile(settings)
  return settings
}

export function getSettings(): Settings {
  let settings: Settings | null = loadSettingsFile()
  if (settings === null) {
    settings = {
      desiredResistance: 100,
      maxComplexity: 4,
      collections: {},
      selectedCollection: null,
    }
    saveSettingsFile(settings)
  }
  return settings
}

export function addCollection(settings: Settings, id: string, name: string, collection: CollectionItem[]): Settings {
  // TODO: check if id is no duplicate in settings
  saveCollectionFile(id, collection)
  settings.collections[id] = name
  saveSettingsFile(settings)
  return settings
}

export function setCollection(settings: Settings, id: string, collection: CollectionItem[]): Settings {
  // TODO: check if collection exists in settings
  saveCollectionFile(id, collection)
  saveSettingsFile(settings)
  return settings
}

export function getCollection(id: string | null): CollectionItem[] | null {
  if (!id) return null
  let collection: CollectionItem[] | null = loadCollectionFile(id)
  return collection
}
