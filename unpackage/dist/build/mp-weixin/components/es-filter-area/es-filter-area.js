(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["components/es-filter-area/es-filter-area"],{"0126":function(t,i,n){"use strict";(function(t,e){var c=n("47a9");Object.defineProperty(i,"__esModule",{value:!0}),i.default=void 0;var o=c(n("2232")),s=n("c741"),a=c(n("6368")),u=(getApp(),{props:{show:{type:Boolean,default:!1},value:{type:Object,default:function(){return{}}},enableLocation:{type:Boolean,default:!0},top:{type:String,default:"0px"},bottomPopup:{type:Boolean,default:!1},zIndex:{type:Number,default:999},radius:{type:String,default:"32rpx"},height:{type:String,default:"800rpx"},background:{type:String,default:"#ffffff"},btnBg:{type:String,default:"#f6f8fb"},btnColor:{type:String,default:"#888888"},activeBg:{type:String,default:"#45D4A8"},activeColor:{type:String,default:"#ffffff"}},data:function(){return{gpsStatus:"success",provinceList:[],cityList:[],province:"",city:"",gpsProvince:"",gpsCity:"",distance:null,distanceList:[1,5,10,15]}},watch:{show:function(t){this.show&&this.enableLocation&&this.getGpsCity()},value:{immediate:!0,handler:function(){this.value&&(this.distance=this.value.distance||null,this.province=this.value.province||"",this.city=this.value.city||"")}},province:{immediate:!0,handler:function(){this.cityList=s.city[this.province]}}},computed:{cityHeight:function(){return"calc(".concat(this.height," - ").concat(this.enableLocation?"150rpx":"0rpx",")")}},mounted:function(){var t=[];for(var i in s.city)t.push(i);this.provinceList=t},methods:{getGpsCity:function(){var i=arguments.length>0&&void 0!==arguments[0]&&arguments[0],n=this;n.gpsStatus="loading",t.getFuzzyLocation({type:"gcj02",success:function(t){console.log(t);var i=new a.default.AMapWX({key:o.default.AMapKey});i.getRegeo({location:"".concat(t.longitude,",").concat(t.latitude),success:function(t){var i=t[0].longitude,e=t[0].latitude,c=t[0].regeocodeData.addressComponent,o="",s="";!c.province.endsWith("市")||c.city&&0!=c.city.length?(o=c.province.replace(/省/g,""),s=c.city.replace(/市/g,"")):(o=c.province.replace(/市/g,""),s=c.district),n.gpsProvince=o,n.gpsCity=s,n.province&&n.city||(n.longitude=i,n.latitude=e,n.province=o,n.city=s),n.gpsStatus="success"},fail:function(t){n.gpsStatus="fail"}})},fail:function(e){console.log(e),n.gpsStatus="noAccess",i&&t.showModal({title:"提示",content:"未开通定位权限将无法使用完整功能，是否去开启定位权限",showCancel:!1,confirmText:"开通权限",success:function(i){i.confirm&&t.openSetting({success:function(t){}})}})}})},regps:function(){this.gpsStatus="loading",this.getGpsCity()},openLocationSetting:function(){var t=this;e.openSetting({success:function(i){t.regps()}})},onChangeDistance:function(t){this.distance=t,this.province=this.gpsProvince,this.city=this.gpsCity},onChangeProvince:function(t){this.province=t,this.city="",this.distance=null},onChangeCity:function(t){this.city=t,this.distance=null},onReset:function(){this.province="",this.city="",this.distance=null,this.longitude=null,this.latitude=null},onConfirm:function(){var t="";t=0==this.distance&&this.city?"全"+this.city:this.distance&&this.distance>0?this.distance+"km":this.city?this.city:this.province?"全"+this.province:"",this.$emit("confirm",{province:this.province,city:this.city,distance:this.distance,longitude:this.longitude,latitude:this.latitude,name:t})},onClose:function(){this.$emit("close")},onStop:function(t){t.stopPropagation()}}});i.default=u}).call(this,n("df3c")["default"],n("3223")["default"])},"03aa":function(t,i,n){"use strict";n.d(i,"b",(function(){return e})),n.d(i,"c",(function(){return c})),n.d(i,"a",(function(){}));var e=function(){var t=this.$createElement;this._self._c},c=[]},"0480":function(t,i,n){"use strict";n.r(i);var e=n("03aa"),c=n("26e4");for(var o in c)["default"].indexOf(o)<0&&function(t){n.d(i,t,(function(){return c[t]}))}(o);n("56ba");var s=n("828b"),a=Object(s["a"])(c["default"],e["b"],e["c"],!1,null,"5455dab2",null,!1,e["a"],void 0);i["default"]=a.exports},"26e4":function(t,i,n){"use strict";n.r(i);var e=n("0126"),c=n.n(e);for(var o in e)["default"].indexOf(o)<0&&function(t){n.d(i,t,(function(){return e[t]}))}(o);i["default"]=c.a},4232:function(t,i,n){},"56ba":function(t,i,n){"use strict";var e=n("4232"),c=n.n(e);c.a}}]);
;(global["webpackJsonp"] = global["webpackJsonp"] || []).push([
    'components/es-filter-area/es-filter-area-create-component',
    {
        'components/es-filter-area/es-filter-area-create-component':(function(module, exports, __webpack_require__){
            __webpack_require__('df3c')['createComponent'](__webpack_require__("0480"))
        })
    },
    [['components/es-filter-area/es-filter-area-create-component']]
]);
