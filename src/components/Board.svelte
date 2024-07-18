<script lang="ts">
  import { type Resistor } from "../lib/resistor";
  import ResistorElement from "./ResistorElement.svelte";

  export let resistor: Resistor
</script>

<div class="board">
  <ResistorElement resistor={resistor} />
</div>

<style>
.board {
  padding: 2em;
  background-color: var(--input-color);
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  position: relative;
  border-radius: 8px;
}

.board::before {
  position: absolute;
  content: "";
  width: calc(1em - var(--resistor-border) * 2);
  height: calc(1em - var(--resistor-border) * 2);
  left: calc(50% - 0.5em);
  border-radius: 1em;
  top: 1em;
  border: var(--resistor-border) solid var(--resistor-border-color);
}

.board::after {
  position: absolute;
  content: "";
  width: calc(1em - var(--resistor-border) * 2);
  height: calc(1em - var(--resistor-border) * 2);
  left: calc(50% - 0.5em);
  border-radius: 6px;
  bottom: 1em;
  border: var(--resistor-border) solid var(--resistor-border-color);
}
</style>
