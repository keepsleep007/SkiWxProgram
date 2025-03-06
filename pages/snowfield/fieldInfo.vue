<template>
	<view>
		<!-- 封面图 -->
		<view class="carousel">
			<view class="image-wrapper">
				<image :src="getBaseUrl()+data.coverImage" mode="aspectFill"></image>
			</view>
		</view>
		<!-- 标题 -->
		<view class="introduce-section">
			<text class="title">{{data.label}}</text>
		</view>
		<!-- 雪道图 -->
		<view class="detail-desc">
			<view class="d-header">
				<text>雪道图（点击放大）</text>
			</view>
		</view>
		<view class="carousel" style="margin-left: 16upx; margin-right: 16upx;">
			<view class="image-wrapper">
				<image :src="getBaseUrl()+data.trailImage" mode="aspectFill" @click="previewImage(getBaseUrl()+data.trailImage)"></image>
			</view>
		</view>
		<!-- 雪场图文介绍 -->
		<view class="detail-desc" v-if="infoRichTextFlag">
			<view class="d-header">
				<text>雪场介绍</text>
			</view>
			<rich-text :nodes="data.richText"></rich-text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				data: {},
				infoRichTextFlag: false,
			};
		},
		async onLoad(options) {
			//接收传值,id
			let id = options.id;
			if (id) {
				// console.log("onLoad_id", id)
				//根据id加载详细数据
				this.getDataInfo(id);
			}
		},
		methods: {
			getDataInfo(id) {
				let requestParam = {};
				requestParam.id = id;
				this.request('/app_api/snowField/getFieldInfo', requestParam, 'GET').then(res => {
					// console.log("getFieldInfo", res)
					if (res) {
						if (res.code == 200) {
							//处理富文本中的图片，补全url链接
							if (res.data.richText) {
								res.data.richText = this.fixImageSrcInHtml(res.data.richText, this.getBaseUrl());
								//后台富文本编辑器内容为空时始终会保留2个标签，导致没有内容时title依然显示，这里做下处理
								if (res.data.richText === '<p><br></p>') {
									this.infoRichTextFlag = false;
								} else {
									this.infoRichTextFlag = true;
								}
							}
							this.data = res.data;
						}
					}
				});
			},
			// 用于修改HTML中的图片src  
			fixImageSrcInHtml(htmlText, baseUrl) {
				if (!htmlText) {
					console.error('HTML文本不能为空');
					return;
				}
				// 使用正则表达式匹配所有的URL
				const urlPattern = /src="([^"]+)"/g;
				let match;
				const restoredUrls = [];
				while ((match = urlPattern.exec(htmlText)) !== null) {
					const url = match[1];
					if (url.startsWith('/profile')) {
						restoredUrls.push(baseUrl + url);
					} else {
						restoredUrls.push(url); // 如果没有/profile，返回原URL
					}
				}
				// 替换处理后的HTML中的URL
				let newHtml = htmlText;
				restoredUrls.forEach((newUrl, index) => {
					const originalUrl = urlPattern.exec(htmlText)[1];
					newHtml = newHtml.replace(originalUrl, newUrl);
				});
				console.log('fixImageSrcRestoreUrls处理后的HTML：', newHtml)
				return newHtml;
			},
			//查看大图功能
			previewImage(url) {
				uni.previewImage({
					current: 0,
					urls: [url]
				});
			}
		},
	}
</script>

<style lang='scss'>
	page {
		background: $page-color-base;
		padding-bottom: 160upx;
	}

	.carousel {
		width: 100%;
		overflow: hidden;
		position: relative;
	}

	.image-wrapper {
		width: 100%;
		height: 500upx;
		display: flex;
	}

	.image-wrapper image {
		width: 100%;
		height: auto;
		/* 保持宽高比 */
		object-fit: cover;
		/* 确保图片覆盖整个容器，同时保持宽高比 */
	}

	/* 标题简介 */
	.introduce-section {
		background: #fff;
		padding: 20upx 30upx;

		.title {
			font-size: 32upx;
			color: $font-color-dark;
			height: 50upx;
			line-height: 50upx;
		}
	}

	/*  详情 */
	.detail-desc {
		background: #fff;
		margin-top: 16upx;
		margin-left: 16upx;
		margin-right: 16upx;

		.d-header {
			display: flex;
			justify-content: center;
			align-items: center;
			height: 80upx;
			font-size: $font-base + 2upx;
			color: $font-color-dark;
			position: relative;

			text {
				padding: 0 20upx;
				background: #fff;
				position: relative;
				z-index: 1;
			}

			&:after {
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translateX(-50%);
				width: 300upx;
				height: 0;
				content: '';
				border-bottom: 1px solid #ccc;
			}
		}
	}
</style>