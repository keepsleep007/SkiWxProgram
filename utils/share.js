export default {
	data() {
		return {
			// 默认的全局分享内容
			share: {
				title: '拼车、拼房、找雪友、找雪票、找教练，找优惠，啥啥都行', //分享时的标题
				path: '/pages/home/index', // 全局分享的路径，比如 首页
				imageUrl: '/static/img/shardimg.jpg', // 全局分享的图片(可本地可网络)
			}
		}
	},
	// 定义全局分享
	// 1.发送给朋友
	onShareAppMessage(res) {
		return {
			title: this.share.title,
			path: this.share.path,
			imageUrl: this.share.imageUrl,
		}
	},
	//2.分享到朋友圈
	onShareTimeline(res) {
		return {
			title: this.share.title,
			path: this.share.path,
			imageUrl: this.share.imageUrl,
		}
	},
}