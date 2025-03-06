<template>
	<div class="es-filter__popup" @tap.stop="onClose" @touchmove.stop.prevent :class="{'es-filter--show':show}" :style="{top:top,zIndex:zIndex}">
		<view class="es-filter-select" @tap.stop="onStop" :style="{
			 background:background,
			'border-bottom-left-radius':radius,
			'border-bottom-right-radius':radius
		 }">
			<view class="es-filter-select__wrapper" @tap.stop :style="{
				background:background,
				'border-bottom-left-radius':multiple?'none':radius,
				'border-bottom-right-radius':multiple?'none':radius
				}">
				<scroll-view scroll-y enable-flex style="height:500rpx" :show-scrollbar="false">
					<view class="es-filter-select__list">
						<view v-for="(item,index) in options" :key="index" :style="{width:column==2?'300rpx':'750rpx'}" @tap.stop="onTap($event,index)" class="es-filter-select__item">
							<image v-if="item.img" :src="item.img" class="es-filter__img" mode="aspectFill"></image>
							<view class="es-filter-select__text" :class="{'es-filter-select__text--active':checked[item.value] === true}">
								{{item.label}}
							</view>
							<view v-if="checked[item.value] === true" class="esfont es-filter-select__checked-icon">&#xe700;
							</view>
						</view>
					</view>
				</scroll-view>
			</view>

			<view v-if="multiple" @tap.stop="onStop" class="es-footer__wrapper" :style="{background:background,'border-bottom-left-radius':radius,'border-bottom-right-radius':radius}">
				<view class="es-footer-btn es-footer-reset" @tap.stop="onReset">
					<text class="es-footer-reset__text">重置</text>
				</view>
				<view class="es-footer-btn es-footer-confirm" :style="{background:activeBg}" @tap.stop="onConfirm">
					<text class="es-footer-confirm__text" :style="{color:activeColor}">确认</text>
				</view>
			</view>

		</view>
	</div>
</template>

<script>
	let app = getApp();
	export default {
		props: {
			show: {
				type: Boolean,
				default: false
			},
			value: {
				type: [Array, String]
			},
			// 下拉选项列表
			options: {
				type: Array,
				default: function() {
					return []
				}
			},
			top: {
				type: String,
				default: "0px"
			},
			radius: {
				type: String,
				default: "32rpx"
			},
			background: {
				type: String,
				default: "#ffffff"
			},
			//每行展示几列，仅支持1列和2列
			column: {
				type: Number,
				default: 1
			},
			//是否多选
			multiple: {
				type: Boolean,
				false: false
			},
			//确认按钮背景色
			activeBg: {
				type: String,
				default: "#45D4A8"
			},
			//确认按钮文字颜色
			activeColor: {
				type: String,
				default: "#ffffff"
			},
			zIndex: {
				type: Number,
				default: 999
			}
		},
		data() {
			return {
				cache: {},
				checked: {}
			}
		},
		watch: {
			options: {
				immediate: true,
				handler() {
					let cache = {};
					let options = this.options || [];
					options.forEach(item => {
						cache[item.value] = item.label;
					})
					this.cache = cache;
				}
			},
			value: {
				immediate: true,
				handler() {
					let checked = {};
					//多选
					if (this.multiple) {
						if (this.value && this.value.length > 0) {
							this.value.forEach(item => {
								checked[item] = true;
							})
						}
					} else {
						checked[this.value] = true;
					}
					this.checked = checked;
				}
			}
		},
		methods: {
			onTap(e, index) {
				e.stopPropagation();
				let value = this.options[index].value;
				let checked = this.checked[value] || false;
				if (this.multiple) {
					this.$set(this.checked, value, !checked);
				} else {
					if (checked) {
						this.checked = {};
						this.$emit("confirm", {
							value: 'null',
							label: ""
						});
					} else {
						this.checked = {
							[value]: true
						}
						this.$emit("confirm", this.options[index]);
					}

				}
			},
			onReset(e) {
				e.stopPropagation();
				this.checked = {};
			},
			onConfirm(e) {
				e.stopPropagation();
				let checkedList = this.checked;
				let values = [];
				let labels = [];
				for (let key in checkedList) {
					if (checkedList[key] === true) {
						values.push(key);
						labels.push(this.cache[key]);
					}
				}
				this.$emit("confirm", {
					value: values,
					label: labels.join(",")
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
	.es-filter__popup {
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

	.es-filter--show {
		transform: translateY(0);
		transition: all 0.3s;
	}

	.es-filter-select {
		display: flex;
		flex-direction: column;
		position: relative;
		width: 750rpx;
		overflow: auto;
	}

	.es-filter-select__wrapper {
		position: relative;
		width: 750rpx;
	}

	.es-filter-select__list {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
	}

	.es-filter-select__item {
		height: 90rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		padding: 0 25rpx;
	}

	.es-filter__img {
		width: 40rpx;
		height: 40rpx;
		margin-right: 20rpx;
	}


	.es-filter-select__text {
		flex: 1;
		font-size: 28rpx;
		color: #999999;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.es-filter-select__text--active {
		color: #1e1e1e;
		font-weight: Bold;
	}

	.es-filter-select__checked-icon {
		color: #1E1E1E;
		font-size: 24rpx;
		margin: 0 10rpx;
	}


	.es-footer__wrapper {
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