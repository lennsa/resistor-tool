<script lang="ts">
  import { type Resistor } from "./resistor";

  export let resistors: Array<Resistor>
  export let desiredResistance: number

  function precision(n: number) {
    return (n<0?"":(n===0?"±":"+")) + n.toPrecision(4)
  }
</script>

<table class="table">
  <tr>
    <th>resistance</th>
    <th>n resistors</th>
    <th>delta in Ω</th>
    <th>delta in %</th>
  </tr>
  {#each resistors as resistor}
    <tr>
      <td>{resistor.value.toPrecision(4)}Ω</td>
      <td>{resistor.complexity}</td>
      <td>{precision(resistor.value - desiredResistance)}Ω</td>
      <td>{precision((resistor.value - desiredResistance) / desiredResistance * 100)}%</td>
    </tr>
  {/each}
</table>

<style>
table {
  width: 100%;
}
td, th {
  text-align: left;
}
</style>