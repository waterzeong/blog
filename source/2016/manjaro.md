title: "Enjoy Manjaro"
date: 2016-06-01 22:00:00 +0800
update: 2016-06-08 23:00:00 +0800
author: me
cover: "-/images/manjaro-gnome.jpg"
tags:
    - Linux
    - 系统
preview: Manjaro Linux是面向桌面的、用户友好的、基于Arch Linux的发行版。它的一些显著特性包括：一份直观的安装程序、自动硬件检测、用于管理图形卡的特别Bash脚本、一组额外的桌面配置选项。 Manjaro Linux带有三份样式，分别采用Xfce、GNOME 3（使用Cinnamon Shell）、KDE桌面。

---
## Manjaro简介
Manjaro Linux 是面向桌面的、用户友好的、基于 Arch Linux 的发行版。它的一些显著特性包括：一份直观的安装程序、自动硬件检测、用于管理图形卡的特别 Bash 脚本、一组额外的桌面配置选项。 Manjaro Linux 带有三份样式，分别采用 Xfce、GNOME 3（使用Cinnamon Shell）、KDE 桌面。
![Manjaro](-/images/manjaro-gnome.jpg)
## 写在前面
在尝试安装 Arch 之后才接触到的 Manjaro ，相比之下 Manjaro 安装简单，只需要少量配置，即可使用，降低了初学者的入门门槛，让过渡更加平缓。分享一下自己的安装过程，给刚从 Windows 过渡来的小伙伴一些参考。
## 启动盘
* 下载ISO,[官网传送门](http://manjaro.github.io/download/)，页面底部有torrents链接。
* 启动盘制作工具：[Image Writer](https://launchpad.net/win32-image-writer/)，[其他工具传送门](https://wiki.manjaro.org/index.php?title=Burn_an_ISO_File)。
## 安装
* 进入boot直接选择之前制作好的安装介质启动。
* 建议启动安装后选择第二项闭源驱动，Manjaro 会帮你安装好基本驱动，十分省事。
* 剩下的就是点点点...
## 额外配置
### 添加`archlinuxCN`源
```
sudo nano /etc/pacman.conf
在文件底部加入如下几行
[archlinuxcn]
SigLevel = Optional TrustedOnly
Server = https://mirrors.ustc.edu.cn/archlinuxcn/$arch
```
### 安装`中文`输入法
以安装`搜狗`为例
```
sudo pacman -S fcitx-sogoupinyin
sudo pacman -S fcitx-im
sudo pacman -S fcitx-configtool
```
设置中文输入法`环境变量`，否则中文输入法无法启动
```
sudo nano ~/.xprofile
export GTK_IM_MODULE=fcitx
export QT_IM_MODULE=fcitx
export XMODIFIERS="@im=fcitx"
```
保存成功后，在终端输入`fcitx`启动服务
### 开发环境
经过以上基本设置，Manjaro 即可达到可用的状态，接着可以根据自己的需要构建开发环境，通过`pacman`安装应用非常方便，一条命令即可完成。

推荐一些自己用到的前端开发工具
* chrome
* atom
* git
* nodejs
* npm

最后推荐一款主题 [arc-theme](https://github.com/horst3180/Arc-theme)，一款漂亮的扁平化主题。
## 总结
Manjaro 的安装过程非常简单，同时也是基于 Arch Linux 的一个相对完整的发行版，有较好的稳定性、易用、人性化，就像其官网宣传的能达到开机即用的自由操作系统，这也为想要体验自由系统的用户提供了另一种途径，让更多用户可以更平缓的进入自由系统的世界，Enjoy Manjaro!

> 本作品采用 [知识共享署名 4.0 国际许可协议](https://creativecommons.org/licenses/by/4.0/) 进行许可。
