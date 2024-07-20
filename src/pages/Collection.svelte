<script lang="ts">
  import { addCollection, getCollection, setCollection, setSettings, type Settings } from '../lib/settings';
  import PrettyInput from '../components/PrettyInput.svelte';
  import Import from '../components/ImportPopUp.svelte';
  import type { CollectionItem } from '../lib/resistor';
  import PrettyOutput from '../components/PrettyOutput.svelte';
  import { onMount } from 'svelte';
  import { metaToText } from '../lib/formatting';

  export let settings: Settings

  export let showCollection: boolean
  export let newCollection: boolean

  let collection: CollectionItem[]
  let id: string
  let name: string
  
  if (newCollection) {
    collection = []
    name = ""
    id = window.crypto.randomUUID()
  } else if (showCollection) {
    if (!settings.selectedCollection) {
      cancelCollection()
    } else {
      let collectionTry = getCollection(settings.selectedCollection)
      if (!collectionTry) {
        cancelCollection()
      } else {
        collection = collectionTry
        name = settings.collections[settings.selectedCollection]
        id = settings.selectedCollection
      }
    }
  } else {
    cancelCollection()
  }

  let importPopUpOpen: boolean = false

  function saveCollection () {
    if (newCollection) {
      if (name === "") name = "Sammlung " + id
      settings = addCollection(settings, id, name, collection)
      settings.selectedCollection = id
    } else {
      settings = setCollection(settings, id, collection)
    }
    settings.collections[id] = name
    settings = setSettings(settings)
    newCollection = false
    showCollection = false
  }

  function cancelCollection() {
    newCollection = false
    showCollection = false
  }

  function addResistor () {
    collection = [...collection, {
      resistor: {
        value: 0,
        complexity: 1,
        type: "resistor",
        subResistors: [],
      },
      meta: {},
      active: true,
    }]
    handleScroll()
  }

  function openImportPopUp() {
    importPopUpOpen = true
  }

  function importCollection(event: CustomEvent<CollectionItem[]>) {
    collection = [...collection, ...event.detail]
    handleScroll()
  }

  function deleteResistor(index: number) {
    collection.splice(index, 1)
    collection = [...collection]
    handleScroll()
  }

  function deleteCollection() {
    if (settings.selectedCollection !== null) {
      delete settings.collections[settings.selectedCollection]
    }
    settings.selectedCollection = null
    settings = setSettings(settings)
    newCollection = false
    showCollection = false
  }

  let scrolledToBottom = false

  function handleScroll() {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement
    scrolledToBottom = scrollTop + clientHeight >= scrollHeight
  }

  onMount(() => {
    handleScroll()
  })
</script>

<svelte:window on:scroll={handleScroll} />

{#if newCollection}
  <h2>Neue Sammlung</h2>
{:else}
  <h2>Sammlung Bearbeiten</h2>
{/if}

<form class="card" on:submit|preventDefault={saveCollection}>
  <label for="name">Name</label>
  <input id="name" required bind:value={name}>

  <label for="name">Widerstände</label>
  <div class="box">
    <table class="table">
      <tr>
        <th>Nr.</th>
        <th>Widerstand Eingabe</th>
        <th>Widerstand in Ω</th>
        <th>Aktiviert</th>
        <th>Löschen</th>
      </tr>
      {#each collection as collectionItem, index}
        <tr class="resistor" title={metaToText(collectionItem.meta)} data-toggle="tooltip">
          <td>{index + 1}</td>
          <td><PrettyInput clazz="w-100 inverted" id="resistor_{index}" required bind:value={collectionItem.resistor.value} /></td>
          <td><span class="ta-c"><PrettyOutput value={collectionItem.resistor.value} /></span></td>
          <td><input id="resistor_active_{index}" type="checkbox" bind:checked={collectionItem.active}></td>
          <td><button type="button" class="secondary w-100" on:click={() => deleteResistor(index)}>Löschen</button></td>
        </tr>
      {/each}
    </table>
    <div class="form-row">
      <div class="form-row-child">
        <button type="button" class="secondary" on:click={addResistor}>Widerstand Hinzufügen</button>
      </div>
      <div class="form-row-child">
        <button type="button" class="secondary" on:click={openImportPopUp}>Widerstände Importieren (CSV)</button>
      </div>
    </div>
  </div>

  <div class="form-row stick" class:bottom={scrolledToBottom}>
    <div class="form-row-child">
      <button type="button" class="secondary" disabled={newCollection} on:click={deleteCollection}>Löschen</button>
    </div>
    <div class="form-row-child">
      <button type="button" class="secondary" on:click={cancelCollection}>Abbrechen</button>
    </div>
    <div class="form-row-child">
      <button type="submit">Speichern</button>
    </div>
  </div>
</form>

<Import bind:importPopUpOpen on:import={importCollection} />

<style>
  table {
    border-collapse: collapse;
  }

  tr {
    border-bottom: 2px solid var(--primary-color);
  }

  th, td {
    padding: 0.4rem 0.6rem;
  }

  th:first-child, td:first-child {
    padding-left: 0;
  }

  th:last-child, td:last-child {
    padding-right: 0;
  }

  .box {
    display: flex;
    flex-direction: column;
    border-radius: 6px;
    padding: 1rem;
    background-color: var(--input-color);
  }
  
  .box > * {
    margin-bottom: .4rem;
  }

  .box > *:last-child {
    margin-bottom: 0;
  }

  .stick {
    position: sticky;
    bottom: 1.8rem;
    box-shadow:
      0 0.5rem 0 1.3rem var(--background-color),
      0 -1rem 0.5rem 0  var(--primary-color);
    background-color: var(--background-color);
  }

  .stick.bottom {
    box-shadow: 0 0.5rem 0 1.3rem var(--background-color);
  }
</style>
