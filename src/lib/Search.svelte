<script lang="ts">
  import Board from './Board.svelte'
  import Table from './Table.svelte'
  import { numberToPrettyString, prettyStringToNumber } from './formatting';
  import type { Settings } from './localStorage';
  import { ResistanceGenerator, type Resistor } from './resistor'
  import { getCollection, setSettings } from './settings';

  export let settings: Settings
  let collection: Array<Resistor>

  export let showCollection: boolean
  export let newCollection: boolean
  
  let state: "awaitInput" | "searching" | "done" | "paused" = 'awaitInput'
  let resistors: Array<Resistor> = []
  let nResistors: number = 0
  let showResultIndex: number = 0

  function startSearch () {
    settings = setSettings(settings)
    collection = getCollection(settings.selectedCollection)

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

<form class="card" onsubmit="return false">
  <label for="collection">Sammlung</label>
  <div class="form-row">
    <div class="form-row-child fg-2">
      <select id="collection" bind:value={settings.selectedCollection} on:change={stopSearch}>
        {#each Object.entries(settings.collections) as [id, name]}
          <option value={id}>
            {name}
          </option>
        {/each}
      </select>
    </div>
    <div class="form-row-child">
      <button disabled={settings.selectedCollection === null} on:click={openEditCollection}>Bearbeiten</button>
    </div>
    <div class="form-row-child">
      <button on:click={openAddCollection}>Neue Sammlung</button>
    </div>
  </div>

  <label for="resistor">Gewünschter Widerstand in Ω</label>
  <div class="form-row">
    <div class="form-row-child fg-3">
      <input id="resistor" bind:value={settings.desiredResistance} on:input={stopSearch}>
    </div>
    <div class="form-row-child">
      <span>{numberToPrettyString(settings.desiredResistance)}Ω</span>
    </div>
  </div>

  <label for="complexity">Maximale Anzahl an Widerständen</label>
  <input id="complexity" type="number" bind:value={settings.maxComplexity} on:input={stopSearch}>

  {#if state === "searching"}
    <button on:click={pauseSearch}>Pause</button>
  {:else if state === "paused"}
    <button on:click={resumeSearch}>Resume</button>
  {:else}
    <button on:click={startSearch}>Start</button>
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
    /* line-height: 1.2rem;
    font-size: 1rem; */
    /* background-color: #1c1c1c; */
    border-radius: 8px;
    padding: .5rem .8rem;
    align-content: center;
    text-align: center;
    display: block;
    /* font-weight: bold; */
  }

  /* @media (prefers-color-scheme: light) {
    span {
      background-color: #eaeaea;
    }
  } */
</style>