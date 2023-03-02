import type { CustomCanvas } from '$src/types/canvas'

function flip (canvas: CustomCanvas, type: 'x'|'y') {
  canvas.forEachObject((o) => {
    if (type == 'x') {
      if (canvas.width && typeof o.left == 'number' && o.width) {
        // 전체넓이 - 오른쪽여백 - object넓이 = 오른쪽 공백
        o.set({
          flipX: !o.flipX,
          left: canvas.width - o.left - o.width,
        })
      }
    } else {
      if (canvas.height && typeof o.top == 'number' && o.height) {
        // 전체높이 - 위쪽여백 - object 높이 = 위쪽 공백
        o.set({
          flipY: !o.flipY,
          top: canvas.height - o.top - o.height,
        })
      }
    }
    o.setCoords()
  })
  canvas.requestRenderAll()
}

export {
  flip
}
