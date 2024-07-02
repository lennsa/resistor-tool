<script lang="ts">
  import { allSign, numberToPrettyString } from "./formatting";
  import { type Resistor } from "./resistor";

  export let resistors: Array<Resistor>
  export let desiredResistance: number
  export let clickedRow: number = 0

  function clickRow(index) {
    clickedRow = index
  }
</script>

<table class="table">
  <tr>
    <th>Widerstand</th>
    <th>Anzahl einzelner Widerstände</th>
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
  border-spacing:0;
  border-collapse: collapse;
}

td, th {
  text-align: left;
}

tr.resistor {
  cursor: pointer;
}

tr.resistor:hover {
  background-color: #1c1c1c;
}

tr.resistor.selected {
  background-color: #151515;
}

@media (prefers-color-scheme: light) {
  tr.resistor:hover {
    background-color: #eaeaea;
  }

  tr.resistor.selected {
    background-color: #dadada;
  }
}
</style>