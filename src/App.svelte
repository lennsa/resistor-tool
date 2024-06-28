<script lang="ts">
  import Board from './lib/Board.svelte';
  import { type Resistor, generateResistors } from './lib/resistor';

  let ohmStr: string = ""
  let desiredResistance: number = 0
  let maxComplexity: number = 3
  let resistors: Array<Resistor> = []
  let search: boolean = false
  
  const calculate = () => {
    // activale search
    search = true

    // get desired resistance
    let mul: number = 1
    if (ohmStr.indexOf('k') >= 0) {
      mul *= 1000
    } else if (ohmStr.indexOf('M') >= 0) {
      mul *= 1000000
    }
    desiredResistance = mul * Number(ohmStr.replace(/[k,M]/g,''))

    // get results
    resistors = generateResistors(maxComplexity)
  }

</script>

<main>
  <h1>Resistor-Tool</h1>

  <div class="card">
    <label for="resistor">desired resistance</label>
    <input id="resistor" bind:value={ohmStr}>
    <label for="complexity">max resistors</label>
    <input id="complexity" type="number" bind:value={maxComplexity}>
    <button on:click={calculate}>
      start
    </button>

    {#if search}
      <p>searching for {desiredResistance}Ω resistor, max resistors: {maxComplexity}</p>
    {/if}
  </div>

  {#if resistors.length}
     <Board resistor={resistors[0]}/>
  {/if}

  {#each resistors as resistor}
     <Board resistor={resistor}/>
  {/each}
</main>
