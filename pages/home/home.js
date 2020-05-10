/**
 *  点击我的环境之前
 *    需要判断是否授权
 *      授权：可以点击
 * 
 *      没授权：不能点击 -- 提示需要授权
 */
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user_image : "../../image/user.png",
    user_title : "立即授权",
    listActive : 'a',
    popup : false,
    huanjing : "imageAll",
    list : [
      {
        src : "../../image/db.png",
        title : "我的环境",
        right : "../../image/right.png"
      },
      {
        src : "../../image/sc.png",
        title : "我的收藏",
        right : "../../image/right.png"
      },
      {
        src : "../../image/rw.png",
        title : "我的任务",
        right : "../../image/right.png"
      },
      {
        src : "../../image/bq.png",
        title : "我的标签",
        right : "../../image/right.png"
      },
      {
        src : "../../image/sz.png",
        title : "我的设置",
        right : "../../image/right.png"
      },
     
    ]
  },
  // 点击授权
  addUserMessage(e){
    let that = this;
    // 判断是否授权
    if(e.detail.userInfo){
     
      let data = { 
        ...e.detail.userInfo,
      };
      // 储存用户授权信息
      that.setStordata({...data, cloudId : "imageAll"});

    } else {
     wx.showToast({
       title: '取消授权',
       icon : "none",
       duration : 2000
     })
    }
     
  },

  // 判断是否存在该用户
  queryDbUser(result){

    let that = this;
    // 调用云函数判断
    wx.cloud.callFunction({
      name : "MaxBoss",
      data : {
        type : "queryDbUser",
        cloudId: result.cloudId,
      },
      complete(res){
   
       if(res.result == null){
       
         that.addUser(result);
         
       } else {
        
         wx.showToast({
          title: '切换成功！',
          duration : 2000,
          icon : 'none'
        })
       }
      
       return ;
      }
    });

    // 重新设置缓存
    this.setStordata(result)
  },

  /**
   *  添加数据表
   * */ 
  addUser(res){
   
    wx.cloud.callFunction({
      name : "MaxBoss",
      data : {
        type : "addDbUser",
        ...res,
      },
      success(res){
       
        wx.showToast({
          title: '添加成功！',
          duration : 2000,
          icon : 'none'
        })
      },
      fail(res){
       return ;
      }
    });
    return ;
  },

  /**
   * 点击列表项
    */ 
  listChange(e){
    let data = e.currentTarget.dataset; // 获取当前点击的
    let that = this;
    this.setData({
      listActive : data.index,
    })
    setTimeout(() => {
      that.setData({
        listActive : 'a',
      })
    } , 50)

    // 判断是否打开或者关闭蒙层【自定义组件】
    if(data.index == 0){

        wx.getStorage({
          key: 'UserMessage',
          complete(res){
            if(res.data == undefined){
              wx.showToast({
                title: '请先授权',
                icon : "none",
                duration : 1000,
                success(res){
                  return;
                }
              })
            } else {
              setTimeout(()=>{
                that.popupChange();
              },500) 
            }
          }
        })
    }

    // 页面跳转 
    if(data.index == 4 && data.item.title == "我的设置"){
      wx.navigateTo({
        url: './page/setingPage/setingPage',
      })
    }
    if(data.index == 3){
      wx.navigateTo({
        url: './page/label/label',
      })
    }
    if(data.index == 2 ){
      wx.navigateTo({
        url: './page/task/task',
      })
    }
    if(data.index == 1 ){
      wx.navigateTo({
        url: './page/collect/collect',
      })
    }
  },


  /**
   * 
   * 添加环境的回调 -- 成功后取数据库找信息，没找到则创建表 
   */
  addHuanJing(e){
    let that = this;
  
    if(e.detail !== ''){
      wx.showModal({
        cancelColor: 'cancelColor',
        title : "合同",
        content : "是否创建【"+e.detail+"】环境！",
        success(res){
          let data = e.detail;
         if(res.confirm){
          that.setData({
            huanjing :data,
          })
          // 获取缓存  -- 查询
          that.getStordata(that.queryDbUser, data);
         }

        }
      })
    }
    this.popupChange();
  },

  /*
  存储用户信息
  */
  setStordata(val){
    let that = this;
    let hj = val.cloudId;
    wx.setStorage({
      data: {...val, hj},
      key: 'UserMessage',
      success(res){
        
        that.setData({
          user_title : val.nickName,
          user_image : val.avatarUrl,
          huanjing :hj
        })
      },
      fail(res){
        return ;
      }
    })
  },

  /**
   * 获取存储用户信息  -- 存储
   * 
   * @param {*} callback  回调函数
   * @param {*} data  传递的参数，没传递默认 ''
   */
  getStordata(callback = function(res){},data = ''){
    let that = this;
    wx.getStorage({
      key : "UserMessage",
      complete: async function(res){
        callback({
          ...res.data,
          cloudId : data,
        })
      },
    })
  },

  // 关闭蒙层
  popupChange(){
    this.setData({
      popup : !this.data.popup
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
    let that = this;
    // 判断用户是否授权【缓存中】
    wx.getStorage({
      key: 'UserMessage',
      success(res){
        // let hj = res.data.cloudId == undefined ? 'imageAll' : res.data.cloudId ;
        that.setStordata(res.data)
        that.setData({
          user_image : res.data.avatarUrl,
          user_title : res.data.nickName,
        })
      },
      fail(res){
        that.setData({
          user_title : "立即授权"
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