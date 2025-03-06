<template>
	<view class="content">
		<text class="success-icon yticon icon-xuanzhong2"></text>
		<template v-if="flag==1">
			<text class="tit">提交成功，请等待审核</text>
			<text class="tit">状态查看：【我的-教练入驻】</text>
		</template>

		<template v-if="flag==2">
			<text class="tit">信息变更成功</text>
		</template>

		<view class="btn-group">
			<!-- <navigator url="/pages/index/index" open-type="switchTab" class="mix-btn hollow">返回首页</navigator> -->
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				flag: 0
			}
		},
		onLoad(option) {
			console.log("onLoad", option); //打印出上个页面传递的参数。
			this.flag = option.flag
		},
		methods: {

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

	.btn-group {
		padding-top: 100upx;
	}

	.mix-btn {
		margin-top: 30upx;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 600upx;
		height: 80upx;
		font-size: $font-lg;
		color: #fff;
		background-color: $base-color;
		border-radius: 10upx;

		&.hollow {
			background: #fff;
			color: #303133;
			border: 1px solid #ccc;
		}
	}
</style>