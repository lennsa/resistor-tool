<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { numberToPrettyString, prettyStringToNumber } from '../lib/formatting';

  export let clazz: string = ""
  export let id: string
  export let value: number

  const dispatch = createEventDispatcher();
  $: valueString = numberToPrettyString(value)

  function handleInput(event: Event) {
    let test = prettyStringToNumber(valueString)
    if (!isNaN(test)) value = test
    dispatch('input', event, { cancelable: true })
  }
</script>

<input class={clazz} id={id} bind:value={valueString} on:input={handleInput}>
