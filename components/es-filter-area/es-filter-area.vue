<template>
	<div class="es-filter-area__popup" :class="{'es-filter-area--show':show,'justify-flex-end':bottomPopup}" :style="{top:top,zIndex:zIndex}" @tap.stop="onClose" @touchmove.stop.prevent>
		<view class="es-filter-area__wrapper" @tap.stop="onStop" :style="{
			 	 background:background,
			 	 'border-top-left-radius':bottomPopup?radius:'0rpx',
			 	 'border-top-right-radius':bottomPopup?radius:'0rpx'
			  }">
			<!-- 是否启用定位功能 -->
			<block v-if="enableLocation">
				<view class="es-filter-location">
					<view class="esfont es-filter-location__icon">&#xe6e6;</view>
					<view class="es-filter-location__text" v-if="gpsStatus==='noAccess'" @tap.stop="openLocationSetting">请开启定位权限</view>
					<view class="es-filter-location__text" v-else-if="gpsStatus==='fail'">定位获取失败</view>
					<view class="es-filter-location__text" v-else-if="gpsStatus==='loading'">定位中...</view>
					<view class="es-filter-location__text" v-else>{{gpsCity}}</view>
					<template v-if="gpsStatus!=='loading'">
						<view class="es-filter-location__line"></view>
						<view class="es-filter-location__relocation-text" @tap.stop="regps">重新定位</view>
					</template>
					<view class="esfont es-filter-location__relocation-icon" @tap.stop="regps" :class="{'es-filter-location__relocation-icon--ani':gpsStatus==='loading'}">&#xe6fe;</view>
				</view>

				<view class="es-filter-distance">
					<scroll-view class="es-filter-distance__scroll" scroll-x :show-scrollbar="false">
						<!-- 全莆田 -->
						<view class="es-filter-distance__list">
							<view class="es-filter-distance__item" @tap.stop="onChangeDistance(0)" style="margin-left: 30rpx;" :style="{background:distance===0?activeBg:btnBg}">
								<text class="es-filter-distance__item__text" :style="{color:distance===0?activeColor:btnColor}">全{{gpsCity||'国'}}</text>
							</view>
							<view class="es-filter-distance__item" v-for="item in distanceList" @tap.stop="onChangeDistance(item)" :style="{background:distance===item?activeBg:btnBg}">
								<text class="es-filter-distance__item__text" :style="{color:distance===item?activeColor:btnColor}">{{item}}km</text>
							</view>
						</view>

					</scroll-view>
				</view>
			</block>

			<view class="es-filter-city-wrapper" :style="{height:cityHeight}">
				<!-- 省份 -->
				<scroll-view scroll-y enable-flex :show-scrollbar="false" style="width:200rpx;">
					<!-- 未选中时，全国 -->
					<view class="es-filter-province" @tap.stop="onChangeProvince('')" :class="{'es-filter-province--active':!province}">
						<text class="es-filter-province__text" :class="{'es-filter-province__text--active':!province}">全国</text>
					</view>
					<!-- 如果有gps省份优先展示 -->
					<view class="es-filter-province" @tap.stop="onChangeProvince(province)" v-if="province" :class="{'es-filter-province--active':province === province}">
						<text class="es-filter-province__text" :class="{'es-filter-province__text--active':province === province}">{{province}}</text>
					</view>
					<block v-for="item in provinceList">
						<view @tap.stop="onChangeProvince(item)" class="es-filter-province" v-if="!province || item!=province" :class="{'es-filter-province_--active':province === item}">
							<text class="es-filter-province__text" :class="{'es-filter-province__text--active':province === item}">{{item}}</text>
						</view>
					</block>

				</scroll-view>

				<!-- 城市 -->
				<scroll-view enable-flex scroll-y :show-scrollbar="false" style="width:550rpx;">
					<view v-if="!province" class="es-filter-city">
						<view class="es-filter-city__text es-filter-city__text--active">全国</view>
						<view class="esfont es-filter-city__checked-icon icon-check"></view>
					</view>
					<view v-else class="es-filter-city" @tap.stop="onChangeCity('')">
						<view class="es-filter-city__text" :class="{'es-filter-city__text--active':!city}">全{{province}}</view>
						<view class="esfont es-filter-city__checked-icon icon-check" v-if="!city"></view>
					</view>
					<view v-for="item in cityList" class="es-filter-city" @tap.stop="onChangeCity(item)">
						<view class="es-filter-city__text" :class="{'es-filter-city__text--active':city===item}">{{item}}</view>
						<view v-if="city===item" class="esfont es-filter-city__checked-icon icon-check"></view>
					</view>
				</scroll-view>
			</view>
		</view>
		<view class="es-footer-wrapper" @tap.stop="onStop" :style="{background:background,'border-bottom-left-radius':bottomPopup?radius:'0rpx','border-bottom-right-radius':bottomPopup?radius:'0rpx'}">
			<view class="es-footer-btn es-footer-reset" @tap.stop="onReset">
				<text class="es-footer-reset__text">重置</text>
			</view>
			<view class="es-footer-btn es-footer-confirm" :style="{background:activeBg}" @tap.stop="onConfirm">
				<text class="es-footer-confirm__text" :style="{color:activeColor}">确认</text>
			</view>
		</view>
	</div>
</template>

<script>
	//引入高德地图key 请自行申请
	import config from '../../libs/config';
	//引入城市数据
	import {
		city as area
	} from '../../libs/city.js';
	import amapFile from '../../libs/amap-wx.js';

	let app = getApp();
	export default {
		props: {
			show: {
				type: Boolean,
				default: false
			},
			value: {
				type: Object,
				default: function() {
					return {}
				}
			},
			// 启用定位
			enableLocation: {
				type: Boolean,
				default: true
			},
			top: {
				type: String,
				default: "0px"
			},
			bottomPopup: {
				type: Boolean,
				default: false
			},
			zIndex: {
				type: Number,
				default: 999
			},
			radius: {
				type: String,
				default: "32rpx"
			},
			height: {
				type: String,
				default: "800rpx"
			},
			background: {
				type: String,
				default: "#ffffff"
			},
			btnBg: {
				type: String,
				default: "#f6f8fb"
			},
			btnColor: {
				type: String,
				default: "#888888"
			},
			activeBg: {
				type: String,
				default: "#45D4A8"
			},
			activeColor: {
				type: String,
				default: "#ffffff"
			}

		},
		data() {
			return {
				gpsStatus: "success", //success 定位完成 loading定位中  noAccess未开启定位权限
				provinceList: [],
				cityList: [],
				province: "",
				city: "",
				gpsProvince: "",
				gpsCity: "",
				distance: null,
				distanceList: [1, 5, 10, 15],
			}
		},
		watch: {
			show(val) {
				if (this.show) {
					if (this.enableLocation) {
						this.getGpsCity();
					}
				}
			},
			value: {
				immediate: true,
				handler() {
					if (this.value) {
						this.distance = this.value.distance || null;
						this.province = this.value.province || "";
						this.city = this.value.city || "";
					}
				}
			},
			province: {
				immediate: true,
				handler() {
					this.cityList = area[this.province];
				}
			}
		},
		computed: {
			cityHeight() {
				return `calc(${this.height} - ${this.enableLocation?'150rpx':'0rpx'})`;
			}
		},
		mounted() {
			let provinceList = [];
			for (let key in area) {
				provinceList.push(key)
			}
			this.provinceList = provinceList;
		},
		methods: {
			/**
			 *@name 获取gps定位城市 
			 */
			getGpsCity(showAuthorizeModal = false) {
				let _this = this;
				_this.gpsStatus = 'loading';
				// #ifdef MP-WEIXIN
				uni.getFuzzyLocation({
						type: 'gcj02',
						// #endif
						// #ifndef MP-WEIXIN
						uni.getLocation({
							type: 'wgs84',
							isHighAccuracy: true,
							// #endif
							success(res) {
								console.log(res)
								let myAmapFun = new amapFile.AMapWX({
									key: config.AMapKey
								});
								myAmapFun.getRegeo({
									location: `${res.longitude},${res.latitude}`,
									//location的格式为'经度,纬度'
									success: function(data) {
										let longitude = data[0].longitude;
										let latitude = data[0].latitude;
										let address = data[0].regeocodeData.addressComponent;
										let province = "";
										let city = "";
										if (address.province.endsWith("市") && (!address.city || address
												.city.length == 0)) {
											province = address.province.replace(/市/g, "");
											city = address.district;
										} else {
											province = address.province.replace(/省/g, "");
											city = address.city.replace(/市/g, "");
										}
										_this.gpsProvince = province;
										_this.gpsCity = city;

										//未选择地区时，使用定位地址
										if (!_this.province || !_this.city) {
											_this.longitude = longitude;
											_this.latitude = latitude;
											_this.province = province;
											_this.city = city;
										}

										_this.gpsStatus = "success";
									},
									fail: function(info) {
										_this.gpsStatus = 'fail';
									}
								});
							},
							fail: function(info) {
								console.log(info)
								_this.gpsStatus = 'noAccess';
								// 用户拒绝了授权
								// #ifdef MP-WEIXIN
								if (showAuthorizeModal) {
									uni.showModal({
										title: '提示',
										content: '未开通定位权限将无法使用完整功能，是否去开启定位权限',
										showCancel: false,
										confirmText: "开通权限",
										success: res => {
											if (res.confirm) {
												// 跳转设置页面
												uni.openSetting({
													success: res => {

													}
												});
											}
										}
									});
								}
								// #endif
							}

						});

					},
					regps() {
						this.gpsStatus = "loading";
						this.getGpsCity()
					},
					openLocationSetting() {
						// 跳转设置页面
						// #ifdef MP-WEIXIN
						wx.openSetting({
							success: res => {
								this.regps()
							}
						});
						// #endif
					},
					onChangeDistance(distance) {
						this.distance = distance;
						this.province = this.gpsProvince;
						this.city = this.gpsCity;
					},
					onChangeProvince(province) {
						this.province = province;
						this.city = "";
						this.distance = null;
					},
					onChangeCity(city) {
						this.city = city;
						this.distance = null;
					},
					onReset() {
						this.province = "";
						this.city = "";
						this.distance = null;
						this.longitude = null;
						this.latitude = null;
					},
					onConfirm() {
						let name = '';
						if (this.distance == 0 && this.city) {
							name = "全" + this.city;
						} else if (this.distance && this.distance > 0) {
							name = this.distance + "km";
						} else {
							name = this.city ? this.city : this.province ? '全' + this.province : '';
						}
						this.$emit("confirm", {
							province: this.province,
							city: this.city,
							distance: this.distance,
							longitude: this.longitude,
							latitude: this.latitude,
							name: name
						});
					},
					onClose() {
						this.$emit("close")
					},
					onStop(e) {
						e.stopPropagation();
					}
				}
			}
</script>

<style scoped>
	.es-filter-area__popup {
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		width: 750rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		background-color: rgba(0, 0, 0, 0.4);
		border-top: 1rpx solid #f6f8fb;
		transform: translateY(100%);
	}

	.justify-flex-end {
		justify-content: flex-end;
	}

	.es-filter-area--show {
		transform: translateY(0);
		transition: all 0.3s;
	}

	.es-filter-area__wrapper {
		display: flex;
		flex-direction: column;
		position: relative;
		width: 750rpx;
		overflow: auto;
	}

	.es-filter-location {
		width: 690rpx;
		margin-left: 30rpx;
		height: 80rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		flex-shrink: 0;
	}

	.es-filter-location__icon {
		font-size: 26rpx;
		color: #1E1E1E;
		margin-right: 5rpx;
	}

	.es-filter-location__text {
		font-size: 26rpx;
		line-height: 26rpx;
		color: #1E1E1E;
	}

	.es-filter-location__line {
		height: 20rpx;
		margin: 0 10rpx;
		border-right: 1rpx solid #ededed;
	}

	.es-filter-location__relocation-text {
		font-size: 24rpx;
		line-height: 24rpx;
		color: #888888;
	}

	.es-filter-location__relocation-icon {
		font-size: 22rpx;
		color: #888888;
		margin-left: 5rpx;
	}

	.es-filter-location__relocation-icon--ani {
		animation: spin 1s linear infinite;
		/* 无限旋转动画 */
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}

		100% {
			transform: rotate(360deg);
		}
	}


	.es-filter-distance {
		width: 750rpx;
		height: 50rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-bottom: 20rpx;
	}

	.es-filter-distance__scroll {
		width: 750rpx;
		height: 50rpx;
	}

	.es-filter-distance__list {
		display: flex;
		align-items: center;
		flex-wrap: nowrap;
	}

	.es-filter-distance__item {
		height: 50rpx;
		border-radius: 50rpx;
		padding: 0 25rpx;
		margin-right: 20rpx;
	}

	.es-filter-distance__item__text {
		font-size: 26rpx;
		line-height: 26rpx;
	}


	.es-filter-city-wrapper {
		display: flex;
		flex-direction: row;
		background-color: #f6f8fb;
	}

	.es-filter-province {
		display: flex;
		flex-direction: row;
		align-items: center;
		padding: 20rpx 20rpx 20rpx 30rpx;
		background-color: #ffffff;
	}

	.es-filter-city {
		height: 80rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		padding: 0 30rpx 0 40rpx;
		background-color: #f6f8fb;
	}

	.es-filter-province__text,
	.es-filter-city__text {
		color: #888888;
		font-size: 26rpx;
	}

	.es-filter-province--active {
		background-color: #f6f8fb;
	}

	.es-filter-province__text--active,
	.es-filter-city__text--active {
		color: #1e1e1e;
		font-weight: Bold;
	}

	.es-filter-city__checked-icon {
		color: #1E1E1E;
		font-size: 24rpx;
		margin: 0 10rpx;
	}

	.es-footer-wrapper {
		width: 750rpx;
		display: flex;
		flex-direction: row;
		justify-content: center;
		padding: 30rpx 0;
	}

	.es-footer-btn {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		width: 300rpx;
		height: 80rpx;
		border-radius: 80rpx;
		box-sizing: border-box;
	}

	.es-footer-reset {
		border: 1px solid #B6B6B6;
	}

	.es-footer-reset__text {
		font-size: 30rpx;
		color: #B6B6B6;
		font-weight: bold;
	}

	.es-footer-confirm {
		margin-left: 30rpx;
	}

	.es-footer-confirm__text {
		font-size: 30rpx;
		color: #FFFFFF;
		font-weight: bold;
	}
</style>