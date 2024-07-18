<script lang="ts">
  import { allSign, numberToPrettyString } from "../lib/formatting";
  import { type Resistor } from "../lib/resistor";

  export let resistors: Resistor[]
  export let desiredResistance: number
  export let clickedRow: number = 0

  function clickRow(index) {
    clickedRow = index
  }
</script>

<table class="table">
  <tr>
    <th>Widerstand</th>
    <th>Anzahl Widerstände</th>
    <th>Abweichung in Ω</th>
    <th>Abweichung in %</th>
  </tr>
  {#each resistors as resistor, index}
    <tr
      on:click={() => clickRow(index)}
      class="resistor"
      class:selected={index===clickedRow}
    >
      <td>{numberToPrettyString(resistor.value, false, 3)}Ω</td>
      <td>{resistor.complexity}</td>
      <td>{numberToPrettyString(resistor.value - desiredResistance, true, 3)}Ω</td>
      <td>{allSign((resistor.value - desiredResistance) / desiredResistance * 100, 2)}%</td>
    </tr>
  {/each}
</table>

<style>
table {
  width: 100%;
  border-spacing: 0;
  border-collapse: collapse;
}

td, th {
  text-align: left;
}

tr.resistor {
  cursor: pointer;
}

tr.resistor:hover {
  background-color: var(--input-color);
}

tr.resistor.selected {
  background-color: var(--primary-color);
}
</style>
