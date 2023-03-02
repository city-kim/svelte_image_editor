<script lang="ts">
  import { createPopperActions } from 'svelte-popperjs';

  export let contents = ''
  const [popperRef, popperContent] = createPopperActions({
    placement: 'top',
    strategy: 'fixed',
  });

  const extraOpts = {
    modifiers: [
      { name: 'offset', options: { offset: [0, 8] } }
    ],
  };

  let showTooltip = false;
</script>

<div class="popper-wrap"
use:popperRef
on:mouseenter={() => showTooltip = true}
on:mouseleave={() => showTooltip = false}>
  <slot />
  {#if showTooltip}
    <div class="popper"
      use:popperContent={extraOpts}>
      <div/>
      {contents}
    </div>
  {/if}
</div>