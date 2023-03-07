<script lang="ts">
  import { canvasElement } from '$src/store/canvas'
  import { selectObject } from '$lib/js/canvas'
  import type { fabric } from 'fabric'

  let data:Array<fabric.Object> = []

  $: {
    if ($canvasElement) {
      data = $canvasElement.getObjects()
    }
  }

  function select (index: number) {
    selectObject($canvasElement, index)
  }
</script>
<article class="editor-canvas-sidebar-control">
  <h2>Selector</h2>
  <ul>
    {#each data as list, index}
      {#if list.type != 'circle' && list.type != 'line' && list.type != 'image'}
        <li>
          <button type="button"
            on:click={() => select(index)}>
            {list.type}
          </button>
        </li>  
      {/if}
    {/each}
  </ul>
</article>