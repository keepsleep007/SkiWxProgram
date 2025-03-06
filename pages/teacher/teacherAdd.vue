<template>
	<view class="container">
		<!-- 自定义表单校验 -->
		<uni-forms ref="teacherInfoForm" :rules="rules" :model="formData">
			<uni-card title="教练信息" extra=" ">
				<view class="uni-list" v-if="statusShow">
					<view class="uni-list-cell uni-list-cell-pd">
						<view class="uni-list-cell-db">接单状态：({{switchText}})</view>
						<switch :checked="statusFlag" @change="switchChange" />
					</view>
				</view>
				<uni-forms-item label="昵称" required name="nickname" label-width="auto">
					<uni-easyinput v-model="formData.nickname" placeholder="请输入昵称" />
				</uni-forms-item>
				<uni-forms-item label="性别" required name="iSex" label-width="auto">
					<uni-data-select placeholder="请选择性别" v-model="formData.iSex" :localdata="iSex"></uni-data-select>
				</uni-forms-item>
				<uni-forms-item label="手机" required name="phone" label-width="auto">
					<uni-easyinput v-model="formData.phone" placeholder="请输入号码" />
				</uni-forms-item>
				<uni-forms-item label="头像" required name="headPhotoShow" label-width="auto">
					<!-- uni-file-picker组件在H5下无法使用，会出现图片无法上传，必须在真机小程序中验证这块的功能 -->
					<uni-file-picker ref="headPhotoShow" v-model="formData.headPhotoShow" file-mediatype="image" mode="grid" :limit="1" @select="imageUpload($event,1)" />
				</uni-forms-item>
				<uni-forms-item label="个人\n简介" required name="introduce" label-width="auto">
					<uni-easyinput type="textarea" v-model="formData.introduce" placeholder="请输入简介,300字以内" />
				</uni-forms-item>
				<uni-forms-item label="擅长\n领域" required name="tags" label-width="auto">
					<uni-easyinput type="textarea" v-model="formData.tags" placeholder="请输入领域,多个可使用 / 分隔(刻滑/公园)" />
				</uni-forms-item>
				<uni-forms-item label=" 雪龄" required name="skiAge" label-width="auto">
					<uni-number-box v-model="formData.skiAge" />
				</uni-forms-item>
				<uni-forms-item label="教龄" required name="teachAge" label-width="auto">
					<uni-number-box v-model="formData.teachAge" />
				</uni-forms-item>
				<uni-forms-item label="教学类型" required name="teachType" label-width="auto">
					<uni-data-select placeholder="请选择教学类型" v-model="formData.teachType" :localdata="teachType"></uni-data-select>
				</uni-forms-item>
				<uni-forms-item label="常驻雪场" required name="skiResortName" label-width="auto">
					<view class="textarea-container" @click="openSkiResport">
						<textarea class="textarea" disabled v-model="formData.skiResortName" placeholder="请选择雪场,10个以内"></textarea>
						<!-- 设置disabled后无法响应点击事件，这里放个透明遮罩层，实际点击的是遮罩层 -->
						<view class="click-mask" @click="openSkiResport"></view>
					</view>
				</uni-forms-item>
				<uni-forms-item label="教练体系" required name="teacherSystem" label-width="auto">
					<uni-data-select placeholder="请选择体系" v-model="formData.teacherSystem" :localdata="teacherSystem"></uni-data-select>
				</uni-forms-item>
				<uni-forms-item label="体系等级" required name="teacherLevel" label-width="auto">
					<uni-data-select placeholder="请选择等级" v-model="formData.teacherLevel" :localdata="teacherLevel"></uni-data-select>
				</uni-forms-item>
			</uni-card>
			<uni-card title="价格信息" extra=" ">
				<view class="grid-container">
					<!-- 标题行（这里不是网格布局的一部分，但用于展示） -->
					<view class="grid-row">
						<view class="grid-cell">
							教学模式
						</view>
						<view class="grid-cell">
							教学时长（时）
						</view>
						<view class="grid-cell">
							教学价格
						</view>
					</view>
					<!-- 网格布局开始 -->
					<view class="grid-row" v-for="(row, index) in formData.teacher_priceList" :key="index">
						<view class="grid-cell">
							<uni-forms-item :name="['teacher_priceList',index,'tcMode']" :rules="[{required: true,errorMessage: '不能为空'}]">
								<uni-data-select v-model="formData.teacher_priceList[index].tcMode" :localdata="teachMode"></uni-data-select>
							</uni-forms-item>
						</view>
						<view class="grid-cell">
							<uni-number-box v-model="row.tcTime"></uni-number-box>
						</view>
						<view class="grid-cell">
							<uni-forms-item :name="['teacher_priceList',index,'price']" :rules="[{required: true,errorMessage: '不能为空'},{format: 'number',errorMessage: '只能输入数字'}]">
								<uni-easyinput v-model="formData.teacher_priceList[index].price"></uni-easyinput>
							</uni-forms-item>
						</view>
					</view>
					<!-- 添加行的按钮 -->
					<view class="grid-row">
						<view class="grid-cell"></view>
						<view class="grid-cell">
							<button style="width: 80px; height: 30px; font-size: 100%;" @click="addRow">增加</button>
						</view>
						<view class="grid-cell">
							<button style="width: 80px; height: 30px; font-size: 100%;" @click="delRow">删除</button>
						</view>
					</view>
				</view>
			</uni-card>
			<!-- <uni-card title="视频" extra=" ">
				<view>
					<uni-forms-item label="滑行" required name="skiVideoShow">
						<video v-if="skiVideoShowFlag" :src="formData.skiVideoShow.url" controls show-fullscreen-btn style="width: 200px;height: 200px;"></video>
						<uni-file-picker ref="skiVideoShow" title="注:视频大小不可超过50MB" v-model="formData.skiVideoShow" file-mediatype="video" mode="grid" :limit="1" @select="videoUpload($event,3,'skiVideoShow')" @delete="delVideo($event,3)" />
					</uni-forms-item>
					<uni-forms-item label="教学" required name="teacherVideoShow">
						<video v-if="teacherVideoShowFlag" :src="formData.teacherVideoShow.url" controls show-fullscreen-btn style="width: 200px;height: 200px;"></video>
						<uni-file-picker ref="teacherVideoShow" title="注:视频大小不可超过50MB" v-model="formData.teacherVideoShow" file-mediatype="video" mode="grid" :limit="1" @select="videoUpload($event,4,'teacherVideoShow')" @delete="delVideo($event,4)" />
					</uni-forms-item>
				</view>
			</uni-card> -->
			<uni-card title="证书" extra=" ">
				<view>
					<uni-forms-item label="证书" required name="caFilePathShow">
						<uni-file-picker ref="caFilePathShow" v-model="formData.caFilePathShow" file-mediatype="image" mode="grid" :limit="1" @select="imageUpload($event,2)" />
					</uni-forms-item>
				</view>
			</uni-card>
			<uni-card title="审核结果" extra=" ">
				<view>
					<text v-if="formData.reviewStatus=='0'">待审核</text>
					<text v-if="formData.reviewStatus=='1'">通过</text>
					<text v-if="formData.reviewStatus=='2'">拒绝</text>
				</view>
				<view v-if="formData.reviewStatus!='0'">
					<text v-if="formData.reviewText !== null">审核说明：{{formData.reviewText}}</text>
					<text v-else></text>
				</view>
				<view v-if="formData.reviewStatus!='0'">
					<text>审核时间：{{formData.reviewTime}}</text>
				</view>
			</uni-card>
		</uni-forms>
		<button class="button" :disabled="isDisabled" type="primary" @click="submit('teacherInfoForm')">{{subBtnTitle}}</button>
		<!-- 提示需要预留手机或微信弹窗 -->
		<view>
			<uni-popup ref="alertDialog" type="dialog">
				<uni-popup-dialog style="text-align: center;" :type="msgType" cancelText="拒绝" confirmText="同意" title="提示" content="注册教练会收集个人性别、手机号等信息,用于审核教练资格" @confirm="dialogConfirm" @close="dialogClose"></uni-popup-dialog>
			</uni-popup>
		</view>
		<!-- 常驻雪场选择功能弹窗 -->
		<uni-popup ref="popup" type="right" :animation="true" background-color="#fff">
			<view class="popup-content flex-container">
				<view class="flex-item left">
					<uni-data-checkbox mode="tag" v-model="snowAreaCheckBox" :localdata="snowField_tree" :map="{text:'label',value:'id'}"></uni-data-checkbox>
				</view>
				<!-- 分割线 -->
				<view class="divider">
				</view>
				<view class="flex-item right">
					<template v-for="(datalist, index) in snowField_tree">
						<uni-data-checkbox :key="index" v-show="snowAreaCheckBox==datalist.id?true:false" mode="tag" multiple v-model="datalist.checkbox" :localdata="datalist.children" :map="{text:'label',value:'tid'}"></uni-data-checkbox>
					</template>
				</view>
			</view>
			<button class="button" type="primary" @click="snowFieldClick">确定</button>
		</uni-popup>
	</view>
</template>

<script>
	import {
		getToken,
		getConfig,
		getUserInfo,
	} from '@/utils/auth';
	export default {
		data() {
			return {
				//接单状态组件是否显示，新建时不显示，只有通过审核的才显示
				statusShow: false,
				//接单状态，页面组件使用此字段
				statusFlag: false,
				//标志进入此页面后是新增还是编辑
				editFlag: '',
				//提交按钮展示的文字，新增（提交），编辑（更新）
				subBtnTitle: '',
				//接单开关提示语
				switchText: '他人可在教练列表看到你',
				// 雪场地区选择
				snowAreaCheckBox: '',
				// 性别初始化数据 
				iSex: [{
						value: '0',
						text: "男"
					},
					{
						value: '1',
						text: "女"
					},
				],
				// 教学类型
				teachType: [],
				// 教练体系
				teacherSystem: [],
				// 体系等级
				teacherLevel: [],
				//教学模式
				teachMode: [],
				// 雪场数据
				snowField: [],
				// 雪场数据.构建成为树形结构
				snowField_tree: [],
				// 滑行视频 video组件是否显示
				skiVideoShowFlag: false,
				// 教学视频 video组件是否显示
				teacherVideoShowFlag: false,
				//常驻雪场数据
				snowFieldArr: [],
				// 提交按钮控制,防止连续点击（false则按钮可点击）
				isDisabled: false,
				//表单数据
				formData: {
					//接单状态，0-正常接单、1-暂停接单
					status: '',
					nickname: '',
					iSex: '',
					phone: '',
					headPhoto: '',
					introduce: '',
					tags: '',
					skiAge: 0,
					teachAge: 0,
					teachType: '',
					skiResort: '',
					// 常驻雪场翻译成文字后的内容
					skiResortName: '',
					// 教练体系
					teacherSystem: '',
					// 体系等级
					teacherLevel: '',
					// 价格信息
					teacher_priceList: [{
						tcMode: '',
						tcTime: 1,
						price: '',
					}],
					skiVideo: '',
					teacherVideo: '',
					caFilePath: '',
					headPhotoShow: [],
					skiVideoShow: [],
					teacherVideoShow: [],
					caFilePathShow: [],
					reviewText: '',
					reviewTime: '',
				},
				// 校验规则
				rules: {
					nickname: {
						rules: [{
							required: true,
							errorMessage: '不能为空'
						}]
					},
					iSex: {
						rules: [{
							required: true,
							errorMessage: '不能为空'
						}]
					},
					phone: {
						rules: [{
							required: true,
							errorMessage: '不能为空',
						}, {
							pattern: "^1[3-9]\\d{9}$",
							errorMessage: '手机号格式不正确',
						}]
					},
					headPhotoShow: {
						rules: [{
							required: true,
							errorMessage: '不能为空'
						}]
					},
					introduce: {
						rules: [{
							required: true,
							errorMessage: '不能为空'
						}]
					},
					tags: {
						rules: [{
							required: true,
							errorMessage: '不能为空'
						}]
					},
					skiAge: {
						rules: [{
							required: true,
							errorMessage: '不能为空'
						}]
					},
					teachAge: {
						rules: [{
							required: true,
							errorMessage: '不能为空'
						}]
					},
					teachType: {
						rules: [{
							required: true,
							errorMessage: '不能为空'
						}]
					},
					skiResortName: {
						rules: [{
							required: true,
							errorMessage: '不能为空'
						}]
					},
					teacherSystem: {
						rules: [{
							required: true,
							errorMessage: '不能为空'
						}]
					},
					teacherLevel: {
						rules: [{
							required: true,
							errorMessage: '不能为空'
						}]
					},
					// skiVideoShow: {
					// 	rules: [{
					// 		required: true,
					// 		errorMessage: '不能为空'
					// 	}]
					// },
					// teacherVideoShow: {
					// 	rules: [{
					// 		required: true,
					// 		errorMessage: '不能为空'
					// 	}]
					// },
					caFilePathShow: {
						rules: [{
							required: true,
							errorMessage: '不能为空'
						}]
					}
				},
			}
		},
		async onLoad(option) {
			uni.showLoading({
				title: '加载中'
			});
			//加载页面所需初始化数据
			await this.getBaseData();
			await this.getSnowField();
			//加载自己的教练数据
			await this.getData();
			uni.hideLoading();
		},
		onReady() {
			// 需要在onReady中设置规则
			this.$refs.teacherInfoForm.setRules(this.rules)
		},
		methods: {
			submit(ref) {
				this.$refs[ref].validate().then(res => {
					//禁用按钮,使用 setTimeout 在2秒后重新启用按钮
					this.isDisabled = true;
					setTimeout(() => {
						this.isDisabled = false;
					}, 2000); // 2000毫秒后重新启用按钮  
					this.formData.skiResort = this.snowFieldArr.join(",");
					// 设置token
					this.formData.appToken = getToken();
					//新增
					if (this.editFlag == 'add') {
						this.request('/app_api/teacher/addTeacherInfo', this.formData, 'POST').then(res => {
							if (res) {
								if (res.code == 200) {
									uni.redirectTo({
										url: '/pages/teacher/teacherAddsuccess?flag=1'
									});
								}
								if (res.code == 500) {
									uni.showToast({
										title: res.msg,
										icon: 'none',
										duration: 2000
									});
								}
							}
						});
						// 审核通过后,可编辑
					} else if (this.editFlag == 'edit') {
						// console.log("updateTeacherInfo:")
						this.request('/app_api/teacher/updateTeacherInfo', this.formData, 'POST').then(res => {
							console.log("updateTeacherInfo:", this.formData)
							if (res) {
								if (res.code == 200) {
									uni.redirectTo({
										url: '/pages/teacher/teacherAddsuccess?flag=2'
									});
								}
							}
						});
					}
					//审核拒绝，重新提交
					else if (this.editFlag == 'revAdd') {
						// console.log("updateTeacherInfo:")
						//审核状态更改为 待审核
						this.formData.reviewStatus = '0';
						this.request('/app_api/teacher/updateTeacherInfo', this.formData, 'POST').then(res => {
							console.log("updateTeacherInfo:", this.formData)
							if (res) {
								if (res.code == 200) {
									uni.redirectTo({
										url: '/pages/teacher/teacherAddsuccess?flag=2'
									});
								}
							}
						});
					}
				}).catch(err => {
					console.log('err', err);
					uni.showToast({
						title: '存在未填项，请检查',
						icon: 'none',
						duration: 2000
					});
				})
			},
			async getData() {
				let query = {};
				query.createBy = getToken();
				await this.request('/app_api/teacher/getTeacherInfo_MyInfo', query, 'GET').then(res => {
					// console.log("getTeacherInfo_MyInfo:", res)
					if (res) {
						if (res.code == 200) {
							//没查到自己的教练数据,结束后续逻辑,用户曾经没注册过教练，这次是新增
							if (res.data.length == 0) {
								this.editFlag = 'add';
								this.subBtnTitle = '提交'
								//弹出隐私收集提示框
								// this.dialogToggle();
								return
							}
							//判断信息状态，审核中状态禁止修改（0-待审核、1-通过、2-拒绝）
							if (res.data[0].reviewStatus === '0') {
								this.editFlag = '';
								this.subBtnTitle = '审核中'
								//禁用按钮
								this.isDisabled = true;
							} else if (res.data[0].reviewStatus === '1') {
								this.editFlag = 'edit';
								this.subBtnTitle = '更新'
							} else if (res.data[0].reviewStatus === '2') {
								this.editFlag = 'revAdd';
								this.subBtnTitle = '重新提交'
							}
							//审核通过的显示接单控制按钮
							if (res.data[0].reviewStatus === '1') {
								this.statusShow = true
							}
							//接单状态
							if (res.data[0].status == '0') {
								//按钮设置为打开状态
								this.statusFlag = true;
							}
							if (res.data[0].status == '1') {
								//按钮设置为打开状态
								this.statusFlag = false;
							}
							// 头像
							res.data[0].headPhotoShow = {
								"name": "1.png",
								"extname": "png",
								"url": this.getBaseUrl() + res.data[0].headPhoto
							}
							//滑行视频
							res.data[0].skiVideoShow = {
								"name": "滑行视频",
								"extname": "mp4",
								"url": this.getBaseUrl() + res.data[0].skiVideo
							}
							this.skiVideoShowFlag = true
							// 教学视频
							res.data[0].teacherVideoShow = {
								"name": "教学视频",
								"extname": "mp4",
								"url": this.getBaseUrl() + res.data[0].teacherVideo
							}
							this.teacherVideoShowFlag = true
							// 证书
							res.data[0].caFilePathShow = {
								"name": "1.png",
								"extname": "png",
								"url": this.getBaseUrl() + res.data[0].caFilePath
							}
							this.formData = res.data[0];
							this.snowFieldArr = res.data[0].skiResort.split(",");
							this.snowFieldCodeToName();
							//回显常驻雪场选择(实测循环次数为 地区数量*常驻雪场数量)
							for (var c = 0; c < this.snowFieldArr.length; c++) {
								for (var j = 0; j < this.snowField.length; j++) {
									if (this.snowField[j].tid == this.snowFieldArr[c]) {
										// console.log(this.snowFieldArr[c], this.snowField[j].pid)
										for (var i = 0; i < this.snowField_tree.length; i++) {
											if (this.snowField_tree[i].id == this.snowField[j].pid) {
												// console.log(this.snowField_tree[i].id, this.snowField_tree[i].label)
												this.snowField_tree[i].checkbox.push(Number(this.snowFieldArr[c]))
											}
										}
									}
								}
							}
							// console.log(this.snowField_tree)
						}
					}
				});
			},
			async getBaseData() {
				await this.request('/app_api/teacher/loadTeacherSystemTag', 'GET').then(res => {
					if (res) {
						// console.log("loadTeacherSystemTag", res)
						// select组件需要使用value和text才能渲染显示,这里使用循环修改字段名称
						for (var j = 0; j < res.data.length; j++) {
							for (var i = 0; i < res.data[j].length; i++) {
								res.data[j][i].value = res.data[j][i].dictValue;
								res.data[j][i].text = res.data[j][i].dictLabel;
							}
						}
						//教练体系
						this.teacherSystem = res.data[0];
						// 教学类型
						this.teachType = res.data[1];
						// 教学模式
						this.teachMode = res.data[2];
						// 体系等级
						this.teacherLevel = res.data[3];
					}
				})
			},
			async getSnowField() {
				await this.request('/app_api/snowField/listFieldAll', 'GET').then(res => {
					if (res) {
						//数据存两份，一份是树结构，用于页面显示，和选择逻辑实现
						this.snowField_tree = this.handleTree(res.data, "id", "pid");
						//有的地区下面可能没雪场，需要将children节点赋值为空数组，否则后续流程会报null异常
						for (var j = 0; j < this.snowField_tree.length; j++) {
							if (this.snowField_tree[j].children == undefined) {
								this.snowField_tree[j].children = []
							}
							//每个里面都创建一个checkbox数组，用于存放多选的雪场，不创建的话微信小程序会报null错误
							this.snowField_tree[j].checkbox = []
						}
						// console.log("snowField_tree", this.snowField_tree)
						//另一份用于将值翻译为中文名显示
						this.snowField = res.data
					}
				})
			},
			//上传图片方法（头像、证书）
			imageUpload(file, flag) {
				console.log('开始上传', file)
				let size = file.tempFiles[0].size;
				let maxSize = 10 * 1024 * 1024; // 设置最大文件大小为 10MB  
				//判断文件大小
				if (size > maxSize) {
					console.log("fileSize", size)
					console.log("maxSize", maxSize)
					uni.showToast({
						title: '上传失败，文件大小不能超过10MB，请重新选择',
						icon: 'none'
					});
					return;
				}
				uni.uploadFile({
					url: getConfig().uploadUrl, //图片上传路径
					name: 'file', //对应接口的文件名称
					filePath: file.tempFiles[0].path,
					header: { //请求头
						"Content-Type": "multipart/form-data"
					},
					success: (res) => {
						uni.hideLoading()
						//一般用于重新获取数据渲染页面
						const r = JSON.parse(res.data);
						let savePath = this.getBaseUrl() + r.fileName;
						if (r.code == 200) {
							//头像
							if (flag == 1) {
								this.formData.headPhoto = r.fileName;
								let tmpImgInfo = {
									"name": "1.png",
									"extname": "png",
									"url": savePath
								}
								this.formData.headPhotoShow = tmpImgInfo;
							}
							// 证书
							if (flag == 2) {
								this.formData.caFilePath = r.fileName;;
								let tmpImgInfo = {
									"name": "1.png",
									"extname": "png",
									"url": savePath
								}
								this.formData.caFilePathShow = tmpImgInfo;
							}
							uni.showToast({
								title: '上传成功',
								icon: 'success',
								duration: 2000
							});
						}
					},
					fail: (err) => {
						//失败的回调
						console.log("err", err)
						uni.showToast({
							title: '上传失败，请重试',
							icon: 'success',
							duration: 2000
						});
					}
				})
			},
			//上传视频方法（滑行、教学视频）
			videoUpload(file, flag, refName) {
				console.log('开始上传', file)
				let size = file.tempFiles[0].size;
				let maxSize = 50 * 1024 * 1024; // 设置最大文件大小为 50MB  
				//判断文件大小
				if (size > maxSize) {
					console.log("fileSize", size)
					console.log("maxSize", maxSize)
					uni.showToast({
						title: '上传失败，文件大小不能超过50MB，请重新选择',
						icon: 'none'
					});
					return;
				}
				const uploadTask = uni.uploadFile({
					url: getConfig().uploadUrl, //图片上传路径
					name: 'file', //对应接口的文件名称
					filePath: file.tempFiles[0].path,
					header: { //请求头
						"Content-Type": "multipart/form-data"
					},
					success: (res) => {
						uni.hideLoading()
						//一般用于重新获取数据渲染页面
						const r = JSON.parse(res.data);
						let savePath = this.getBaseUrl() + r.fileName;
						if (r.code == 200) {
							// 滑行视频
							if (flag == 3) {
								this.formData.skiVideo = r.fileName;
								this.skiVideoShowFlag = true
								let tmpImgInfo = {
									"name": "滑行视频",
									"extname": "mp4",
									"url": savePath
								}
								this.formData.skiVideoShow = tmpImgInfo;
							}
							// 教学视频
							if (flag == 4) {
								this.formData.teacherVideo = r.fileName;
								this.teacherVideoShowFlag = true
								let tmpImgInfo = {
									"name": "教学视频",
									"extname": "mp4",
									"url": savePath
								}
								this.formData.teacherVideoShow = tmpImgInfo;
							}
							uni.showToast({
								title: '上传成功',
								icon: 'success',
								duration: 2000
							});
						}
					},
					fail: (err) => {
						//失败的回调
						console.log("err", err)
						uni.showToast({
							title: '上传失败，请重试',
							icon: 'success',
							duration: 2000
						});
					}
				})
				uploadTask.onProgressUpdate((res) => {
					this.$refs[refName].files[0].progress = res.progress //实时进度条更新
				})
			},
			// 视频被删除
			delVideo(file, flag) {
				// 滑行视频
				if (flag == 3) {
					this.formData.skiVideo = ''
					//隐藏视频播放组件
					this.skiVideoShowFlag = false
				}
				// 教学视频
				if (flag == 4) {
					this.formData.teacherVideo = ''
					//隐藏视频播放组件
					this.teacherVideoShowFlag = false
				}
			},
			openSkiResport() {
				this.$refs.popup.open()
			},
			//常驻雪场pop弹出层点击确定后，获取选择了那些雪场
			snowFieldClick() {
				//先清空，防止重复添加
				this.snowFieldArr = [];
				// console.log("snowFieldClick", this.snowField_tree);
				for (var j = 0; j < this.snowField_tree.length; j++) {
					if (this.snowField_tree[j].checkbox) {
						for (var i = 0; i < this.snowField_tree[j].checkbox.length; i++) {
							this.snowFieldArr.push(this.snowField_tree[j].checkbox[i])
						}
					}
				}
				this.$refs.popup.close()
				this.snowFieldCodeToName();
			},
			//将雪场tid翻译成中文名称
			snowFieldCodeToName() {
				let skiResortName = [];
				for (var j = 0; j < this.snowFieldArr.length; j++) {
					for (var i = 0; i < this.snowField.length; i++) {
						if (this.snowFieldArr[j] == this.snowField[i].tid) {
							skiResortName.push(this.snowField[i].label);
						}
					}
				}
				this.formData.skiResortName = skiResortName.join(",");
			},
			// 增加一行,增加到最后
			addRow() {
				this.formData.teacher_priceList.push({
					tcMode: '',
					tcTime: 1,
					price: '',
				});
			},
			//删除行，默认删除最后一行
			delRow() {
				// 只剩下一行的时候不允许删除
				if (this.formData.teacher_priceList.length > 1) {
					this.formData.teacher_priceList.splice(this.formData.teacher_priceList.length - 1, 1); // 移除指定索引的行  
				}
			},
			switchChange(e) {
				//0-正常接单、1-暂停接单
				console.log('switch1 发生 change 事件，携带值为', e.detail.value)
				let data = {};
				if (e.detail.value == true) {
					this.switchText = '他人可在教练列表看到你'
					data.status = '0'
					this.formData.status = '0'
				}
				if (e.detail.value == false) {
					this.switchText = '他人不可在教练列表看到你'
					data.status = '1'
					this.formData.status = '1'
				}
				data.createBy = getToken();
				this.request('/app_api/teacher/updateStatus', data, 'POST').then(res => {
					console.log(res)
					if (res) {
						if (res.code == 200) {
							uni.showToast({
								title: '操作成功，接单状态已变更',
								icon: 'none',
								duration: 3000
							});
						}
						if (res.code == 500) {
							uni.showToast({
								title: res.msg,
								icon: 'none',
								duration: 3000
							});
						}
					}
				});
			},
			handleTree(data, id, parentId, children) {
				let config = {
					id: id || 'id',
					parentId: parentId || 'parentId',
					childrenList: children || 'children'
				};

				var childrenListMap = {};
				var nodeIds = {};
				var tree = [];

				for (let d of data) {
					let parentId = d[config.parentId];
					if (childrenListMap[parentId] == null) {
						childrenListMap[parentId] = [];
					}
					nodeIds[d[config.id]] = d;
					childrenListMap[parentId].push(d);
				}

				for (let d of data) {
					let parentId = d[config.parentId];
					if (nodeIds[parentId] == null) {
						tree.push(d);
					}
				}

				for (let t of tree) {
					adaptToChildrenList(t);
				}

				function adaptToChildrenList(o) {
					if (childrenListMap[o[config.id]] !== null) {
						o[config.childrenList] = childrenListMap[o[config.id]];
					}
					if (o[config.childrenList]) {
						for (let c of o[config.childrenList]) {
							adaptToChildrenList(c);
						}
					}
				}
				return tree;
			},
			dialogToggle() {
				this.msgType = 'info'
				this.$refs.alertDialog.open()
			},
			dialogConfirm() {
				console.log('点击确认')
			},
			dialogClose() {
				console.log('点击拒绝，返回上一页')
				uni.navigateBack({
					delta: 1
				});
			},
		}
	}
</script>

<style lang="scss">
	.container {
		overflow: hidden;
	}

	.button {
		margin: 15px;
	}

	// 强行覆盖掉overflow属性,当uni-data-select放入uni-card中时，如果uni-card的高度不够高，就会出现选项展示不全的问题,覆盖就能解决，哈哈哈
	.uni-card {
		overflow: visible !important;
	}

	.textarea-container {
		position: relative;
	}

	.textarea {
		border: solid 1px #e1e1e1;
		width: 100%;
		height: 70px;
		box-sizing: border-box;
		font-size: 12px;
	}

	.click-mask {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		opacity: 0;
	}

	.grid-container {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		/* 创建三个等宽的列 */
		gap: 10px;
		/* 列之间的间距，可以根据需要调整 */
	}

	.grid-row {
		display: contents;
		/* 使.grid-row本身不占据任何空间，只作为其子元素的容器 */
		/* 注意：display: contents是一个实验性特性，可能不是所有浏览器都支持 */
		/* 如果不支持，可以考虑使用其他方法，比如不给.grid-row添加任何特定的样式 */
	}

	.grid-cell {
		/* 这里可以添加针对每个网格单元格的样式 */
		/* 例如，您可以设置背景色、内边距、边框等 */
	}

	.title {
		/* 标题样式，这里仅用于示例 */
		text-align: center;
		/* 水平居中 */
		margin-bottom: 10px;
		/* 与网格布局内容之间的间距 */
		/* 如果需要，还可以添加其他样式，如字体大小、颜色等 */
		/* 注意：实际项目中，标题可能是由<uni-card>组件控制的，因此这里的样式可能不起作用 */
	}

	.popup-content {
		align-items: center;
		justify-content: center;
		background-color: #fff;
		width: 100%;
		height: 90%;
	}

	.flex-container {
		display: flex;
	}

	.flex-item {
		// flex: 1;
		/* 两个子容器平分空间 */
		padding: 10px;
		/* 添加一些内边距以避免内容紧贴边缘 */
		// border: 1px solid #cc0003;
		/* 添加边框，颜色为浅灰色，宽度为1px，实线 */
		box-sizing: border-box;
		/* 确保内边距和边框不会增加容器的总宽度（虽然这在flex容器上通常不是必需的，但为了一致性可以加上） */
	}

	.left {
		width: 250upx;
	}

	.right {
		width: 400upx;
	}

	.divider {
		width: 2px;
		height: 100%;
		background-color: #ccc;
	}


	.uni-list {
		margin-bottom: 20rpx;
	}

	/* 假设这是你的全局或组件样式表 */
	.uni-list-cell {
		display: flex;
		/* 使其成为flex容器 */
		align-items: center;
		/* 垂直居中子元素 */
		/* 其他样式，如padding、margin等 */
	}

	.uni-list-cell-db {
		/* 这个类可能用于显示文本，如“开启中” */
		/* 你可以根据需要设置它的样式 */
		flex: 1;
		/* 让这个元素占据剩余的空间 */
		margin-right: 10px;
		/* 可选：给开关留出一些空间 */
		/* 其他样式 */
	}

	.uni-list-cell switch {
		/* 注意：这里可能需要使用/deep/或::v-deep伪元素来穿透组件样式，  
	     但这取决于你的框架和组件库。如果switch是一个自定义组件，  
	     你可能需要直接在它的样式中设置margin-left: auto;  
	     或者在其父容器上设置。如果它是一个原生HTML元素，  
	     下面的选择器应该工作。 */
		margin-left: auto;
		/* 将switch推到右边 */
	}
</style>