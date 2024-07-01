<script lang="ts">
  import Board from './lib/Board.svelte';
  import Table from './lib/Table.svelte';
  import { type Resistor, generateResistors } from './lib/resistor';

  let desiredResistanceStr: string = "0"
  let desiredResistance: number = 0
  let maxComplexity: number = 3
  let resistors: Array<Resistor> = []
  let search: boolean = false
  
  const calculate = () => {
    // activale search
    search = true

    // get desired resistance
    let mul: number = 1
    if (desiredResistanceStr.indexOf('k') >= 0) {
      mul *= 1000
    } else if (desiredResistanceStr.indexOf('M') >= 0) {
      mul *= 1000000
    }
    desiredResistance = mul * Number(desiredResistanceStr.replace(/[k,M]/g,''))

    // get results
    resistors = []
    generateResistors(resistors, desiredResistance, maxComplexity)
  }

  $: res = resistors

</script>

<main>
  <h1>Resistor-Tool</h1>

  <div class="card">
    <label for="resistor">desired resistance</label>
    <input id="resistor" bind:value={desiredResistanceStr}>
    <label for="complexity">max resistors</label>
    <input id="complexity" type="number" bind:value={maxComplexity}>
    <button on:click={calculate}>
      start
    </button>

    {#if search}
      <p>searching for {desiredResistance}Ω resistor, max resistors: {maxComplexity}</p>
    {/if}
  </div>

  {#if res.length > 0}
    <Board resistor={res[0]} />
    <Table resistors={res} desiredResistance={desiredResistance} />
  {/if}

</main>
