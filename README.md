# SpiderReader
闲着无事熟悉熟悉react native项目，正好最近看小说是弹出广告，所以做了个不需要服务端的爬虫应用

## 初期规划
能够切换来源，支持本地存储文章和导出为txt等功能，结果做完了一部分的时候发现还麻烦，所以暂时先开着，以后在说

## 主要技术
主体技术当然就是react-native做基础框架，用的context组件间通信（通信并不多），@react-navigation作为路由功能，cheerio作为解析html工具，realm作为本地存储，fetch作为数据请求

## 流程

### 菜单流程
点开页面

   ↓

获取远程数据和本地数据

   ↓

数据进行对比

   ↓

两端数据不同 → 直接使用本地数据

  ↓

去重

  ↓

过滤本地数据

   ↓

存入数据库

   ↓

把远程数据和本地数据合并，并渲染列表
