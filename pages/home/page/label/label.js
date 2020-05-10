// pages/home/page/label/label.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    noteAll : [],
  },
  getImageAll(hj){
    let that = this;
  
    wx.cloud.callFunction({
      name : "MaxBossImage",
      data : {
        _id : hj
      },
      success(res){
      
        if(res.result.data.data == undefined){
          that.setData({
            noteAll : [],
          });
          return;
        } else {
            console.log(res)
            that.setData({
              noteAll : res.result.data.note == undefined ? [] : res.result.data.note,
            })
        }
      },
      fail(res){
       return ;
      }
    })
  },

  noteTop(e){
    let that = this;
    wx.setStorage({
      data: {
        ...e.currentTarget.dataset
      },
      key: 'NoteData',
    });
    //  页面切换
    wx.navigateTo({
      url: './page/openPage',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    wx.getStorage({
      key: 'UserMessage',
      success(res){
        that.getImageAll(res.data.hj)
      }
    })
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