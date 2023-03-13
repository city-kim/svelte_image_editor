import { fabric } from 'fabric'
import { objectLock } from '$lib/js/control'
import { canvasElement, historyStore } from '$src/store/canvas'
import type { CustomCanvas, DrawingOptionType, ZoomOptions, HistoryItem, HistoryList } from '$src/types/canvas'

// 캔버스 전체적인 세팅에 대한 변경을 담당
class drag {
  // 드래그 모드
  canvas: CustomCanvas // 캔버스
  dragMode = false // 드래그모드 여부
  isDragging = false // 드래그중인가?
  clientX = 0
  clientY = 0

  constructor(canvas: CustomCanvas) {
    this.canvas = canvas
  }
  startDrag () {
    // 드래그 시작
    objectLock(this.canvas, {isLock: true})
    this.canvas.defaultCursor = 'move'
    this.canvas.selection = false
    this.dragMode = true
  }

  endDrag () {
    // 드래그 종료
    if (this.dragMode) {
      objectLock(this.canvas, {isLock: false})
    }
    this.canvas.defaultCursor = 'default'
    this.canvas.selection = true
    this.dragMode = false
    // viewport를 리셋해준다
    this.canvas.viewportTransform = [1, 0, 0, 1, 0, 1]
  }

  setPosition (options: fabric.IEvent<MouseEvent>) {
    this.isDragging = true
    // 마지막 위치를 저장
    this.clientX = options.e.clientX
    this.clientY = options.e.clientY
  }

  dragging (options: fabric.IEvent<MouseEvent>) {
    if (this.isDragging && options) {
      // 모든 객체 선택종료
      this.canvas.selection = false

      // 이동할 거리
      let moveX = 0
      let moveY = 0
      // 현재 이벤트 위치에서 마지막 거리를 차감
      if (this.clientX) moveX = options.e.clientX - this.clientX
      if (this.clientY) moveY = options.e.clientY - this.clientY
      
      // 마지막 위치 다시저장
      this.clientX = options.e.clientX
      this.clientY = options.e.clientY
      // 이동할 포인트 지정
      let delta = new fabric.Point(moveX, moveY)
      // viewpoint 포인트만큼 옮겨주기
      this.canvas.relativePan(delta)
    }
  }
}

class history {
  canvas: CustomCanvas // 캔버스

  constructor (canvas: CustomCanvas) {
    this.canvas = canvas
  }

  reset () {
    // history 초기화한다
    historyStore.set([])
  }

  saveData (name: string) {
    // 세이브 추가 active된 index 찾기
    let history: HistoryList | undefined
    const unsubscribe = historyStore.subscribe(x => history = x)
    if (history) {
      const index = history.findIndex(x => x.active)
      if (typeof index == 'number' && index > -1) {
        // active된 값이 있다면 slice 후 그 뒤에 저장
        historyStore.update(list => {
          list[index].active = false
          list = list.slice(0, index + 1)
          return list
        })
      }
      historyStore.update(list => {
        list.push({
          name: name,
          data: this.canvas.toDatalessJSON(),
          active: true,
        })
        return list
      })
    }
    unsubscribe()
  }

  change ({index, type}: {index?: number, type?: 'undo'|'redo'}) {
    if (index != undefined || type) {
      let history: HistoryList | undefined
      const unsubscribe = historyStore.subscribe(x => history = x)
      if (history && history.length > 0) {
        let result: HistoryItem | undefined;
        const from = history.find(x => x.active)
        if (index != undefined) {
          // index값이 있다면 해당값으로 변경
          historyStore.update(list => {
            // 모든값 active 제거
            list.map(x => {
              if (x.active) {
                x.active = false
              }
              return x
            })
            // 해당 값을 active 시켜주기
            list[index].active = true
            result = list[index]
            return list
          })
        } else {
          // 없다면 active 각각 undo redo 해주기
          const active = history.findIndex(x => x.active)
          const i = type == 'undo' ? active - 1 : active + 1
          
          historyStore.update(list => {
            if (list[i]) {
              // 값이 존재하는 경우만 실행
              list[active].active = false
              list[i].active = true
              result = list[i]
            }
            return list
          })
        }
  
        if (result) {
          // 성공시 canvas를 재 랜더링한다
          this.canvas.loadFromJSON(result.data, () => {
            const object = this.canvas.getObjects().find(x => x.type == 'image')
            if (object) {
              object.set({ hasBorders: false, hasControls: false, selectable: false, hoverCursor: 'default' })
              this.canvas.requestRenderAll()
            }
            if (from?.name == 'resize' || from?.name == 'crop') {
              // 리사이즈 혹은 crop인경우 캔버스 사이즈 재조정
              const image = this.canvas.getObjects().find(x => x.type == 'image')
              if (image && image.width && image.height) canvasResize(this.canvas, image.width, image.height)
            }
            canvasElement.update(state => state)
          })
        }
      }
      unsubscribe()
    }
  }
}

async function loadImage(canvas: CustomCanvas, image: File) {
  const event = await fileLoad(image)
  const imgObj = new Image()
  if (event.target?.result && typeof event.target?.result == 'string') {
    imgObj.src = event.target.result
  }

  imgObj.onload = async () => {
    // 이미지가 정상적으로 로드되었다면 초기화
    canvas.clear()
    canvas.imagePath = image.name

    const img = new fabric.Image(imgObj)
    if (img.width && img.height) {
      // 캔버스 container의 크기가 너무 크지않게 조정(내부 이미지 사이즈는 원본유지하기위함)
      canvasResize(canvas, img.width, img.height)
    }

    canvas.centerObject(img)
    canvas.add(img);

    const object = canvas.getObjects().find(x => x.type == 'image')
    // 이 시점에 히스토리 초기화
    new history(canvas).reset()
    if (object) {
      object.set({ hasBorders: false, hasControls: false, selectable: false, hoverCursor: 'default' })
      canvas.requestRenderAll()
      new history(canvas).saveData('image_load')
    }
  }
  imgObj.onerror = error => {
    console.log(error)
    alert('이미지를 로드할 수 없습니다')
  }
}

async function fileLoad(file: File) {
  return new Promise<ProgressEvent<FileReader>>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = async (event) => resolve(event)
    reader.onerror = (error) => reject(error)
    reader.readAsDataURL(file)
  })
}

function canvasResize (canvas: CustomCanvas, w:number, h:number) {
  canvas.imageSize = {
    width: w,
    height: h,
  }
  let width = 0
  let height = 0
  if ((w >= 1280 || h >= 720)) {
    // 둘중 하나가 1280 720보다 높은경우
    if (w > h) {
      // 가로가 더 넓은경우
      width = 1280
      height = h / (w / 1280)
      canvas.cornerSize = 15 * w / 1280
    } else {
      // 세로가 더 넓은경우
      width = w / (h / 720)
      height = 720
      canvas.cornerSize = 15 * h / 720
    }
  } else {
    width = w
    height = h
    canvas.cornerSize = 15
  }

  canvas.setWidth(w)
  canvas.setHeight(h)
  canvasMaxWidth(width, height)
}

function canvasMaxWidth (width:number, height: number) {
  // 캔버스 element의 크기가 너무 크지않게 조정(내부 이미지 사이즈는 원본유지하기위함)
  (document.querySelector('.lower-canvas') as HTMLCanvasElement).style.maxWidth = width + 'px';
  (document.querySelector('.lower-canvas') as HTMLCanvasElement).style.maxHeight = height + 'px';
  (document.querySelector('.upper-canvas') as HTMLCanvasElement).style.maxWidth = width + 'px';
  (document.querySelector('.upper-canvas') as HTMLCanvasElement).style.maxHeight = height + 'px';
  (document.querySelector('.canvas-container') as HTMLDivElement).style.maxWidth = width + 'px';
  (document.querySelector('.canvas-container') as HTMLDivElement).style.maxHeight = height + 'px';
  canvasElement.update(state => state)
}

function Zoom (canvas: CustomCanvas, {options, isZoomIn}: ZoomOptions) {
  // 화면 줌
  let zoom = 0

  // 줌 지점 default는 center
  let offsetX = (canvas.width ?? 0) / 2
  let offsetY = (canvas.height ?? 0) / 2
  if(options) {
    // wheel 음수일경우 줌 양수일경우 줌아웃 천천히 줌되고 빨리 아웃되게함
    zoom = canvas.getZoom() - (options?.e.deltaY > 0 ? 1 : -1) / 10
    offsetX = options.e.offsetX
    offsetY = options.e.offsetY
  } else {
    // 메뉴얼로 줌 인 아웃을 조절 고정값으로 동작하게함
    zoom = canvas.getZoom() - (isZoomIn ? 0.1 : -0.1)
  }
  
  if (zoom > 15) zoom = 15 // 15배율이 넘어가면 정지
  if (zoom < 1) zoom = 1 // 최대 1까지만 가능하게함(그 이상은 안보임)

  // viewport를 벗어나지 않게하자
  canvas.viewportTransform = [1, 0, 0, 1, 0, 1]

  // 휠을 동작시킨 포인터 위치에 줌 in&out
  canvas.zoomToPoint({
    x: offsetX,
    y: offsetY
  }, zoom)
  canvas.requestRenderAll()
}

function setVariable () {
  // 캔버스 오브젝트 기본설정
  return {
    strokeWidth: 1, // 선굵기
    strokeTransparent: false, // 선채우기 없음 여부
    stroke: '#000000', // 선 컬러
    fillTransparent: false, // 색채우기 없음여부
    fill: '#ffffff', // 색 컬러
    fontSize: 18, // 폰트사이즈
    isBold: false, // 볼드여부
  } as DrawingOptionType
}

function downLoadImage(canvas: CustomCanvas) {
  const path = canvas.imagePath ? canvas.imagePath : 'sample.png'
  const link = document.createElement('a')
  link.href = canvas.toDataURL({
    format: path.substring(path.lastIndexOf('.')).replace('.', '')
  })
  link.download = path
  link.click()
  link.remove()
}

function generateImageUrl(canvas: CustomCanvas) {
  const name = canvas.imagePath ? canvas.imagePath : 'sample.png'
  const url = canvas.toDataURL({
    format: name.substring(name.lastIndexOf('.')).replace('.', '')
  })
  return url
}

function selectObject (canvas: CustomCanvas, index: number) {
  canvas.discardActiveObject()
  const objects = canvas.getObjects()
  canvas.setActiveObject(objects[index])
  canvas.requestRenderAll()
}

export {
  drag,
  history,
  loadImage,
  canvasResize,
  canvasMaxWidth,
  Zoom,
  setVariable,
  downLoadImage,
  generateImageUrl,
  selectObject
}