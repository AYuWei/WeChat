let data = "https://mini.eastday.com";

let shuangua = "http://apis.juhe.cn"; //算卦的主域名

// 自定义request请求的基类

// 请求类型， 请求参数， 请求id
function ajax(Type, data, appkey, pageIndex = 1, successData, failData){
  let methonType = "application/json";
  let url = '';

  // 访问的主域名
  let https = "https://v.juhe.cn";

  // 页面请求的域名
 

  if(Type === "GET"){
    url = https + "/toutiao/index?type=" + data + "&key=" + appkey + "&page=" + pageIndex;
  }
 
  console.log("【ajax】", url)

  wx.request({
    url: url,
    method : Type,
    header : {
      "content-type" : methonType
    },
    data : {},
    success(res) {
      successData(res);
    },
    fail(res){
      failData(res)
    },
    complete(res){

    }
  })
}

module.exports = {
  ajax : ajax
}

