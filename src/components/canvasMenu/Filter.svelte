<script lang="ts">
import { filterElement } from '$src/store/canvas'

let Blend = {
  mode: '',
  color: '#00FFFF',
  alpha: 0.5,
}

$: if ($filterElement) {
  Blend = $filterElement.Blend
}

</script>
<div class="drawing-options-container">
  {#if $filterElement}
    <div class="drawing-options-contents">
      {#each $filterElement.Colormatrix as list}
        <div>
          <label for="{list.name}">{list.name}</label>
          <input id="{list.name}"
            type="checkbox"
            bind:checked={list.checked}
            on:change={() => $filterElement.setFilter(list)}/>
        </div>
      {/each}
    </div>
    
    <div class="drawing-options-contents">
      {#each $filterElement.imageControl as list}
        <div>
          <label>
            {list.name}
            <input type="checkbox"
              bind:checked={list.checked}
              on:change={() => $filterElement.setFilter(list)}/>
          </label>
          {#if list.checked}
            <div>
              <input type="range"
                id="Brightness"
                bind:value={list.value}
                on:input={() => $filterElement.updateFilter(list)}
                min="{list.min}" max="{list.max}" step="{list.step}"/>
            </div>
          {/if}
        </div>
      {/each}
    </div>

    <div class="drawing-options-contents">
      <div>
        <label for="BlendMode"></label>
        <select id="BlendMode" bind:value={Blend.mode}
          on:change={() => $filterElement.changeBlandMode(Blend)}>
          <option value="">None</option>
          {#each $filterElement.blendMode as list}
            <option value="{list}">{list.toUpperCase()}</option>
          {/each}
        </select>
      </div>
      <div>
        <label for="Color">Color</label>
        <input type="color"
          id="Color"
          bind:value={Blend.color}
          on:input={() => $filterElement.changeBlandMode(Blend)}/>
      </div>
      <div>
        <label for="Alpha">Alpha</label>
        <input type="range"
          id="Alpha"
          bind:value={Blend.alpha}
          on:input={() => $filterElement.changeBlandMode(Blend)}
          min="0" max="1" step="0.1"/>
      </div>
    </div>
  {/if}
</div>