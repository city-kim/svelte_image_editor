<script lang="ts">
  import { onMount } from 'svelte'
  import { setVariable } from '$lib/js/canvas'
  import { shapeElement } from '$src/store/canvas'
  import { updateVariable } from '$lib/js/control'

  import type { fabric } from 'fabric'

  import Popper from '$component/Popper.svelte'
  import DrawingOptions from '$component/DrawingOptions.svelte'
  
  export const setCanvasOption = (e: fabric.IEvent) => {
    // 캔버스의 선택한 대상 옵션으로 업데이트
    variable = updateVariable(e, variable)
  }

  let variable = setVariable() // 드로잉 옵션

  onMount(() => {
    return () => $shapeElement.reset()
  })
  
</script>
<DrawingOptions variable={variable}></DrawingOptions>
<div class="editor-icons">
  <Popper contents="사각형">
    <button 
      on:click={() => $shapeElement.setRect(variable.strokeWidth, {stroke: variable.stroke, fill: variable.fill})}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
        <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
      </svg>
    </button>
  </Popper>
  <Popper contents="삼각형">
    <button 
      on:click={() => $shapeElement.setTriangle(variable.strokeWidth, {stroke: variable.stroke, fill: variable.fill})}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
        <path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017.163.163 0 0 1-.054-.06.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z"/>
      </svg>
    </button>
  </Popper>
  <Popper contents="원">
    <button 
      on:click={() => $shapeElement.setCircle(variable.strokeWidth, {stroke: variable.stroke, fill: variable.fill})}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
      </svg>
    </button>
  </Popper>
  <Popper contents="별">
    <button 
      on:click={() => $shapeElement.setStar(variable.strokeWidth, {stroke: variable.stroke, fill: variable.fill})}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
        <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"/>
      </svg>
    </button>
  </Popper>
</div>