(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/active/orderList"],{"66b8":function(e,t,o){"use strict";o.r(t);var n=o("c2e5"),r=o.n(n);for(var a in n)["default"].indexOf(a)<0&&function(e){o.d(t,e,(function(){return n[e]}))}(a);t["default"]=r.a},"8b57":function(e,t,o){"use strict";var n=o("d88b"),r=o.n(n);r.a},"95a8":function(e,t,o){"use strict";o.d(t,"b",(function(){return r})),o.d(t,"c",(function(){return a})),o.d(t,"a",(function(){return n}));var n={uniLoadMore:function(){return Promise.all([o.e("common/vendor"),o.e("uni_modules/uni-load-more/components/uni-load-more/uni-load-more")]).then(o.bind(null,"94e9"))},uniPopup:function(){return o.e("uni_modules/uni-popup/components/uni-popup/uni-popup").then(o.bind(null,"8570"))},uniPopupDialog:function(){return Promise.all([o.e("common/vendor"),o.e("uni_modules/uni-popup/components/uni-popup-dialog/uni-popup-dialog")]).then(o.bind(null,"3b6c"))}},r=function(){var e=this,t=e.$createElement,o=(e._self._c,e.__map(e.navList,(function(t,o){var n=e.__get_orig(t),r=!0===t.loaded&&0===t.orderList.length,a=e.__map(t.orderList,(function(t,o){var n=e.__get_orig(t),r=t.goodsList.length,a=1===r?e.getBaseUrl():null;return{$orig:n,g1:r,m0:a}}));return{$orig:n,g0:r,l0:a}})));e.$mp.data=Object.assign({},{$root:{l1:o}})},a=[]},c2e5:function(e,t,o){"use strict";(function(e){var n=o("47a9");Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r=n(o("7eb4")),a=n(o("ee10")),i=o("b816"),u={components:{empty:function(){o.e("pages/active/empty").then(function(){return resolve(o("b7e9"))}.bind(null,o)).catch(o.oe)}},data:function(){return{pageNum:1,pageSize:10,tabCurrentIndex:0,navList:[{state:0,text:"全部",loadingType:"more",orderList:[]},{state:1,text:"待付款",loadingType:"more",orderList:[]},{state:2,text:"待服务",loadingType:"more",orderList:[]},{state:3,text:"已完成",loadingType:"more",orderList:[]},{state:4,text:"已关闭",loadingType:"more",orderList:[]}],closeItem:{},serverTime:0}},onLoad:function(e){var t=this;return(0,a.default)(r.default.mark((function o(){return r.default.wrap((function(o){while(1)switch(o.prev=o.next){case 0:t.tabCurrentIndex=+e.state,0==e.state&&t.loadData();case 2:case"end":return o.stop()}}),o)})))()},methods:{loadData:function(e){var t=this;return(0,a.default)(r.default.mark((function o(){var n,a,i,u;return r.default.wrap((function(o){while(1)switch(o.prev=o.next){case 0:return o.next=2,t.getServerTime();case 2:if(n=t.tabCurrentIndex,a=t.navList[n],a.state,"tabChange"===e&&(t.pageNum=1,a.loadingType="more",a.orderList=[]),"noMore"!==a.loadingType){o.next=9;break}return console.log("没有更多数据了"),o.abrupt("return");case 9:return a.loadingType="loading",o.next=12,t.loadDataForBackground(t.tabCurrentIndex,t.pageNum,t.pageSize);case 12:i=o.sent,console.log("orderArr",i),u=i[0],u.forEach((function(e){a.orderList.push(e)})),t.$set(a,"loaded",!0),a.orderList.length>=i[1]?(console.log("count",a.orderList.length),console.log("SUM",i[1]),a.loadingType="noMore"):(a.loadingType="more",t.pageNum=t.pageNum+1);case 18:case"end":return o.stop()}}),o)})))()},loadDataForBackground:function(t,o,n){var u=this;return(0,a.default)(r.default.mark((function a(){var s,c,l;return r.default.wrap((function(r){while(1)switch(r.prev=r.next){case 0:return s={},s.pageNum=o,s.pageSize=n,s.createBy=(0,i.getToken)(),0==t&&console.log("全部"),1==t&&(console.log("待付款"),s.orderStatus=3),2==t&&(console.log("待服务"),s.orderStatus=2),3==t&&(console.log("已完成"),s.orderStatus=1),4==t&&(console.log("已关闭"),s.orderStatus=0),c=[],l=[],console.log("requestParam",s),r.next=14,u.request("/app_api/activity/getMyActivityOrder",s,"GET").then((function(t){if(t){if(console.log("getMyActivityOrder",t),200==t.code){for(var o=t.data[0],n=0;n<o.length;n++){var r=[];if(r[0]={},r[0]["title"]=o[n].activityTitle,r[0]["price"]=o[n].payMoney,r[0]["number"]=o[n].saleNumber,r[0]["coverImage"]=o[n].coverImage,r[0]["attr"]=o[n].productName,r[0]["stockType"]=o[n].stockType,c[n]={},c[n]["goodsList"]=r,c[n]["state"]=o[n].orderStatus,0==o[n].orderStatus&&(c[n]["stateTip"]="已关闭",c[n]["stateTipColor"]="#909399"),1==o[n].orderStatus&&(c[n]["stateTip"]="已完成",c[n]["stateTipColor"]="#fa436a"),2==o[n].orderStatus&&(c[n]["stateTip"]="待服务",c[n]["stateTipColor"]="#fa436a"),3==o[n].orderStatus){c[n]["stateTip"]="待付款",c[n]["stateTipColor"]="#fa436a";var a=new Date(o[n].createTime).getTime()/1e3,i=a+600;console.log("serverTime",u.serverTime),console.log("endTime",i),u.serverTime>i&&(console.log("订单超时未支付"),o[n].orderStatus=0,c[n]["stateTip"]="已关闭",c[n]["stateTipColor"]="#909399")}c[n]["time"]=o[n].createTime,c[n]["orderNo"]=o[n].orderNo,c[n]["orderStatus"]=o[n].orderStatus,c[n]["payStatus"]=o[n].payStatus,c[n]["id"]=o[n].id,c[n]["payMoney"]=o[n].payMoney,c[n]["wantPayMoney"]=o[n].wantPayMoney}l[1]=t.data[1]}500==t.code&&e.showToast({title:t.msg,icon:"none",duration:2e3})}})).catch((function(t){e.showToast({title:t,icon:"none",duration:2e3})}));case 14:return l[0]=c,r.abrupt("return",l);case 16:case"end":return r.stop()}}),a)})))()},changeTab:function(e){this.tabCurrentIndex=e.target.current,this.loadData("tabChange")},tabClick:function(e){this.tabCurrentIndex=e},deleteOrder:function(t){var o=this;e.showLoading({title:"请稍后"}),setTimeout((function(){o.navList[o.tabCurrentIndex].orderList.splice(t,1),e.hideLoading()}),600)},cancelOrder:function(e){this.closeItem=e,this.msgType="info",this.$refs.alertDialog.open()},dialogClose:function(){console.log("点击关闭")},dialogConfirm:function(){var t=this.closeItem;console.log("点击确认");var o={};o.id=t.id,this.request("/app_api/activity/cancelActivityOrder",o,"POST").then((function(o){o&&(console.log("cancelActivityOrder",o),200==o.code&&1==o.data&&(t.orderStatus="0",t.stateTip="已关闭",t.stateTipColor="#909399",e.showToast({title:"取消成功",icon:"none",duration:2e3})))}))},orderStateExp:function(e){var t="",o="#fa436a";switch(+e){case 1:t="待付款";break;case 2:t="待发货";break;case 9:t="订单已关闭",o="#909399";break}return{stateTip:t,stateTipColor:o}},toOrderInfo:function(t){console.log("toOrderInfo",t),e.navigateTo({url:"/pages/active/orderListInfo?id="+t.id})},toPay:function(t){e.navigateTo({url:"/pages/active/pay?orderId="+t+"&type=0"})},getServerTime:function(){var e=this;return(0,a.default)(r.default.mark((function t(){return r.default.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,e.request("/app_api/util/getServerTime","","GET").then((function(t){t&&(console.log("getServerTime",t),200==t.code&&(e.serverTime=t.data))}));case 2:case"end":return t.stop()}}),t)})))()}}};t.default=u}).call(this,o("df3c")["default"])},d88b:function(e,t,o){},f178:function(e,t,o){"use strict";o.r(t);var n=o("95a8"),r=o("66b8");for(var a in r)["default"].indexOf(a)<0&&function(e){o.d(t,e,(function(){return r[e]}))}(a);o("8b57");var i=o("828b"),u=Object(i["a"])(r["default"],n["b"],n["c"],!1,null,null,null,!1,n["a"],void 0);t["default"]=u.exports},f242:function(e,t,o){"use strict";(function(e,t){var n=o("47a9");o("d090");n(o("3240"));var r=n(o("f178"));e.__webpack_require_UNI_MP_PLUGIN__=o,t(r.default)}).call(this,o("3223")["default"],o("df3c")["createPage"])}},[["f242","common/runtime","common/vendor"]]]);