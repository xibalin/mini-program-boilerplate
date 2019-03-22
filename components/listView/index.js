import request from '../../utils/request';

Component({
  options:{
    multipleSlots: true 
  },
  properties: {
    query: {
      type: Object,
      value: {}
    },
    apiUrl: {
      type: String,
      value: ''
    },
    showLoading: {
      type: Boolean,
      value: true
    },
    refresh: {
      type: Boolean,
      value: false,
      observer(){
        this.data.listQuery = {
          ...this.data.listQuery,
          page: 1
        }
        !this.data.firstLoading && this.loadData().then(res=>{
          let { list } = this.data;
          this.triggerEvent('loaded', {data: list})
        });
      }
    }
  },
  data:{
    list:[],
    loading: true,
    firstLoading: true,
    listQuery: {
      page: 1,
      cnt: 20,
    },
    total: 0,
    noMore: false,
  },
  methods: {
    loadData(){
      let { listQuery, noMore } = this.data;
      let { apiUrl } = this.properties;
      let propertiesQuery = this.properties.query;
      let query = {
        ...propertiesQuery,
        ...listQuery,
      };
      this.setData({loading: true});
      return request().post(apiUrl, query).then(res=>{
        
        if (res.status_code == 200){
          let { data } = res.data;
          let list = [];
          if (query.page == 1){
            list = data;
          } else {
            list = this.data.list.concat(data);
          }
          this.setData({
            list,
            noMore: !data.length,
            total: res.data.total,
            loading: false,
            listQuery: {
              ...query,
              page: query.page + 1,
            }
          }, ()=>{
            return res;
          })
        } else {
          this.setData({loading: false});
          wx.showToast({
            icon: 'none',
            title: res.message,
          })
        }
      }).catch(res=>{
        console.log(res)
        this.setData({loading: false});
        wx.showToast({
          icon: 'none',
          title: '请重试',
        })  
      })
    },
    scrollToLower(){
      if (!this.data.noMore){
        this.loadData().then(res=>{
          let { list } = this.data;
          this.triggerEvent('loaded', {data: list})
        })
      }
    }
  },
  ready(){
    this.properties.showLoading && wx.showLoading({title: '正在加载', mask: true});
    this.loadData().then(res=>{
      this.setData({firstLoading: false})
      wx.hideLoading();
      this.triggerEvent('loaded', {data: this.data.list})
    });
  }
})