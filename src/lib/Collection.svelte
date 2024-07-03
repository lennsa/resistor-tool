<script lang="ts">
  import type { Settings } from './localStorage';
  import { addCollection, getCollection, setCollection, setSettings } from './settings';
  import type { Resistor } from './resistor';
  import { numberToPrettyString } from './formatting';

  export let showCollection: boolean
  export let newCollection: boolean

  export let settings: Settings
  let collection: Array<Resistor> = newCollection ? [] : getCollection(settings.selectedCollection)
  let name = newCollection ? "" : settings.collections[settings.selectedCollection]

  function saveCollection () {
    if (newCollection) {
      if (name === "") name = "Sammlung " + settings.collections.length
      let id: string = window.crypto.randomUUID()
      settings = addCollection(settings, id, name, collection)
      settings.selectedCollection = id
    } else {
      settings = setCollection(settings, settings.selectedCollection, collection)
    }
    settings.collections[settings.selectedCollection] = name
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
      value: 0,
      complexity: 1,
      type: "resistor",
      subResistors: [],
    }]
  }

  function deleteResistor(index: number) {
    collection.splice(index, 1)
    collection = [...collection]
  }

  function deleteCollection() {
    delete settings.collections[settings.selectedCollection]
    settings.selectedCollection = null
    settings = setSettings(settings)
    newCollection = false
    showCollection = false
  }
</script>

{#if newCollection}
  <h2>Neue Sammlung</h2>
{:else}
  <h2>Sammlung Bearbeiten</h2>
{/if}

<form class="card" onsubmit="return false">
  <label for="name">Name</label>
  <input id="name" bind:value={name}>

  <label for="name">Widerstände</label>
  <table class="table">
    <tr>
      <th>Nr.</th>
      <th>Widerstand Eingabe</th>
      <th>Widerstand in Ω</th>
      <th>Löschen</th>
    </tr>
    {#each collection as resistor, index}
      <tr class="resistor">
        <td>{index + 1}</td>
        <td><input class="w-100" id="resistor_{index}" type="number" bind:value={resistor.value}></td>
        <td><span class="ta-c">{numberToPrettyString(resistor.value, false, 3)}Ω</span></td>
        <td><button class="w-100" on:click={() => deleteResistor(index)}>Löschen</button></td>
      </tr>
    {/each}
  </table>
  <button on:click={addResistor}>Widerstand Hinzufügen</button>

  <div class="form-row">
    <div class="form-row-child">
      <button disabled={newCollection} on:click={deleteCollection}>Löschen</button>
    </div>
    <div class="form-row-child">
      <button on:click={cancelCollection}>Abbrechen</button>
    </div>
    <div class="form-row-child">
      <button on:click={saveCollection}>Speichern</button>
    </div>
  </div>
</form>

<style>
  table {
    border-collapse: separate;
    border-spacing: 1rem 0;
    margin-left: -1rem;
    margin-right: -1rem;
  }
</style>