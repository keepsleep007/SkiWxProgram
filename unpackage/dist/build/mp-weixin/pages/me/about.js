(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/me/about"],{"0aff":function(t,e,a){"use strict";a.r(e);var n=a("add8"),r=a.n(n);for(var u in n)["default"].indexOf(u)<0&&function(t){a.d(e,t,(function(){return n[t]}))}(u);e["default"]=r.a},"279f":function(t,e,a){"use strict";a.r(e);var n=a("db4e"),r=a("0aff");for(var u in r)["default"].indexOf(u)<0&&function(t){a.d(e,t,(function(){return r[t]}))}(u);a("fca3");var c=a("828b"),f=Object(c["a"])(r["default"],n["b"],n["c"],!1,null,null,null,!1,n["a"],void 0);e["default"]=f.exports},6477:function(t,e,a){"use strict";(function(t,e){var n=a("47a9");a("d090");n(a("3240"));var r=n(a("279f"));t.__webpack_require_UNI_MP_PLUGIN__=a,e(r.default)}).call(this,a("3223")["default"],a("df3c")["createPage"])},add8:function(t,e,a){"use strict";var n=a("47a9");Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var r=n(a("7eb4")),u=n(a("ee10")),c={data:function(){return{data:{}}},onLoad:function(){var t=this;return(0,u.default)(r.default.mark((function e(){return r.default.wrap((function(e){while(1)switch(e.prev=e.next){case 0:t.getDataInfo("397ac855fe544c4bb8498d4870b852d7");case 1:case"end":return e.stop()}}),e)})))()},methods:{getDataInfo:function(t){var e=this;this.request("/app_api/util/getAboutClubInfo/"+t,"","GET").then((function(t){t&&200==t.code&&(t.data.richText&&(t.data.richText=e.fixImageSrcInHtml(t.data.richText,e.getBaseUrl())),e.data=t.data)}))},fixImageSrcInHtml:function(t,e){if(t){var a,n=/src="([^"]+)"/g,r=[];while(null!==(a=n.exec(t))){var u=a[1];u.startsWith("/profile")?r.push(e+u):r.push(u)}var c=t;return r.forEach((function(e,a){var r=n.exec(t)[1];c=c.replace(r,e)})),console.log("fixImageSrcRestoreUrls处理后的HTML：",c),c}console.error("HTML文本不能为空")}}};e.default=c},b5b1:function(t,e,a){},db4e:function(t,e,a){"use strict";a.d(e,"b",(function(){return n})),a.d(e,"c",(function(){return r})),a.d(e,"a",(function(){}));var n=function(){var t=this.$createElement;this._self._c},r=[]},fca3:function(t,e,a){"use strict";var n=a("b5b1"),r=a.n(n);r.a}},[["6477","common/runtime","common/vendor"]]]);