# X-Watermark

![X-Watermark](logo.png)

![](https://img.shields.io/npm/v/@xpyjs/watermark.svg) ![](https://badgen.net/npm/dt/@xpyjs/watermark) ![](https://img.shields.io/npm/l/@xpyjs/watermark.svg)

`X-Watermark` 是一款易用的 JavaScript `X-Watermark` ，通过简单的配置，就可以在网页的任何位置添加水印效果。

## 特性

- 任意位置：可以挂载到任意 DOM 节点上，以便在任意位置显示水印
- 动态计算宽度和高度：水印可以根据内容长度和容器宽度进行自适应调整，确保水印始终显示完整。
- 自动换行：当水印内容超过容器宽度时，水印会自动进行换行，以便适应容器的大小。
- 动态监听：`X-Watermark` 会监听 DOM 变化，还可以指定某个 DOM，以便发生变化时自动更新水印。
- 防止删除：`X-Watermark` 会监听自身变化，如果发现水印被删除，会自动重新添加水印。
- 多种样式选择：水印支持多种样式，包括平铺、横向、纵向以及错位铺等多种形式，满足不同需求。
- 高度可定制化：水印的样式、颜色、透明度等都可以根据需求进行定制，以满足不同场景的需求。
- 支持 TypeScript：`X-Watermark` 提供了完整的类型定义，可以在 TypeScript 项目中直接使用。

## 快速开始

### CDN

```js
<script src="https://unpkg.com/@xpyjs/watermark"></script>

// or
<script src="https://cdn.jsdelivr.net/npm/@xpyjs/watermark"></script>
```

```js
const watermark = new XWatermark.XWatermark();

watermark.init('Watermark Text', {
  parentSelector: '#container'; // 优先级高于 parentNode
});

// or
watermark.init('Watermark Text', {
  parentNode: document.getElementById('container');
});
```

### 安装

使用 npm 安装`X-Watermark` ：

```shell
npm install @xpyjs/watermark --save
```

### 引入

在你的 JavaScript 文件中引入 `X-Watermark` ：

```javascript
import XWatermark from '@xpyjs/watermark';
```

### 使用

创建一个水印实例，并将其应用于指定的 DOM 元素：

```javascript
const watermark = new XWatermark();

watermark.init('Watermark Text', {
  parentSelector: '#container'; // 优先级高于 parentNode
});

// or
watermark.init('Watermark Text', {
  parentNode: document.getElementById('container');
});
```

以上代码将在 id 为 `container` 的 DOM 元素中应用一个平铺样式的水印，水印内容为 "Watermark Text"。

## 配置选项

`X-Watermark` 提供了丰富的配置选项，以便根据需求进行定制。

请参阅[完整类型](./types/index.d.ts)以获取所有配置选项的详细说明。

## 贡献

如果你发现了任何问题或有任何改进意见，请随时提出 issue 或发送 pull request。我们欢迎并感谢你的贡献。

## 许可证

`X-Watermark` 基于 MIT 许可证进行分发。请参阅[许可证文件](./LICENSE)以获取更多信息。
