// pages/easy/page/openPage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pagedata : '',
    imgArr : '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    wx.getStorage({
      key: 'NoteData',
      success(res){
        that.setData({
          pagedata : res.data.item,
          imgArr : res.data.item.imgarr,
        })
      },
      fail(res){
        return ;
      }
    })
  },
  imgChange(e){
    let index = e.currentTarget.dataset.index;
    let arr = [];
  
    this.data.imgArr.forEach((item,i)=>{
      arr.push(item.url);
    })
    wx.previewImage({
      urls: arr,
      current : arr[index]
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