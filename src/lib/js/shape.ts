import { fabric } from 'fabric'
import { canvasElement } from '$src/store/canvas'
import { history } from '$lib/js/canvas'
import type { CustomCanvas } from '$src/types/canvas'
import type { Color } from '$src/types/canvas'

// 도형
const polygonPointArray = { // shape 폴리곤 배열
  star: [{x: 80, y: 14},{x: 67, y: 52},{x: 27, y: 52},{x: 60, y: 76},{x: 47, y: 114},{x: 80, y: 91},{x: 112, y: 114},{x: 100, y: 76},{x: 132, y: 52},{x: 92, y: 52}]
}

class shape {
  history: history
  canvas: CustomCanvas // 캔버스
  optionGroup: {
    transparentCorners: boolean
    padding: number
  }
  shapeMode = false // 폴리곤모드대상
  shapeTarget: 'rect'|'ellipse'|'triangle'|'star'|null = null
  drawing = false // 그리기중인지
  startX = 0
  startY = 0

  target: fabric.Object|null = null // 그려질 도형 대상

  constructor(canvas: CustomCanvas) {
    this.canvas = canvas
    this.history = new history(this.canvas)
    this.optionGroup = {
      transparentCorners: false,
      padding: 1
    }
  }

  reset () {
    this.shapeMode = false
    this.shapeTarget = null
    this.drawing = false
    this.startX = 0
    this.startY = 0
    if (this.target) {
      // 타겟이 있는경우 모든객체 active 해제
      this.canvas.discardActiveObject()
      // 생성된 객체 selection 설정
      const select = new fabric.ActiveSelection([this.target], {
        canvas: this.canvas,
        cornerSize: this.canvas.cornerSize,
        ...this.optionGroup
      });
      // 생성된 객체 선택
      this.canvas.setActiveObject(select);
      this.canvas.requestRenderAll();
    }
    this.target = null
    this.canvas.selection = true
  }

  drawShape (options: fabric.IEvent<MouseEvent>) {
    // 도형 그리기
    if (this.target) {
      // 시작점 좌표 설정
      this.target.left = this.startX = options.pointer?.x || 0
      this.target.top = this.startY = options.pointer?.y || 0
      this.canvas.add(this.target)
    }
    // 드로잉 켜주기
    this.drawing = true
  }

  updateShape (options: fabric.IEvent<MouseEvent>) {
    if (this.drawing && this.target) {
      const pointer = this.canvas.getPointer(options.e);

      // 마우스 포인터가 시작점보다 작으면 object 위치보정
      if(this.startX > pointer.x) {
        this.target.set({ left: Math.abs(pointer.x) });
      }
      if(this.startY > pointer.y) {
        this.target.set({ top: Math.abs(pointer.y) });
      }

      const width = Math.abs(this.startX - pointer.x)
      const height = Math.abs(this.startY - pointer.y)
      if (this.shapeTarget == 'rect' || this.shapeTarget == 'triangle') {
        // 사각형이나 삼각형인경우
        this.target.set({
          width: Math.abs(width),
          height: Math.abs(height)
        });
      }
      if (this.shapeTarget == 'ellipse') {
        // 원인경우
        const ellipse = this.target as fabric.Ellipse
        ellipse.set('rx', Math.abs((width) / 2))
        ellipse.set('ry', Math.abs((height) / 2))
      }

      if (this.shapeTarget == 'star') {
        // 커스텀 도형인경우 scale로 조정
        const scaleX = (pointer.x - this.startX) / (this.target.width ?? 1)
        const scaleY = (pointer.y - this.startY) / (this.target.height ?? 1)
        this.target.set({
          scaleX: Math.abs(scaleX),
          scaleY: Math.abs(scaleY),
        });
      }
    }
    this.canvas.requestRenderAll()
  }
  
  setRect (strokeWidth: number, color: Color) {
    // 사각형 준비
    this.shapeMode = true
    this.canvas.selection = false
    this.shapeTarget = 'rect'
    this.target = new fabric.Rect({
      strokeWidth: strokeWidth,
      stroke: color.stroke,
      fill: color.fill,
      ...this.optionGroup,
      cornerSize: this.canvas.cornerSize
    })
  }

  setCircle (strokeWidth: number, color: Color) {
    // 원 준비
    this.shapeMode = true
    this.canvas.selection = false
    this.shapeTarget = 'ellipse'
    this.target = new fabric.Ellipse({
      strokeWidth: strokeWidth,
      stroke: color.stroke,
      fill: color.fill,
      ...this.optionGroup,
      cornerSize: this.canvas.cornerSize
    })
  }

  setTriangle (strokeWidth: number, color: Color) {
    // 삼각형 준비
    this.shapeMode = true
    this.canvas.selection = false
    this.shapeTarget = 'triangle'
    this.target = new fabric.Triangle({
      strokeWidth: strokeWidth,
      stroke: color.stroke,
      fill: color.fill,
      angle: 0,
      ...this.optionGroup,
      cornerSize: this.canvas.cornerSize
    })
  }

  setStar (strokeWidth: number, color: Color) {
    // 별 준비
    this.shapeMode = true
    this.canvas.selection = false
    this.shapeTarget = 'star'
    this.target = new fabric.Polygon(polygonPointArray.star, {
      strokeWidth: strokeWidth,
      stroke: color.stroke,
      fill: color.fill,
      ...this.optionGroup,
      cornerSize: this.canvas.cornerSize
    })
  }

  addText (strokeWidth: number, color: Color, fontSize: number, isBold: boolean) {
    this.canvas.add(new fabric.IText('Doble Click Edit text', {
      fontFamily: 'Spoqa Han Sans Neo',
      fontSize: this.canvas.width ? this.canvas.width / 10 : fontSize,
      fontWeight: isBold ? 'bold' : '',
      strokeWidth: strokeWidth,
      stroke: color.stroke,
      fill: color.fill,
      ...this.optionGroup,
      cornerSize: this.canvas.cornerSize
    }))
    this.history.saveData('add_text')
    canvasElement.update(state => state)
  }
}

export {
  shape
}