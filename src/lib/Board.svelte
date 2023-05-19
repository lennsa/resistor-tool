<script lang="ts">
  import { type Resistor } from "./resistor";
  import ResistorElement from "./ResistorElement.svelte";

  export let resistor: Resistor
</script>

<div class="board">
  <ResistorElement {resistor}/>
</div>

<style>
.board {
  padding: calc(2em + var(--padding)) 2em;
  background-color: blueviolet;
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