import { fabric } from 'fabric'
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
    this.Colormatrix = [
      {name: 'Grayscale', filter: new fabric.Image.filters.Grayscale(), checked: false},
      {name: 'Invert', filter: new fabric.Image.filters.Invert(), checked: false},
      {name: 'Sepia', filter: new fabric.Image.filters.Sepia(), checked: false},
    ]
    for (let k in matrices) {
      const key = k as 'Brownie'|'Vintage'|'Kodachrome'|'Technicolor'|'Polaroid'|'BlackWhite'
      this.Colormatrix.push({
        name: key, filter: new fabric.Image.filters.ColorMatrix({ matrix: matrices[key] }), checked: false,
      })
    }

    this.imageControl = [
      {name: 'Brightness', filter: new fabric.Image.filters.Brightness({brightness: 0}), checked: false, value: 0, min: 0, max: 1, step: 0.1},
      {name: 'Contrast', filter: new fabric.Image.filters.Contrast({contrast: 0}), checked: false, value: 0, min: 0, max: 1, step: 0.1},
      {name: 'Hue', filter: new fabric.Image.filters.HueRotation({rotation: 0}), checked: false, value: 0, min: 0, max: 2, step: 0.01},
      {name: 'Saturation', filter: new fabric.Image.filters.Saturation({saturation: 0}), checked: false, value: 0, min: 0, max: 1, step: 0.1},
      {name: 'Noise', filter: new fabric.Image.filters.Noise({noise: 5}), checked: false, value: 5, min: 5, max: 100, step: 1},
      {name: 'Pixelate', filter: new fabric.Image.filters.Pixelate({blocksize: 5}), checked: false, value: 5, min: 5, max: 100, step: 1},
      {name: 'Blur', filter: new fabric.Image.filters.Blur({blur: 0}), checked: false, value: 0, min: 0, max: 3, step: 0.1},
    ]
  }

  setImage(canvas: CustomCanvas) {
    this.canvas = canvas
    // this.setFilter()
  }

  setFilter(data: FilterColormatrix) {
    if (data.checked) {
      this.filters.push(data)
    } else {
      const i = this.filters.findIndex(x => x.name == data.name)
      if (i > -1) {
        this.filters.splice(i, 1)
      }
    }
    this.filterUpdate()
  }

  updateFilter (data: FilterImageControl) {
    const i = this.filters.findIndex(x => x.name == data.name)
    if(data.name == 'Brightness') this.filters[i].filter.setOptions({brightness: data.value})
    if(data.name == 'Contrast') this.filters[i].filter.setOptions({contrast: data.value})
    if(data.name == 'Hue') this.filters[i].filter.setOptions({rotation: data.value})
    if(data.name == 'Saturation') this.filters[i].filter.setOptions({saturation: data.value})
    if(data.name == 'Noise') this.filters[i].filter.setOptions({noise: data.value})
    if(data.name == 'Pixelate') this.filters[i].filter.setOptions({blocksize: data.value})
    if(data.name == 'Blur') this.filters[i].filter.setOptions({blur: data.value})
    this.filterUpdate()
  }

  changeBlandMode (options: BlendOptions) {
    // 블랜드모드 변경
    this.Blend = options
    const i = this.filters.findIndex(x => x.name == 'BlendColor')
    if (this.Blend.mode) {
      if (i > -1) {
        // 이미 적용된경우 업데이트
        this.filters[i].filter.setOptions({
          color: this.Blend.color,
          mode: this.Blend.mode,
          alpha: this.Blend.alpha
        })
      } else {
        // 필터가 적용되지 않았다면 push
        this.filters.push({
          name: 'BlendColor',
          filter: new fabric.Image.filters.BlendColor({
            color: this.Blend.color,
            mode: this.Blend.mode,
            alpha: this.Blend.alpha
          }),
          checked: true
        })
      }
    } else {
      // 모드가 없는경우 삭제하기
      const i = this.filters.findIndex(x => x.name == 'BlendColor')
      if (i > -1) {
        this.filters.splice(i, 1)
      }
    }
    this.filterUpdate()
  }

  filterUpdate () {
    if (this.canvas) {
      const object = this.canvas.getObjects().find(x => x.type == 'image') as fabric.Image
      object.filters = this.filters.map(x => x.filter)
      object.applyFilters()
      this.canvas.requestRenderAll()
    }
  }
}

export {
  filter
}