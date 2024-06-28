<script lang="ts">
  import { type Resistor } from "./resistor";
  import ResistorElement from "./ResistorElement.svelte";

  export let resistors: Array<Resistor>
</script>

<table class="table">
  <<ResistorElement {resistor}/>>
</table>

<style>
.board {
  padding: 2em;
  background-color: blueviolet;
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