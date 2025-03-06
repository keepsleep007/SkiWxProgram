<template>
	<view class="container">
		<view class="detail-desc">
			<rich-text :nodes="data.richText"></rich-text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				data: {},
			};
		},
		async onLoad() {
			//这个id是固定值，数据有且仅有这一条数据
			this.getDataInfo('397ac855fe544c4bb8498d4870b852d7');
		},
		methods: {
			getDataInfo(id) {
				this.request('/app_api/util/getAboutClubInfo/' + id, '', 'GET').then(res => {
					// console.log("getAboutClubInfo", res)
					if (res) {
						if (res.code == 200) {
							//处理富文本中的图片，补全url链接
							if (res.data.richText) {
								res.data.richText = this.fixImageSrcInHtml(res.data.richText, this.getBaseUrl());
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
			}
		},
	}
</script>

<style lang='scss'>
	page {
		background: #fff;
		padding-bottom: 160upx;
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