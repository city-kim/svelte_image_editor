<script lang="ts">
  import { onMount } from 'svelte'
  import { setVariable } from '$lib/js/canvas'
  import { updateVariable } from '$lib/js/control'
  import { shapeElement } from '$src/store/canvas'

  import Popper from '$component/Popper.svelte'
  import DrawingOptions from '$component/DrawingOptions.svelte'

  let variable = setVariable()

  $:color = {
    stroke: variable.strokeTransparent ? 'transparent' : variable.stroke,
    fill: variable.fillTransparent ? 'transparent' : variable.fill,
  }
  
  export const setCanvasOption = (e: fabric.IEvent) => {
    // 캔버스의 선택한 대상 옵션으로 업데이트
    variable = updateVariable(e, variable)
  }
  
  onMount(() => {
    return () => $shapeElement.reset()
  })
</script>
<DrawingOptions variable={variable}></DrawingOptions>
<div class="editor-text">

  <div class="editor-icons">
    <Popper contents="텍스트추가">
      <button 
        on:click={() => $shapeElement.addText(variable.strokeWidth, color, variable.fontSize || 10, variable.isBold ?? false)}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
          <path d="M12.258 3h-8.51l-.083 2.46h.479c.26-1.544.758-1.783 2.693-1.845l.424-.013v7.827c0 .663-.144.82-1.3.923v.52h4.082v-.52c-1.162-.103-1.306-.26-1.306-.923V3.602l.431.013c1.934.062 2.434.301 2.693 1.846h.479L12.258 3z"/>
        </svg>
      </button>
    </Popper>
  </div>
</div>