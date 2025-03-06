<template>
	<view id="filterBox" style="height: 35px;">
		<scroll-view class="es-filter__scroll" scroll-x :show-scrollbar="false" :style="{padding:padding}">
			<view class="es-filter-item__wrapper" v-for="(item,index) in filterList" :key="index">
				<view class="es-filter-item" @tap="onClick(index)" :style="{background:item.show===true||item.label?activeBg:btnBg,marginLeft:index===0?'20rpx':'0'}">
					<!-- 按钮名称 -->
					<view class="es-filter__text" :style="{fontSize:fontSize,lineHeight:'50rpx',color:item.show===true||item.label?activeColor:color}">{{item.label||item.name||'请选择'}}</view>
					<!-- 展开图标 -->
					<!-- <view v-if="item.type !== 'button'" class="esfont es-filter__expand" :style="{color:item.show===true||item.label?activeColor:color,'transform': item.show===true?'rotate(-180deg)':'rotate(0)'}">&#xe707;</view> -->
				</view>
			</view>
		</scroll-view>

		<!-- 遮罩层，用于弹窗时防止用户点击空白区域 -->
		<view v-if="showMask" @tap="onClickFilterMask" @touchmove.stop.prevent class="es-filter__mask" :style="{height:maskHeight+'px'}"></view>

		<template v-for="(item,index) in filterList">
			<!-- 地区选择 -->
			<!-- <es-filter-area v-if="item.type==='area'" :key="item.field" :show="item.show" :value="item.value" :top="maskHeight+'px'" :height="item.height" :background="background" :enable-location="item.enableLocation" :activeBg="activeBg" :activeColor="activeColor" :zIndex="zIndex" @confirm="onAreaChange($event,index)" @close="onClose(index)"></es-filter-area> -->
			<!-- 下拉选择 -->
			<es-filter-select v-if="item.type==='select'" :key="index" :background="background" :show="item.show" :value="item.value" :top="maskHeight+'px'" :activeBg="activeBg" :activeColor="activeColor" :zIndex="zIndex" :options="item.options" :multiple="item.multiple" @confirm="onSelectChange($event,index)" @close="onClose(index)"></es-filter-select>
			<uni-calendar v-if="item.type==='calendar'" :key="index" ref="calendar" class="uni-calendar--hook" :clear-date="false" :insert="info.insert" :lunar="info.lunar" :range="info.range" @confirm="confirm($event,index)" @close="close(index)" />
		</template>
	</view>
</template>

<script>
	import esFilterArea from '../es-filter-area/es-filter-area';
	import esFilterSelect from '../es-filter-select/es-filter-select';
	export default {
		components: {
			esFilterArea,
			esFilterSelect
		},
		props: {
			// 搜索栏按钮列表
			//field 字段名称
			//type area-地区 select-选择 button-按钮
			//name 按钮名称
			//label 组件上显示的值
			//value 传给接口的值
			list: {
				type: Array,
				default () {
					return []
				}
			},
			// 按钮背景色
			btnBg: {
				type: String,
				default: "#f6f8fb"
			},
			//弹出面板背景色
			background: {
				type: String,
				default: "#ffffff"
			},
			// 展开时的按钮背景色
			activeBg: {
				type: String,
				default: "#45D4A8"
			},
			// 文字颜色
			color: {
				type: String,
				default: "#555555"
			},
			// 展开时文字颜色
			activeColor: {
				type: String,
				default: "#ffffff"
			},
			//字体大小
			fontSize: {
				type: String,
				default: "11px"
			},
			padding: {
				type: String,
				default: "4px 0"
			},
			zIndex: {
				type: Number,
				default: 999
			},
		},
		data() {
			return {
				filterList: [],
				showMask: false,
				maskHeight: 35,
				showCalendar: false,
				info: {
					lunar: true,
					range: false,
					insert: false,
					selected: []
				}
			}
		},
		created() {
			this.initData(this.list)
		},
		methods: {
			onAreaChange(e, index) {
				this.$set(this.filterList[index], "value", {
					distance: e.distance,
					province: e.province,
					city: e.city
				});
				this.$set(this.filterList[index], "label", e.name);
				this.onClose(index);
				this.onChange();
			},
			onSelectChange(e, index) {
				this.$set(this.filterList[index], "value", e.value);
				this.$set(this.filterList[index], "label", e.label);
				this.onClose(index);
				this.onChange();
			},
			onClick(index) {
				this.$set(this.filterList[index], "show", !this.filterList[index].show);
				let item = this.filterList[index];

				//点击的按钮是重置
				if (item.type == 'resetBtn') {
					// console.log("reset", this.filterList)
					for (var i = 0; i < this.filterList.length; i++) {
						this.$set(this.filterList[i], "value", 'null');
						this.$set(this.filterList[i], "label", '');
						this.$set(this.filterList[i], "show", false);
					}
					this.showMask = true;
					this.showMask = false;
					this.onChange();
				}
				//点击的按钮是日历
				if (item.type == 'calendar') {
					this.open();
				}
				if (item.type != 'resetBtn') {
					this.showMask = true;
				}
			},
			getMaskHeight() {
				const query = uni.createSelectorQuery().in(this);
				query.select("#filterBox")
					.boundingClientRect((data) => {
						// this.maskHeight = 0;
						// #ifdef H5
						// this.maskHeight += uni.getSystemInfoSync().windowTop;
						// #endif
					})
					.exec();
			},
			onClickFilterMask() {
				this.showMask = false;
				this.filterList = this.filterList.map(item => {
					if (item.type !== 'button') {
						item.show = false;
					}
					return item;
				})
			},
			onChange() {
				this.$emit("change", this.filterList);
			},
			onClose(index) {
				this.$set(this.filterList[index], "show", false);
				this.showMask = false;
				this.$emit("close", {
					index,
					index
				});
			},
			initData(list) {
				this.filterList = list;
				// console.log("initData", this.filterList)
			},
			open() {
				// console.log(this.$refs.calendar[0]);
				this.$refs.calendar[0].open()
			},
			close(index) {
				// console.log('弹窗关闭');
				this.onClose(index);
			},
			change(e) {
				console.log('change 返回:', e)
			},
			confirm(e, index) {
				// console.log('confirm', e);
				this.$set(this.filterList[index], "value", e.fulldate);
				this.$set(this.filterList[index], "label", e.fulldate);
				this.onClose(index);
				this.onChange();
			},
			monthSwitch(e) {
				console.log('monthSwitchs 返回:', e)
			}
		}
	}

	/**
	 * 获取任意时间
	 */
	function getDate(date, AddDayCount = 0) {
		if (!date) {
			date = new Date()
		}
		if (typeof date !== 'object') {
			date = date.replace(/-/g, '/')
		}
		const dd = new Date(date)

		dd.setDate(dd.getDate() + AddDayCount) // 获取AddDayCount天后的日期

		const y = dd.getFullYear()
		const m = dd.getMonth() + 1 < 10 ? '0' + (dd.getMonth() + 1) : dd.getMonth() + 1 // 获取当前月份的日期，不足10补0
		const d = dd.getDate() < 10 ? '0' + dd.getDate() : dd.getDate() // 获取当前几号，不足10补0
		return {
			fullDate: y + '-' + m + '-' + d,
			year: y,
			month: m,
			date: d,
			day: dd.getDay()
		}
	}
</script>

<style scoped>
	::-webkit-scrollbar {
		width: 0 !important;
		height: 0 !important;
		color: transparent !important;
		display: none;
	}

	.es-filter__scroll {
		width: 750rpx;
		white-space: nowrap;
		overflow: hidden;
	}

	.es-filter-item__wrapper {
		display: inline-block;
	}

	.es-filter-item {
		display: flex;
		flex-direction: row;
		height: 50rpx;
		/* #ifdef H5 */
		line-height: 50rpx;
		/* #endif */
		border-radius: 50rpx;
		padding: 0 25rpx;
		margin-right: 20rpx;
	}

	.es-filter__text {
		max-width: 150rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.es-filter__expand {
		line-height: 50rpx;
		font-size: 10rpx;
		margin-left: 10rpx;
		transition: all 0.3s;
	}

	.es-filter__mask {
		width: 750rpx;
		position: fixed;
		top: 0;
		left: 0;
	}
</style>