<script lang="ts">
  import Board from './lib/Board.svelte'
  import Table from './lib/Table.svelte'
  import { numberToPrettyString, prettyStringToNumber } from './lib/formatting';
  import { ResistanceGenerator, initialResistors, type Resistor } from './lib/resistor'

  let desiredResistanceStr: string = "100"
  let desiredResistance: number = 100
  let maxComplexity: number = 3

  let state: "awaitInput" | "generating" | "done" | "paused" = 'awaitInput'
  let resistors: Array<Resistor> = []
  let nResistors: number = 0
  let showResultIndex: number = 0

  function startSearch () {
    desiredResistance = prettyStringToNumber(desiredResistanceStr)
    desiredResistanceStr = numberToPrettyString(desiredResistance)
    
    // reset output
    state = "generating"
    resistors = []
    nResistors = 0
    showResultIndex = 0

    // generate results
    let generator = new ResistanceGenerator(initialResistors, desiredResistance, maxComplexity)
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
</script>

<main>
  <h1>Resistor-Tool</h1>

  <div class="card">
    <label for="resistor">desired resistance</label>
    <input id="resistor" bind:value={desiredResistanceStr} on:input={stopSearch}>
    <label for="complexity">max resistors</label>
    <input id="complexity" type="number" bind:value={maxComplexity} on:input={stopSearch}>
    {#if state === "generating"}
      <button on:click={pauseSearch}>pause</button>
    {:else if state === "paused"}
      <button on:click={resumeSearch}>resume</button>
    {:else}
      <button on:click={startSearch}>start</button>
    {/if}

    {#if state !== "awaitInput"}
      <p>searching for {desiredResistanceStr}Ω resistor, max resistors: {maxComplexity}</p>
      <p>checked: {nResistors}</p>
      {#if state === "done"}
        <p>Done!</p>
      {:else if state === "paused"}
        <p>paused</p>
      {/if}
    {/if}
  </div>

  {#if resistors.length > 0}
    <Board resistor={resistors[showResultIndex]} desiredResistance={desiredResistance} />
    <Table resistors={resistors} bind:clickedRow={showResultIndex} desiredResistance={desiredResistance} />
  {/if}

</main>
