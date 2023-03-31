import type { fabric } from 'fabric'
import type { ComponentType } from 'svelte'

interface LeaveComponent {
  isLeave?: boolean
}

interface CustomCanvas extends fabric.Canvas {
  imageSize?: {
    width: number
    height: number
  }
  cornerSize?: number
  imagePath?: string
  polygonMode?: boolean
  shapeMode?: boolean
  dragMode?: boolean
  cropMode?: boolean
}

interface Color {
  // 컬러묶음 타입
  stroke: string
  fill: string
}

interface DrawingOptionType {
  // 드로잉 옵션에 사용되는 타입
  strokeWidth: number
  strokeTransparent: boolean
  stroke: string
  fillTransparent: boolean
  fill: string
  fontSize?: number
  isBold?: boolean
}

interface CanvasOptionsUpdateComponent extends ComponentType {
  // 캔버스 하위 컴포넌트 타입
  setCanvasOption?: Function
  mouseDown?: Function
  mouseMove?: Function
}

interface ZoomOptions {
  // 확대옵션 타입
  options?: fabric.IEvent<WheelEvent>
  isZoomIn?: boolean
  scale?: number
}

interface CropOtions {
  ratio?: {
    x: number
    y: number
  }
  size?: {
    w: number
    h: number
    t: number
    l: number
  }
}

interface FilterColormatrix {
  name: string
  filter: fabric.IBaseFilter
  checked: boolean
}

interface FilterImageControl extends FilterColormatrix {
  value: number
  min: number
  max: number
  step: number
}

interface BlendOptions {
  mode: string
  color: string
  alpha: number
}

interface HistoryData {
  version: string
  objects: fabric.Object[]
}

interface HistoryItem {
  name: string 
  data: HistoryData
  active: boolean
}

type HistoryList = Array<HistoryItem>

export type {
  LeaveComponent,
  CustomCanvas,
  Color,
  DrawingOptionType,
  CanvasOptionsUpdateComponent,
  ZoomOptions,
  CropOtions,
  FilterColormatrix,
  FilterImageControl,
  BlendOptions,
  HistoryData,
  HistoryItem,
  HistoryList
}