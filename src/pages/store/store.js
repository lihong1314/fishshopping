require('./store.less');

const { getStorage, setStorage } = require('../../utils/storage');
import * as storeService from '../../services/store'; 
import '../../components/disable/tip.less';
import * as wxp from '../../services/wxp';
Page({
  data:{
    shopList:[],
    offset:1,
    limit:10,
    total: 0,
    disableFlag:false
  },
  onShow(){
    
  },
  initLocation() {
    wxp
      .getLocation()
      .then((res) =>{
        // console.log('res:',res)
        setStorage('location',{latitude:res.latitude.toFixed(4),longitude:res.longitude.toFixed(4)})
        this.setData({
          location:{latitude:res.latitude.toFixed(4),longitude:res.longitude.toFixed(4)}
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
        that.getList();
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
                              that.getList();
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
  onLoad(){
    this.checkLocation()
    // const { cuserId,access } = getStorage( 'USER_INFO' ) || {};
    // if(access != "Y" && access){
    //   this.setData({
    //     disableFlag:true
    //   })
    // }else{
      
    // }

    // this.getList()
    
  },
  onReachBottom: function() {
    if (this.data.total > this.data.limit * (this.data.offset)) {
      this.setData({
        offset: this.data.offset + 1,
      });
      this.getList()
    }
  },

  onPullDownRefresh() {
    this.setData({
      shopList: [],
      offset: 1,
      total: 0,
    })
    this.getList();
  },
  getList(){
    wx.showLoading({title:'加载中...'})
    const {latitude,longitude} = getStorage('location') || {};
    storeService
    .getStoreList({
      latitude,
      longitude,
      distance:10,
      page:this.data.offset,
      size:this.data.limit
    })
    .then(res=>{
      wx.hideLoading();
      console.log("好店数据:",res)
      if(!res.shopList){
        this.setData({
          shopList:null,
          total:res.totalSize
        })
        
      }else{
        let list = res.shopList;
        list.images
        list.map(item=>{
          item.images = item.images.filter( (list,index) => {
            return index <= 2
          })
        })
        this.setData({
          shopList:this.data.shopList.concat(list),
          total:res.totalSize
        })
      }
      
      
      wx.stopPullDownRefresh();
    })
    
  },
  inStorFn(e){
    const {shopid} = e.currentTarget.dataset;
    wx.navigateTo({
      url:`/pages/stordetail/stordetail?shopid=${shopid}`
    })
  }
})