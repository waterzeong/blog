title: "4分钟学会网页样式[译]"
date: 2016-07-27 22:00:00 +0800
update: 2016-07-28 23:00:00 +0800
author: me
cover: "-/images/web-design-in-4-minutes.png"
tags:
    - CSS
    - 前端
preview: 比方说，你想要在自己网站上分享一个产品，或者是一个作品集，又或者仅仅只是一个灵感。在你发布到网上之前，你想让它看起来有吸引力，专业，或者至少得看起来像那么回事。那么你接下来该做什么呢？

---
比方说，你想要在自己网站上分享一个产品，或者是一个作品集，又或者仅仅只是一个灵感。在你发布到网上之前，你想让它看起来有吸引力，专业，或者至少得看起来像那么回事。

那么你接下来该做什么呢？

## 文本

设计的目的是为了增强它所应用到的内容的表现形式。这看上去是显而易见的事，但内容是一个网站的主要元素，它不应该在发布后才想到要调整。
编写的内容，就像你目前正在阅读的文章，组成了超过90%的网页。为这个文本内容添加样式将有一个很长的路要走。
让我们假设你已经完成了你想发布的内容，同时已经创建了一个空的`style.css`文件，什么是你可以写的第一条规则？

## 居中

长文本很难解析，也因此不易阅读。每行设置字符限制，可以大大提高大量文本的可读性和吸引力。
```
body {
  margin: 0 auto;
  max-width: 50em;
}
```
在为文本容器添加了样式后，为文本本身添加样式可好？

## 字体

浏览器的默认字体为`Times`，可看起来缺乏吸引力（主要是因为它是“无样式”字体）。切换到一个无衬线字体，如`Helvetica`或`Arial`可以大大提高你网页的可读性。
```
body {
  font-family: "Helvetica", "Arial", sans-serif;
}
```
如果你坚持要用衬线体，可以试试`Georgia`。
当我们让文本更具吸引力时，也需要让它更具可读性。

## 间隔

当用户觉得一个页面`崩坏`的时候，通常来说都是`间距`问题。通过在文本周围和文本内设置适当的间距就可以增加页面的吸引力。
```
body {
  line-height: 1.5;
  padding: 4em 1em;
}

h2 {
  margin-top: 1em;
  padding-top: 1em;
}
```
虽然到目前为止布局已经大大改善，但让我们添加更多细节处理。

## 颜色和对比度

白色背景上的黑色文字看起来会比较扎眼。为文本选择一款较软一点的黑色，让页面阅读起来更舒服。
```
body {
  color: #555;
}
```
为了保持一个良好的`对比度`，让我们为`重要`文本选择一个更黑暗的阴影。
```
h1,
h2,
strong {
  color: #333;
}
```
虽然大部分页面在视觉上已经有所提升，但是一些元素依然显得格格不入，如代码段。

## 平衡

只需要一些额外的调整就可以平衡页面：
```
code,
pre {
  background: #eee;
}

code {
  padding: 2px 4px;
  vertical-align: text-bottom;
}

pre {
  padding: 1em;
}
```
在这一点上，你可能想让你的页面脱颖而出，让它更有个性。

## 主色调

大多数品牌都有一个`主色调`，作为视觉基调。在一个网页上，这个主色调可以用来强调交互元素，如`链接`。
```
a {
  color: #e81c4f;
}
```
但是为了保持平衡/协调，我们还需要一些额外的颜色。

## 辅助色

主色调可以用更微妙的色调来补充，用于边框，背景，甚至正文中。
```
body {
  color: #566b78;
}

code,
pre {
  background: #f5f7f9;
  border-bottom: 1px solid #d8dee9;
  color: #a7adba;
}

pre {
  border-left: 2px solid #69c;
}
```
已经改变了色调，为什么不一并改变外形/字体...

## 自定义字体

由于文本是网页的主要内容，使用`自定义字体`能使页面更加引人注目。
当你可以嵌入自己的网页字体或使用类似[Typekit](https://typekit.com/)的在线服务时，让我们使用免费[谷歌字体](https://fonts.google.com/)`Roboto`：
```
@import 'https://fonts.googleapis.com/css?family=Roboto:300,400,500';

body {
  font-family: "Roboto", "Helvetica", "Arial", sans-serif;
}
```
在通过自定义字体凸显你的个性后，想让页面更加丰富多彩又怎么办呢？

![Spongebob rainbow meme saying 'Images'](https://raw.githubusercontent.com/jgthms/web-design-in-4-minutes/master/images.png)

图片和图标既可用来作为支持你的内容的装饰品，还可以在你想要传达的信息中担当积极部分。

让我们从[Unsplash](https://unsplash.com/photos/qH36EgNjPJY)挑选一张漂亮的背景图片来美化`header`。
```
header {
  background-color: #263d36;
  background-image: url("header.jpg");
  background-position: center top;
  background-repeat: no-repeat;
  background-size: cover;
  line-height: 1.2;
  padding: 10vw 2em;
  text-align: center;
}
```
添加`logo`
```
header img {
  display: inline-block;
  height: 120px;
  vertical-align: top;
  width: 120px;
}
```
让我们借这个机会，来提高文本格调。
```
header h1 {
  color: white;
  font-size: 2.5em;
  font-weight: 300;
}

header a {
  border: 1px solid #e81c4f;
  border-radius: 290486px;
  color: white;
  font-size: 0.6em;
  letter-spacing: 0.2em;
  padding: 1em 2em;
  text-transform: uppercase;
  text-decoration: none;
  transition: none 200ms ease-out;
  transition-property: color, background;
}

header a:hover {
  background:  #e81c4f;
  color: white;
}
```
[瞧！](#)

按照网页设计的基本原则，我们在短短几分钟内设计了一个像样的页面。只剩下最后一件事啦...

## 分享爱！

[**GitHub**下载链接](https://github.com/jgthms/web-design-in-4-minutes)

[**Facebook**分享链接](http://www.facebook.com/sharer.php?u=http%3A%2F%2Fjgthms.com%2Fweb-design-in-4-minutes%2F)

[**Twitter**分享链接](https://twitter.com/intent/tweet?text=Web%20Design%20in%204%20minutes&url=http%3A%2F%2Fjgthms.com%2Fweb-design-in-4-minutes%2F&via=jgthms)


如果你想学习更过网页设计, 查看 [**MarkSheet**](http://marksheet.io/), 我的免费 HTML 和 CSS 指南.
又或者你想马上开始尝试网页设计, 试试 [**Bulma**](http://bulma.io/), 这是我基于Flexbox的 CSS 框架.

## 总结 - Web Design in 4 minutes

这篇文章介绍了基本的网页设计过程和设计原则，一步步分解过程，让刚开始接触网页设计的人，也可以很快找到感觉，希望这篇文章能在你刚接触网页设计不知所措的时，给到你些帮助。

感谢阅读！

> 本文译自2016年的[《Web Design in 4 minutes》 - Jeremy Thomas](http://jgthms.com/web-design-in-4-minutes/)，第一次翻译，同时对原文有理解性改动，水平有限，欢迎提出意见。
