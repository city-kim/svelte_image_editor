import { fabric } from 'fabric'
import { objectLock } from '$lib/js/control'
import type { CustomCanvas } from '$src/types/canvas'
import type { Color } from '$src/types/canvas'

class draw {
  // 그리기모드
  canvas: CustomCanvas // 캔버스
  color: Color = { // 기본 색상(폴리곤 그리기용)
    stroke: '#000000',
    fill: '#ffffff',
  }

  strokeWidth = 1 // 선굵기
  min = 99 // 랜덤 최소값
  max = 999999 // 랜덤 최대값
  polygonMode = false // 폴리곤모드여부
  pointArray = new Array() // 포인트의 배열
  lineArray = new Array() // 선의 배열
  activeLine:null | fabric.Line = null // active된 선
  activeShape:null | fabric.Polygon = null // active된 면

  constructor(canvas: CustomCanvas) {
    this.canvas = canvas
  }
  
  reset () {
    this.polygonMode = false
    objectLock(this.canvas, {isLock: false})
    this.endDrawing()
  }

  setPolygonMod () {
    // 폴리곤 모드 시작
    this.polygonMode = true
    objectLock(this.canvas, {isLock: true})
  }

  addPoint(options: fabric.IEvent<MouseEvent>) {
    // 포인트 추가하기
    const random = Math.floor(Math.random() * (this.max - this.min + 1)) + this.min // 랜덤값을 부여하여 name이 중복되지 않게함
    const name = (new Date().getTime() + random).toString()
    let pointer = this.canvas.getPointer(options.e)
    let circle = new fabric.Circle({
      radius: 5,
      fill: this.color.fill,
      stroke: this.color.stroke,
      strokeWidth: 0.5,
      left: (pointer.x / this.canvas.getZoom()),
      top: (pointer.y / this.canvas.getZoom()),
      selectable: false,
      hasBorders: false,
      hasControls: false,
      originX:'center',
      originY:'center',
      name: name
    })
    if(this.pointArray.length == 0){
      circle.set({
        fill:'red'
      })
    }
    let points = [
      (pointer.x / this.canvas.getZoom()),
      (pointer.y / this.canvas.getZoom()),
      (pointer.x / this.canvas.getZoom()),
      (pointer.y / this.canvas.getZoom())
    ]
    let line = new fabric.Line(points, {
      strokeWidth: 2,
      fill: '#999999',
      stroke: '#999999',
      originX:'center',
      originY:'center',
      selectable: false,
      hasBorders: false,
      hasControls: false,
      evented: false
    })
    if(this.activeShape) {
      // active된 선이 있을경우
      const pos = this.canvas.getPointer(options.e)
      let activePoints = this.activeShape.get('points')
      if (activePoints) {
        // 미리보기 면을 만들어준다
        activePoints.push({x: pos.x, y: pos.y} as fabric.Point)
        let polygon = new fabric.Polygon(activePoints,{
          stroke: this.color.stroke,
          strokeWidth: this.strokeWidth,
          fill: this.color.fill,
          opacity: 0.3,
          selectable: false,
          hasBorders: false,
          hasControls: false,
          evented: false,
          objectCaching:false,
        })
        this.canvas.remove(this.activeShape)
        this.canvas.add(polygon)
        this.activeShape = polygon
        this.canvas.requestRenderAll()
      }
    }
    else{
      // 없을경우 포인트값을 찾아서 만들어준다
      let pointer = this.canvas.getPointer(options.e)
      let polyPoint = [{x:(pointer.x/this.canvas.getZoom()), y:(pointer.y/this.canvas.getZoom())}]
      let polygon = new fabric.Polygon(polyPoint,{
        stroke: this.color.stroke,
        strokeWidth: this.strokeWidth,
        fill: this.color.fill,
        opacity: 0.3,
        selectable: false,
        hasBorders: false,
        hasControls: false,
        evented: false
      })
      this.activeShape = polygon
      this.canvas.add(polygon)
    }
    this.activeLine = line

    this.pointArray.push(circle)
    this.lineArray.push(line)

    this.canvas.add(line)
    this.canvas.add(circle)
    this.canvas.selection = false
  }

  generatePolygon(color: Color) {
    // 폴리곤 생성하기
    let points = new Array()

    // 사용된 포인트는 모두 지운다
    for (let i in this.pointArray) {
      let point = this.pointArray[i]
      points.push({
        x:point.left,
        y:point.top
      })
    }

    // 라인도 모두 지움
    for (let i in this.lineArray) {
      let line = this.lineArray[i]
      this.canvas.remove(line)
    }

    if (this.activeShape && this.activeLine) {
      let polygon = new fabric.Polygon(points,{
          stroke: color.stroke,
          strokeWidth: this.strokeWidth,
          fill: color.fill,
      })
      this.canvas.add(polygon)
    }
    
    // 사용된 포인트는 모두 지운다
    for (let i in this.pointArray) {
      let point = this.pointArray[i]
      this.canvas.remove(point)
    }

    // 라인도 모두 지움
    for (let i in this.lineArray) {
      let line = this.lineArray[i]
      this.canvas.remove(line)
    }
    
    if (this.activeShape && this.activeLine) {
      this.canvas.remove(this.activeShape).remove(this.activeLine)
    }
    
    this.pointArray = []
    this.lineArray = []
    this.activeLine = null
    this.activeShape = null
    this.polygonMode = false
    this.canvas.selection = true
    objectLock(this.canvas, {isLock: false})
  }
  
  startDrawing (strokeWidth: number, stroke: string) {
    // 그리기모드 시작
    this.canvas.isDrawingMode = true
    this.canvas.freeDrawingBrush.color = stroke
    this.canvas.freeDrawingBrush.width = strokeWidth
  }

  endDrawing () {
    // 그리기모드 종료
    this.canvas.isDrawingMode = false
  }
  
}

export {
  draw,
}