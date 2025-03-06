<template>
	<view class="content">
		<text class="success-icon yticon icon-xuanzhong2"></text>
		<text class="tit">发布成功</text>
		<view class="btn-view">
			<button class="button" type="primary" @click="toPage()">返回</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tabIndex: 0
			}
		},
		onLoad(options) {
			console.log('options', options)
			this.tabIndex = options.tabIndex
		},
		methods: {
			toPage() {
				uni.reLaunch({
					url: '/pages/club/club?tabIndex=' + this.tabIndex
				})
			}
		}
	}
</script>

<style lang='scss'>
	.content {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.success-icon {
		font-size: 160upx;
		color: #fa436a;
		margin-top: 100upx;
	}

	.tit {
		font-size: 38upx;
		color: #303133;
	}

	.btn-view {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		margin-top: 20px;
	}

	.button {
		margin-left: 15px;
		margin-right: 15px;
		width: 100%;
	}
</style>