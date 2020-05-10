// pages/home/popup/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    value : ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    valChange(e){
      this.setData({
        value : e.detail.value,
      })
    },
    addChange(e){
      console.log(this.data.value)
      console.log(e)
      this.triggerEvent("addHuanJing", this.data.value)
    }
  }
})
