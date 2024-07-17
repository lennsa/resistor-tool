<script lang="ts">
  import { getSettings, type Settings } from './lib/settings';
  import Search from './pages/Search.svelte';
  import Collection from './pages/Collection.svelte';

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
