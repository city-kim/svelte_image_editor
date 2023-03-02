<script lang="ts">
  import { onMount } from 'svelte'
  import { setVariable } from '$lib/js/canvas'
  import { updateVariable } from '$lib/js/control'
  import { canvasElement, drawingElement } from '$src/store/canvas'

  import type{ fabric } from 'fabric'

  import Popper from '$component/Popper.svelte'
  import DrawingOptions from '$component/DrawingOptions.svelte'

  export const setCanvasOption = (e: fabric.IEvent) => {
    // 캔버스의 선택한 대상 옵션으로 업데이트
    variable = updateVariable(e, variable)
  }

  export function mouseDown (options: fabric.IEvent<MouseEvent>) {
    // 캔버스에서 클릭시
    if(options.target && options.target.name && options.target.name == $drawingElement.pointArray[0].name) {
      // 대상이 있다면 폴리곤 생성
      $drawingElement.generatePolygon({stroke: variable.stroke, fill: variable.fill})
    }

    if($drawingElement.polygonMode) {
      // 폴리곤 모드일경우 가이드 포인트 생성
      $drawingElement.addPoint(options);
    }
  }

  export function mouseMove (options: fabric.IEvent<MouseEvent>) {
    // 마우스 이동시
    if($drawingElement.activeLine){
      // 활성화중인 선이 있다면 마우스를 추적하는 선 그리기
      const pointer = $canvasElement.getPointer(options.e);
      $drawingElement.activeLine.set({ x2: pointer.x, y2: pointer.y });
    }
    $canvasElement.renderAll();
  }

  let drawingMode: boolean | undefined = false // 그리기모드 여부

  function togglePencil (boolean: boolean) {
    // 연필모드 토글해주기
    if (boolean) {
      $drawingElement.startDrawing(variable.strokeWidth, variable.stroke)
    } else {
      $drawingElement.endDrawing()
    }
    drawingMode = boolean
  }

  function endDrawingMode (e: KeyboardEvent) {
    if (e.key === 'Escape') {
      // esc 누를시 선이나 펜모드 종료시키기
      if ($drawingElement.polygonMode) {
        $drawingElement.generatePolygon({stroke: variable.stroke, fill: variable.fill})
      } else if ($canvasElement.isDrawingMode) {
        $drawingElement.endDrawing()
      }
    }
  }

  onMount(() => {
    document.addEventListener('keydown', endDrawingMode)
    return () => {
      document.removeEventListener('keydown', endDrawingMode);
      $drawingElement.reset()
      $drawingElement.generatePolygon({stroke: variable.stroke, fill: variable.fill})
    }
  })
  
  let variable = setVariable() // 그리기옵션

</script>
<DrawingOptions variable={variable}></DrawingOptions>
<div class="editor-icons">
  {#if !drawingMode}
    <Popper contents="펜그리기">
      <button 
        on:click={() => togglePencil(true)}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
          <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
          <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
        </svg>
      </button>
    </Popper>

    <Popper contents="선그리기">
      <button 
        on:click={() => $drawingElement.setPolygonMod()}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M13.854 2.146a.5.5 0 0 1 0 .708l-11 11a.5.5 0 0 1-.708-.708l11-11a.5.5 0 0 1 .708 0Z"/>
        </svg>
      </button>
    </Popper>
  {/if}

  {#if drawingMode}
    <Popper contents="펜그리기종료">
      <button 
        on:click={() => togglePencil(false)}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
          <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
          <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
        </svg>
      </button>
    </Popper>
  {/if}
</div>