require('./help.less');

const { getStorage, setStorage } = require('../../utils/storage');
import * as personalService from '../../services/personal';

Page({
  data:{
    // problemList:[
    //   {
    //     problem:"如何提现到微信钱包",
    //     answer:"提现会收取10%的手续费，申请提现后会在1-5个工作日内转账到您的微信钱包",
    //     num:0,
    //     flag:false,
    //     style:"height:0px;",
    //     class:""
    //   },
    //   {
    //     problem:"提现会收服务费吗，多久到账",
    //     answer:"提现会收取10%的手续费，申请提现后会在1-5个工作日内转账到您的微信钱包",
    //     num:1,
    //     flag:false,
    //     style:"height:0px;",
    //     class:""
    //   }
    // ],
    problemList:[]
  },
  onShow(){
    
    
  },
  onLoad(){
    wx.showLoading({title:'加载中...'})
    personalService
    .questions()
    .then(res => {
      console.log(res)
      let list = res;
      list.map((item,index)=>{
        item.num = index;
        item.flag = false;
        item.style="height:0px;"
        item.class=""
      })
      this.setData({
        problemList:list
      })
      wx.hideLoading()
    })
  },
  getAnswerFn(e){
    const {num} = e.currentTarget.dataset;
    let list = this.data.problemList;
    // console.log('num:',num);
    // list[num].flag;

    if(!list[num].flag){
      list[num].flag = true;
      list[num].style="height:auto;";
      list[num].class="up";
      this.setData({
        problemList:list
      })
    }else{
      list[num].flag = false;
      list[num].style="height:0;";
      list[num].class="";
      this.setData({
        problemList:list
      })
    }

    
  }
})