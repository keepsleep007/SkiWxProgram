(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/me/myRelease/r-car-page-info"],{"26a1":function(a,e,t){},"2b14":function(a,e,t){"use strict";(function(a,e){var n=t("47a9");t("d090");n(t("3240"));var o=n(t("47f7"));a.__webpack_require_UNI_MP_PLUGIN__=t,e(o.default)}).call(this,t("3223")["default"],t("df3c")["createPage"])},"47f7":function(a,e,t){"use strict";t.r(e);var n=t("f155"),o=t("a85b");for(var i in o)["default"].indexOf(i)<0&&function(a){t.d(e,a,(function(){return o[a]}))}(i);t("b8fe");var r=t("828b"),u=Object(r["a"])(o["default"],n["b"],n["c"],!1,null,null,null,!1,n["a"],void 0);e["default"]=u.exports},"49da":function(a,e,t){"use strict";(function(a){var n=t("47a9");Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var o=n(t("7eb4")),i=n(t("ee10")),r=t("b816"),u={components:{},data:function(){return{id:"",data:{avatar:null,type:"",goType:"",price:"",personNum:"",boardNum:"",packageNum:"",goTime:"",goPlace:"",endPlace:"",remark:"",createTime:"",phone:"",wechat:"",createBy:"",uid:"",goArea:""},buttonFlag:!1,del_buttonFlag:!1,snowField:[]}},onShow:function(){var a=this;return(0,i.default)(o.default.mark((function e(){return o.default.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,a.getAreaData();case 2:return e.next=4,a.getData();case 4:case"end":return e.stop()}}),e)})))()},methods:{editBtn:function(){a.navigateTo({url:"/pages/me/myRelease/r-car-page-add?id="+this.id})},dialogClose:function(){console.log("点击关闭")},dialogConfirm:function(){console.log("点击确认");var e={};e.id=this.id,this.request("/app_api/carPool/delCarPoolInfo",e,"GET").then((function(e){e&&(console.log("delCarPoolInfo",e),200==e.code&&(a.showToast({title:"删除成功",icon:"success",duration:2e3}),setTimeout((function(){a.navigateBack({delta:1})}),1e3)))}))},delBtn:function(){this.msgType="info",this.$refs.alertDialog.open()},isEdit:function(){this.data.uid==(0,r.getToken)()&&(this.buttonFlag=!0,this.del_buttonFlag=!0)},getData:function(){var a=this;return(0,i.default)(o.default.mark((function e(){var t;return o.default.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return t={},t.id=a.id,e.next=4,a.request("/app_api/carPool/getCarPoolInfo",t,"GET").then((function(e){e&&(console.log("getCarPoolInfo",e),200==e.code&&(a.data.avatar=e.data.avatar,a.data.type=e.data.type,a.data.goType=e.data.goType,a.data.price=e.data.price,a.data.personNum=e.data.personNum,a.data.boardNum=e.data.boardNum,a.data.packageNum=e.data.packageNum,a.data.goTime=e.data.goTime,a.data.goPlace=e.data.goPlace,a.data.endPlace=e.data.endPlace,null==e.data.remark?a.data.remark="":a.data.remark=e.data.remark,a.data.createTime=e.data.createTime,null==e.data.phone?a.data.phone="":a.data.phone=e.data.phone,null==e.data.wechat?a.data.wechat="":a.data.wechat=e.data.wechat,a.data.createBy=e.data.createBy,a.data.uid=e.data.uid,a.data.goArea=a.codeToName(e.data.goArea),a.isEdit()))}));case 4:case"end":return e.stop()}}),e)})))()},makePhoneCall:function(e){a.makePhoneCall({phoneNumber:e,success:function(){console.log("拨打电话成功！")},fail:function(a){console.error("拨打电话失败：",a)}})},getAreaData:function(){var a=this;return(0,i.default)(o.default.mark((function e(){return o.default.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,a.request("/app_api/carPool/loadAreaData").then((function(e){if(e){for(var t=[],n=0;n<e.data.length;n++)t[n]={},t[n]["text"]=e.data[n].name,t[n]["value"]=e.data[n].id;a.snowField=t}}));case 2:case"end":return e.stop()}}),e)})))()},codeToName:function(a){for(var e in this.snowField)if(this.snowField[e].value==a)return this.snowField[e].text}},computed:{fullName:function(){var a,e;return a=1==this.data.type?"车找人":"人找车",e=1==this.data.goType?"去雪场":"雪场返回",a+"-"+e}},onLoad:function(a){console.log("CarOnLoad",a),this.id=a.id},onShareAppMessage:function(a){return"button"===a.from&&console.log(a.target),{title:"分享了拼车信息，一起看看吧~",path:"/pages/club/car-page-info?id="+this.id}}};e.default=u}).call(this,t("df3c")["default"])},a85b:function(a,e,t){"use strict";t.r(e);var n=t("49da"),o=t.n(n);for(var i in n)["default"].indexOf(i)<0&&function(a){t.d(e,a,(function(){return n[a]}))}(i);e["default"]=o.a},b8fe:function(a,e,t){"use strict";var n=t("26a1"),o=t.n(n);o.a},f155:function(a,e,t){"use strict";t.d(e,"b",(function(){return o})),t.d(e,"c",(function(){return i})),t.d(e,"a",(function(){return n}));var n={uniCard:function(){return t.e("uni_modules/uni-card/components/uni-card/uni-card").then(t.bind(null,"dd67"))},uniPopup:function(){return t.e("uni_modules/uni-popup/components/uni-popup/uni-popup").then(t.bind(null,"8570"))},uniPopupDialog:function(){return Promise.all([t.e("common/vendor"),t.e("uni_modules/uni-popup/components/uni-popup-dialog/uni-popup-dialog")]).then(t.bind(null,"3b6c"))}},o=function(){var a=this.$createElement,e=(this._self._c,null!=this.data.avatar?this.getBaseUrl():null);this.$mp.data=Object.assign({},{$root:{g0:e}})},i=[]}},[["2b14","common/runtime","common/vendor"]]]);