<script lang="ts">
  import { numberToPrettyString, metaToText } from "../lib/formatting";
  import { type CollectionItem, type Resistor } from "../lib/resistor";

  export let resistor: Resistor
  export let root: boolean = false
  export let collection: CollectionItem[]

  let meta: string = getMeta()
  let contentWidth: {[key: number]: number} = {}

  $: console.log(resistor, contentWidth)

  function getMeta(): string {
    if (resistor.type !== "resistor") return ""
    let collectionItem: CollectionItem | undefined = collection.find((collectionItem: CollectionItem) => collectionItem.resistor === resistor)
    if (collectionItem === undefined) return ""
    return metaToText(collectionItem.meta)
  }
</script>

{#if root}
  <div class="chain-element" style:--content-width={contentWidth[0] + "px"}>
    <div bind:clientWidth={contentWidth[0]}>
      <svelte:self resistor={resistor} collection={collection}/>
    </div>
  </div>
{:else}
  {#if resistor.type == "parallel"}
    <div class="parallel-element">
      <div>
        {#each resistor.subResistors as subResistor, i}
          <div class="chain-element" style:--content-width={contentWidth[i] + "px"}>
            <div bind:clientWidth={contentWidth[i]}>
              <svelte:self resistor={subResistor} collection={collection}/>
            </div>
          </div>
        {/each}
      </div>
    </div>
  {:else if resistor.type == "chain"}
    {#each resistor.subResistors as subResistor}
      <svelte:self resistor={subResistor} collection={collection}/>
    {/each}
  {:else}
    <div class="resistor" class:meta={meta} title={meta} data-toggle="tooltip">
      <div class="resistor-text">{numberToPrettyString(resistor.value)}Ω</div>
    </div>
  {/if}
{/if}
<style>
  :root {
    --resistor-width: 1.8em;
    --resistor-height: 4em;
    --resistor-border: 4px;
    --resistor-color: rgb(175, 85, 21);
    --resistor-border-color: black;
    --padding-y: 1em;
    --padding-x: 2em;
    --blob: 0.8em;
    --text-background-color: var(--resistor-border-color);
    --text-color: var(--resistor-color);
  }

  @media (prefers-color-scheme: light) {
    :root {
      --resistor-color: rgb(230, 119, 39);
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
    z-index: 1;
  }

  .meta {
    cursor: help;
  }

  .resistor-text {
    width: fit-content;
    font-weight: bold;
    background-color: var(--text-background-color);
    color: var(--text-color);
    padding: .075em .25em;
  }

  .chain-element {
    position: relative;
    flex-grow: 1;
    width: var(--resistor-width);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .chain-element:not(:first-child) {
    margin-left: calc(var(--content-width) / 2 - var(--resistor-width) / 2 + var(--padding-x) / 2);
  }

  .chain-element:not(:last-child) {
    margin-right: calc(var(--content-width) / 2 - var(--resistor-width) / 2 + var(--padding-x) / 2);
  }

  .chain-element > div {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: var(--padding-y);
    padding: var(--padding-y) 0;
    position: relative;
    height: calc(100% - var(--padding-y) * 2);
    width: fit-content;
  }

  .chain-element > div::before {
    pointer-events: none;
    position: absolute;
    content: "";
    top: calc(0em - var(--resistor-border) / 2);
    bottom: calc(0em - var(--resistor-border) / 2);
    border-left: var(--resistor-border) solid var(--resistor-border-color);
    margin-left: calc(- var(--resistor-border) / 2);
  }

  .chain-element:not(:last-child):not(:first-child)::before {
    pointer-events: none;
    position: absolute;
    content: "";
    top: calc(var(--blob) / -2);
    left: calc(50% - var(--blob) / 2);
    width: calc(var(--blob));
    height: calc(var(--blob));
    border-radius: var(--blob);
    background-color: var(--resistor-border-color);
    z-index: 1;
  }

  .chain-element:not(:last-child):not(:first-child)::after {
    pointer-events: none;
    position: absolute;
    content: "";
    bottom: calc(var(--blob) / -2);
    left: calc(50% - var(--blob) / 2);
    width: calc(var(--blob));
    height: calc(var(--blob));
    border-radius: var(--blob);
    background-color: var(--resistor-border-color);
    z-index: 1;
  }

  .parallel-element {
    position: relative;
  }

  .parallel-element > div {
    display: flex;
    justify-content: center;
    align-items: stretch;
    /* gap: var(--padding-x); */
    position: relative;
  }

  .parallel-element > div::before {
    pointer-events: none;
    position: absolute;
    content: "";
    top: calc(0em - var(--resistor-border) / 2);
    bottom: calc(0em - var(--resistor-border) / 2);
    left: calc(var(--resistor-width) / 2 + var(--resistor-border) / 2);
    right: calc(var(--resistor-width) / 2 + var(--resistor-border) / 2);
    border-top: var(--resistor-border) solid var(--resistor-border-color);
    border-bottom: var(--resistor-border) solid var(--resistor-border-color);
    background-color: var(--input-color);
  }

  .parallel-element::before {
    pointer-events: none;
    position: absolute;
    content: "";
    top: calc(var(--blob) / -2);
    left: calc(50% - var(--blob) / 2);
    width: calc(var(--blob));
    height: calc(var(--blob));
    border-radius: var(--blob);
    background-color: var(--resistor-border-color);
    z-index: 1;
  }

  .parallel-element::after {
    pointer-events: none;
    position: absolute;
    content: "";
    bottom: calc(var(--blob) / -2);
    left: calc(50% - var(--blob) / 2);
    width: calc(var(--blob));
    height: calc(var(--blob));
    border-radius: var(--blob);
    background-color: var(--resistor-border-color);
    z-index: 1;
  }

</style>
