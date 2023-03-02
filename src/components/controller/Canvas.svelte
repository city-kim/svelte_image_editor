<script lang="ts">
import { onMount } from 'svelte'
import { canvasElement, dragElement } from '$src/store/canvas'
import { Zoom } from '$lib/js/canvas'
import Popper from '$component/Popper.svelte'

function endDragMode (e: KeyboardEvent) {
  if (e.key === 'Escape') {
    // esc 누를시 드래그모드 종료시키기
    if ($dragElement.dragMode) {
      $dragElement.endDrag()
    }
  }
}

onMount(() => {
  document.addEventListener('keydown', endDragMode)
  return () => {
    document.removeEventListener('keydown', endDragMode);
    $dragElement.endDrag()
  }
})

function dragTrigger (boolean: boolean) {
  if (boolean) {
    $dragElement.startDrag()
    // update를 trigger하여 state를 반영함
    dragElement.update(state => state)
  } else {
    $dragElement.endDrag()
    dragElement.update(state => state)
  }
}

</script>
{#if !$dragElement?.dragMode}
  <Popper contents="ZoomIn">
    <button 
      on:click={() => Zoom($canvasElement, {isZoomIn: false})}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11zM13 6.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0z"/>
        <path d="M10.344 11.742c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1 6.538 6.538 0 0 1-1.398 1.4z"/>
        <path fill-rule="evenodd" d="M6.5 3a.5.5 0 0 1 .5.5V6h2.5a.5.5 0 0 1 0 1H7v2.5a.5.5 0 0 1-1 0V7H3.5a.5.5 0 0 1 0-1H6V3.5a.5.5 0 0 1 .5-.5z"/>
      </svg>
    </button>
  </Popper>
  <Popper contents="ZoomOut">
    <button 
      on:click={() => Zoom($canvasElement, {isZoomIn: true})}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11zM13 6.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0z"/>
        <path d="M10.344 11.742c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1 6.538 6.538 0 0 1-1.398 1.4z"/>
        <path fill-rule="evenodd" d="M3 6.5a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5z"/>
      </svg>
    </button>
  </Popper>
  <Popper contents="Move">
    <button 
      on:click={() => dragTrigger(true)}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M7.646.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 1.707V5.5a.5.5 0 0 1-1 0V1.707L6.354 2.854a.5.5 0 1 1-.708-.708l2-2zM8 10a.5.5 0 0 1 .5.5v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 0 1 .708-.708L7.5 14.293V10.5A.5.5 0 0 1 8 10zM.146 8.354a.5.5 0 0 1 0-.708l2-2a.5.5 0 1 1 .708.708L1.707 7.5H5.5a.5.5 0 0 1 0 1H1.707l1.147 1.146a.5.5 0 0 1-.708.708l-2-2zM10 8a.5.5 0 0 1 .5-.5h3.793l-1.147-1.146a.5.5 0 0 1 .708-.708l2 2a.5.5 0 0 1 0 .708l-2 2a.5.5 0 0 1-.708-.708L14.293 8.5H10.5A.5.5 0 0 1 10 8z"/>
      </svg>
    </button>
  </Popper>
{:else}
  <Popper contents="EndMoveMode">
    <button 
      on:click={() => dragTrigger(false)}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
        <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
      </svg>
    </button>
  </Popper>
{/if}