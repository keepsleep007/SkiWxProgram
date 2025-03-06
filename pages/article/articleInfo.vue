<template>
	<view class="container">
		<view class="detail-desc" v-if="infoRichTextFlag">
			<view class="title">
				{{data.articleTitle}}
			</view>
			<view class="subtitle">
				{{data.articleSubtitles}}
			</view>
			<rich-text :nodes="data.infoRichText"></rich-text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				data: {},
				infoRichTextFlag: false
			};
		},
		async onLoad(options) {
			//接收传值,id
			let id = options.id;
			if (id) {
				console.log("onLoad_id", id)
				//根据id加载详细数据
				this.getDataInfo(id);
			}
		},
		methods: {
			getDataInfo(id) {
				this.request('/app_api/article/getArticleInfo/' + id, '', 'GET').then(res => {
					console.log("getArticleInfo", res)
					if (res) {
						if (res.code == 200) {
							//处理富文本中的图片，补全url链接
							if (res.data.infoRichText) {
								res.data.infoRichText = this.fixImageSrcInHtml(res.data.infoRichText, this.getBaseUrl());
								//后台富文本编辑器内容为空时始终会保留2个标签，导致没有内容时title依然显示，这里做下处理
								if (res.data.infoRichText === '<p><br></p>') {
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
		},
	}
</script>

<style lang='scss'>
	page {
		background: $page-color-base;
		padding-bottom: 160upx;
	}

	.detail-desc {
		background: #fff;
		margin-top: 16upx;
		margin-left: 16upx;
		margin-right: 16upx;
	}

	.title {
		text-align: center;
		font-size: 24px;
	}

	.subtitle {
		text-align: center;
		font-size: 20px;
	}
</style>