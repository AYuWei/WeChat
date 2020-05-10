
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  
  // 处理缓存中的数据 NewsTop
  setList_NewsTop(res){
    let timeData = res.data;
    let data = new Date();
    let timermoney = data.toLocaleDateString().slice(5,data.toLocaleDateString().length ) + " " + data.toTimeString().slice(0,5);
    timeData["time"] = timermoney;
    let paragraphArr = [] // / 处理content内容
    let arr = timeData.content.split("。");
    // 处理内容区的循环
    for(var i = 1 ; i < arr.length ; i ++){
      paragraphArr.push(arr[i-1]+"。")
    }
    timeData["content"] = paragraphArr

    this.setData({
      list : timeData
    })
  },

   // 处理缓存中的数据 NewsList
  setList_NewsList(res){
    let timeData = res.data;

    // 此处有苦说不清，因为微信小程序中不支持第三方插件，无法使用cheerio来进行爬取页面中的数据，试了很多方法，结果得出了一个道理，无法使用第三方库。【失败告终】 我们就以图片给呈现出来吧。
    // 处理url 获得主要的路径
    // var url = this.getUrlData(timeData.url);    
    
    // 发送网络请求
    // this.getQueryPage(url)

    let time = timeData.date.slice(5,16);
    timeData["time"] = time;
    this.setData({
      list : timeData
    })
  },

  // 发送网络请求页面
  getQueryPage(dataUrl){
    let that = this;
    let url = "https://mini.eastday.com"; // 主域名
    let appkey = "qid=02263";  // 域名后面的参数
    let newUrl = url + "/a/" + dataUrl + "?" + appkey;
    wx.request({
      url: newUrl,
      headers: {
        'Content-Type': 'application/json'
      },
      success(res){
        that.successData(res.data);
      },
      fail(res){
        return ;
      }
    })
  },

  // 处理发送请求的url 获取主要字段
  getUrlData(url){

    let data = url.split("F");
    return data[data.length - 1];
  },

  // 请求成功返回页面的数据处理
  successData(res){
    var html = JSON.stringify(res); // 转化为json格式
    
    var arr = html.split('<body>')[1].split('<p>')
  
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    wx.getStorage({
      key: 'pageData',
      success(res){
        
        if(res.data.id_name == "NewsTop"){
          that.setList_NewsTop(res);
        } else if(res.data.id_name == "NewsList") {
         
          that.setList_NewsList(res)
        }
        
      },
      fail(res){
       return ;
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