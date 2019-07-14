require('./report.less');
import * as indexService from '../../services/index'; 


Page({
    data:{
      items: [
        {name: 'QZ', value: '欺诈',checked:false},
        {name: 'SQ', value: '色情',checked:false},
        {name: 'XDXW', value: '诱导行为',checked:false},
        {name: 'BSXX', value: '不实信息',checked:false},
        {name: 'WFFZ', value: '违法犯罪',checked:false},
        {name: 'ZZYY', value: '政治谣言',checked:false},
        {name: 'EYYX', value: '恶意营销',checked:false},
      ],
      phone:null,
      subFlg:false,
      value:''
    },
    onLoad(option){
      const {publishid} = option
      this.setData({
        publishid
      })
    },
    onShow(){
      this.checkRadio();
    },
    radioChange: function(e) {
      // console.log('radio发生change事件，携带value值为：', e.detail.value);
      this.setData({
        subFlg:true,
        value:e.detail.value
      })
    },
    checkRadio(){
      this.data.items.map(item=>{
        if(item.checked){
          console.log(item.value)
          return;
        }
      })
    },
    radio: params => /^1[34578]\d{9}$/.test(params),
    phoneFn(e){
      
      this.setData({
        phone:e.detail.value
      })
    },
    subFn(){
      const {value,phone} = this.data;
      if(this.radio(phone) || !phone){
        indexService
        .report({
          publishId:this.data.publishid,
          reportContent:value,
          contact:phone
        })
        .then(res => {
          // console.log("举报:",res)
          wx.showToast({title: '提交成功'})
          wx.redirectTo({
            url: `/pages/post/post?id=${this.data.publishid}`
          })
        })
        
      }else{
        console.log("error")
      }
      
    }

  })