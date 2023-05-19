<script lang="ts">
  import { type Resistor } from "./resistor";

  export let resistor: Resistor
</script>

{#if resistor.subResistors}
  <div class="element {resistor.type}-element">
    {#each resistor.subResistors as subResistor}
      <svelte:self resistor={subResistor}/>
    {/each}
  </div>
{:else}
<div class="resistor-wrapper">
  <div class="resistor">{resistor.value}</div>
</div>
{/if}

<style>
:root {
  --resistor-width: 2em;
  --resistor-height: 4em;
  --resistor-border: 4px;
  --padding: 1em;
}

.resistor {
  width: var(--resistor-width);
  height: var(--resistor-height);
  border: var(--resistor-border) solid black;
  background-color: coral;
}

.resistor-wrapper {
  position: relative;
}

.resistor-wrapper::before {
  position: absolute;
  content: "";
  height: var(--padding);
  top: calc(0em - var(--padding));
  left: calc(var(--resistor-width) / 2 + var(--resistor-border) / 2);
  border-left: var(--resistor-border) solid black;
}

.resistor-wrapper::after {
  position: absolute;
  content: "";
  height: var(--padding);
  bottom: calc(0em - var(--padding));
  left: calc(var(--resistor-width) / 2 + var(--resistor-border) / 2);
  border-left: var(--resistor-border) solid black;
}

.element {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: calc(var(--padding) * 2);
}

.chain-element {
  flex-direction: column;
}

.parallel-element {
  position: relative;
}

.parallel-element::after {
  position: absolute;
  content: "";
  top: calc(0em - var(--padding) - var(--resistor-border) / 2);
  bottom: calc(0em - var(--padding) - var(--resistor-border) / 2);
  left: calc(var(--resistor-width) / 2 + var(--resistor-border) / 2);
  right: calc(var(--resistor-width) / 2 + var(--resistor-border) / 2);
  border-top: var(--resistor-border) solid black;
  border-bottom: var(--resistor-border) solid black;
}
</style>
