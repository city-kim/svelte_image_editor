import { c as create_ssr_component, b as subscribe, v as validate_component, d as add_attribute, e as escape, f as each, h as set_store_value, m as missing_component } from "../../chunks/index2.js";
import "fabric";
import { w as writable } from "../../chunks/index.js";
const selectedComponent = writable();
const canvasElement = writable();
const shapeElement = writable();
const drawingElement = writable();
const dragElement = writable();
const cropElement = writable();
const resizeElement = writable();
const filterElement = writable();
const controlElement = writable();
function updateVariable(e, variable) {
  const result = variable;
  if (e.selected) {
    if (e.selected.length == 1) {
      if (e.selected[0].stroke) {
        if (e.selected[0].stroke == "transparent") {
          result.strokeTransparent = true;
        } else {
          result.strokeTransparent = false;
          result.stroke = e.selected[0].stroke;
        }
      }
      if (e.selected[0].strokeWidth) {
        result.strokeWidth = e.selected[0].strokeWidth;
      }
      if (e.selected[0].fill && typeof e.selected[0].fill == "string" && e.selected[0].type != "image") {
        if (e.selected[0].fill == "transparent") {
          result.fillTransparent = true;
        } else {
          result.fillTransparent = false;
          result.fill = e.selected[0].fill;
        }
      }
    }
    for (let i = 0; i < e.selected.length; i++) {
      if (e.selected[i].type == "i-text") {
        let object = e.selected[i];
        if (object.fontSize) {
          result.fontSize = object.fontSize;
        }
        result.isBold = object.fontWeight == "bold" ? true : false;
        break;
      }
    }
  }
  return result;
}
function setVariable() {
  return {
    strokeWidth: 1,
    // 선굵기
    strokeTransparent: false,
    // 선채우기 없음 여부
    stroke: "#000000",
    // 선 컬러
    fillTransparent: false,
    // 색채우기 없음여부
    fill: "#ffffff",
    // 색 컬러
    fontSize: 18,
    // 폰트사이즈
    isBold: false
    // 볼드여부
  };
}
const Popper = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { contents = "" } = $$props;
  if ($$props.contents === void 0 && $$bindings.contents && contents !== void 0)
    $$bindings.contents(contents);
  return `<div class="${"popper-wrap"}">${slots.default ? slots.default({}) : ``}
  ${``}</div>`;
});
const Canvas = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $dragElement, $$unsubscribe_dragElement;
  let $$unsubscribe_canvasElement;
  $$unsubscribe_dragElement = subscribe(dragElement, (value) => $dragElement = value);
  $$unsubscribe_canvasElement = subscribe(canvasElement, (value) => value);
  $$unsubscribe_dragElement();
  $$unsubscribe_canvasElement();
  return `${!$dragElement?.dragMode ? `${validate_component(Popper, "Popper").$$render($$result, { contents: "ZoomIn" }, {}, {
    default: () => {
      return `<button><svg xmlns="${"http://www.w3.org/2000/svg"}" viewBox="${"0 0 16 16"}"><path fill-rule="${"evenodd"}" d="${"M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11zM13 6.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0z"}"></path><path d="${"M10.344 11.742c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1 6.538 6.538 0 0 1-1.398 1.4z"}"></path><path fill-rule="${"evenodd"}" d="${"M6.5 3a.5.5 0 0 1 .5.5V6h2.5a.5.5 0 0 1 0 1H7v2.5a.5.5 0 0 1-1 0V7H3.5a.5.5 0 0 1 0-1H6V3.5a.5.5 0 0 1 .5-.5z"}"></path></svg></button>`;
    }
  })}
  ${validate_component(Popper, "Popper").$$render($$result, { contents: "ZoomOut" }, {}, {
    default: () => {
      return `<button><svg xmlns="${"http://www.w3.org/2000/svg"}" viewBox="${"0 0 16 16"}"><path fill-rule="${"evenodd"}" d="${"M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11zM13 6.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0z"}"></path><path d="${"M10.344 11.742c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1 6.538 6.538 0 0 1-1.398 1.4z"}"></path><path fill-rule="${"evenodd"}" d="${"M3 6.5a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5z"}"></path></svg></button>`;
    }
  })}
  ${validate_component(Popper, "Popper").$$render($$result, { contents: "Move" }, {}, {
    default: () => {
      return `<button><svg xmlns="${"http://www.w3.org/2000/svg"}" viewBox="${"0 0 16 16"}"><path fill-rule="${"evenodd"}" d="${"M7.646.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 1.707V5.5a.5.5 0 0 1-1 0V1.707L6.354 2.854a.5.5 0 1 1-.708-.708l2-2zM8 10a.5.5 0 0 1 .5.5v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 0 1 .708-.708L7.5 14.293V10.5A.5.5 0 0 1 8 10zM.146 8.354a.5.5 0 0 1 0-.708l2-2a.5.5 0 1 1 .708.708L1.707 7.5H5.5a.5.5 0 0 1 0 1H1.707l1.147 1.146a.5.5 0 0 1-.708.708l-2-2zM10 8a.5.5 0 0 1 .5-.5h3.793l-1.147-1.146a.5.5 0 0 1 .708-.708l2 2a.5.5 0 0 1 0 .708l-2 2a.5.5 0 0 1-.708-.708L14.293 8.5H10.5A.5.5 0 0 1 10 8z"}"></path></svg></button>`;
    }
  })}` : `${validate_component(Popper, "Popper").$$render($$result, { contents: "EndMoveMode" }, {}, {
    default: () => {
      return `<button><svg xmlns="${"http://www.w3.org/2000/svg"}" viewBox="${"0 0 16 16"}"><path d="${"M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"}"></path><path d="${"M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"}"></path></svg></button>`;
    }
  })}`}`;
});
const Object$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_canvasElement;
  $$unsubscribe_canvasElement = subscribe(canvasElement, (value) => value);
  $$unsubscribe_canvasElement();
  return `${validate_component(Popper, "Popper").$$render($$result, { contents: "BringToFront" }, {}, {
    default: () => {
      return `<button><svg xmlns="${"http://www.w3.org/2000/svg"}" viewBox="${"0 0 16 16"}"><path d="${"M8.354.146a.5.5 0 0 0-.708 0l-3 3a.5.5 0 0 0 0 .708l1 1a.5.5 0 0 0 .708 0L7 4.207V12H1a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H9V4.207l.646.647a.5.5 0 0 0 .708 0l1-1a.5.5 0 0 0 0-.708l-3-3z"}"></path><path d="${"M1 7a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h4.5a.5.5 0 0 0 0-1H1V8h4.5a.5.5 0 0 0 0-1H1zm9.5 0a.5.5 0 0 0 0 1H15v2h-4.5a.5.5 0 0 0 0 1H15a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1h-4.5z"}"></path></svg></button>`;
    }
  })}
${validate_component(Popper, "Popper").$$render($$result, { contents: "SendToBack" }, {}, {
    default: () => {
      return `<button><svg xmlns="${"http://www.w3.org/2000/svg"}" viewBox="${"0 0 16 16"}"><path d="${"M8.354 15.854a.5.5 0 0 1-.708 0l-3-3a.5.5 0 0 1 0-.708l1-1a.5.5 0 0 1 .708 0l.646.647V4H1a1 1 0 0 1-1-1V1a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H9v7.793l.646-.647a.5.5 0 0 1 .708 0l1 1a.5.5 0 0 1 0 .708l-3 3z"}"></path><path d="${"M1 9a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h4.5a.5.5 0 0 1 0 1H1v2h4.5a.5.5 0 0 1 0 1H1zm9.5 0a.5.5 0 0 1 0-1H15V6h-4.5a.5.5 0 0 1 0-1H15a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-4.5z"}"></path></svg></button>`;
    }
  })}
${validate_component(Popper, "Popper").$$render($$result, { contents: "Copy" }, {}, {
    default: () => {
      return `<button><svg xmlns="${"http://www.w3.org/2000/svg"}" viewBox="${"0 0 16 16"}"><path d="${"M0 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2H2a2 2 0 0 1-2-2V2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H2z"}"></path></svg></button>`;
    }
  })}`;
});
const Controller = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<div class="${"editor-control-panel"}">${validate_component(Canvas, "Canvas").$$render($$result, {}, {}, {})}
  ${validate_component(Object$1, "Object").$$render($$result, {}, {}, {})}</div>`;
});
const Resize = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let max;
  let $resizeElement, $$unsubscribe_resizeElement;
  $$unsubscribe_resizeElement = subscribe(resizeElement, (value) => $resizeElement = value);
  let width = 0;
  let height = 0;
  max = {
    // 최대값은 베이스 사이즈로
    x: $resizeElement.baseSize.width,
    y: $resizeElement.baseSize.height
  };
  $$unsubscribe_resizeElement();
  return `<div class="${"drawing-options-container"}"><div class="${"drawing-options-contents"}"><label for="${"width"}">width</label>
    <div><input type="${"range"}" id="${"width"}" min="${"50"}"${add_attribute("max", max.x, 0)} step="${"1"}"${add_attribute("value", width, 0)}>
      ${escape(width)}</div></div>
  <div class="${"drawing-options-contents"}"><label for="${"height"}">height</label>
    <div><input type="${"range"}" id="${"height"}" min="${"50"}"${add_attribute("max", max.y, 0)} step="${"1"}"${add_attribute("value", height, 0)}>
      ${escape(height)}</div></div></div>

<div class="${"drawing-options-container"}"><button type="${"button"}">apply</button>
  <button type="${"button"}">cancel</button></div>`;
});
const Crop = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_cropElement;
  $$unsubscribe_cropElement = subscribe(cropElement, (value) => value);
  $$unsubscribe_cropElement();
  return `<div class="${"drawing-options-container"}">
  <button type="${"button"}">1:1</button>
  <button type="${"button"}">3:2</button>
  <button type="${"button"}">4:3</button>
  <button type="${"button"}">5:4</button>
  <button type="${"button"}">7:5</button>
  <button type="${"button"}">16:9</button></div>
<div class="${"drawing-options-container"}">
  <button type="${"button"}">apply</button>
  <button type="${"button"}">cancel</button></div>`;
});
const DrawingOptions = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_canvasElement;
  let $selectedComponent, $$unsubscribe_selectedComponent;
  $$unsubscribe_canvasElement = subscribe(canvasElement, (value) => value);
  $$unsubscribe_selectedComponent = subscribe(selectedComponent, (value) => $selectedComponent = value);
  const isFont = false;
  let { variable } = $$props;
  if ($$props.isFont === void 0 && $$bindings.isFont && isFont !== void 0)
    $$bindings.isFont(isFont);
  if ($$props.variable === void 0 && $$bindings.variable && variable !== void 0)
    $$bindings.variable(variable);
  ({
    stroke: variable.strokeTransparent ? "transparent" : variable.stroke,
    fill: variable.fillTransparent ? "transparent" : variable.fill
  });
  $$unsubscribe_canvasElement();
  $$unsubscribe_selectedComponent();
  return `<div class="${"drawing-options-container"}"><div class="${"drawing-options-contents"}"><label for="${"variable.strokeWidth"}">strokeWidth</label>
    <div><input type="${"range"}" id="${"variable.strokeWidth"}" min="${"1"}" max="${"50"}" step="${"0.5"}"${add_attribute("value", variable.strokeWidth, 0)}>
      ${escape(variable.strokeWidth)}</div></div>
  <div class="${"drawing-options-contents"}"><label for="${"fillColor"}">fillColor</label>
    <div>${!variable.fillTransparent ? `<input type="${"color"}" id="${"fillColor"}"${add_attribute("value", variable.fill, 0)}>` : ``}
      <label>empty
        <input type="${"checkbox"}"${add_attribute("checked", variable.fillTransparent, 1)}></label></div></div>
  <div class="${"drawing-options-contents"}"><label for="${"strokeColor"}">strokeColor</label>
    <div>${!variable.strokeTransparent ? `<input type="${"color"}" id="${"strokeColor"}"${add_attribute("value", variable.stroke, 0)}>` : ``}
      <label>empty
        <input type="${"checkbox"}"${add_attribute("checked", variable.strokeTransparent, 1)}></label></div></div>

  ${$selectedComponent.name == "text" ? `<div class="${"drawing-options-contents"}"><label for="${"fontSize"}">fontSize</label>
      <div><input type="${"range"}" id="${"fontSize"}" min="${"10"}" max="${"100"}" step="${"0.5"}"${add_attribute("value", variable.fontSize, 0)}>
        <span>${escape(variable.fontSize)}</span></div></div>
    <div class="${"drawing-options-contents"}"><label for="${"isBold"}">bold</label>
      <div><input type="${"checkbox"}" id="${"isBold"}"${add_attribute("checked", variable.isBold, 1)}></div></div>` : ``}</div>`;
});
const Shape = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_shapeElement;
  $$unsubscribe_shapeElement = subscribe(shapeElement, (value) => value);
  const setCanvasOption = (e) => {
    variable = updateVariable(e, variable);
  };
  let variable = setVariable();
  if ($$props.setCanvasOption === void 0 && $$bindings.setCanvasOption && setCanvasOption !== void 0)
    $$bindings.setCanvasOption(setCanvasOption);
  $$unsubscribe_shapeElement();
  return `${validate_component(DrawingOptions, "DrawingOptions").$$render($$result, { variable }, {}, {})}
<div class="${"editor-icons"}">${validate_component(Popper, "Popper").$$render($$result, { contents: "사각형" }, {}, {
    default: () => {
      return `<button><svg xmlns="${"http://www.w3.org/2000/svg"}" viewBox="${"0 0 16 16"}"><path d="${"M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"}"></path></svg></button>`;
    }
  })}
  ${validate_component(Popper, "Popper").$$render($$result, { contents: "삼각형" }, {}, {
    default: () => {
      return `<button><svg xmlns="${"http://www.w3.org/2000/svg"}" viewBox="${"0 0 16 16"}"><path d="${"M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017.163.163 0 0 1-.054-.06.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z"}"></path></svg></button>`;
    }
  })}
  ${validate_component(Popper, "Popper").$$render($$result, { contents: "원" }, {}, {
    default: () => {
      return `<button><svg xmlns="${"http://www.w3.org/2000/svg"}" viewBox="${"0 0 16 16"}"><path d="${"M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"}"></path></svg></button>`;
    }
  })}
  ${validate_component(Popper, "Popper").$$render($$result, { contents: "별" }, {}, {
    default: () => {
      return `<button><svg xmlns="${"http://www.w3.org/2000/svg"}" viewBox="${"0 0 16 16"}"><path d="${"M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"}"></path></svg></button>`;
    }
  })}</div>`;
});
const Draw = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $drawingElement, $$unsubscribe_drawingElement;
  let $canvasElement, $$unsubscribe_canvasElement;
  $$unsubscribe_drawingElement = subscribe(drawingElement, (value) => $drawingElement = value);
  $$unsubscribe_canvasElement = subscribe(canvasElement, (value) => $canvasElement = value);
  const setCanvasOption = (e) => {
    variable = updateVariable(e, variable);
  };
  function mouseDown(options) {
    if (options.target && options.target.name && options.target.name == $drawingElement.pointArray[0].name) {
      $drawingElement.generatePolygon({
        stroke: variable.stroke,
        fill: variable.fill
      });
    }
    if ($drawingElement.polygonMode) {
      $drawingElement.addPoint(options);
    }
  }
  function mouseMove(options) {
    if ($drawingElement.activeLine) {
      const pointer = $canvasElement.getPointer(options.e);
      $drawingElement.activeLine.set({ x2: pointer.x, y2: pointer.y });
    }
    $canvasElement.renderAll();
  }
  let variable = setVariable();
  if ($$props.setCanvasOption === void 0 && $$bindings.setCanvasOption && setCanvasOption !== void 0)
    $$bindings.setCanvasOption(setCanvasOption);
  if ($$props.mouseDown === void 0 && $$bindings.mouseDown && mouseDown !== void 0)
    $$bindings.mouseDown(mouseDown);
  if ($$props.mouseMove === void 0 && $$bindings.mouseMove && mouseMove !== void 0)
    $$bindings.mouseMove(mouseMove);
  $$unsubscribe_drawingElement();
  $$unsubscribe_canvasElement();
  return `${validate_component(DrawingOptions, "DrawingOptions").$$render($$result, { variable }, {}, {})}
<div class="${"editor-icons"}">${`${validate_component(Popper, "Popper").$$render($$result, { contents: "펜그리기" }, {}, {
    default: () => {
      return `<button><svg xmlns="${"http://www.w3.org/2000/svg"}" viewBox="${"0 0 16 16"}"><path d="${"M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"}"></path><path fill-rule="${"evenodd"}" d="${"M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"}"></path></svg></button>`;
    }
  })}

    ${validate_component(Popper, "Popper").$$render($$result, { contents: "선그리기" }, {}, {
    default: () => {
      return `<button><svg xmlns="${"http://www.w3.org/2000/svg"}" viewBox="${"0 0 16 16"}"><path fill-rule="${"evenodd"}" d="${"M13.854 2.146a.5.5 0 0 1 0 .708l-11 11a.5.5 0 0 1-.708-.708l11-11a.5.5 0 0 1 .708 0Z"}"></path></svg></button>`;
    }
  })}`}

  ${``}</div>`;
});
const Text = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_shapeElement;
  $$unsubscribe_shapeElement = subscribe(shapeElement, (value) => value);
  let variable = setVariable();
  const setCanvasOption = (e) => {
    variable = updateVariable(e, variable);
  };
  if ($$props.setCanvasOption === void 0 && $$bindings.setCanvasOption && setCanvasOption !== void 0)
    $$bindings.setCanvasOption(setCanvasOption);
  ({
    stroke: variable.strokeTransparent ? "transparent" : variable.stroke,
    fill: variable.fillTransparent ? "transparent" : variable.fill
  });
  $$unsubscribe_shapeElement();
  return `${validate_component(DrawingOptions, "DrawingOptions").$$render($$result, { variable }, {}, {})}
<div class="${"editor-text"}"><div class="${"editor-icons"}">${validate_component(Popper, "Popper").$$render($$result, { contents: "텍스트추가" }, {}, {
    default: () => {
      return `<button><svg xmlns="${"http://www.w3.org/2000/svg"}" viewBox="${"0 0 16 16"}"><path d="${"M12.258 3h-8.51l-.083 2.46h.479c.26-1.544.758-1.783 2.693-1.845l.424-.013v7.827c0 .663-.144.82-1.3.923v.52h4.082v-.52c-1.162-.103-1.306-.26-1.306-.923V3.602l.431.013c1.934.062 2.434.301 2.693 1.846h.479L12.258 3z"}"></path></svg></button>`;
    }
  })}</div></div>`;
});
const Flip = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_canvasElement;
  $$unsubscribe_canvasElement = subscribe(canvasElement, (value) => value);
  $$unsubscribe_canvasElement();
  return `<div class="${"drawing-options-container"}"><button type="${"button"}">flip x</button>
  <button type="${"button"}">flip y</button></div>`;
});
const Filter = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $filterElement, $$unsubscribe_filterElement;
  $$unsubscribe_filterElement = subscribe(filterElement, (value) => $filterElement = value);
  let Blend = { mode: "", color: "#00FFFF", alpha: 0.5 };
  {
    if ($filterElement) {
      Blend = $filterElement.Blend;
    }
  }
  $$unsubscribe_filterElement();
  return `<div class="${"drawing-options-container"}">${$filterElement ? `<div class="${"drawing-options-contents"}">${each($filterElement.Colormatrix, (list) => {
    return `<div><label${add_attribute("for", list.name, 0)}>${escape(list.name)}</label>
          <input${add_attribute("id", list.name, 0)} type="${"checkbox"}"${add_attribute("checked", list.checked, 1)}>
        </div>`;
  })}</div>
    
    <div class="${"drawing-options-contents"}">${each($filterElement.imageControl, (list) => {
    return `<div><label>${escape(list.name)}
            <input type="${"checkbox"}"${add_attribute("checked", list.checked, 1)}></label>
          ${list.checked ? `<div><input type="${"range"}" id="${"Brightness"}"${add_attribute("min", list.min, 0)}${add_attribute("max", list.max, 0)}${add_attribute("step", list.step, 0)}${add_attribute("value", list.value, 0)}>
            </div>` : ``}
        </div>`;
  })}</div>

    <div class="${"drawing-options-contents"}"><div><label for="${"BlendMode"}"></label>
        <select id="${"BlendMode"}"><option value="${""}">None</option>${each($filterElement.blendMode, (list) => {
    return `<option${add_attribute("value", list, 0)}>${escape(list.toUpperCase())}</option>`;
  })}</select></div>
      <div><label for="${"Color"}">Color</label>
        <input type="${"color"}" id="${"Color"}"${add_attribute("value", Blend.color, 0)}></div>
      <div><label for="${"Alpha"}">Alpha</label>
        <input type="${"range"}" id="${"Alpha"}" min="${"0"}" max="${"1"}" step="${"0.1"}"${add_attribute("value", Blend.alpha, 0)}></div></div>` : ``}</div>`;
});
const CanvasEditor = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_canvasElement;
  let $$unsubscribe_dragElement;
  let $selectedComponent, $$unsubscribe_selectedComponent;
  let $$unsubscribe_controlElement;
  let $$unsubscribe_filterElement;
  let $$unsubscribe_cropElement;
  let $$unsubscribe_shapeElement;
  let $$unsubscribe_drawingElement;
  $$unsubscribe_canvasElement = subscribe(canvasElement, (value) => value);
  $$unsubscribe_dragElement = subscribe(dragElement, (value) => value);
  $$unsubscribe_selectedComponent = subscribe(selectedComponent, (value) => $selectedComponent = value);
  $$unsubscribe_controlElement = subscribe(controlElement, (value) => value);
  $$unsubscribe_filterElement = subscribe(filterElement, (value) => value);
  $$unsubscribe_cropElement = subscribe(cropElement, (value) => value);
  $$unsubscribe_shapeElement = subscribe(shapeElement, (value) => value);
  $$unsubscribe_drawingElement = subscribe(drawingElement, (value) => value);
  let ctx;
  set_store_value(selectedComponent, $selectedComponent = { name: "filter", component: Filter }, $selectedComponent);
  let component;
  const selectorList = [
    { target: "resize", component: Resize },
    { target: "crop", component: Crop },
    { target: "flip", component: Flip },
    //  {target: 'rotate', component: 'ROTATE'},
    { target: "draw", component: Draw },
    { target: "shape", component: Shape },
    { target: "text", component: Text },
    { target: "filter", component: Filter }
  ];
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    $$rendered = `<div class="${"editor"}"><section class="${"editor-header"}"><h1>IMAGE EDITOR</h1>
    <div class="${"editor-header-buttons"}"><label>Load Image
        <input type="${"file"}"></label>
      <button type="${"button"}">DownLoad</button></div></section>
  <div class="${"editor-control-container"}">${validate_component(Controller, "Controller").$$render($$result, {}, {}, {})}</div>
  <div class="${"editor-canvas-container"}"><canvas${add_attribute("this", ctx, 0)}></canvas></div>
  <div class="${"editor-menu"}">${validate_component($selectedComponent.component || missing_component, "svelte:component").$$render(
      $$result,
      { this: component },
      {
        this: ($$value) => {
          component = $$value;
          $$settled = false;
        }
      },
      {}
    )}
    <ul class="${"editor-menu-list"}">${each(selectorList, (item) => {
      return `<li><button type="${"button"}">${escape(item.target.toUpperCase())}</button>
        </li>`;
    })}</ul></div></div>`;
  } while (!$$settled);
  $$unsubscribe_canvasElement();
  $$unsubscribe_dragElement();
  $$unsubscribe_selectedComponent();
  $$unsubscribe_controlElement();
  $$unsubscribe_filterElement();
  $$unsubscribe_cropElement();
  $$unsubscribe_shapeElement();
  $$unsubscribe_drawingElement();
  return $$rendered;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${$$result.head += `<!-- HEAD_svelte-t32ptj_START -->${$$result.title = `<title>Home</title>`, ""}<meta name="${"description"}" content="${"Svelte demo app"}"><!-- HEAD_svelte-t32ptj_END -->`, ""}

<section>${validate_component(CanvasEditor, "CanvasEditor").$$render($$result, {}, {}, {})}
</section>`;
});
export {
  Page as default
};
