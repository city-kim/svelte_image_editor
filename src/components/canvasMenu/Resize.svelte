<script lang="ts">
	import { onMount } from 'svelte'
  import { resizeElement } from '$src/store/canvas'

  let width: number = 0
  let height: number = 0
  let resetData = false

  $: if(width && !resetData) {
    $resizeElement.resizeImage(width, height)
  }
  $: if (height && !resetData) {
    $resizeElement.resizeImage(width, height)
  }
  
  $: max = { // 최대값은 베이스 사이즈로
    x: $resizeElement.baseSize.width,
    y: $resizeElement.baseSize.height
  }

  onMount(() => { // 마운트시 사이즈 세팅
    $resizeElement.reset()
    width = $resizeElement.newSize.width
    height = $resizeElement.newSize.height
    return () => { 
      $resizeElement.reset()
    }
  })

  function reset () {
    resetData = true
    console.log('?')
    $resizeElement.reset()
    console.log('!')
    resetData = false
  }

</script>
<div class="drawing-options-container">
  <div class="drawing-options-contents">
    <label for="width">width</label>
    <div>
      <input type="range"
        id="width"
        bind:value={width}
        on:input={() => width}
        min="50" max="{max.x}" step="1"/>
      {width}
    </div>
  </div>
  <div class="drawing-options-contents">
    <label for="height">height</label>
    <div>
      <input type="range"
        id="height"
        bind:value={height}
        on:input={() => height}
        min="50" max="{max.y}" step="1"/>
      {height}
    </div>
  </div>
</div>

<div class="drawing-options-container">
  <button type="button" on:click={() => $resizeElement.updateImageSize()}>apply</button>
  <button type="button" on:click={() => reset()}>cancel</button>
</div>


