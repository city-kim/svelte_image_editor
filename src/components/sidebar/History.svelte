<script lang="ts">
  import { canvasElement } from '$src/store/canvas'
  import { historyStore } from '$src/store/canvas'
  import { history } from '$lib/js/canvas'
  $:data = $historyStore ? $historyStore : []

</script>
<article class="editor-canvas-sidebar-control">
  <h2>History</h2>
  <ul>
    {#each data as list, index}
      <li class:active={list.active}>
        <button type="button"
          on:click={() => new history($canvasElement).change({index: index})}>
          {list.name}
        </button>
      </li>  
    {/each}
  </ul>
</article>