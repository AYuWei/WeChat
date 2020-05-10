// pages/hot/hot.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentChannel : 'top', //当前的频道
  },

  // 置顶导航条触发事件
  pageChange(e){
   
    let data = e.detail.appkey;
    this.setData({
      currentChannel : data
    })
  },

  // 置顶新闻触发事件
  TopNewsChange(e){
   
    this.navigatePage(e.detail, "NewsTop")
  },

  // 新闻列表项
  NewsListChange(e){
   
    this.navigatePage(e.detail, "NewsList")
  },

  // 页面跳转
  navigatePage(data, name){
    // 参跳转的参数传递到缓存中
    wx.setStorage({
      data: {
        ...data,
        id_name : name
      },
      key: 'pageData',
    })
    wx.navigateTo({
      url: './page/newsPage',
      success(res){

      },
      fail(res){
        console.error(res);
        
      }
    })
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