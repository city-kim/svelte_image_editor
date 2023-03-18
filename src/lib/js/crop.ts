import { fabric } from 'fabric'
import { objectLock } from '$lib/js/control'
import { canvasResize } from '$lib/js/canvas'
import { history } from '$lib/js/canvas'
import type { LeaveComponent, CustomCanvas } from '$src/types/canvas'

class crop {
  canvas: CustomCanvas // 캔버스
  cropMode = false // crop모드 설정
  strokeWidth = 1
  stroke = 'rgb(255, 255, 255)'
  fill = 'rgb(255, 255, 255, 0.5)'

  drawing = false // 그리기중인지
  startX = 0
  startY = 0

  target: fabric.Object|null = null // crop대상

  visibleOption = { // crop select 옵션
    ml: false,
    mb: false,
    mr: false,
    mt: false,
    mtr: false,
  }
  cropType = ''

  scale = {
    x: 1,
    y: 1
  }
  
  constructor(canvas: CustomCanvas) {
    this.canvas = canvas
  }

  reset ({isLeave}: LeaveComponent) {
    if (isLeave) {
      this.cropMode = false
    }
    objectLock(this.canvas, {isLock: false})
    if (this.target) this.canvas.remove(this.target)
    this.canvas.viewportTransform = [1, 0, 0, 1, 0, 1]
  }

  drawCrop (options: fabric.IEvent<MouseEvent>) {
    // crop 그리기
    if (options.target?.type != 'crop') {
      // 클릭 대상이 crop이 아닌경우만 active객체 모두 선택해제후 다시그리기
      this.canvas.discardActiveObject()
      const pointer = this.canvas.getPointer(options.e)
      if (this.target) {
        // 이미 존재한다면 삭제하기
        this.canvas.remove(this.target)
      }
      // 박스 새로생성
      this.target = new fabric.Rect({
        type: 'crop',
        strokeWidth: this.strokeWidth,
        stroke: this.stroke,
        fill: this.fill,
        cornerSize: this.canvas.cornerSize,
        transparentCorners: false,
        hoverCursor: 'move'
      })
      this.target.setControlsVisibility(this.visibleOption)
      this.canvas.add(this.target)
      if (this.target) {
        // 시작점 좌표 설정
        this.target.left = this.startX = pointer.x || 0
        this.target.top = this.startY = pointer.y || 0
      }
      // 드로잉 켜주기
      this.canvas.requestRenderAll()
      this.drawing = true 
    }
  }

  endDrawing () {
    if (this.target) {
      this.canvas.setActiveObject(this.target)
      this.target.set({
        strokeWidth: this.strokeWidth,
        stroke: this.stroke,
        fill: this.fill,
      })
      this.canvas.requestRenderAll()
    }
    if (this.drawing) {
      this.cropType = ''
      this.drawing = false
    }
  }

  updateCrop (options: fabric.IEvent<MouseEvent>) {
    // 크롭 업데이트
    if (this.target && this.canvas.width && this.canvas.height) {
      if (this.drawing) {
        // 직접그리기
        const pointer = this.canvas.getPointer(options.e)
  
        // 마우스 포인터가 시작점보다 작으면 object 위치보정
        const left = Math.max(0, pointer.x)
        const top = Math.max(0, pointer.y)
        if(this.startX > pointer.x) {
          this.target.set({ left: left })
        } else {
          this.target.set({ left: this.startX })
        }
        if(this.startY > pointer.y) {
          this.target.set({ top: top })
        } else {
          this.target.set({ top: this.startY })
        }
  
        const width = Math.abs(this.startX - left)
        const height = Math.abs(this.startY - top)
        
        this.target.set({
          width: pointer.x > this.canvas.width ? this.canvas.width - this.startX : width,
          height: pointer.y > this.canvas.height ? this.canvas.height - this.startY : height,
        })
      } else {
        // 그리기가 아닌경우
        if (this.target.width && this.target.height && this.target.left && this.target.top && this.target.scaleX && this.target.scaleY) {
          // 포인터가 있는경우 최대값 설정
          this.target.set({
            left: Math.min(Math.max(this.target.left, 0), this.canvas.width - this.target.width * this.target.scaleX),
            top: Math.min(Math.max(this.target.top, 0), this.canvas.height - this.target.height * this.target.scaleY),
          })
          this.target.setCoords()
        }
      }
    }
    this.canvas.requestRenderAll()
  }

  updateCropScale () {
    if (this.target) {
      if (this.canvas.width && this.canvas.height &&
        this.target.width && this.target.height &&
        typeof this.target.left == 'number' && typeof this.target.top == 'number' &&
        this.target.scaleX && this.target.scaleY)
      {
        if (this.cropType) {
          // 세팅된경우
          // 크기는 음수이동이 안되게 제한
          this.target.set({
            left: Math.max(this.target.left, 0),
            top: Math.max(this.target.top, 0),
          })
          // 최대값은 sacle 배율로 정한다
          const max = {
            x: (this.canvas.width - this.target.left) / this.target.width,
            y: (this.canvas.height - this.target.top) / this.target.height,
          }
          // 가로세로 비율이 동일하게 지정
          const ratio = Math.min(Math.min(this.target.scaleX, max.x), Math.min(this.target.scaleY, max.y))
          this.target.set({
            scaleX: ratio,
            scaleY: ratio,
          })
        } else {
          // free drawing인경우 크기제한
          const scale = {
            x: this.target.left < 0 ? 1 : this.target.scaleX,
            y: this.target.top < 0 ? 1 : this.target.scaleY,
          }
          const max = {
            x: Math.min((this.canvas.width - Math.max(0, this.target.left)) / this.target.width, scale.x),
            y: Math.min((this.canvas.height - Math.max(0, this.target.top)) / this.target.height, scale.y),
          }
          this.target.set({
            width: this.target.width * max.x,
            height: this.target.height * max.y,
            scaleX: 1,
            scaleY: 1,
            stroke: undefined,
            fill: undefined,
          })
        }
      }
    }
    this.canvas.requestRenderAll()
  }

  setCrop (x:number, y:number) {
    // 비율로 직접그리기
    this.reset({isLeave: false})
    objectLock(this.canvas, {isLock: true})

    if (this.canvas.width && this.canvas.height) {
      
      // 적은값을 기준으로 잡는다 나눌때는 높은값을 기준으로 잡는다
      const reference = (this.canvas.width > this.canvas.height ? this.canvas.height : this.canvas.width) / (x > y ? x : y)

      const ratio = {
        x: (reference * x) / 2,
        y: (reference * y) / 2,
      }
      
      const rect = new fabric.Rect({
        width: ratio.x,
        height: ratio.y,
        strokeWidth: this.strokeWidth,
        stroke: this.stroke,
        fill: this.fill,
        cornerSize: this.canvas.cornerSize
      })

      const stroke = {strokeWidth: this.strokeWidth, stroke: this.stroke}

      // 배율만큼 나눠준다
      const w = ratio.x / x
      const h = ratio.y / y
      
      const column: Array<fabric.Line> = []
      const row: Array<fabric.Line> = []

      for (let i=1; i<x; i++) column.push(new fabric.Line([w*i, 0, w*i, h*y], {...stroke}))
      for (let i=1; i<y; i++) row.push(new fabric.Line([0, h*i, w*x, h*i], {...stroke}))

      const group = new fabric.Group([rect, ...column, ...row], {
        type: 'crop',
        transparentCorners: false,
        cornerSize: this.canvas.cornerSize,
      })
      this.target = group
      group.setControlsVisibility(this.visibleOption)
      this.canvas.add(group)
      // 생성된 객체 선택
      this.canvas.setActiveObject(group)
    }
    this.cropType = 'set'

    this.canvas.requestRenderAll()
  }

  cropImage () {
    // 실행
    let image: fabric.Object | undefined;
    image = this.canvas.getObjects().find(x => x.type == 'image')
    if (image) {
      if (this.target && this.target.width && this.target.height) {
        this.canvas.clear()
        const cropped = new Image()
        cropped.src = image.toDataURL({
          top: this.target.top,
          left: this.target.left,
          width: this.target.width * (this.target.scaleX || 1),
          height: this.target.height * (this.target.scaleY || 1),
        })
        cropped.onload = () => {
            const newimage = new fabric.Image(cropped)
            this.canvas.add(newimage)
            newimage.set({
              // 이미지 잠그기
              hasBorders: false,
              hasControls: false,
              selectable: false,
              hoverCursor: 'default'
            })
            newimage.setCoords()
            if (newimage.width && newimage.height) canvasResize(this.canvas, newimage.width, newimage.height)
            this.canvas.requestRenderAll()
        };
        this.target = null
      }
      this.canvas.requestRenderAll()
      new history(this.canvas).saveData('crop')
    }
  }
}

export {
  crop
}