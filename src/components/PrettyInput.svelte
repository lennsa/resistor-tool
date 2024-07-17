<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { numberToPrettyString, prettyStringToNumber } from '../lib/formatting';

  export let clazz: string = ""
  export let id: string
  export let required: boolean = false
  export let value: number | null

  const dispatch = createEventDispatcher()
  let valueString: string = numberToPrettyString(value)
  $: valueString = prettyStringToNumber(valueString) !== value ? numberToPrettyString(value) : valueString

  function handleInput(event: Event) {
    value = prettyStringToNumber(valueString)
    dispatch('input', event, { cancelable: true })
  }
</script>

<input class={clazz} id={id} required={required} bind:value={valueString} on:input={handleInput}>
