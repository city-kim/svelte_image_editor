import { fabric } from 'fabric'
import { resizeElement } from '$src/store/canvas'
import { history, canvasMaxWidth, canvasResize } from '$lib/js/canvas'
import type { CustomCanvas } from '$src/types/canvas'

class resize {
  canvas: CustomCanvas // 캔버스
  resizeMode = false // resize모드 설정
  baseSize: {
    width: number
    height: number
  }
  newSize: {
    width: number
    height: number
  }
  
  constructor(canvas: CustomCanvas) {
    this.canvas = canvas
    this.baseSize = {
      width: canvas.imageSize.width || 0,
      height: canvas.imageSize.height || 0
    }
    this.newSize = {
      width: this.baseSize.width,
      height: this.baseSize.height,
    }
  }

  reset () {
    // 리셋하기
    this.baseSize = { // 베이스는 이미지사이즈로 한다
      width: this.canvas.imageSize.width,
      height: this.canvas.imageSize.height,
    }

    if (this.baseSize.width != this.newSize.width || this.baseSize.height != this.newSize.height) {
      // 값이 다르다면 동일하게 맞추고 wrap도 재설정해준다
      this.newSize = {
        width: this.baseSize.width,
        height: this.baseSize.height,
      }
      this.resizeImage(this.baseSize.width, this.baseSize.height)
    }
    resizeElement.update(state => state)
  }

  resizeImage (w: number, h:number) {
    // 리사이즈 시도중인경우
    if (!this.baseSize.width || !this.baseSize.height) {
      this.baseSize = {
        width: w,
        height: h
      }
    }
    
    let width = 0
    let height = 0
    if ((w >= 1280 || h >= 720)) {
      // 둘중 하나가 1280 720보다 높은경우
      if (w > h) {
        // 가로가 더 넓은경우
        width = 1280
        height = h / (w / 1280)
        if (height > 720) {
          // 보정후 높이값이 커지면 역보정
            height = 720
            width = w / (h / 720)
        }
      } else {
        // 세로가 더 넓은경우
        width = w / (h / 720)
        height = 720
        if (width > 1280) {
          // 보정후 넓이값이 너무 커지면 역보정
          width = 1280
          height = h / (w / 1280)
        }
      }
    } else {
      width = w
      height = h
    }
    this.newSize = {
      width: w,
      height: h,
    }
    canvasMaxWidth(width, height)
  }

  updateImageSize () {
    // 이미지 리사이즈 확정하기
    const image = this.canvas.getObjects().find(x => x.type == 'image')

    if (image) {
      image.set({
        scaleX: this.newSize.width/this.baseSize.width,
        scaleY: this.newSize.height/this.baseSize.height,
      })
      this.canvas.clear()
      const cropped = new Image();
      cropped.src = image.toDataURL({})
      cropped.onload = () => {
          const newimage = new fabric.Image(cropped);
          this.canvas.add(newimage);
          newimage.set({
            // 이미지 잠그기
            hasBorders: false,
            hasControls: false,
            selectable: false,
            hoverCursor: 'default'
          })
          newimage.setCoords();
          if (newimage.width && newimage.height) {
            this.baseSize = {
              width: newimage.width,
              height: newimage.height
            }
            canvasResize(this.canvas, newimage.width, newimage.height)
          }
          this.canvas.requestRenderAll()
          new history(this.canvas).saveData('resize')
          resizeElement.update(state => state)
      }
    }
  }

}

export {
  resize
}