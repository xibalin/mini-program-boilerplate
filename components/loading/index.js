Component({
  properties: {
    show: {
      type: Boolean,
      value: true,
      observer(){
        if (!this.properties.show){
          this.disappear();
        }
      }
    },
  },
  data: {
    loadingShow: true,
    domShow: true,
  },
  methods: {
    disappear(){
      this.setData({
        loadingShow: false,
      }, ()=>{
        setTimeout(()=>{
          this.setData({domShow: false})
        }, 600)
      })
    }
  },
  ready(){
    this.setData({
      loadingShow: this.properties.show,
      domShow: this.properties.show,
    })
  }
})