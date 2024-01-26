/// <reference path="../types/index.d.ts" />
/*
 * @Author: JeremyJone
 * @Date: 2023-07-26 13:33:14
 * @LastEditors: JeremyJone
 * @LastEditTime: 2024-01-24 14:42:17
 * @Description: 生成水印
 */

const __DEV__ = false;
const WARN = "[XWatermark]";

const defaultOptions = {
  id: "", //水印总体的id
  top: 0, //水印起始 top 位置
  left: 0, //水印起始 left 位置
  rows: 0, //水印行数
  cols: 0, //水印列数
  xSpace: 50, //水印x轴间隔
  ySpace: 50, //水印y轴间隔
  ratio: 1, //大小的倍数，可以用来做高清适配
  font: "Helvetica Neue, Arial, MS YaHei", //水印字体
  weight: "normal", //水印字体粗细
  color: "black", //水印字体颜色
  fontsize: 16, //水印字体大小
  alpha: 0.1, //水印透明度，要求设置在大于等于0.005
  angle: -15, //水印倾斜度数
  zIndex: 9999, //水印层级
  width: "auto", //水印宽度。数字(含数字型字符，如 '90')或者auto(默认)
  height: "auto", //水印长度。数字(含数字型字符，如 '90')或者auto(默认)
  mode: "n", //平铺模式。支持: normal(默认，简写n) | horizontal(横向平铺，h、x) | vertical(纵向平铺， v、y) | stagger(交错，s)
  parentNode: document.body, //水印插件挂载的父元素element,不输入则默认挂在body上
  parentSelector: "", // 挂载的父元素选择器，优先级高于 parentNode
  observer: false, // 是否观察父元素变化，自动更新水印
  observerNode: null, // 要观察的元素，不传则默认为 parentNode
  prevent: false // 是否防止水印被篡改
};

function deleteElement(id) {
  const dom = document.getElementById(id);

  if (dom) {
    try {
      const parentNode = dom.parentNode;
      parentNode?.removeChild(dom);
      return true;
    } catch (error) {
      console.warn(`${WARN} Remove watermark dom [${id}] failed:`, error);
    }

    return false;
  }

  // 元素不存在，直接返回 true
  return true;
}

function setCtxFont(ctx, options) {
  //设置字体样式
  ctx.font = `${options.weight} ${options.fontsize}px ${options.font}`;
  //设置填充绘画的颜色、渐变或者模式
  ctx.fillStyle = options.color;
  //设置文本内容的当前对齐方式
  ctx.textAlign = "left";
  //设置在绘制文本时使用的当前文本基线
  ctx.textBaseline = "bottom";
}

// 高度自动时，计算行数
const calculateLines = (ctx, text, maxWidth) => {
  const words = text.split("");
  let line = "";
  let lines = 0;
  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i];
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && i > 0) {
      lines++;
      line = words[i];
    } else {
      line = testLine;
    }
  }
  return ++lines;
};

function drawText(ctx, text, x, y, maxWidth, lineHeight, rotate) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate((rotate * Math.PI) / 180);

  const words = text.split("");
  let line = "";
  const indent = lineHeight * Math.sin((rotate * Math.PI) / 180);
  let lineNum = rotate < 0 ? -1 : 0;

  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i];
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;

    if (testWidth > maxWidth && i > 0) {
      ctx.fillText(line, indent * lineNum++, 0);
      line = words[i];
      ctx.translate(0, lineHeight);
    } else {
      line = testLine;
    }
  }

  ctx.fillText(line, indent * lineNum, 0);
  ctx.restore();
}

/**
 * 生成水印
 * @param {object} dom
 * @param {string} str
 * @param {object} options
 * @returns base64
 */
const setWatermark = (dom, str, options) => {
  if (!dom) {
    console.error(`${WARN} Could not load watermark. Dom is null. content:`, str);
    return;
  }

  const id = options.id;
  // 如果已经存在水印，则先删除
  deleteElement(id);

  // lineHeight
  const lineHeight = options.fontsize * 1.5;

  // 如果 mode 是 stagger，space 增大两倍
  let spaceX = options.xSpace;
  let spaceY = options.ySpace;
  if (["stagger", "s"].includes(options.mode)) {
    spaceX = options.xSpace * 2;
    spaceY = options.ySpace * 2;
  }

  // 角度在 -90 ~ 90 之间
  // options.angle = options.angle % 90;

  //创建一个画布
  let canvas = document.createElement("canvas");

  let context = canvas.getContext("2d");
  if (context === null) {
    console.error(
      `${WARN} load error. Canvas Context is null. You'r browser may not support canvas.`
    );
    return "";
  }

  setCtxFont(context, options);

  // 如果宽高是 auto，那么要先计算 canvas 的宽高
  if (typeof options.width === "string") {
    // 先转数字，如果是一个 '100' 这样的字符串，可以转成数字使用
    // 如果转换失败，那么就是 auto，需要后续计算
    const w = Number(options.width);
    if (!isNaN(w)) {
      options.width = w * options.ratio;
    } else {
      if (options.width === "auto") {
        // 通过 measureText 计算宽度
        const metrics = context.measureText(str);
        options.width =
          metrics.width +
          lineHeight * Math.sin((Math.abs(options.angle) * Math.PI) / 180);
      } else {
        console.warn(
          `${WARN} width is not a number or 'auto'. Please check your options.`
        );
        return "";
      }
    }
  }
  if (typeof options.height === "string") {
    const h = Number(options.height);
    if (!isNaN(h)) {
      options.height = h * options.ratio;
    } else {
      if (options.height === "auto") {
        // options.height = lineHeight * str.split('\n').length;
        const lines = calculateLines(context, str, options.width);
        options.height =
          lineHeight * lines +
          options.width * Math.sin((Math.abs(options.angle) * Math.PI) / 180);
      } else {
        console.warn(
          `${WARN} height is not a number or 'auto'. Please check your options.`
        );
        return "";
      }
    }
  }

  //设置画布的长宽。包含水印之间的间隔（后续长宽按照 options 中计算）
  const ratio = window.devicePixelRatio || 1;
  canvas.width = (options.width + spaceX) * ratio;
  canvas.height = (options.height + spaceY) * ratio;

  //缩放当前绘图至更大或更小
  context.scale(ratio, ratio);
  //旋转角度（文本自身旋转）
  // context.rotate((options.angle * Math.PI) / 180);

  setCtxFont(context, options);

  // [test] 给整个画布添加一个红色边框
  if (__DEV__) {
    context.strokeStyle = "red";
    context.strokeRect(0, 0, canvas.width, canvas.height);
  }

  //在画布上绘制填色的文本（输出的文本，开始绘制文本的X坐标位置，开始绘制文本的Y坐标位置）。默认从画布的左中开始
  drawText(
    context,
    str,
    0,
    (options.angle < 0 ? 1 : 0) *
    options.width *
    Math.sin((Math.abs(options.angle) * Math.PI) / 180) + lineHeight * (4 / 5), // bottom 对齐
    options.width,
    lineHeight,
    options.angle
  );

  // 生成base64位图片
  const base64Url = canvas.toDataURL("image/png");

  // 清除画布
  context.clearRect(0, 0, canvas.width, canvas.height);
  context = null;
  canvas = null;

  if (
    dom !== document.body &&
    (dom.style.position === "" || dom.style.position === "static")
  ) {
    dom.style.position = "relative";
  }

  const wmContainer = document.createElement("div");
  wmContainer.id = id;
  // wmContainer.classList.add("x-watermark-container");
  wmContainer.style.pointerEvents = "none";
  wmContainer.style.overflow = "hidden";
  wmContainer.style.top = "0";
  wmContainer.style.left = "0";
  wmContainer.style.margin = "0";
  wmContainer.style.padding = "0";
  wmContainer.style.position = dom === document.body ? "fixed" : "absolute";
  wmContainer.style.zIndex = `${options.zIndex}`;
  wmContainer.style.opacity = `${options.alpha}`;
  wmContainer.style.paddingTop = `${options.top}px`;
  wmContainer.style.paddingLeft = `${options.left}px`;
  wmContainer.style.width =
    (dom.clientWidth || document.documentElement.clientWidth) -
    options.left +
    "px";
  wmContainer.style.height =
    (dom.clientHeight || document.documentElement.clientHeight) -
    options.top +
    "px";

  const div = document.createElement("div");
  // div.classList.add("x-watermark-content");
  div.style.width = "100%";
  div.style.height = "100%";
  div.style.margin = "0";
  div.style.padding = "0";

  // 根据模式设置背景
  div.style.backgroundImage = `url(${base64Url})`;
  div.style.backgroundPosition = "0 0";
  switch (options.mode) {
    case "horizontal":
    case "h":
    case "x":
      div.style.backgroundRepeat = "repeat-x";
      break;
    case "vertical":
    case "v":
    case "y":
      div.style.backgroundRepeat = "repeat-y";
      break;
    case "stagger":
    case "s":
      div.style.backgroundImage = `url(${base64Url}), url(${base64Url})`;
      div.style.backgroundRepeat = "repeat, repeat";
      div.style.backgroundPosition = `0 0, ${(options.width + spaceX) / 2}px ${(options.height + spaceY) / 2}px`;
      break;
    case "normal":
    case "n":
    default:
      div.style.backgroundRepeat = "repeat";
  }

  // 最后设置背景大小
  div.style.backgroundSize = `${options.width + spaceX}px ${options.height + spaceY}px`;

  // [test]
  if (__DEV__) {
    div.style.backgroundRepeat = "no-repeat";
    wmContainer.style.opacity = "1";
  }

  wmContainer.appendChild(div);
  dom.appendChild(wmContainer);

  return base64Url;
};

class Watermark {
  _observerObs = null;
  _preventObs = null;

  _targetNode = null;

  /**
   * 生成的水印 base64 图片
   */
  base64 = "";

  /**
   * 水印文字内容
   */
  content = "";

  /**
   * 水印配置项
   */
  _options = Object.assign({}, defaultOptions);

  /**
   * Creates an instance of Watermark.
   * 两种方式：
   * - 不传参，直接实例化一个空水印对象，可以后续调用 init 方法
   * - 支持直接初始化，传参等同于 init 方法
   * @param {string | null} str
   * @param {object} opts
   * @returns
   */
  constructor(str = null, opts = {}) {
    if (str) {
      return this.init(str, opts);
    }
  }

  /**
   * 初始化水印。只会添加一次
   * @param {string} str
   * @param {object} opts
   */
  init(str, opts = {}) {
    this._options = Object.assign(
      {},
      defaultOptions,
      { id: generateRandomId() },
      opts
    );
    this.content = str;

    this._targetNode = this._options.parentSelector
      ? document.querySelector(this._options.parentSelector)
      : this._options.parentNode;

    if (!this._targetNode) {
      console.warn(
        `${WARN} You have set 'options.parentSelector': (${this._options.parentSelector}), but it seems that the selector does not match any element. You may need to refresh manually or change/delete the selector param.`
      );

      return
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this._do());
    } else {
      this._do();
    }

    window.addEventListener("resize", () => this._do());

    if (this._options.observer) {
      const ResizeObserver =
        window.ResizeObserver || window.WebKitResizeObserver;

      if (ResizeObserver) {
        this._observerObs = new ResizeObserver(
          throttle(entries => {
            entries.forEach(entry => {
              this._do();
            });
          }),
          100
        );

        // 选择目标节点
        const target =
          this._options.observerNode || this._targetNode;
        this._observerObs.observe(target, { attributes: true });
      } else {
        console.warn(
          `${WARN} You have set 'options.observer', but it seems that your current env does not support ResizeObserver. You may need to refresh manually.`
        );
      }
    }

    if (this._options.prevent) {
      // 监听水印修改，防止被篡改
      const MutationObserver =
        window.MutationObserver || window.WebKitMutationObserver;

      if (MutationObserver) {
        this._preventObs = new MutationObserver(
          throttle(mutations => {
            mutations.forEach(mutation => {
              this._do();
            });
          }, 100)
        );

        // 选择目标节点
        this._preventObs.observe(this._targetNode, {
          attributes: true,
          subtree: true,
          childList: true,
          characterData: true,
          attributeOldValue: true,
          characterDataOldValue: true
        });
      } else {
        console.warn(
          `${WARN} You have set 'options.prevent', but it seems that your current env does not support MutationObserver. You may need to do it manually.`
        );
      }
    }

    return this;
  }

  /**
   * 重载水印。不传参则使用上一次的参数
   * @param {string} str
   * @param {object | undefined} opts
   */
  reload(str, opts) {
    this.remove();

    if (str) {
      this.content = str;
    }

    if (opts && typeof opts === "object") {
      this._options = Object.assign(
        {},
        defaultOptions,
        { id: generateRandomId() },
        opts
      );
    }

    return this.init(this.content, this._options);
  }

  /**
   * 移除水印
   */
  remove() {
    this._dispose();

    return deleteElement(this._options.id);
  }

  _do() {
    // 根据倍数计算各种数值
    if (typeof this._options.ratio === "number" && this._options.ratio !== 1) {
      this._options.top *= this._options.ratio;
      this._options.left *= this._options.ratio;
      this._options.xSpace *= this._options.ratio;
      this._options.ySpace *= this._options.ratio;
      this._options.fontsize *= this._options.ratio;

      // 单独计算宽高
      if (typeof this._options.width === "number") {
        this._options.width *= this._options.ratio;
      }

      if (typeof this._options.height === "number") {
        this._options.height *= this._options.ratio;
      }
    }

    this.base64 = setWatermark(this._targetNode, this.content, this._options);
  }

  _dispose() {
    if (this._observerObs) {
      this._observerObs.disconnect();
      this._observerObs = null;
    }

    if (this._preventObs) {
      this._preventObs.disconnect();
      this._preventObs = null;
    }

    window.removeEventListener("resize", this._do);
  }
}

export const XWatermark = Watermark;
export default Watermark;

function throttle(func, limit) {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

function generateRandomId() {
  return (
    "x-watermark-" +
    Math.floor(Math.random() * 0xffffff)
      .toString(16)
      .padStart(6, "0")
  );
}
