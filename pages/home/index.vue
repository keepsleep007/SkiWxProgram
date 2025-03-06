<template>
	<view class="uni-margin-wrap">
		<!-- 顶部位置轮播图 -->
		<swiper class="swiper" :circular="true" :indicator-dots="true" :autoplay="true" :interval="5000" :duration="500">
			<swiper-item v-for="(item, index) in bannerList" :key="index">
				<view class="swiper-item" @click="clickBannerItem(item)">
					<image :src="item.bannerImage" mode="aspectFill" :draggable="false" />
				</view>
			</swiper-item>
		</swiper>
		<!-- 中间位置是主功能区，有两种显示模式，这里是图片模式 -->
		<view class="uni-flex-grid uni-row" v-if="mainCardFlag==1" v-for="(item, index) in flexList" :key="index">
			<view class="flex-item-grid-left" @click="clickFlexItem(item.left)">
				<image :src="item.left.image" />
				<view class="title-text">{{item.left.title}}</view>
				<view class="subtitles-text">{{item.left.subtitles}}</view>
			</view>
			<view class="flex-item-grid-right" @click="clickFlexItem(item.right)">
				<image :src="item.right.image" />
				<view class="title-text">{{item.right.title}}</view>
				<view class="subtitles-text">{{item.right.subtitles}}</view>
			</view>
		</view>
		<!-- 中间位置是主功能区，有两种显示模式，这里是图标模式 -->
		<view class="icon-flex-continer" v-if="mainCardFlag==2">
			<view class="icon-flex-item" v-for="(item, index) in iconflexList" :key="index" @click="clickFlexItem(item)">
				<image class="icon-flex-item-image" :src="item.menuIcon" mode="widthFix"></image>
				<view class="icon-flex-item-title">{{item.title}}</view>
			</view>
		</view>
		<!-- 中间位置横向滚动区域，展示活动 -->
		<template v-if="activityFlag">
			<view class="uni-common-mt">
				<text>热门活动</text>
				<text class="more-text" @click="moreActivity()">更多>></text>
			</view>
			<view style="margin: 10px;">
				<scroll-view class="scroll-view_H" scroll-x="true" @scroll="scroll" scroll-left="0">
					<template v-for="(item, index) in scrollData">
						<view class="scroll-view-item_H" :key="index" @click="toActiveInfo(item)">
							<view class="scroll-view-item-image">
								<image :src="item.coverImage" />
							</view>
							<view class="scroll-view-item-title">
								<text>{{item.activityTitle}}</text>
							</view>
							<view class="scroll-view-item-price">
								<text>￥{{item.price}} 起</text>
							</view>
							<view class="scroll-view-item-tag">
								<template v-for="(activityTagitem, index) in activityTagList">
									<template v-if="item.activityTag==activityTagitem.dictValue">
										<text :key="index">{{ activityTagitem.dictLabel }}</text>
									</template>
								</template>
							</view>
						</view>
					</template>
				</scroll-view>
			</view>
		</template>
		<!-- 中间位置横向滚动区域，展示推荐教练 -->
		<template v-if="teacherFlag">
			<view class="uni-common-mt">
				<text>滑雪教练</text>
				<text class="more-text" @click="moreTeacher()">更多>></text>
			</view>
			<view style="margin: 10px;">
				<scroll-view class="scroll-view-teacher" scroll-x="true" @scroll="scroll" scroll-left="0">
					<template v-for="(card, index) in teacherData">
						<view class="teacher-item" :key="index">
							<view class="teacher-item-tag">
								<template v-for="(teachType, index) in teachTypeList">
									<template v-if="card.teachType==teachType.dictValue">
										<view>
											<text :key="teachType.dictValue">{{ teachType.dictLabel }}</text>
										</view>
									</template>
								</template>
							</view>
							<view class="teacher-item-avatar">
								<u-avatar :src="card.headPhoto!=null?getBaseUrl()+card.headPhoto:avatarUrl" size="70"></u-avatar>
							</view>
							<view class="teacher-item-nickname">
								<text>{{card.nickname}}</text>
							</view>
							<view class="teacher-item-introduce">
								<text>{{card.introduce}}</text>
							</view>
							<view class="teacher-item-button" @click="toTeacherInfo(card)">预定</view>
						</view>
					</template>
				</scroll-view>
			</view>
		</template>
		<!-- 中间位置横向滚动区域，展示雪场百科 -->
		<template v-if="snowAreaFlag">
			<view class="uni-common-mt">
				<text>雪场百科</text>
			</view>
			<view style="margin: 10px;">
				<scroll-view class="scroll-view-snow-area" scroll-x="true" @scroll="scroll" scroll-left="0">
					<template v-for="(card, index) in snowAreaList">
						<view class="snow-area-item" :key="index" @click="toSnowAreaInfo(card)">
							<view class="snow-area-item-image">
								<image :src="getBaseUrl()+card.coverImage" />
							</view>
							<view class="snow-area-item-name">
								<text>{{card.label}}</text>
							</view>
						</view>
					</template>
				</scroll-view>
			</view>
		</template>
		<!-- 底部文字 -->
		<view class="copyright">
			<text>— Club —</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				//控制是否显示【滑雪教练】板块
				teacherFlag: false,
				activityFlag: false,
				snowAreaFlag: false,
				current: 0,
				swiperDotIndex: 0,
				bannerList: {},
				//控制主功能区显示模式,默认0不显示，1-图片模式；2-图标模式
				mainCardFlag: 0,
				flexList: [],
				iconflexList: [],
				scrollData: [],
				activityTagList: [],
				teacherData: [],
				teachTypeList: [],
				snowAreaList: [],
			}
		},
		onLoad() {
			// 加载轮播图
			this.getBannerlist();
			//加载主功能区显示模式
			this.getMainCardFlag();
			// 加载主功能区卡片
			this.getMainCard();
			// 加载热门活动
			this.getActivity();
			// 加载活动标签
			this.getActivityTag();
			//加载推荐教练
			this.getTeacherList();
			// 加载教练体系
			this.loadTeacherSystemTag();
			//加载雪场地区
			this.getSnowArea();
		},
		computed: {},
		methods: {
			clickBannerItem(item) {
				console.info("clickBannerItem", item)
				this.toLink(item);
			},
			clickFlexItem(item) {
				console.info("clickFlexItem", item)
				this.toLink(item);
			},
			changeSwiper(e) {
				this.current = e.detail.current
			},
			changeGrid(e) {
				this.$modal.showToast('模块建设中~')
			},
			getBannerlist() {
				this.request('/app_api/banner/loadBanner', 'GET').then(res => {
					// console.log("getBannerlist:", res)
					if (res) {
						let imgurl = {}
						for (var i = 0; i < res.data.length; i++) {
							imgurl[i] = {};
							imgurl[i]['bannerImage'] = this.getBaseUrl() + res.data[i].image;
							imgurl[i]['url'] = res.data[i].url;
						}
						// console.log(imgurl)
						this.bannerList = imgurl
					}
				})
			},
			getMainCardFlag() {
				this.request('/app_api/maincard/getMainCardFlag', 'GET').then(res => {
					// console.log("getMainCardFlag:", res)
					if (res) {
						this.mainCardFlag = res.msg;
					}
				})
			},
			getMainCard() {
				this.request('/app_api/maincard/loadCard', 'GET').then(res => {
					// console.log("loadCard:", res)
					if (res) {
						var j = 0;
						let tmpflexList = [];
						for (var i = 0; i < res.data.length; i++) {
							let tmp = {};
							if (i % 2 === 0) {
								tmp.image = this.getBaseUrl() + res.data[i].image;
								tmp.menuIcon = this.getBaseUrl() + res.data[i].menuIcon;
								tmp.url = res.data[i].url;
								tmp.subtitles = res.data[i].subtitles;
								if (tmp.subtitles == null) {
									tmp.subtitles = '';
								}
								tmp.title = res.data[i].title;
								tmpflexList[j] = {};
								tmpflexList[j]['left'] = tmp;
								//图标模式显示的集合中也存一份
								if (res.data[i].id != null) {
									this.iconflexList.push(tmp)
								}
							} else {
								tmp.image = this.getBaseUrl() + res.data[i].image;
								tmp.menuIcon = this.getBaseUrl() + res.data[i].menuIcon;
								tmp.url = res.data[i].url;
								tmp.subtitles = res.data[i].subtitles;
								if (tmp.subtitles == null) {
									tmp.subtitles = '';
								}
								tmp.title = res.data[i].title;
								if (res.data[i].image == null) {
									tmp.image = null;
								}
								tmpflexList[j]['right'] = tmp;
								//图标模式显示的集合中也存一份
								if (res.data[i].id != null) {
									this.iconflexList.push(tmp)
								}
								j++;
							}
						}
						// console.log(this.iconflexList);
						this.flexList = tmpflexList;
					}
				})
			},
			getActivity() {
				let requestParam = {};
				requestParam.showHomeStatus = '0';
				this.request('/app_api/activity/loadActivity', requestParam, 'GET').then(res => {
					// console.log("loadActivity:", res)
					if (res) {
						if (res.data.length > 0) {
							for (var i = 0; i < res.data.length; i++) {
								res.data[i].coverImage = this.getBaseUrl() + res.data[i].coverImage;
							}
							this.scrollData = res.data;
							this.activityFlag = true;
						}
					}
				})
			},
			getActivityTag() {
				this.request('/app_api/activity/loadActivityTag', 'GET').then(res => {
					// console.log("res:", res.data)
					if (res) {
						this.activityTagList = res.data
					}
				})
			},
			getTeacherList() {
				let requestParam = {};
				requestParam.indexShow = '1';
				this.request('/app_api/teacher/getTeacherList', requestParam, 'GET').then(res => {
					// console.log("getTeacherList:", res)
					if (res) {
						// 根据后台返回的总条数，判断有没有教练信息，如果没有则不向下执行逻辑防止报错，同时隐藏页面【滑雪教练】标题
						if (res.data[1] == 0) {
							return;
						}
						this.teacherFlag = true;
						this.teacherData = res.data[0];
					}
				})
			},
			loadTeacherSystemTag() {
				this.request('/app_api/teacher/loadTeacherSystemTag', 'GET').then(res => {
					// console.log("loadTeacherSystemTag:", res)
					if (res) {
						this.teachTypeList = res.data[1];
					}
				})
			},
			getSnowArea() {
				let requestParam = {};
				requestParam.showFlag = '1';
				this.request('/app_api/snowField/listArea', requestParam, 'GET').then(res => {
					console.log("listArea:", res)
					if (res) {
						if (res.data.length == 0) {
							return;
						}
						this.snowAreaList = res.data;
						this.snowAreaFlag = true;
					}
				})
			},
			toSnowAreaInfo(item) {
				// console.log("toSnowAreaInfo", item)
				uni.navigateTo({
					url: '/pages/snowfield/fieldList?id=' + item.id
				});
			},
			// 横滚时触发
			scroll: function(e) {
				// console.log(e)
			},
			toActiveInfo(item) {
				uni.navigateTo({
					url: '/pages/active/active_info?id=' + item.id
				});
			},
			toTeacherInfo(item) {
				console.log("toTeacherInfo", item)
				//uni.switchTab跳转时不能携带参数，这里将数据存储到缓存中，跳转后页面从缓存中获取一次数据，获取后，删除掉缓存中的数据
				uni.setStorageSync('teacherData', item);
				// uni.switchTab({
				// 	url: '/pages/teacher/teacherIndex'
				// });
				uni.navigateTo({
					url: '/pages/teacher/teacherIndex'
				});
			},
			toLink(item) {
				let urlArr = item.url.split('|')
				let firstChar = urlArr[0]
				let link = urlArr[1]
				//不跳转
				if (firstChar === '0') {
					console.log("不跳转");
					return;
				}
				// URL
				if (firstChar === '1') {
					console.log("跳转URL", link)
					uni.navigateTo({
						url: link
					});
				}
				// APP功能页
				if (firstChar === '2') {
					console.log("功能页", link)
					// 圈子，快讯
					if (link === "10") {
						uni.setStorageSync('tabIndex', 0);
						uni.switchTab({
							url: '/pages/club/club'
						});
					}
					//圈子，拼车
					if (link === "11") {
						uni.setStorageSync('tabIndex', 1);
						uni.switchTab({
							url: '/pages/club/club'
						});
					}
					//圈子，拼房
					if (link === "12") {
						uni.setStorageSync('tabIndex', 2);
						uni.switchTab({
							url: '/pages/club/club'
						});
					}
					//圈子，捡漏
					if (link === "13") {
						uni.setStorageSync('tabIndex', 3);
						uni.switchTab({
							url: '/pages/club/club'
						});
					}
					// 活动
					if (link == "2") {
						uni.switchTab({
							url: '/pages/active/active'
						});
					}
					// 教练
					if (link === "3") {
						// uni.switchTab({
						// 	url: '/pages/teacher/teacherIndex'
						// });
						this.moreTeacher();
					}
					// 我的
					if (link === "4") {
						uni.switchTab({
							url: '/pages/me/me'
						});
					}
					// 雪票
					if (link === "5") {
						uni.switchTab({
							url: '/pages/ticket/ticketIndex'
						});
					}
				}
				// 内容聚合页
				if (firstChar === '3') {
					console.log("内容聚合页", link)
					// 攻略
					if (link === "1") {
						uni.navigateTo({
							url: '/pages/article/strategyIndex'
						});
					}
					// 吃喝
					if (link == "2") {
						uni.navigateTo({
							url: '/pages/article/eat-drink-Index'
						});
					}
					// 推荐
					if (link === "3") {
						uni.navigateTo({
							url: '/pages/article/reco-Index'
						});
					}
				}
				// 指定文章
				if (firstChar === '4') {
					console.log("指定文章", link)
					uni.navigateTo({
						url: '/pages/article/articleInfo?id=' + link
					});
				}
			},
			moreTeacher() {
				uni.navigateTo({
					url: '/pages/teacher/teacherIndex'
				});
			},
			moreActivity() {
				uni.switchTab({
					url: '/pages/active/active'
				});
			}
		}
	}
</script>

<style>
	page {
		background-color: #ffffff;
	}

	s .uni-margin-wrap {
		width: 690rpx;
		width: 100%;
	}

	.swiper {
		height: 300rpx;
	}

	.swiper-item {
		display: block;
		height: 300rpx;
		line-height: 300rpx;
		text-align: center;
	}

	.swiper-list {
		margin-top: 40rpx;
		margin-bottom: 0;
	}

	.uni-common-mt {
		margin-top: 30rpx;
		margin-left: 10px;
		margin-right: 10px;
		position: relative;
		font-size: 17px;
		font-weight: bold;
		display: flex;
		/* 设置为Flex容器 */
		justify-content: space-between;
		/* 使得子元素之间的空间被分配，分别靠向两端 */
		align-items: center;
		/* 确保子元素在垂直方向上居中对齐 */
	}

	.more-text {
		font-size: 14px;
		color: #8f8f94;
	}

	.info {
		position: absolute;
		right: 20rpx;
	}

	.uni-padding-wrap {
		width: 550rpx;
		padding: 0 100rpx;
	}

	.uni-bg-red {
		background: red;
	}

	.uni-bg-green {
		background: green;
	}

	.uni-bg-blue {
		background: blue;
	}

	/* 宫格样式 */

	.uni-flex-grid {
		display: flex;
	}

	.uni-row {
		flex-direction: row;
	}

	.flex-item-grid-left {
		position: relative;
		margin-left: 10px;
		margin-right: 5px;
		margin-top: 10px;
		width: 50%;
		height: 100px;
		text-align: center;
		line-height: 100px;
	}

	.flex-item-grid-right {
		position: relative;
		margin-left: 5px;
		margin-right: 10px;
		margin-top: 10px;
		width: 50%;
		height: 100px;
		text-align: center;
		line-height: 100px;
	}

	.flex-item-grid-left image {
		height: 100px;
		width: 100%;
		/* 设置圆角的大小 */
		border-radius: 10px;
		z-index: 1;
	}

	.flex-item-grid-right image {
		height: 100px;
		width: 100%;
		/* 设置圆角的大小 */
		border-radius: 10px;
		z-index: 1;
	}

	.title-text {
		position: absolute;
		/* 将文字位置放在容器的垂直中间 */
		top: 70%;
		left: 5%;
		/* 使文字水平垂直居中 */
		transform: translate(0%, -50%);
		/* 文字颜色 */
		color: #FFFFFF;
		/* 确保文字在图片上方 */
		z-index: 2;
		/* 文字大小 */
		font-size: 17px;
		font-weight: bold;
		text-shadow:
			1px 1px 2px rgba(0, 0, 0, 0.8),
			-1px -1px 2px rgba(156, 156, 156, 0.8),
			5px 0 10px rgba(64, 128, 180, 0.8),
			-5px 0 10px rgba(64, 128, 180, 0.8);
	}

	.subtitles-text {
		position: absolute;
		/* 将文字位置放在容器的垂直中间 */
		top: 90%;
		left: 5%;
		/* 使文字水平垂直居中 */
		transform: translate(0%, -50%);
		/* 文字颜色 */
		color: #FFFFFF;
		/* 确保文字在图片上方 */
		z-index: 2;
		/* 文字大小 */
		font-size: 12px;
		text-shadow:
			1px 1px 2px rgba(0, 0, 0, 0.8),
			-1px -1px 2px rgba(156, 156, 156, 0.8),
			5px 0 10px rgba(64, 128, 180, 0.8),
			-5px 0 10px rgba(64, 128, 180, 0.8);
	}

	/* 横滚区域样式 */
	.scroll-Y {
		height: 300rpx;
	}

	.scroll-view_H {
		white-space: nowrap;
		width: 100%;
	}

	.scroll-view-item_H {
		position: relative;
		display: inline-block;
		width: 200rpx;
		height: 300rpx;
		line-height: 50rpx;
		text-align: center;
		font-size: 36rpx;
		margin-right: 10px;
	}

	.scroll-view-item-image {
		width: 200rpx;
		height: 200rpx;
		text-align: center;
		font-size: 36rpx;
	}

	.scroll-view-item-image image {
		height: 200rpx;
		width: 200rpx;
		/* 设置圆角的大小 */
		border-radius: 10px;
	}

	.scroll-view-item-title {
		width: 200rpx;
		height: 70rpx;
		font-size: 12px;
		line-height: 18px;
		word-break: break-all;
		white-space: normal;
		text-align: left;
	}

	.scroll-view-item-price {
		text-align: left;
		font-size: 25rpx;
		color: #ff5a5f;
		font-weight: bold;
	}

	.scroll-view-item-tag {
		position: absolute;
		/* 使用绝对定位将标签固定在左上角 */
		top: 0;
		/* 距离父容器顶部 0px */
		left: 0;
		/* 距离父容器左侧 0px */
		width: auto;
		/* 根据内容自动调整宽度，或者设置一个具体的宽度 */
		height: auto;
		/* 根据内容自动调整高度，或者设置一个具体的高度 */
		padding: 2px 5px;
		/* 根据需要添加内边距，以确保文字不会紧贴边框 */
		text-align: center;
		/* 文字水平居中 */
		line-height: normal;
		/* 行高设置为正常，或者根据需要设置一个具体的值 */
		background-color: #ff5a5f;
		/* 背景颜色 */
		border-radius: 5px;
		/* 圆角 */
		color: #FFFFFF;
		/* 文字颜色 */
		font-size: 11px;
		/* 字体大小 */
	}

	/* 设置scroll-view的样式，确保内容横向滚动 */
	.scroll-view-teacher {
		overflow-x: auto;
		/* 允许横向滚动 */
		overflow-y: hidden;
		/* 隐藏纵向滚动条 */
		overflow-x: auto;
		/* 允许水平滚动 */
		overflow-y: hidden;
		/* 禁止垂直滚动 */
		white-space: nowrap;
		/* 防止内容换行 */
		-webkit-overflow-scrolling: touch;
		/* 在移动设备上启用平滑滚动 */
		flex-direction: row;
		/* 水平排列子元素 */
	}

	/* 设置teacher-item的样式，使用Flexbox布局 */
	.teacher-item {
		display: inline-flex;
		/* 使元素作为flex容器，并且在一行内显示 */
		flex-direction: column;
		/* 子元素垂直排列 */
		align-items: center;
		/* 子元素在交叉轴（水平方向）上居中 */
		justify-content: center;
		/* 子元素在主轴（垂直方向）上居中，但这里我们可能需要调整 */
		width: 200rpx;
		/* 设定宽度 */
		height: 210px;
		/* 设定高度，以适应垂直堆叠的内容 */
		background-color: #efeff4;
		/* 浅灰色背景色 */
		margin-right: 10px;
		/* 添加右侧外边距 */
		box-sizing: border-box;
		/* 包括内边距和边框在内计算元素的总宽度和高度 */
		padding: 10px;
		/* 添加内边距，使内容不紧贴边框 */
		border-radius: 10px;
		position: relative;
		/* 必要的，以便定位内部的绝对元素 */
	}

	/* 设置teacher-item-avatar的样式 */
	.teacher-item-avatar {
		width: 70px;
		/* 头像宽度 */
		height: 70px;
		/* 头像高度 */
		margin-bottom: 5px;
		/* 与下方内容保持一定距离 */
		margin-top: 10px;
	}

	/* 设置teacher-item-nickname的样式 */
	.teacher-item-nickname {
		font-size: 11px;
		/* 字体大小 */
		color: #000000;
		/* 字体颜色 */
		margin-bottom: 5px;
		/* 与下方内容（如果有）保持一定距离 */
		/* 字体颜色 */
		overflow: hidden;
		/* 隐藏超出部分 */
		text-overflow: ellipsis;
		/* 超出部分用省略号表示，但这通常用于单行文本 */
		display: -webkit-box;
		/* 如果需要多行省略，可以使用webkit的盒子模型 */
		-webkit-line-clamp: 1;
		/* 限制显示的行数 */
		-webkit-box-orient: vertical;
		/* 垂直方向布局 */
		word-wrap: break-word;
		/* 允许长单词换行 */
	}

	/* 设置teacher-item-introduce的样式 */
	.teacher-item-introduce {
		font-size: 11px;
		/* 字体大小 */
		color: #000000;
		/* 字体颜色 */
		overflow: hidden;
		/* 隐藏超出部分 */
		text-overflow: ellipsis;
		/* 超出部分用省略号表示，但这通常用于单行文本 */
		display: -webkit-box;
		/* 如果需要多行省略，可以使用webkit的盒子模型 */
		-webkit-line-clamp: 3;
		/* 限制显示的行数 */
		-webkit-box-orient: vertical;
		/* 垂直方向布局 */
		white-space: normal;
		/* 允许换行 */
	}

	/* 设置teacher-item-button的样式 */
	.teacher-item-button {
		margin-top: auto;
		/* 使用margin-top: auto将按钮推到容器的底部 */
		background-color: #ff5a5f;
		/* 背景色 */
		color: #fff;
		/* 字体颜色 */
		border-radius: 15px;
		/* 圆角 */
		text-align: center;
		/* 文字居中 */
		line-height: normal;
		/* 行高，使文字垂直居中 */
		font-size: 13px;
		/* 字体大小 */
		padding: 5px 25px;
		/* 根据需要添加内边距，以确保文字不会紧贴边框 */
	}

	.teacher-item-tag {
		position: absolute;
		/* 使用绝对定位将标签固定在左上角 */
		top: 0;
		/* 距离父容器顶部 0px */
		left: 0;
		/* 距离父容器左侧 0px */
		width: auto;
		/* 根据内容自动调整宽度，或者设置一个具体的宽度 */
		height: auto;
		/* 根据内容自动调整高度，或者设置一个具体的高度 */
		padding: 2px 5px;
		/* 根据需要添加内边距，以确保文字不会紧贴边框 */
		text-align: center;
		/* 文字水平居中 */
		line-height: normal;
		/* 行高设置为正常，或者根据需要设置一个具体的值 */
		background-color: #ff5a5f;
		/* 背景颜色 */
		border-radius: 5px;
		/* 圆角 */
		color: #FFFFFF;
		/* 文字颜色 */
		font-size: 11px;
		/* 字体大小 */
	}

	.scroll-view-snow-area {
		overflow-x: auto;
		/* 允许横向滚动 */
		overflow-y: hidden;
		/* 隐藏纵向滚动条 */
		overflow-x: auto;
		/* 允许水平滚动 */
		overflow-y: hidden;
		/* 禁止垂直滚动 */
		white-space: nowrap;
		/* 防止内容换行 */
		-webkit-overflow-scrolling: touch;
		/* 在移动设备上启用平滑滚动 */
		flex-direction: row;
		/* 水平排列子元素 */
	}

	.snow-area-item {
		display: inline-flex;
		/* 使元素作为flex容器，并且在一行内显示 */
		flex-direction: column;
		/* 子元素垂直排列 */
		align-items: center;
		/* 子元素在交叉轴（水平方向）上居中 */
		justify-content: center;
		/* 子元素在主轴（垂直方向）上居中，但这里我们可能需要调整 */
		width: 300rpx;
		/* 设定宽度 */
		height: 180rpx;
		/* 设定高度，以适应垂直堆叠的内容 */
		background-color: #eaeaea;
		/* 浅灰色背景色 */
		margin-right: 10px;
		/* 添加右侧外边距 */
		box-sizing: border-box;
		/* 包括内边距和边框在内计算元素的总宽度和高度 */
		padding: 10px;
		/* 添加内边距，使内容不紧贴边框 */
		border-radius: 10px;
		position: relative;
		/* 必要的，以便定位内部的绝对元素 */
	}

	.snow-area-item-image {
		width: 300rpx;
		height: 180rpx;
		text-align: center;
		font-size: 36rpx;
		border-radius: 10px;
	}

	.snow-area-item-image image {
		width: 300rpx;
		height: 180rpx;
		/* 设置圆角的大小 */
		border-radius: 10px;
	}

	.snow-area-item-name {
		position: absolute;
		/* 将文字位置放在容器的垂直中间 */
		top: 80%;
		left: 5%;
		/* 使文字水平垂直居中 */
		transform: translate(0%, -50%);
		/* 文字颜色 */
		color: #FFFFFF;
		/* 确保文字在图片上方 */
		z-index: 2;
		/* 文字大小 */
		font-size: 17px;
		text-shadow:
			1px 1px 2px rgba(0, 0, 0, 0.8),
			-1px -1px 2px rgba(156, 156, 156, 0.8),
			5px 0 10px rgba(64, 128, 180, 0.8),
			-5px 0 10px rgba(64, 128, 180, 0.8);
	}

	/* 主功能区图标样式开始 */
	.icon-flex-continer {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		margin: 10px;
	}

	.icon-flex-item {
		display: flex;
		/* 内部的Flexbox容器，但这里主要用于垂直对齐（尽管文字默认在下方） */
		flex-direction: column;
		/* 垂直方向排列子元素 */
		align-items: center;
		/* 子元素水平居中对齐（对于图标有用，但文字会自然在下方） */
	}

	.icon-flex-item-image {
		width: 48px;
		/* 设置图标的宽度 */
		height: auto;
		/* 保持图标的宽高比 */
		margin-bottom: 8px;
		/* 图标和文字之间的间距 */
	}

	.icon-flex-item-title {
		color: #333;
		/* 设置文字颜色 */
		font-size: 16px;
		/* 设置文字大小 */
		text-align: center;
		/* 文字居中对齐，或者根据需要设置为left/right */
		font-weight: bold;
	}

	.copyright {
		margin: 20rpx auto;
		width: 80%;
		height: 60rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #9E9E9E;
		font-size: 26rpx;
	}
</style>