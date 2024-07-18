<script lang="ts">
  import { numberToPrettyString } from "../lib/formatting";
  import { type Resistor } from "../lib/resistor";

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
    <div class="resistor"><div class="resistor-text">{numberToPrettyString(resistor.value)}Ω</div></div>
    <div class="spacer"/>
  </div>
{/if}

<style>
:root {
  --resistor-width: 1.8em;
  --resistor-height: 4em;
  --resistor-border: 4px;
  --resistor-color: rgb(175, 85, 21);
  --resistor-border-color: black;
  --padding: 1em;
  --text-background-color: rgba(0, 0, 0, .8);
  --text-color: var(--resistor-color);
}

@media (prefers-color-scheme: light) {
  :root {
    --text-background-color: rgba(255, 255, 255, .95);
    --text-color: rgb(141, 62, 5);
  }
}

* {
  box-sizing: content-box;
}

.resistor {
  width: var(--resistor-width);
  height: var(--resistor-height);
  border: var(--resistor-border) solid var(--resistor-border-color);
  background-color: var(--resistor-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.resistor-text {
  width: fit-content;
  background-color: var(--text-background-color);
  color: var(--text-color);
  padding: .075em .25em;
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
  border-top: var(--resistor-border) solid var(--resistor-border-color);
  border-bottom: var(--resistor-border) solid var(--resistor-border-color);
}

.spacer {
  min-height: var(--padding);
  flex-grow: 1;
  border-left: var(--resistor-border) solid var(--resistor-border-color);
}
</style>
