<script lang="ts">
  import PrettyInput from '../components/PrettyInput.svelte';
  import Board from '../components/Board.svelte'
  import Table from '../components/Table.svelte'
  import { numberToPrettyString } from '../lib/formatting';
  import { ResistanceGenerator, type CollectionItem, type Resistor } from '../lib/resistor'
  import { getCollection, setSettings, type Settings } from '../lib/settings';
  import PrettyOutput from '../components/PrettyOutput.svelte';

  export let settings: Settings
  let collection: CollectionItem[]

  export let showCollection: boolean
  export let newCollection: boolean
  
  let state: "awaitInput" | "searching" | "done" | "paused" = 'awaitInput'
  let resistors: Resistor[] = []
  let nResistors: number = 0
  let showResultIndex: number = 0

  function startSearch () {
    if (settings.desiredResistance === null) return
    if (settings.maxComplexity === null) return
    settings = setSettings(settings)
    let collectionTry: CollectionItem[] | null = getCollection(settings.selectedCollection)
    if (collectionTry === null) return
    collection = collectionTry

    // reset output
    state = "searching"
    resistors = []
    nResistors = 0
    showResultIndex = 0

    // generate results
    let generator = new ResistanceGenerator(collection, settings.desiredResistance, settings.maxComplexity)
    let generating = true
    let interval = setInterval(() => {
      if (state === "paused") {
        return
      } else if (state !== "searching") {
        clearInterval(interval)
        return
      }
      for (let i = 0; i < (100000 / generator.resistors.length + 200); i++) {
        generating = generator.generateStep()
        if (!generating) {
          clearInterval(interval)
          state = "done"
          break
        }
      }
      resistors = generator.resistors.slice(0, 100)
      nResistors = generator.resistors.length
    }, 100)
  }

  function stopSearch() {
    state = "awaitInput"
    resistors = []
    nResistors = 0
    showResultIndex = 0
  }

  function pauseSearch() {
    state = "paused"
  }
  
  function resumeSearch() {
    state = "searching"
  }

  function openEditCollection() {
    stopSearch()
    showCollection = true
    newCollection = false
  }
  
  function openAddCollection() {
    stopSearch()
    showCollection = true
    newCollection = true
  }
</script>

<h2>Suche</h2>

<form class="card" on:submit|preventDefault={startSearch}>
  <label for="collection">Sammlung</label>
  <div class="form-row">
    <div class="form-row-child fg-2">
      <select id="collection" required bind:value={settings.selectedCollection} on:change={stopSearch}>
        {#each Object.entries(settings.collections) as [id, name]}
          <option value={id}>
            {name}
          </option>
        {/each}
      </select>
    </div>
    <div class="form-row-child">
      <button type="button" disabled={settings.selectedCollection === null} on:click={openEditCollection}>Bearbeiten</button>
    </div>
    <div class="form-row-child">
      <button type="button" on:click={openAddCollection}>Neue Sammlung</button>
    </div>
  </div>

  <label for="resistor">Gewünschter Widerstand in Ω</label>
  <div class="form-row">
    <div class="form-row-child fg-3">
      <PrettyInput id="resistor" required bind:value={settings.desiredResistance} on:input={stopSearch} />
    </div>
    <div class="form-row-child">
      <span><PrettyOutput value={settings.desiredResistance} /></span>
    </div>
  </div>

  <label for="complexity">Maximale Anzahl an Widerständen</label>
  <input id="complexity" type="number" required bind:value={settings.maxComplexity} on:input={stopSearch}>

  {#if state === "searching"}
    <button type="button" on:click={pauseSearch}>Pause</button>
  {:else if state === "paused"}
    <button type="button" on:click={resumeSearch}>Resume</button>
  {:else}
    <button type="submit">Start</button>
  {/if}

  {#if state !== "awaitInput"}
    <p>
      Suche nach {numberToPrettyString(settings.desiredResistance)}Ω Schaltung,
      Widerstände in der Sammlung: {collection.length},
      Maximale Anzahl an Widerständen: {settings.maxComplexity}
    </p>
    <p>Überprüfte Kombinationen: {nResistors}</p>
    {#if state === "done"}
      <p>Fertig!</p>
    {:else if state === "paused"}
      <p>Pausiert</p>
    {/if}
  {/if}
</form>

{#if resistors.length > 0}
  <h2>Ergebnisse</h2>
  <div class="card">
    <Board resistor={resistors[showResultIndex]} desiredResistance={settings.desiredResistance} />
  </div>
  <div class="card">
    <Table resistors={resistors} bind:clickedRow={showResultIndex} desiredResistance={settings.desiredResistance} />
  </div>
{/if}

<style>
span {
  border-radius: 8px;
  padding: .5rem .8rem;
  align-content: center;
  text-align: center;
  display: block;
}
</style>
