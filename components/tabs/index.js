Component({
  options:{
    multipleSlots: true 
  },
  properties: {
    tabs:{
      type: Array,
      value: [],
    },
    defaultActiveTab: {
      type: Number,
      value: 0,
      observer(){
        let activeTab = Math.min(this.properties.defaultActiveTab, this.properties.tabs.length - 1);
        activeTab = Math.max(activeTab ,0)
        this.setData({activeTab})
      }
    },
  },
  data: {
    activeTab: 0,
  },
  methods: {
    tabClick(e){
      this.setData({activeTab: e.currentTarget.dataset.index});
    }
  },
  ready(){
    this.setData({activeTab: this.properties.defaultActiveTab})
  }
})