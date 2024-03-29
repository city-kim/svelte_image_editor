import { fabric } from 'fabric'
import { history } from '$lib/js/canvas'
import { canvasElement } from '$src/store/canvas'
import type { CustomCanvas } from '$src/types/canvas'
import type { FilterColormatrix, FilterImageControl, BlendOptions } from '$src/types/canvas'

const matrices = {
  Brownie: [
    0.59970,0.34553,-0.27082,0,0.186,
    -0.03770,0.86095,0.15059,0,-0.1449,
    0.24113,-0.07441,0.44972,0,-0.02965,
    0,0,0,1,0
  ],
  Vintage: [
    0.62793,0.32021,-0.03965,0,0.03784,
    0.02578,0.64411,0.03259,0,0.02926,
    0.04660,-0.08512,0.52416,0,0.02023,
    0,0,0,1,0
  ],
  Kodachrome: [
    1.12855,-0.39673,-0.03992,0,0.24991,
    -0.16404,1.08352,-0.05498,0,0.09698,
    -0.16786,-0.56034,1.60148,0,0.13972,
    0,0,0,1,0
  ],
  Technicolor: [
    1.91252,-0.85453,-0.09155,0,0.04624,
    -0.30878,1.76589,-0.10601,0,-0.27589,
    -0.23110,-0.75018,1.84759,0,0.12137,
    0,0,0,1,0
  ],
  Polaroid: [
    1.438,-0.062,-0.062,0,0,
    -0.122,1.378,-0.122,0,0,
    -0.016,-0.016,1.483,0,0,
    0,0,0,1,0
  ],
  BlackWhite: [
    1.5, 1.5, 1.5, 0, -1,
    1.5, 1.5, 1.5, 0, -1,
    1.5, 1.5, 1.5, 0, -1,
    0, 0, 0, 1, 0,
  ]
}

class filter {
  canvas: CustomCanvas | null = null
  Colormatrix: Array<FilterColormatrix> = []
  filters: Array<FilterColormatrix> = []
  imageControl: Array<FilterImageControl> = []
  image: fabric.Image | undefined = undefined

  Blend = {
    mode: '',
    color: '#00FFFF',
    alpha: 0.5
  }
  blendMode = ['add','diff','subtract','multiply','screen','lighten','darken','overlay','exclusion','tint']

  constructor () {
    this.reset()
  }

  reset () {
    // 필터 초기화
    this.Colormatrix = [
      // 컬러매트릭스 필터
      {name: 'Grayscale', filter: new fabric.Image.filters.Grayscale(), checked: false},
      {name: 'Invert', filter: new fabric.Image.filters.Invert(), checked: false},
      {name: 'Sepia', filter: new fabric.Image.filters.Sepia(), checked: false},
    ]
    for (let k in matrices) {
      // 선언된 matrices를 Colormatrix에 push한다
      const key = k as 'Brownie'|'Vintage'|'Kodachrome'|'Technicolor'|'Polaroid'|'BlackWhite'
      this.Colormatrix.push({
        name: key, filter: new fabric.Image.filters.ColorMatrix({ matrix: matrices[key] }), checked: false,
      })
    }

    this.imageControl = [
      // 이미지 조정 필터
      {name: 'Brightness', filter: new fabric.Image.filters.Brightness({brightness: 0}), checked: false, value: 0, min: 0, max: 1, step: 0.01},
      {name: 'Contrast', filter: new fabric.Image.filters.Contrast({contrast: 0}), checked: false, value: 0, min: 0, max: 1, step: 0.01},
      {name: 'Hue', filter: new fabric.Image.filters.HueRotation({rotation: 0}), checked: false, value: 0, min: 0, max: 2, step: 0.01},
      {name: 'Saturation', filter: new fabric.Image.filters.Saturation({saturation: 0}), checked: false, value: 0, min: 0, max: 1, step: 0.01},
      {name: 'Noise', filter: new fabric.Image.filters.Noise({noise: 5}), checked: false, value: 5, min: 5, max: 100, step: 1},
      {name: 'Pixelate', filter: new fabric.Image.filters.Pixelate({blocksize: 5}), checked: false, value: 5, min: 5, max: 100, step: 1},
      {name: 'Blur', filter: new fabric.Image.filters.Blur({blur: 0}), checked: false, value: 0, min: 0, max: 3, step: 0.01},
    ]
  }

  setImage(canvas: CustomCanvas) {
    // 이미지를 캔버스에 띄우는용도
    this.canvas = canvas
    // this.setFilter()
  }

  setFilter(data: FilterColormatrix) {
    // 선택된 필터를 filters에 push한다
    if (data.checked) {
      this.filters.push(data)
      this.filterUpdate({type: 'add', target: data.name})
    } else {
      const i = this.filters.findIndex(x => x.name == data.name)
      if (i > -1) {
        this.filters.splice(i, 1)
      }
      this.filterUpdate({type: 'remove', target: data.name})
    }
  }

  updateFilter (data: FilterImageControl) {
    // 필터의 값이 조정되면 업데이트 해준다
    const result = this.filters.find(x => x.name == data.name)
    if (result) {
      // 값을 찾았다면 업데이트한다
      result.filter.setOptions({[data.name.toLowerCase()]: data.value})
    }
    this.filterUpdate({type: 'update', target: data.name})
  }

  changeBlandMode (options: BlendOptions) {
    // 블랜드모드 변경
    this.Blend = options
    const i = this.filters.findIndex(x => x.name == 'BlendColor')
    if (this.Blend.mode) {
      const data = this.filters.find(x => x.name == 'BlendColor')
      if (data) {
        // 이미 적용된경우 업데이트
        data.filter.setOptions({...this.Blend})
        this.filterUpdate({type: 'update', target: 'BlendColor'})
      } else {
        // 필터가 적용되지 않았다면 push
        this.filters.push({
          name: 'BlendColor',
          checked: true,
          filter: new fabric.Image.filters.BlendColor({...this.Blend})
        })
        this.filterUpdate({type: 'add', target: 'BlendColor'})
      }
    } else {
      // 모드가 없는경우 삭제하기
      const i = this.filters.findIndex(x => x.name == 'BlendColor')
      if (i > -1) {
        this.filters.splice(i, 1)
      }
      this.filterUpdate({type: 'remove', target: 'BlendColor'})
    }
  }

  filterUpdate ({type, target}: {type: 'add'|'update'|'remove', target: string}) {
    // canvas 이미지의 필터값을 반영해준다
    if (this.canvas) {
      const object = this.canvas.getObjects().find(x => x.type == 'image') as fabric.Image
      object.filters = this.filters.map(x => x.filter)
      object.applyFilters()
      this.canvas.requestRenderAll()
      new history(this.canvas).saveData(`${type}_${target}`)
      canvasElement.update(state => state)
    }
  }
}

export {
  filter
}