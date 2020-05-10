// 获取全局的音频
const globalMusic = wx.getBackgroundAudioManager();


Page({

  /**
   * 页面的初始数据
   */
  data: {
    musiclist : [],
    musicIndex : 0,
    imageAll : [],
    noteAll : [], 
    current : "img",  // 判断当前的图片或记录集
    Imglongtap : false, // 判断是否打开删除按钮
    isdelete : "add",
    userId : 'userId', // 获取云函数的环境 id
    isNote : '',
  },

  // 图片集
  ChangeImg(){
    this.setData({
      current : "img"
    })
    globalMusic.play(); // 播放音乐
  },
  ChangeVideo(){
    this.setData({
      current : "note"
    });
    globalMusic.pause(); // 暂停音乐
  },

  // 当点击图片时候参生的时间
  ImgChange(e){
    let that = this;
     if(!this.data.Imglongtap){
      let imgList = [];
      let imgindex = e.currentTarget.dataset.index;
      let imgId = e.currentTarget.dataset.item; // 获得item
      this.data.imageAll.forEach((item, i) => {
        imgList.push(item.url);
      })
      this.PreviewImage(imgList, imgindex)
     } else {
       setTimeout(()=>{
        that.setData({
          Imglongtap : false,
          isdelete : "add",
         })
       },1000)
     }
     return ;
  },

  noteTop(e){
    let that = this;
    this.setData({
      isNote : e.currentTarget.dataset.index
    }),
    setTimeout(()=>{
      that.setData({
        isNote : '',
      })
    },10)
    if(!this.data.Imglongtap){
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
    } else {
      setTimeout(()=>{
        that.setData({
          Imglongtap : false,
          isdelete : "add",
         })
       },1000)
    }
    
  },

  // 手指点击图片0.5秒后触发  -- 出现删除按钮
  ImgLongTap(e){
    let that = this;
    this.setData({
      Imglongtap : true,
      isdelete : "delete"
    });
    wx.setStorage({
      data: {
        ...e.currentTarget.dataset,
        userId : that.data.userId,
      },
      key: 'deleteData',
    })
  }, 

  //  手指点击视频0.5秒后触发
  NoteLongTap(e){
    let that = this;
    this.setData({
      Imglongtap : true,
      isdelete : "delete"
    });
    wx.setStorage({
      data: {
        id : e.currentTarget.dataset.item.id,
        userId : that.data.userId,
        imgarr : e.currentTarget.dataset.item.imgarr != undefined ? e.currentTarget.dataset.item.imgarr : [],
      },
      key: 'deleteData',
    })
  },

  // 点击删除按钮 
  deleteChange(e){
    let that = this;
    // 判断是否登录
    wx.getStorage({
      key: 'UserMessage',
      complete(res){
       if(res.data == undefined){
         wx.showToast({
           title: '请先登陆！',
           icon : "none",
           duration: 2000,
         })
       } else {
        //  执行删除
        // 判断删除的执行云函数的 type类型
          let data = that.data.current == 'img' ? 'removeImg' : 'removeNote'
          if(data == "removeImg"){
            that.DeleteImg(data);
          } else if(data == "removeNote") {
            that.DeleteNote(data);
          }

       }
      }
    })
  },

  // 删除  -- tupian
  DeleteImg(typeData){
    let that = this;
    // 获取需要删除项
    wx.getStorage({
      key: 'deleteData',
      success(res){
        let cloudID = res.data.userId; // 获取云id
        let dataUrl = res.data.item.url // 获取url
        let dataId = res.data.item.id;
        let data = [dataId];

        // 删除云数据库
        wx.cloud.deleteFile({
          fileList : data
        }).then(res => {
          wx.showLoading({
            title: '正在删除...',
          })
          // 删除云数据库表
          wx.cloud.callFunction({
            name : "MaxBoss",
            data : {
              type : typeData,
              dataId : dataId,
              cloudId : cloudID,
              dataUrl : dataUrl,
            },
            complete(res){
              that.getImageAll(that.data.userId);
              wx.hideLoading();
              wx.showToast({
                title: '删除数据表成功',
                icon : "none",
                duration : 1000,
              })
            }
          })
        }).catch(e => {
          console.error(e);
        });
      }
    })
  },

  // 删除 note
  DeleteNote(typeData){
    let that = this;
    wx.getStorage({
      key: 'deleteData',
      success(res){
        let dataId = res.data.id;
        let userId = res.data.userId;
       
        // 判断删除中是否有图片数据 是否为空
        that.isImageArr(res.data.imgarr);

        wx.showLoading({
          title: '正在删除',
        })
        // 删除数据表
        wx.cloud.callFunction({
          name : "MaxBoss",
          data : {
            type : typeData,
            dataId : dataId,
            cloudId : userId,
          },
          complete(res){
            that.getImageAll(that.data.userId);
            wx.hideLoading();
            wx.showToast({
              title: '删除数据表成功',
              icon : "none",
              duration : 1000,
            });
            
          }
        })
      }
    })
  },

  isImageArr(arr){
     
    if(arr.length != 0){
      for(let i = 0 ; i < arr.length ; i ++){
        // 开始删除数据库图片
        let cloudId = arr[i].id;
        wx.cloud.deleteFile({
          fileList : [cloudId],
          success(res){
           return;
          }
        })
      }
    }
  },

  //  在新页面中全屏预览图片
  PreviewImage(imgList, imgindex){
    wx.previewImage({
      urls: imgList,
      current : imgList[imgindex],
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    wx.cloud.callFunction({
      name : "MaxBossMusic",
      data : {
        type : ""
      },
      success(res){
       that.setData({
         musiclist : res.result.data.data
       });
       that.onPlay(that.data.musicIndex)
      },
      fail(res){
        return ;
      }
    });

    
  },

  // 播放时触发的事件
  onPlay(index){
    let that = this;
    try{
      let result = this.data.musiclist;
      globalMusic.title = result[index].author_name;
      globalMusic.src = result[index].url;
     
      // 监听播放结束事件
      globalMusic.onEnded(function(){
        let length =that.data.musicIndex + 1 % that.data.musiclist.length;
        if(length == that.data.musiclist.length){
          length = 0;
        }
        that.setData({
          musicIndex : length,
        })
        that.onPlay(length);
      });
    }catch(e){
      console.error(e)
    }
  },


  // 获取所有的图片集
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
            imageAll : [],
            noteAll : [],
          });
          return;
        } else {
          let data =  res.result.data.data;
            if(data.length % 2 !== 0){
              data.push({url : ""});
            } 
          
            that.setData({
              imageAll : data,
              noteAll : res.result.data.note == undefined ? [] : res.result.data.note,
            })
        }
      },
      fail(res){
        wx.showToast({
          title: '取消上传！',
          icon :"none",
          duration : 2000
        })
      }
    })
  },


  // 添加自己的图片/note集
  addChange(){
    let that = this;
    let current = this.data.current;
    //  这里判断后面是否登录，后面处理。现在直接来
    wx.getStorage({
      key: 'UserMessage',
      complete(res){
       if(res.data == undefined){
         wx.showToast({
           title: '请先登陆！',
           icon : "none",
           duration: 2000,
         })
       } else {
           // 上传  图片
         if(current === 'img'){
          that.upLoginFile(res.data.hj);
          // 上传 note
         } else if(current === 'note'){
           that.upLoginNote(res.data.hj);
         }
       }
      }
    })
  },

  // 上传note
  upLoginNote(userId){
    // 页面跳转
    wx.navigateTo({
      url: './page/index',
    })
  },

  // 图片 获取路径
  upLoginFile(userId){
    let that = this;
    // 获取图片路径
    wx.chooseImage({
      success(res){
        wx.showLoading({
          title: '上传中...',
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
      cloudPath : "MaxBossImg/"+ userId +"/"+ name + ".png",
      filePath : src,
      success(res){
       
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
        that.upDate(url, userId, id, cloudData);
      },
    })
  },

  // 存储数据表
  upDate(url, userId, id, cloudData){
    let that = this;
    wx.cloud.callFunction({
      name : "MaxBoss",
      data : {
        type : cloudData,
        src : {
          url : url,
          id : id
        },   
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
          wx.hideLoading();
          wx.showToast({
            title: "添加成功！",
            duration : 2000,
            icon : "none"
          });
          that.onShow()
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
       if(res.data == undefined){
         that.getImageAll("imageAll")
       } else {
        let huanjing = res.data.cloudId;
        //  获取所有的图片集
         that.getImageAll(huanjing);
       }
      
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