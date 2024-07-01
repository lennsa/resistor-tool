<script lang="ts">
  import { type Resistor } from "./resistor";
  import ResistorElement from "./ResistorElement.svelte";
  import Table from "./Table.svelte";

  export let resistor: Resistor
  export let desiredResistance: number
</script>

<div class="wrapper">
  <div class="board">
    <ResistorElement {resistor}/>
  </div>
  <Table resistors={[resistor]} desiredResistance={desiredResistance} />
</div>

<style>
.wrapper {
  margin-bottom: 1.5rem;
}

.board {
  padding: 2em;
  background-color: rgba(128, 128, 128, .2);
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.board::before {
  position: absolute;
  content: "";
  width: calc(1em - var(--resistor-border) * 2);
  height: calc(1em - var(--resistor-border) * 2);
  left: calc(50% - 0.5em);
  border-radius: 1em;
  top: 1em;
  border: var(--resistor-border) solid black;
}

.board::after {
  position: absolute;
  content: "";
  width: calc(1em - var(--resistor-border) * 2);
  height: calc(1em - var(--resistor-border) * 2);
  left: calc(50% - 0.5em);
  border-radius: 1em;
  bottom: 1em;
  border: var(--resistor-border) solid black;
}

</style>