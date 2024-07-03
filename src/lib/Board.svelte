<script lang="ts">
  import { type Resistor } from "./resistor";
  import ResistorElement from "./ResistorElement.svelte";
  import Table from "./Table.svelte";

  export let resistor: Resistor
  export let desiredResistance: number
</script>

<div class="board">
  <ResistorElement resistor={resistor} />
</div>
<Table resistors={[resistor]} desiredResistance={desiredResistance} />

<style>
.board {
  padding: 2em;
  background-color: #1c1c1c;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  position: relative;
  border-radius: 8px;
  margin-bottom: .5rem;
}

@media (prefers-color-scheme: light) {
  .board {
    background-color: #eaeaea;
  }
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