const app = getApp()

Page({
  data: {
    list: [],
    tabs:['tab0', 'tab1']
  },
  createArray(){
    let list = new Array(10).fill(1);
    return list.map(item => {
      return {
        id: Math.random(),
        text: `阿西吧爸爸${Math.random()}`
      }
    })
  },
  swiperMoveEnd(e){
    console.log('当前下标：'+e.detail.current)
  },
  onLoad: function () {
   this.setData({
    list: this.createArray()
   })
  },
})
