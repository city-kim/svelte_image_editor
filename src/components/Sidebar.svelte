<script lang="ts">
import History from '$src/components/sidebar/History.svelte'
import Selector from '$src/components/sidebar/Selector.svelte'
</script>
<div class="editor-canvas-sidebar">
  <History></History>
    <slot/>
  <Selector></Selector>
</div>