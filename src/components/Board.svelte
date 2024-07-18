<script lang="ts">
  import { type CollectionItem, type Resistor } from "../lib/resistor";
  import ResistorElement from "./ResistorElement.svelte";

  export let resistor: Resistor
  export let collection: CollectionItem[]
</script>

<div class="board">
  <ResistorElement resistor={resistor} root={true} collection={collection} />
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
    border-radius: 6px;
  }

  .board::before, .board::after {
    position: absolute;
    content: "";
    width: calc(1em - var(--resistor-border) * 2);
    height: calc(1em - var(--resistor-border) * 2);
    border-radius: 1em;
    border: var(--resistor-border) solid var(--resistor-border-color);
    background-color: var(--input-color);
  }

  .board::before {
    top: 1em;
  }

  .board::after {
    bottom: 1em;
  }
</style>
