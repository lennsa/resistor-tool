<script lang="ts">
  import { numberToPrettyString } from '../lib/formatting';

  export let value: number | null
</script>

{#if value !== null}
  {numberToPrettyString(value)}Ω
{:else}
  Ungültiger Wert!
{/if}
