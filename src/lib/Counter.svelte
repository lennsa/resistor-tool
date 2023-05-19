<script lang="ts">
  let ohmstr: string = ""
  let ohm: number = 0
  const calculate = () => {
    let mul: number = 1
    if (ohmstr.indexOf('k') >= 0) {
      mul *= 1000
    } else if (ohmstr.indexOf('M') >= 0) {
      mul *= 1000000
    }
    ohm = mul * Number(ohmstr.replace(/[k,M]/g,''))
  }
</script>

<input bind:value={ohmstr}>
<button on:click={calculate}>
  ohm is {ohm}
</button>
