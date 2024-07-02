<script lang="ts">
  import Board from './lib/Board.svelte'
  import Table from './lib/Table.svelte'
  import { numberToPrettyString, prettyStringToNumber } from './lib/formatting';
  import type { Settings } from './lib/localStorrge';
  import { ResistanceGenerator, type Resistor } from './lib/resistor'
  import { getCollection, getSettings, setSettings } from './lib/settings';

  let settings: Settings = getSettings()
  let desiredResistanceStr: string = numberToPrettyString(settings.desiredResistance)
  let collection: Array<Resistor>

  let state: "awaitInput" | "generating" | "done" | "paused" = 'awaitInput'
  let resistors: Array<Resistor> = []
  let nResistors: number = 0
  let showResultIndex: number = 0

  function startSearch () {
    settings.desiredResistance = prettyStringToNumber(desiredResistanceStr)
    desiredResistanceStr = numberToPrettyString(settings.desiredResistance)
    settings = setSettings(settings)
    collection = getCollection(settings.selectedCollection)
    
    // reset output
    state = "generating"
    resistors = []
    nResistors = 0
    showResultIndex = 0

    // generate results
    let generator = new ResistanceGenerator(getCollection(settings.selectedCollection), settings.desiredResistance, settings.maxComplexity)
    let generating = true
    let interval = setInterval(() => {
      if (state === "paused") {
        return
      } else if (state !== "generating") {
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
    state = "generating"
  }

  function openEditCollection() {
    
  }

  function openAddCollection() {
    
  }
</script>

<main>
  <h1>Resistor-Tool</h1>

  <form class="card" onsubmit="return false">
    <label for="resistor">Gewünschter Widerstand in Ω</label>
    <input id="resistor" bind:value={desiredResistanceStr} on:input={stopSearch}>

    <label for="complexity">Maximale Anzahl Widerstände</label>
    <input id="complexity" type="number" bind:value={settings.maxComplexity} on:input={stopSearch}>

    <label for="collection">Sammlung</label>
    <select id="collection" value={settings.selectedCollection} on:change={stopSearch}>
      {#each settings.collections as collection}
        <option value={collection.id}>
          {collection.name}
        </option>
      {/each}
    </select>
    <div class="form-row">
      <button disabled={settings.selectedCollection === null} on:click={openEditCollection}>Sammlung Bearbeiten</button>
      <button on:click={openAddCollection}>Sammlung Hinzufügen</button>
    </div>

    {#if state === "generating"}
      <button on:click={pauseSearch}>Pause</button>
    {:else if state === "paused"}
      <button on:click={resumeSearch}>Resume</button>
    {:else}
      <button on:click={startSearch}>Start</button>
    {/if}
  </form>

  {#if state !== "awaitInput"}
    <p>
      Suche nach {desiredResistanceStr}Ω Schaltung,
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

  {#if resistors.length > 0}
    <div class="card">
    <Board resistor={resistors[showResultIndex]} desiredResistance={settings.desiredResistance} />
    </div>
    <div class="card">
      <Table resistors={resistors} bind:clickedRow={showResultIndex} desiredResistance={settings.desiredResistance} />
    </div>
  {/if}

</main>
