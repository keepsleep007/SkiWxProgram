(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/me/myRelease/r-ticket-page-info"],{"1aff":function(t,a,e){"use strict";var n=e("3c5d"),i=e.n(n);i.a},"1ca6":function(t,a,e){"use strict";(function(t){Object.defineProperty(a,"__esModule",{value:!0}),a.default=void 0;var n=e("b816"),i={components:{},data:function(){return{id:"",buttonFlag:!1,del_buttonFlag:!1,data:{avatar:null,price:"",ticketNum:"",snowFieldArea:"",snowFieldId:"",applyTime:"",snowType:"",location:"",remark:"",createTime:"",phone:"",wechat:"",createBy:"",uid:""},snowField:[],ticketType:[]}},onShow:function(){this.getData()},created:function(){var t=this;this.request("/app_api/ticketMarket/loadAreaData","","GET").then((function(a){a&&(t.snowField=a.data)})),this.request("/app_api/ticketMarket/loadTicketType","","GET").then((function(a){a&&(t.ticketType=a.data)}))},methods:{editBtn:function(){t.navigateTo({url:"/pages/me/myRelease/r-ticket-page-add?id="+this.id})},dialogClose:function(){console.log("点击关闭")},dialogConfirm:function(){console.log("点击确认");var a={};a.id=this.id,this.request("/app_api/ticketMarket/delTicketInfo",a,"GET").then((function(a){a&&(console.log("delTicketInfo",a),200==a.code&&(t.showToast({title:"删除成功",icon:"success",duration:2e3}),setTimeout((function(){t.navigateBack({delta:1})}),2e3)))}))},delBtn:function(){this.msgType="info",this.$refs.alertDialog.open()},isEdit:function(){this.data.uid==(0,n.getToken)()&&(this.buttonFlag=!0,this.del_buttonFlag=!0)},getData:function(){var t=this,a={};a.id=this.id,this.request("/app_api/ticketMarket/getTicketInfo",a,"GET").then((function(a){a&&200==a.code&&(t.data.avatar=a.data.avatar,t.data.price=a.data.price,t.data.ticketNum=a.data.ticketNum,t.data.snowFieldArea=a.data.snowFieldArea,t.data.snowFieldId=a.data.snowFieldId,t.data.applyTime=a.data.applyTime,t.data.snowType=a.data.snowType,t.data.location=a.data.location,t.data.remark=a.data.remark,null==a.data.remark?t.data.remark="":t.data.remark=a.data.remark,t.data.createTime=a.data.createTime,null==a.data.phone?t.data.phone="":t.data.phone=a.data.phone,null==a.data.wechat?t.data.wechat="":t.data.wechat=a.data.wechat,t.data.createBy=a.data.createBy,t.data.uid=a.data.uid,t.isEdit())}))},makePhoneCall:function(a){t.makePhoneCall({phoneNumber:a,success:function(){console.log("拨打电话成功！")},fail:function(t){console.error("拨打电话失败：",t)}})}},computed:{fullName:function(){var t,a;for(var e in this.snowField)this.snowField[e].id==this.data.snowFieldArea&&(t=this.snowField[e].label),this.snowField[e].id==this.data.snowFieldId&&(a=this.snowField[e].label);return t+"/"+a}},onLoad:function(t){this.id=t.id},onShareAppMessage:function(t){return"button"===t.from&&console.log(t.target),{title:"分享了雪票信息，一起看看吧~",path:"/pages/club/ticket-page-info?id="+this.id}}};a.default=i}).call(this,e("df3c")["default"])},3221:function(t,a,e){"use strict";e.d(a,"b",(function(){return i})),e.d(a,"c",(function(){return o})),e.d(a,"a",(function(){return n}));var n={uniCard:function(){return e.e("uni_modules/uni-card/components/uni-card/uni-card").then(e.bind(null,"dd67"))},uniPopup:function(){return e.e("uni_modules/uni-popup/components/uni-popup/uni-popup").then(e.bind(null,"8570"))},uniPopupDialog:function(){return Promise.all([e.e("common/vendor"),e.e("uni_modules/uni-popup/components/uni-popup-dialog/uni-popup-dialog")]).then(e.bind(null,"3b6c"))}},i=function(){var t=this,a=t.$createElement,e=(t._self._c,null!=t.data.avatar?this.getBaseUrl():null),n=t.__map(t.ticketType,(function(a,e){var n=t.__get_orig(a),i=t.data.snowType.includes(a.dictValue);return{$orig:n,g1:i}}));t.$mp.data=Object.assign({},{$root:{g0:e,l0:n}})},o=[]},"39d7":function(t,a,e){"use strict";(function(t,a){var n=e("47a9");e("d090");n(e("3240"));var i=n(e("ab37"));t.__webpack_require_UNI_MP_PLUGIN__=e,a(i.default)}).call(this,e("3223")["default"],e("df3c")["createPage"])},"3c5d":function(t,a,e){},6233:function(t,a,e){"use strict";e.r(a);var n=e("1ca6"),i=e.n(n);for(var o in n)["default"].indexOf(o)<0&&function(t){e.d(a,t,(function(){return n[t]}))}(o);a["default"]=i.a},ab37:function(t,a,e){"use strict";e.r(a);var n=e("3221"),i=e("6233");for(var o in i)["default"].indexOf(o)<0&&function(t){e.d(a,t,(function(){return i[t]}))}(o);e("1aff");var d=e("828b"),u=Object(d["a"])(i["default"],n["b"],n["c"],!1,null,null,null,!1,n["a"],void 0);a["default"]=u.exports}},[["39d7","common/runtime","common/vendor"]]]);