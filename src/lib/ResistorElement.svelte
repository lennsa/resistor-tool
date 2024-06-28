<script lang="ts">
  import { type Resistor } from "./resistor";

  export let resistor: Resistor
</script>

{#if resistor.type == "parallel"}
  <div class="spacer"/>
  <div class="parallel-element">
    {#each resistor.subResistors as subResistor}
      <svelte:self resistor={subResistor}/>
    {/each}
  </div>
  <div class="spacer"/>
{:else if resistor.type == "chain"}
  <div class="chain-element">
    {#each resistor.subResistors as subResistor}
      <svelte:self resistor={subResistor}/>
    {/each}
  </div>
{:else}
  <div class="chain-element">
    <div class="spacer"/>
    <div class="resistor">{resistor.value}Ω</div>
    <div class="spacer"/>
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
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.chain-element {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  flex-grow: 1;
}

.parallel-element {
  display: flex;
  justify-content: center;
  position: relative;
  align-items: stretch;
  gap: calc(var(--padding) * 2);
}

.parallel-element::after {
  position: absolute;
  content: "";
  top: calc(0em - var(--resistor-border) / 2);
  bottom: calc(0em - var(--resistor-border) / 2);
  left: calc(var(--resistor-width) / 2 + var(--resistor-border) / 2);
  right: calc(var(--resistor-width) / 2 + var(--resistor-border) / 2);
  border-top: var(--resistor-border) solid black;
  border-bottom: var(--resistor-border) solid black;
}

.spacer {
  min-height: var(--padding);
  flex-grow: 1;
  border-left: var(--resistor-border) solid black;
}
</style>
