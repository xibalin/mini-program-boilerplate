## 开发规范
   * 小图标统一找xibalin更新iconfont
   * 图片超过50k找xibalin要cdn地址
   * 加图片应在static目录下创建于页面同名目录再添加
   * box-sizing默认用border-box
   * css类名用-，id用驼峰
   * components不允许添加其它组件，组件放在自己开发的页面目录下
   * 引用了别的页面的组件请在马蛋中说明并知会xibalin外加记入mr
   * utils中添加方法请在马蛋中说明并知会xibalin外加记入mr
   * 后端接口返回格式统一是`{data:{}, code: 200, msg: ''}`，登录过期统一code是401，有例外向xibalin反映，写接口的人估计也活不长了
   * mockjs是什么，我不知道
   * 要下架的功能如果涉及代码超过5行，统一删代码，拒绝注释，要重新上架的话在git log中找
  
## 公用方法: utils/util（具体用法看代码）

## 公用请求：utils/request(4.7号前都不是最终版)
   * 使用示例： `request().get(apiurl, query).then(res=>{
      // do sth
    })`

## 公用组件
### emptyView(加载失败页) props:
  * noticeText:加载失败提示信息
  * slot:额外信息插槽

### ListView(长列表) props:
#### props:
  * query:查询条件，object
  * showLoading: 加载时是否提示，boolean
  * refresh:值发生变化时会重置列表，boolean
#### slot:
  * empty:无数据时的插槽，无默认，
  * list-con:列表插槽，
#### event:
  * loaded: 加载完成事件，数据放在e.detail.data

### loading(加载页) props:
  * show:是否显示

### tabs(就是tabs嘛(╯‵□′)╯︵┻━┻，此处不看也罢，初定优化负责人：yumingGUO) 
#### props:
  * tabs:展示在头部的文案集合，array
  * defaultActiveTab: 默认显示的tab
#### slot:
  * tab-{{index}}:对应tabs的tabpanel

### xb-swiper(解决原生swiper组件扛不住节点过多的问题) 
#### props:
  * data: 用于展示的数据，array
  * current: 当前展示的元素，对应data的下标
  * slotTag: 用于对应插槽，以data中元素的某个字段作为对应，默认是id
  * height: 组件高度，默认为100vh, 需自定义时请带上单位，如100rpx
  * width: 组件宽度，默认为100vw, 需自定义时请带上单位，如100rpx
  * direction: 组件切换方向
#### slot: data多长slot就有多少个，slot-name为data[slotTag]，详情咨询xibalin
#### event:
  * change: 组件变化完成时触发，返回当前元素对应data的位置(e.detail.current)
  * move: 组件变化过程中触发
    