// pages/hot/component/navTop/navTop.js
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
    navTopactive : "要闻",
		// 头部导航栏数据
		navTap : [
			{
				title : "要闻",
				appkey : "top",
				id : 0
			},
			{
				title : "社会",
				appkey : "shehui",
				id : 1
			},
			{
				title : "体育",
				appkey : "tiyu",
				id : 2
			},
			{
				title : "军事",
				appkey : "junshi",
				id : 3
			},
			{
				title : "科技",
				appkey : "keji",
				id : 4
			},
			{
				title : "财经",
				appkey : "caijing",
				id : 5
			},
			{
				title : "娱乐",
				appkey : "yule",
				id : 6
			},
			{
				title : "时尚",
				appkey : "shishang",
				id : 7
			},
			{
				title : "国内",
				appkey : "guonei",
				id : 8
			},
			{
				title : "国际",
				appkey : "guoji",
				id : 9
			}
		],
  },

  /**
   * 组件的方法列表
   */
  methods: {
    NavTopChange(e){
      let data = e.currentTarget.dataset.navtopdata;

      this.setData({
        navTopactive : data.title,
      });
      
      // 触发使用组件中的事件
      this.triggerEvent("pageChange",data);
    }
  }
})
