<script lang="ts">
  import { onMount } from 'svelte'
	import { cropElement } from '$src/store/canvas'
  onMount(() => {
    $cropElement.cropMode = true

    return () => { $cropElement.reset({isLeave: true}) }
  })
  // $canvasElement.setWidth(width);
  // $canvasElement.setHeight(height);
</script>
<div class="drawing-options-container">
  <!-- <button type="button" on:click={() => $cropElement.setCrop()}>custom</button> -->
  <button type="button" on:click={() => $cropElement.setCrop(1, 1)}>1:1</button>
  <button type="button" on:click={() => $cropElement.setCrop(3, 2)}>3:2</button>
  <button type="button" on:click={() => $cropElement.setCrop(4, 3)}>4:3</button>
  <button type="button" on:click={() => $cropElement.setCrop(5, 4)}>5:4</button>
  <button type="button" on:click={() => $cropElement.setCrop(7, 5)}>7:5</button>
  <button type="button" on:click={() => $cropElement.setCrop(16, 9)}>16:9</button>
</div>
<div class="drawing-options-container">
  <!-- <button type="button" on:click={() => $cropElement.setCrop()}>custom</button> -->
  <button type="button" on:click={() => $cropElement.cropImage()}>apply</button>
  <button type="button" on:click={() => $cropElement.reset({isLeave: false})}>cancel</button>
</div>
