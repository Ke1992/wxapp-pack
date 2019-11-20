### 1、入口   
&emsp;&emsp;主包、子包和sitemap.json   
&emsp;&emsp;子包允许subpackages、subPackages   
### 2、JS   
&emsp;&emsp;import（普通、任意位置、省略后缀）   
&emsp;&emsp;require（普通、不存在的文件、任意位置、省略后缀）   
&emsp;&emsp;export * from '';   
&emsp;&emsp;export {a} from '';   
&emsp;&emsp;.min后缀   
&emsp;&emsp;循环引用   
### 3、JSON（usingComponents）   
&emsp;&emsp;文件级引用（xx/xx/compontent）   
&emsp;&emsp;文件夹级引用（xx/xx）   
&emsp;&emsp;绝对路径（似乎只能指定文件级）   
&emsp;&emsp;全局组件（似乎只能指定文件级）   
### 4、WXML   
&emsp;&emsp;wxs（普通、内嵌）   
&emsp;&emsp;import（普通、绝对路径、省略后缀）   
&emsp;&emsp;include（普通、绝对路径、省略后缀）   
### 5、WXS   
&emsp;&emsp;require（普通、不存在的文件）   
### 6、WXSS   
&emsp;&emsp;import（普通、绝对路径、省略后缀）   
### 7、其他   
&emsp;&emsp;图片   
&emsp;&emsp;注释（JS、WXML、WXS、WXSS、内嵌WXS）   
