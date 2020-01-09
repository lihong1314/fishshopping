require('./index.less');

const { getStorage, setStorage } = require('../../utils/storage');
const { checkLogin, message } = require('../../utils/index.js');
import '../../components/tip/tip.less';
import '../../components/disable/tip.less';
import * as wxp from '../../services/wxp';
import * as indexService from '../../services/index'; 
const account = require('../../services/account.js');
const App = getApp();



Page({
  data:{
    ruzhuFn:false,
    distanceArr:[5,10,20,30,50,80,100,150],
    distanceNum:null,
    tuijianFl:false,
    distancebFl:true,
    addjiantou:false,
    addweight:0,
    distance:30,
    isShowMod:false,
    windowHeight:0,
    windowWidth:0,
    offset: 1,
    limit: 10,
    total: 0,
    tuijianList:[],
    disableFlag:false
    
  },
  initLocation() {
    let that = this;
    wxp
      .getLocation()
      .then((res) =>{
        setStorage('location',{latitude:res.latitude.toFixed(4),longitude:res.longitude.toFixed(4)})
        that.setData({
          location:{latitude:res.latitude.toFixed(4),longitude:res.longitude.toFixed(4)}
        })
        const { cuserId,access } = getStorage( 'USER_INFO' ) || {};
        if(access != "Y" && access){
          that.setData({
            disableFlag:true
          })
        }
        that.getList();
      })
      .catch(err=>{
        this.setData({
          weizhiFlg:true
        })
        
        
      })
      
  },
  checkLocation() {
    let that = this;
    wx.getLocation({
      type: "wgs84",
      success(res) {
        //如果首次授权成功则执行地图定位操作，具体实现代码与此文无关，就不贴出
        setStorage('location',{latitude:res.latitude.toFixed(4),longitude:res.longitude.toFixed(4)})
        that.setData({
          location:{latitude:res.latitude.toFixed(4),longitude:res.longitude.toFixed(4)}
        })
        const { cuserId,access } = getStorage( 'USER_INFO' ) || {};
        if(access != "Y" && access){
          that.setData({
            disableFlag:true
          })
        }
        that.getList(false);
      },
      fail: function(res) {
        //授权失败
        wx.getSetting({
          //获取用户的当前设置，返回值中只会出现小程序已经向用户请求过的权限
          success: function(res) {
            //成功调用授权窗口
            var statu = res.authSetting;
            if (!statu["scope.userLocation"]) {
              //如果设置中没有位置权限
              wx.showModal({
                //弹窗提示
                title: "是否授权当前位置",
                showCancel:false,
                content:
                  "地理位置授权后显示页面内容",
                success: function(tip) {
                  if (tip.confirm) {
                    wx.openSetting({
                      //点击确定则调其用户设置
                      success: function(data) {
                        if (data.authSetting["scope.userLocation"] === true) {
                          //如果设置成功
                          wx.showToast({
                            //弹窗提示
                            title: "授权成功",
                            icon: "success",
                            duration: 1000
                          });
                          wx.getLocation({
                            //通过getLocation方法获取数据
                            type: "wgs84",
                            success(res) {
                              //成功的执行方法
                              setStorage('location',{latitude:res.latitude.toFixed(4),longitude:res.longitude.toFixed(4)})
                              that.setData({
                                location:{latitude:res.latitude.toFixed(4),longitude:res.longitude.toFixed(4)}
                              })
                              const { cuserId,access } = getStorage( 'USER_INFO' ) || {};
                              if(access != "Y" && access){
                                that.setData({
                                  disableFlag:true
                                })
                              }
                              that.getList(false);
                            }
                          });
                        }
                      }
                    });
                  } else {
                    //点击取消按钮，则刷新当前页面
                    wx.redirectTo({
                      //销毁当前页面，并跳转到当前页面
                      url: "/pages/index/index" //此处按照自己的需求更改
                    });
                  }
                }
              });
            }
          },
          fail: function(res) {
            wx.showToast({
              title: "调用授权窗口失败",
              icon: "success",
              duration: 1000
            });
          }
        });
      }
    });
   },
  selectList(e){
    const {num} = e.currentTarget.dataset;
    this.setData({
      distanceNum:num,
      tuijianFl:false,
      addjiantou:false,
      distance:this.data.distanceArr[num],
      tuijianList:[],
      offset: 1,
      total: 0,
    })
    this.getList()
  },
  showdistanceb(){
    this.setData({
      tuijianFl:!this.data.tuijianFl,
      addjiantou:!this.data.addjiantou
    })
  },
  hiddenFn(){
    this.setData({
      tuijianFl:false,
      addjiantou:false
    })
  },
  recommendFn(){
    this.setData({
      distancebFl:true,
      addweight:0,
      tuijianList:[],
      offset: 1,
      total: 0,
      tipcon:"您选择的距离内没有更多内容"
    })
    this.getList()
  },
  getFocus(){
    
    this.setData({
      distancebFl:false,
      addweight:1,
      tuijianList:[],
      offset: 1,
      total: 0,
      tipcon:'还没有关注任何用户哦!'
    })
    this.getList()
    
  },
  onShow(){
    
    let aShow  = getStorage('aShow') || '';
    setStorage('imgUrls',[])
    setStorage('inputValue','')
    if(aShow){
      setStorage('aShow',true);
      setStorage('imgUrls',[]);//清除图片数组中的数据
    }
    var page_this = this;
    var obj=wx.createSelectorQuery();
    
    wx.getSystemInfo({
          success: (res) => {
            let height = 0;
            obj.selectAll('.tabtitle').boundingClientRect();
            obj.exec(function (rect) {
                height = rect[0][0].height
                page_this.setData({
                  windowHeight: res.windowHeight - height,
                  windowWidth: res.windowWidth,
                  windowIsBang: (res.windowWidth/res.windowHeight<0.5 ? true : false)//判断手机是否有刘海屏
                })
            }) ;
            
          }

      })

    this.setData({
      tuijianFl:false,
      addjiantou:false
    })
    const refresh = getStorage("refresh") || '';
    setStorage("refresh",'0')
    if(refresh == '1'){
      this.setData({
        addweight:1,
        distancebFl:false,
        tuijianList:[],
        offset: 1,
        total: 0
      })
      this.getList();
    }
    
  },
  tailorTo(){
    const { cuserId } = getStorage( 'USER_INFO' ) || {};
    if(cuserId){
      this.setData({
        ruzhuFn:false
      })
      wx.navigateTo({
        url: `/pages/tailor/tailor?index=1`
      })
      
    }
    

   
  },
  onLoad(option,ok){
    // const {refresh} = option;
    
    let _this = this;
    _this.setData({
      navH: App.globalData.navHeight
    })
    this.checkLocation()
    
    this.setData({
      tipcon:this.data.addweight == '0'?"暂无推荐内容，选择更大的距离试试~":'暂无关注的内容'
    })
    
    
  },
  cancelFn(){
    this.setData({
      isShowMod:false
    })
  },
  sureFn(){
    this.setData({
      isShowMod:false
    })
  },
  cancelFocus(){
    this.setData({
      isShowMod:true
    })
  },
  focusFn(e){
    const {publishid,index,collection} =  e.currentTarget.dataset;//当前所在页面的 index
    
      indexService
      .chenkCollection({
        publishId:publishid,
        collection:!collection
      })
      .then(res => {
        let list = this.data.tuijianList;
        list[index].collection = res.collection
        this.setData({
          tuijianList:list
        })
        

      })

    
  },
  changeswiper(e){
    var index = e.detail.current;//当前所在页面的 index
 
    if(index == 0) { //第一屏 推荐

      this.setData({
        distancebFl:true,
        addweight:0,
        tuijianList:[],
        offset: 1,
        total: 0
      })

    } else if(index == 1) {//第二屏 关注

      this.setData({
        distancebFl:false,
        addweight:1,
        tuijianList:[],
        offset: 1,
        total: 0
      })

    }
  },
  onReachBottom: function() {
    if (this.data.total > this.data.limit * (this.data.offset)) {
      this.setData({
        offset: this.data.offset + 1,
      });
      this.getList(true)
    }
  },

  onPullDownRefresh() {
    this.setData({
      tuijianList: [],
      offset: 1,
      total: 0,
    })
    this.getList();
  },
  getList(qingkong){
    let addweight = this.data.addweight;
    if(addweight == 0){
      const {latitude,longitude} = getStorage('location') || {};
      wx.showLoading({title:'加载中...'})
        indexService
        .getRecommend({
          latitude:latitude,
          longitude:longitude,
          distance:this.data.distance,
          page:this.data.offset,
          size:this.data.limit
        })
        .then(res => {
          wx.hideLoading();
          if(!res.publishList){
            this.setData({
              tuijianList:null,
              total:res.totalSize
            })
          }else if(!qingkong){
            
            var list = res.publishList;
            list.map(item=>{
              item.content = item.content.split('&hc').join('\n')
              return item;
            })
            this.setData({
              tuijianList:list,
              total:res.totalSize
            })
          }else{
            var list = res.publishList;
            list.map(item=>{
              item.content = item.content.split('&hc').join('\n')
              return item;
            })
            this.setData({
              tuijianList:this.data.tuijianList.concat(list),
              total:res.totalSize
            })
          }
          
          wx.stopPullDownRefresh();
          
        })
    }else if(addweight == 1){
      wx.showLoading({title:'加载中...'})
      indexService
      .getInterestList({
        page:this.data.offset,
        size:this.data.limit
      })
      .then(res=>{
        wx.hideLoading();
        if(!res.publishList){
          this.setData({
            tuijianList:null,
            total:res.totalSize
          })
        }else{
          var list = res.publishList;
          list.map(item=>{
            item.content = item.content.split('&hc').join('\n')
            return item;
          })
          this.setData({
            tuijianList:this.data.tuijianList.concat(list),
            total:res.totalSize
          })
        }
        
        wx.stopPullDownRefresh();
        
      })
    }
   
      
    
  },
  gotoPostFn(e){
    const {publishid} = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/post/post?id=${publishid}`
    })
  },
  onGotUserInfo: function (e) {
    const { cuserId,access } = getStorage( 'USER_INFO' ) || {};
    const {type} = e.currentTarget.dataset;
    if(cuserId){
      
      if(type == '1'){
        this.focusFn(e)
      }else if(type == '2'){
        this.tailorTo()
      }
    }else{
      wx.showLoading({
        title: '授权中请稍后...',
        mask: true
      })
      if(e.detail.errMsg == "getUserInfo:fail auth deny"){
        wx.hideLoading();
        return
      }
      return account.bindAccountBySilent(e.detail).then(res => {
        setStorage( 'USER_INFO', res );
        this.setData({
          islogin:true
        })
        const pages = getCurrentPages()
        const perpage = pages[pages.length - 1]
        perpage.onLoad("ok")  
      }, err => {
        // wx.redirectTo({ url: '/pages/personal/personal'})
      })
    }
    
  },
  cancelruzhu(){
    this.setData({
      ruzhuFn:false
    })
  },
  cancelweizhi(){
    this.setData({
      weizhiFlg:false
    })
  },
  shouquan(){
    this.setData({
      weizhiFlg:false
    })
    this.initLocation()
  },
  onHide(){
    // this.setData({
    //   tuijianList:[]
    // })
  }
})

