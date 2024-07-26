<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { type CollectionItem, type ResistorMeta } from "../lib/resistor.js";
  import { prettyStringToNumber } from "../lib/formatting.js";
  import { parse } from "../lib/parser.js";

  export let importPopUpOpen: boolean

  const dispatch = createEventDispatcher();

  let files: FileList
  let delimiter: string
  let quote: string
  let hasHeader: boolean
  let column: string | null
  
  let text: string
  let metaList: ResistorMeta[]
  let header: string[]

  function updateFile() {
    if (files.length !== 1) return
    files[0].text().then((data: string) => {
      text = data
      read()
    })
  }

  function updateDelimiter() {
    read()
  }

  function updateQuote() {
    read()
  }

  function updateHasHeader() {
    read()
  }

  function read() {
    column = null;
    [header, metaList] = parse(text, delimiter, quote, hasHeader)
  }

  function importCollection() {
    if (!column) return
    let collection: CollectionItem[] = []
    for (const meta of metaList) {
      let value =  prettyStringToNumber(meta[column])
      if (value === null) continue
      collection.push({
        resistor: {
          value: value,
          complexity: 1,
          type: "resistor",
          subResistors: [],
        },
        meta: meta,
        active: true,
      })
    }
    dispatch('import', collection, { cancelable: true })
    reset()
  }

  function closeImportPopUp() {
    reset()
  }

  function reset() {
    importPopUpOpen = false

    // TODO: clear files

    delimiter = ","
    quote = '"'
    hasHeader = true
    column = null
  
    text = ""
    metaList = []
    header = []
  }

  reset()
</script>

{#if importPopUpOpen}
  <div class="wrapper">
    <div class="popup">
      
      <h2>Widerstände Importieren (txt/csv)</h2>

      <form class="card" on:submit|preventDefault={importCollection}>
        <label for="file">File</label>
        <input type="file" id="files" required bind:files on:change={updateFile} />

        <label for="delimiter">Trennzeichen</label>
        <select id="delimiter" required bind:value={delimiter} on:change={updateDelimiter}>
          <option value=",">,</option>
          <option value="|">|</option>
          <option value=";">;</option>
          <option value=":">:</option>
          <option value=".">.</option>
          <option value="/">/</option>
          <option value="\t">TAB</option>
        </select>

        <label for="quote">Anführungszeichen</label>
        <select id="quote" required bind:value={quote} on:change={updateQuote}>
          <option value='"'>"</option>
          <option value="'">'</option>
        </select>

        <label for="headers">Hat die Datei eine Kopfzeile?</label>
        <span><input type="checkbox" id="headers" bind:checked={hasHeader} on:change={updateHasHeader} />Kopfzeile</span>

        <label for="column">Spalte in der der Widerstand Wert steht</label>
        <select id="column" required bind:value={column}>
          {#each header as column}
            <option value={column}>
              {column}
            </option>
          {/each}
        </select>

        <div class="form-row">
          <div class="form-row-child">
            <button type="button" class="secondary" on:click={closeImportPopUp}>Abbrechen</button>
          </div>
          <div class="form-row-child">
            <button type="submit">Importieren</button>
          </div>
        </div>
      </form>

    </div>
  </div>
{/if}

<style>
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
    margin: 5rem auto;
    width: fit-content;
    background-color: var(--background-color);
    padding: 2rem;
    border-radius: 1rem;
  }
</style>
