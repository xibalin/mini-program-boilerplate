const ACTIVE_LIST_LENGTH = 3; //  进行轮播的数组长度
Component({
  options: {
    multipleSlots: true
  },
  properties: {
    data: {
      type: Array,
      value: [],
      observer (newVal, oldVal) {
        this.setData({
          list: newVal,
        });
        if (newVal.length > 0 && oldVal.length == 0) {
          this.setData({
            activeList: newVal.slice(0, 3),
          });
        }
      }
    },
    current: {
      type: Number,
      value: 0,
      observer (newVal) {
        this.setData({
          active: newVal
        }, ()=>{
          this.setNewList(newVal);
        })
      }
    },
    slotTag: {
      type: String,
      value: 'id'
    },
    height:{
      type: String,
      value: '100vh'
    },
    width:{
      type: String,
      value: '100vw'
    },
    direction: {
      type: String,
      value: 'horizontal' // 横向值为horizontal,竖向为vertical
    }
  },
  data: {
    list: [],
    activeList:[],
    active: 0, //展示的swiper的实际下标
    currentActive: 0,
    move: 0,
    touchstartPosition: 0,
    transforming: false, // 是否在切换中状态
    lastMoveTime: +new Date(),
  },
  methods: {
    throttle(method, delay){
      let now = +new Date();
      if(now - this.data.lastMoveTime > delay){
          method.apply(this,arguments);
          this.data.lastMoveTime = now;
      }
    },
    direcitonIsVertical(){
      return this.properties.direction == 'vertical'
    },
    getPageDirection(){
      return this.direcitonIsVertical() ? 'pageY' : 'pageX'
    },
    touchstart (e) {
      this.data.recordPosition = e.touches[0][this.getPageDirection()];
      this.data.touchstartPosition = e.touches[0][this.getPageDirection()];
    },
    touchmove(e) {
      if (!this.data.transforming) {
        let { recordPosition, move } = this.data;
        move += e.touches[0][this.getPageDirection()] - recordPosition;
        recordPosition = e.touches[0][this.getPageDirection()];
        this.data.recordPosition = recordPosition;
        if (!this.direcitonIsVertical()) { //竖向切换不跟手
          this.setData({move})
        }
      }
      this.throttle(()=>{
        this.triggerEvent('move')
      },300);
    },
    //  计算新的缓存队列
    getActiveArr () {
      let { active, list } = this.data;
      if (active == list.length - 1) {
        return {
          currentActive: 2,
          activeList: list.slice(list.length - 3, list.length),
        }
      } else if (active == 0) {
        return {
          currentActive: 0,
          activeList: list.slice(0, 3),
        }
      } else {
        return {
          currentActive: 1,
          activeList: list.slice(active - 1, active + 2),
        }
      }
      
    },
    touchend (e) {
      if (!this.data.transforming) {
        this.data.transforming = true;
        let { touchstartPosition, windowWidth, active, currentActive, list, recordPosition } = this.data;
        let isSwitchNext = recordPosition < touchstartPosition;
        let shouldSwipe = Math.abs(recordPosition - touchstartPosition) > (windowWidth / 20);
        let tmpActive = active + (isSwitchNext ?  1 : -1);
        if (shouldSwipe && tmpActive >= 0 && tmpActive < list.length) {
          active = tmpActive
        }
        let tmpCurrentActive = currentActive + (isSwitchNext ?  1 : -1);
        if (shouldSwipe && tmpCurrentActive >= 0 && tmpCurrentActive <= ACTIVE_LIST_LENGTH - 1) {
          currentActive = tmpCurrentActive;
        }
        let move = -currentActive * windowWidth;
        this.setData({
          transforming: true,
        }, ()=>{
          this.setData({
            active,
            move,
          }, () => {
            setTimeout(()=>{
              this.setNewList(active);
            }, 500)
          })
        })
        
      }
    },
    //  设置新的轮播元素
    setNewList(active){
      let newActiveListObj = this.getActiveArr();
      this.setData({
        activeList: newActiveListObj.activeList,
        currentActive: newActiveListObj.currentActive,
        move: -newActiveListObj.currentActive * this.data.windowWidth,
        transforming: false,
      })
      this.triggerEvent('change', {current: Number(active)})
    },
    //  获取容器信息
    getContainerInfo(){
      return new Promise((resolve)=>{
        const query = this.createSelectorQuery()
        query.select('#xbSwiper').boundingClientRect()
        query.exec(function (res) {
          resolve(res[0])
        })
      })
    }
  },
  ready () {
    this.getContainerInfo().then(res=>{
      let movingWidth = 0;
      let { width, height } = res;
      movingWidth = this.direcitonIsVertical() ? height : width;
      this.data.windowWidth = movingWidth;
    });
  }
})