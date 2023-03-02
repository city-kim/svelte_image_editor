<script lang="ts">
  import { setCanvasObject, setCanvasText } from '$lib/js/control'
  import type { DrawingOptionType } from '$src/types/canvas'
  import { canvasElement, selectedComponent } from '$src/store/canvas'

  export const isFont: boolean = false
  export let variable: DrawingOptionType
  $:color = {
    stroke: variable.strokeTransparent ? 'transparent' : variable.stroke,
    fill: variable.fillTransparent ? 'transparent' : variable.fill,
  }

</script>
<div class="drawing-options-container">
  <div class="drawing-options-contents">
    <label for="variable.strokeWidth">strokeWidth</label>
    <div>
      <input type="range"
        id="variable.strokeWidth"
        bind:value={variable.strokeWidth}
        on:input={() => setCanvasObject($canvasElement, variable.strokeWidth, color, 'strokeWidth')}
        min="1" max="50" step="0.5"/>
      {variable.strokeWidth}
    </div>
  </div>
  <div class="drawing-options-contents">
    <label for="fillColor">fillColor</label>
    <div>
      {#if !variable.fillTransparent}
        <input type="color"
          id="fillColor"
          bind:value={variable.fill}
          on:input={() => setCanvasObject($canvasElement, variable.strokeWidth, color, 'fill')}
          on:change={() => setCanvasObject($canvasElement, variable.strokeWidth, color, 'fill')}/>
      {/if}
      <label>
        empty
        <input type="checkbox"
          bind:checked={variable.fillTransparent}
          on:change={() => setCanvasObject($canvasElement, variable.strokeWidth, color, 'fill')}/>
      </label>
    </div>
  </div>
  <div class="drawing-options-contents">
    <label for="strokeColor">strokeColor</label>
    <div>
      {#if !variable.strokeTransparent}
        <input type="color"
          id="strokeColor"
          bind:value={variable.stroke}
          on:input={() => setCanvasObject($canvasElement, variable.strokeWidth, color, 'stroke')}
          on:change={() => setCanvasObject($canvasElement, variable.strokeWidth, color, 'stroke')}/>
      {/if}
      <label>
        empty
        <input type="checkbox"
          bind:checked={variable.strokeTransparent}
          on:change={() => setCanvasObject($canvasElement, variable.strokeWidth, color, 'stroke')}/>
      </label>
    </div>
  </div>

  {#if $selectedComponent.name == 'text'}
    <div class="drawing-options-contents">
      <label for="fontSize">fontSize</label>
      <div>
        <input type="range"
          id="fontSize"
          bind:value={variable.fontSize}
          on:input={() => setCanvasText($canvasElement, variable.fontSize ?? 10, variable.isBold ?? false)}
          min="10" max="100" step="0.5"/>
        <span>{variable.fontSize}</span>
      </div>
    </div>
    <div class="drawing-options-contents">
      <label for="isBold">bold</label>
      <div>
        <input type="checkbox"
          id="isBold"
          bind:checked={variable.isBold}
          on:change={() => setCanvasText($canvasElement, variable.fontSize ?? 10, variable.isBold ?? false)}/>
      </div>
    </div>
  {/if}
</div>