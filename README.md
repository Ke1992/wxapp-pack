# wxapp-pack
一个使用文件依赖分析的小程序打包工具
# 环境要求
NodeJs要求 v8.3.0 以上
# 下载安装
```
npm install -g wxapp-pack
```
# 特性
* 文件依赖分析
* 未使用文件分析
* 文件依赖图绘制
* 代码压缩
# 命令行用法
### build
```
$ wxapp-pack b
$ wxapp-pack build
```
![build](https://raw.githubusercontent.com/Ke1992/wxapp-pack/master/docs/assets/build.gif "build")
### analyse
```
$ wxapp-pack a
$ wxapp-pack analyse

$ wxapp-pack analyse -n (不绘制文件依赖图)
$ wxapp-pack analyse --nograph
```
![analyse](https://raw.githubusercontent.com/Ke1992/wxapp-pack/master/docs/assets/analyse.gif "analyse")
![browser](https://raw.githubusercontent.com/Ke1992/wxapp-pack/master/docs/assets/browser.gif "browser")
### config
```
$ wxapp-pack c
$ wxapp-pack config
```
![config](https://raw.githubusercontent.com/Ke1992/wxapp-pack/master/docs/assets/config.gif "config")
# 配置项
使用.wxapp-pack.json文件来存储配置项
### before
编译前需要额外执行的命令
### output
编译结果输出目录
### analyse
分析文件输出目录
### imageExtList
允许复制的图片后缀列表
### terserConfig
js压缩配置，具体配置项见https://github.com/terser/terser
### babelGeneratorConfig
wxs压缩配置，具体配置项见https://babeljs.io/docs/en/babel-generator
### analyseWhiteList
未使用文件白名单
### invalidFileWhitelist
无效文件白名单
### showUpdateTips
是否允许提示更新信息
# 其他
### wxapp-pack不支持什么？
* 不支持动态import，例如：import('a.js').then();
* require和import不支持模板语法，例如：require(\`./lib${1}.js\`);
* 不支持js文件使用绝对路径引用，因为小程序不支持
### wxapp-pack如果压缩代码？
#### js
使用[terser](https://github.com/terser/terser)进行压缩，默认压缩配置如下: 
```
{
    "mangle": false,
    "compress": false
}
```
#### json
不进行任何压缩
#### wxml
仅使用[decomment](https://github.com/vitaly-t/decomment)进行注释移除（不会移除内嵌wxs中的注释）
#### wxs
使用[@babel/generator](https://babeljs.io/docs/en/babel-generator)进行压缩，默认压缩配置如下:
```
{
    "comments": false
}
```
#### wxss
仅使用[postcss](https://postcss.org/)进行注释移除
#### image
不进行任何压缩
