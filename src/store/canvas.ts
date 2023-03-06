import { writable } from 'svelte/store'
import type { shape } from '$lib/js/shape'
import type { draw } from '$lib/js/draw'
import type { drag } from '$lib/js/canvas'
import type { crop } from '$lib/js/crop'
import type { resize } from '$lib/js/resize'
import type { filter } from '$lib/js/filter'
import type { control } from '$lib/js/control'
import type { CustomCanvas, CanvasOptionsUpdateComponent , HistoryList} from '$src/types/canvas'

export const selectedComponent = writable<{name: string, component: CanvasOptionsUpdateComponent}>() // 선택된 컴포넌트 구분용
export const canvasElement = writable<CustomCanvas>() // 캔버스
export const shapeElement = writable<shape>() // 캔버스 도형 class
export const drawingElement = writable<draw>() // 캔버스 드로잉 class
export const dragElement = writable<drag>() // 캔버스 드래그 class
export const cropElement = writable<crop>() // 캔버스 crop class
export const resizeElement = writable<resize>() // 캔버스 resize class
export const filterElement = writable<filter>() // 캔버스 filter class
export const controlElement = writable<control>() // 캔버스 control class
export const historyStore = writable<HistoryList>([]) // history 저장소

export const canvasSize = writable({ // 캔버스 사이즈 리사이징
  width: 320,
  height: 150
})