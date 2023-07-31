declare module "@xpyjs/watermark" {
  interface Options {
    /**
     * 水印总体的id
     */
    id: string;
    /**
     * 水印起始 top 位置
     */
    top: number;
    /**
     * 水印起始 left 位置
     */
    left: number;
    /**
     * 水印行数
     */
    rows: number;
    /**
     * 水印列数
     */
    cols: number;
    /**
     * 水印x轴间隔
     */
    xSpace: number;
    /**
     * 水印y轴间隔
     */
    ySpace: number;
    /**
     * 水印大小的倍数，可以用来做高清适配
     */
    ratio: number;
    /**
     * 水印字体
     */
    font: string;
    /**
     * 水印字体粗细
     */
    weight: string;
    /**
     * 水印字体颜色
     */
    color: string;
    /**
     * 水印字体大小
     */
    fontsize: number;
    /**
     * 水印透明度，要求设置在大于等于0.005
     */
    alpha: number;
    /**
     * 水印倾斜度数
     */
    angle: number;
    /**
     * 水印层级
     */
    zIndex: number;
    /**
     * 水印宽度
     */
    width: number | string | "auto";
    /**
     * 水印长度
     */
    height: number | string | "auto";
    /**
     * 平铺模式。支持: normal(默认，简写n) | horizontal(横向平铺，h、x) | vertical(纵向平铺， v、y) | stagger(交错，s;
     */
    mode:
      | "normal"
      | "horizontal"
      | "vertical"
      | "stagger"
      | "n"
      | "h"
      | "x"
      | "v"
      | "y"
      | "s";
    /**
     * 水印插件挂载的父元素element,不输入则默认挂在body上
     */
    parentNode: Element | null;
    /**
     *  是否观察父元素变化，自动更新水印
     */
    observer: boolean;
    /**
     *  要观察的元素，不传则默认为 parentNode
     */
    observerNode: Element | null;
  }

  /**
   * 水印对象
   */
  export default class Watermark {
    /**
     * 生成的水印 base64 图片
     */
    base64: string;

    /**
     * 水印文字内容
     */
    content: string;

    /**
     * 水印配置项
     */
    options: Options;

    /**
     * 构造方法。
     * 两种方式：
     * - 不传参，直接实例化一个空水印对象，可以后续调用 init 方法
     * - 支持直接初始化，传参等同于 init 方法
     */
    constructor(str?: string | null, opts?: Partial<Options>);

    /**
     * 初始化水印。只会添加一次
     */
    init(str: string, opts: Partial<Options>): Watermark;

    /**
     * 重载水印。不传参则使用上一次的参数
     */
    reload(str: string, opts?: Partial<Options>): Watermark;

    /**
     * 移除水印
     */
    remove(): boolean;
  }
}
