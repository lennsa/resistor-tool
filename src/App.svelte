<script lang="ts">
  import type { Settings } from './lib/localStorage';
  import { getSettings } from './lib/settings';
  import Search from './lib/search.svelte';
  import Collection from './lib/collection.svelte';

  let settings: Settings = getSettings()

  let showCollection: boolean = false
  let newCollection: boolean = false
</script>

<main>
  <h1>Resistor-Tool</h1>

  {#if showCollection}
    <Collection bind:settings={settings} bind:showCollection={showCollection} bind:newCollection={newCollection} /> 
  {:else}
    <Search bind:settings={settings} bind:showCollection={showCollection} bind:newCollection={newCollection} />
  {/if}
</main>
