
let ajax = require("../../../../utils/config");
var arr = require("./data.js")

Component({

  // 生命周期函数
  lifetimes : {
    // 此需要网络请求。
    attached(){
      // 发送ajax请求
      this.getAjax(this.data.data, this.data.appkey, this.data.index)
      arr = this.disposeTime(arr)
      this.setData({
        newsListArr : arr
      })
    }
  },


  /**
   * 组件的属性列表
   */
  properties: {
    data : {
      type : String,
      value : 'top',
      observer : function(data){
        this.setData({
          data : data,
        })
        // 发送ajax请求
      this.getAjax(this.data.data, this.data.appkey, this.data.index)
      }
    },
    pageIndex : {
      type : Number,
      value : 1,
      observer : function(index){
        this.setData({
          pageIndex : index
        })
        // 发送ajax请求
      this.getAjax(this.data.data, this.data.appkey, this.data.index)
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: { 
    newsListArr : [],
    appkey : "d5e228834b3734cfa88abd1feb499395",
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 点击事件
    NewsListChange(e){
      let data = e.currentTarget.dataset.data;
      this.triggerEvent("NewsListChange", data)
    },

    // 时间转换
    getDate(oldDate){
      let newDate = new Date(); // 获取当前的时间
      let newYear = newDate.toLocaleDateString().split("/"); // 获取当前的 年-月-日
      let newTime = newDate.toTimeString().slice(0,5).split(":"); // 获取当前的 时-分

      let oldYear = oldDate.slice(0,10).split("-"); // 获取发布的 年-月-日
      let oldTime = oldDate.slice(11,17).split(":"); // 获取发布的 时-分

      let resultYear = [newYear[0] - oldYear[0] , newYear[1] - oldYear[1], newYear[2] - oldYear[2]]; // 最终的年月日
      let resultTime = [newTime[0] - oldTime[0], newTime[1] - oldTime[1]];
     
      let minute =  resultTime[1] > 0 ? resultTime[1]  : 60 + resultTime[1];
     
  
      return {
        year : resultYear[0], // 年
        month : resultYear[1], // 月
        date : resultYear[2], // 日
        hour : resultTime[0], // 时
        minute : minute < 0 ? 1 : minute// 分
      }
    },

    // 数据请求
    getAjax(type, appkey, index){
      ajax.ajax("GET", type, appkey, index, (res) => {
        // 成功回调
        if(res.statusCode === 200) {
          // 处理一下，映射一下时间
          let arr = res.data.result.data; // 当前所有数据
          this.disposeTime(arr);
        } else {
          wx.showToast({
            title: '今日请求限制！',
            duration : 4000
          })
        }

      }, (res) => {
        // 失败回调
        wx.showToast({
          title: '调用接口失败...',
          duration : 2000,
          icon : "none"
        })
      })
    },

    // 处理时间格式
    disposeTime(arr){
      let data = arr.map(item => {
        let time = this.getDate(item.date);
  
        let result = '';

        if(time.hour <= 2  && time.date == 0 && time.year == 0 && time.month == 0){
         result = time.minute + "分钟前"
        } else  if(time.hour >= 2 && time.date == 0 && time.year == 0 && time.month == 0){
          result = time.hour + "小时前"
        }else  if(time.date != 0 && time.year == 0 && time.month == 0){
          result = time.date + "天前"
        }
        return {
          ...item,
          data : result,
          minute : time.minute
        }

     })
    // 对上面的进行排序
      data = data.sort((a , b) => {
        return a.minute - b.minute;
      })
      this.setData({
          newsListArr : [
            ...data,
            this.data.newsListArr
          ],
      })
      }
    },

    
})
