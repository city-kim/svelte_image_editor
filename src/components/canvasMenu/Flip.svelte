<script lang="ts">
	import { canvasElement } from '$src/store/canvas'
  import { flip } from '$lib/js/flip'
</script>
<div class="drawing-options-container">
  <button type="button" on:click={() => flip($canvasElement, 'x')}>flip x</button>
  <button type="button" on:click={() => flip($canvasElement, 'y')}>flip y</button>
</div>