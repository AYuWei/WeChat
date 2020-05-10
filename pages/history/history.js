// pages/history/history.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    men : '',
    women : '',
    isResult : false,
    conter : "",
  },
  MenInput(e){
    this.setData({
      men : e.detail.value,
    })
  },
  WoMenInput(e){
    this.setData({
      women : e.detail.value,
    })
  },
  butChange(e){
    let that = this;
    let Men = this.ifData(this.data.men);
    let WoMen = this.ifData(this.data.women);
    if(Men != 'error' && WoMen != "error"){
      that.queryAjax(Men,WoMen);
      wx.showLoading({
        title: '请稍后...',
      })
    } else {
      wx.showToast({
        title: '输入有误！',
        icon : "none",
        duration : 2000
      })
    }
  },
  queryAjax(men,women){
    let that = this;
    let appkey = "329c250db3ee4f8f818d8facc97852d3";
    let url = "https://apis.juhe.cn"
    wx.request({
      url:  url + "/sxpd/query?men=" + men + "&women=" + women +"&key=" + appkey,
      method : "GET",
      header : {
        "content-type" : "application/json"
      },
      data : {},
      success(res){
        that.setData({
          conter : res.data.result.data,
          isResult : true,
        });
        wx.hideLoading();
      },
      fail(res){
       wx.showToast({
         title: '请求超时',
         icon : "none",
         duration : 2000
       })
      }

    })
  },
  ifData(data){
    switch(data){
      case "鼠" :  
        return "%E9%BC%A0";
      case "牛" :  
        return "%E7%89%9B";
      case "虎" :  
        return "%E8%99%8E";
      case "兔" :  
        return "%E5%85%94";
      case "龙" :  
        return "%E9%BE%99";
      case "蛇" :  
        return "%E8%9B%87";
      case "马" :  
        return "%E9%A9%AC";
      case "羊" :  
        return "%E7%BE%8A";
      case "猴" :  
        return "%E7%8C%B4";
      case "鸡" :  
        return "%E9%B8%A1";
      case "狗" :  
        return "%E7%8B%97";
      case "猪" :  
        return "%E7%8C%AA";
      break;
      
      default :
        return "error"
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})