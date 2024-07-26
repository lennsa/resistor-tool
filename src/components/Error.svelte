<script lang="ts">
  export let message: string
  export let popup: boolean = false

  function close(): void {
    message = ""
  }
</script>

{#if message}
  {#if popup}
    <div class="wrapper">
      <div class="error popup">
        <p>{message}</p>
        <button on:click={close}>OK</button>
      </div>
    </div>
  {:else}
    <div class="error">
      <p>{message}</p>
    </div>
  {/if}
{/if}

<style>
  .error {
    border: 4px solid var(--red);
    padding: 2rem;
    border-radius: 1rem;
  }

  .wrapper {
    z-index: 1;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.2);
  }

  .popup {
    background-color: var(--background-color);
    margin: 5rem auto;
    width: fit-content;
  }
</style>
