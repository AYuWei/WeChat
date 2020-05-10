// pages/hot/component/topNews/topNews.js
Component({
  // 生命周期
  lifetimes : {
    attached(){
      // 数据项为空的时候显示加载
      if(this.data.newsTitleArr.length == 0){
        wx.showLoading({
          title: '加载中...',
        })
      }

      let that = this;
      wx.cloud.callFunction({
        name : "MaxBoss",
        data : {
          type : "queryTopNewsList"
        }
      }).then((res) => {
        // console.log("【热点置顶返回结果】",res.result.data.data);
        let data = res.result.data.data;
        data = that.RandomTwo(data)
        wx.hideLoading();
        that.setData({
          newsTitleArr : data,
        })
      })
    }
  },

  /**
   * 组件的属性列表
   */
  properties: {
    newsTitleArr : {
      type : Array
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    newsTitleArr : []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    RandomTwo(data){
     let result = [];
     for(let i = 0 ; i < data.length ; i ++){
       let random = Math.floor(Math.random() * data.length);
       result.push(data[random])
       data.splice(random, 1);
     }
     return result;
    },
    TopNewsChange(e){
      let data = e.currentTarget.dataset.news;
      // 点击事件，给父页面处理
      this.triggerEvent("TopNewsChange", data)
    }
  }
})
