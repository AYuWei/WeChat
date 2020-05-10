// pages/easy/page/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content : '',
    imgArr : [],
    userId : ''
  },
  textChange(e){
    this.setData({
      content : e.detail.value,
    })
  },
  AddChange(e){
    let that = this;
    that.upLoginFile(that.data.userId)
  },
  // 图片 获取路径
  upLoginFile(userId){
    let that = this;
    // 获取图片路径
    wx.chooseImage({
      success(res){
        wx.showLoading({
          title: '正在添加图片...',
        })
        // 获取图片集合路径
        let imagelist = res.tempFilePaths;
        for(let i = 0; i < imagelist.length ; i ++){
          let name = that.getRandomName();
          // 图片上传 
          that.setUpLoadImg(imagelist[i], name, userId);
        };
      },
      fail(res){
        wx.showToast({
          title: '【获取图片路径失败】',
          icon :"none",
          duration : 2000
        })
      }
    })
  },
  
  // 图片上传
  setUpLoadImg(src,name, userId){
    let that = this;
    wx.cloud.uploadFile({
      cloudPath : "MaxBossnote/"+ userId +"/"+ name + ".png",
      filePath : src,
      success(res){
        wx.hideLoading();
        that.getTempFileUrl(res.fileID, userId,"upData");
      },
      fail(res){
        wx.showToast({
          title: '上传失败',
          icon :"none",
          duration : 2000
        })
      }
    })
  } ,

    /**
   *  获的上传后的临时文件路径转化为真实的路径，然后保存到用户数据库
   * @param {*} res 存储路径url
   * @param {*} userId 存储云id
   * @param {*} cloudData 判断存储是查找什么表6
   */
  getTempFileUrl(res = [], userId, cloudData){
    let that = this;
    wx.cloud.getTempFileURL({
      fileList : [res],
      success(res){
        let url = res.fileList[0].tempFileURL; // 真实路径
        let id = res.fileList[0].fileID; // 获取存储的id
        that.setData({
          imgArr : [...that.data.imgArr,{
            url : url,
            id : id,
          }]
        })
        // that.upDate(url, userId, id, cloudData);
      },
    })
  },

    // 存储数据表
    upDate(url, userId, cloudData){ 
      let that = this;
      wx.cloud.callFunction({
        name : "MaxBoss",
        data : {
          type : cloudData,
          src : url,   
          cloudId : userId,
        },
        success(res){
          if(res.result == null){
            wx.hideLoading();
            wx.showToast({
              title: "添加失败！",
              duration : 2000,
              icon : "none"
            })
          } else {
            wx.showToast({
              title: "添加成功！",
              duration : 2000,
              icon : "none"
            });
            wx.navigateBack({
              delta : 1
            })
          }
        }
      })
    },
  
  // 获取图片存储的随机名
  getRandomName(){
    let resone = "zxcvbnmasdfghjklpoiuytrewq".split('');
    let restwo = "1234567890".split("");
    let data = [...resone, ...restwo]
    data = data.sort((a,b) => a - b)
    let result = '';
    for(let i = 0 ; i < 9 ; i ++){
       let index = Math.floor( Math.random() * data.length );
       result += data[index]
    }
    return result;
  },

  BaoCuenChange(){
    let that = this;
    let dataID = that.getRandomName();
    let data = new Date().toLocaleString();
     if(this.data.content != ''){
       that.upDate({
         content : this.data.content,
         imgarr : this.data.imgArr,
         data : data,
         id : dataID,
       }, this.data.userId,  "upDataNote");
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
    let that = this;
    wx.getStorage({
      key: 'UserMessage',
      complete(res){
        that.setData({
          userId : res.data == undefined ? 'imageAll' : res.data.cloudId
        })
      }
    })
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