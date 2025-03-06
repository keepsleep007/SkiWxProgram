<template>
	<view class="container">
		<!-- 自定义表单校验 -->
		<uni-forms ref="carInfoForm" :rules="rules" :model="formData">
			<uni-card title="拼车信息" extra=" ">
				<uni-forms-item label="拼车类型" required name="type_goType" label-width="auto">
					<uni-data-select :localdata="range" v-model="formData.type_goType"></uni-data-select>
				</uni-forms-item>
				<uni-forms-item label="拼车价格" required name="price" label-width="auto">
					<uni-easyinput type="digit" format="[0-9]+(.[0-9]{1,2})?$" placeholder="请输入价格" v-model="formData.price" />
				</uni-forms-item>
				<uni-forms-item label="可拼人数" required name="personNum" label-width="auto">
					<uni-number-box v-model="formData.personNum" />
				</uni-forms-item>
				<uni-forms-item label="雪板数量" required name="boardNum" label-width="auto">
					<uni-number-box v-model="formData.boardNum" />
				</uni-forms-item>
				<uni-forms-item label="板包数量" required name="packageNum" label-width="auto">
					<uni-number-box v-model="formData.packageNum" />
				</uni-forms-item>
				<uni-forms-item label="出发时间" required name="goTime" label-width="auto">
					<uni-datetime-picker type="datetime" v-model="formData.goTime" />
				</uni-forms-item>
				<uni-forms-item label="出发地区" required name="goArea" label-width="auto">
					<uni-data-select v-model="formData.goArea" :localdata="snowField" placeholder="请选择从哪个地区出发"></uni-data-select>
				</uni-forms-item>
				<uni-forms-item label="出发地点" required name="goPlace" label-width="auto">
					<uni-easyinput placeholder="请输入详细地点" v-model="formData.goPlace" />
				</uni-forms-item>
				<uni-forms-item label="到达地点" required name="endPlace" label-width="auto">
					<uni-easyinput placeholder="请输入详细地点" v-model="formData.endPlace" />
				</uni-forms-item>
				<uni-forms-item label="详细信息" name="remark" label-width="auto">
					<uni-easyinput type="textarea" placeholder="请输入详细描述" v-model="formData.remark" />
				</uni-forms-item>
			</uni-card>
			<uni-card title="联系方式" extra=" ">
				<view>
					<uni-forms-item label="电话" name="phone">
						<uni-easyinput placeholder="请输入电话" v-model="formData.phone" />
					</uni-forms-item>
					<uni-forms-item label="微信" name="wechat">
						<uni-easyinput placeholder="请输入微信" v-model="formData.wechat" />
					</uni-forms-item>
				</view>
			</uni-card>
		</uni-forms>
		<button class="button" type="primary" @click="submit('carInfoForm')">提交</button>
		<!-- 提示需要预留手机或微信弹窗 -->
		<view>
			<uni-popup ref="alertDialog" type="dialog">
				<uni-popup-dialog style="text-align: center;" :type="msgType" cancelText="拒绝" confirmText="同意" title="提示" content="为方便他人联系到你\n发布信息时需填写手机或微信" @confirm="dialogConfirm" @close="dialogClose"></uni-popup-dialog>
			</uni-popup>
		</view>
	</view>
</template>

<script>
	import {
		getToken
	} from '@/utils/auth';
	export default {
		data() {
			return {
				id: null,
				formData: {
					type_goType: '',
					type: '',
					goType: '',
					price: '',
					personNum: 0,
					boardNum: 0,
					packageNum: 0,
					goTime: '',
					goPlace: '',
					endPlace: '',
					remark: '',
					phone: '',
					wechat: '',
					goArea: ''
				},
				snowField: [],
				locationData: [],
				range: [{
						value: 0,
						text: "车找人-去雪场"
					},
					{
						value: 1,
						text: "车找人-雪场返回"
					},
					{
						value: 2,
						text: "人找车-去雪场"
					},
					{
						value: 3,
						text: "人找车-雪场返回"
					},
				],
				// 校验规则
				rules: {
					type_goType: {
						rules: [{
							required: true,
							errorMessage: '类型不能为空'
						}]
					},
					price: {
						rules: [{
							required: true,
							errorMessage: '价格不能为空'
						}]
					},
					personNum: {
						rules: [{
							required: true,
							errorMessage: '数量不能为空'
						}]
					},
					boardNum: {
						rules: [{
							required: true,
							errorMessage: '数量不能为空'
						}]
					},
					packageNum: {
						rules: [{
							required: true,
							errorMessage: '数量不能为空'
						}]
					},
					goTime: {
						rules: [{
							required: true,
							errorMessage: '时间不能为空'
						}]
					},
					goArea: {
						rules: [{
							required: true,
							errorMessage: '出发地区不能为空'
						}]
					},
					goPlace: {
						rules: [{
							required: true,
							errorMessage: '出发地点不能为空'
						}]
					},
					endPlace: {
						rules: [{
							required: true,
							errorMessage: '到达地点不能为空'
						}]
					},
				},
			}
		},
		computed: {},
		onLoad(option) {
			//弹窗提示需要收集信息
			// this.dialogToggle();
			// console.log(option); //打印出上个页面传递的参数。
			if (option.id != null) {
				this.id = option.id;
				this.getData();
			}
			this.getAreaData();
		},
		onReady() {},
		methods: {
			submit(ref) {
				this.$refs[ref].validate().then(res => {
					//验证手机号和微信号，二选一必填
					if (!this.validatePhoneWeChat()) {
						return;
					}
					console.log('success', res);
					// 设置token
					this.formData.appToken = getToken();
					//设置拼车类型和往返类型
					if (this.formData.type_goType == 0) {
						this.formData.type = '1';
						this.formData.goType = '1'
					}
					if (this.formData.type_goType == 1) {
						this.formData.type = '1';
						this.formData.goType = '2'
					}
					if (this.formData.type_goType == 2) {
						this.formData.type = '2';
						this.formData.goType = '1'
					}
					if (this.formData.type_goType == 3) {
						this.formData.type = '2';
						this.formData.goType = '2'
					}
					//id==null页面是从新增进来的，没有id
					console.log(this.formData)
					if (this.id == null) {
						this.request('/app_api/carPool/addCarPoolInfo', this.formData, 'POST').then(res => {
							console.log("addCarPoolInfo:", this.formData)
							if (res) {
								if (res.code == 200) {
									//关闭当前页面，跳转到拼车列表页面，加载最新数据，这个页面在tabBar 中配置了，所以这里使用reLaunch进行跳转
									uni.reLaunch({
										url: '/pages/me/myRelease/r-submitSuccess?tabIndex=0'
									})
								}
							}
						});
					} else {
						//id!=null页面是从编辑进来的，带有id走update方法，更新数据
						this.request('/app_api/carPool/updateCarPoolInfo', this.formData, 'POST').then(res => {
							console.log("updateCarPoolInfo:", this.formData)
							if (res) {
								if (res.code == 200) {
									uni.navigateTo({
										url: '/pages/me/myRelease/r-submitSuccess?tabIndex=0'
									})
								}
							}
						});
					}
				}).catch(err => {
					console.log('err', err);
				})
			},
			validatePhoneWeChat() {
				let isValid = true;
				let errorMessage = '';
				// 检查 phone 和 wechat 是否二选一必填  
				if (!this.formData.phone && !this.formData.wechat) {
					isValid = false;
					errorMessage = '电话或微信必须填写一个';
				} else if (this.formData.phone && !/^1[3-9]\d{9}$/.test(this.formData.phone)) {
					// 可选的：增加对电话格式的基本校验  
					isValid = false;
					errorMessage = '电话格式不正确';
				} else if (this.formData.wechat && !/^[\w\-_]{3,20}$/.test(this.formData.wechat)) {
					// 可选的：增加对微信格式的基本校验（例如，3-20个字符，包括字母、数字、下划线、减号）  
					isValid = false;
					errorMessage = '微信格式不正确';
				}
				if (!isValid) {
					uni.showToast({
						title: errorMessage,
						icon: 'none'
					});
					return false;
				}
				// 如果校验通过，继续处理表单提交  
				console.log('表单校验通过，可以提交');
				return true;
			},
			getData() {
				console.log("请求后台，获取数据")
				this.formData.id = this.id;
				this.request('/app_api/carPool/getCarPoolInfo', this.formData, 'GET').then(res => {
					if (res) {
						if (res.code == 200) {
							// console.log("getCarPoolInfo:", res.data)
							if (res.data.type == 1) {
								if (res.data.goType == 1) {
									this.formData.type_goType = 0
								}
								if (res.data.goType == 2) {
									this.formData.type_goType = 1
								}
							}
							if (res.data.type == 2) {
								if (res.data.goType == 1) {
									this.formData.type_goType = 2
								}
								if (res.data.goType == 2) {
									this.formData.type_goType = 3
								}
							}
							this.formData.price = res.data.price;
							this.formData.personNum = res.data.personNum;
							this.formData.boardNum = res.data.boardNum;
							this.formData.packageNum = res.data.packageNum;
							this.formData.goTime = res.data.goTime;
							this.formData.goPlace = res.data.goPlace;
							this.formData.endPlace = res.data.endPlace;
							this.formData.remark = res.data.remark;
							this.formData.phone = res.data.phone;
							this.formData.wechat = res.data.wechat;
							this.formData.goArea = res.data.goArea;
						}
					}
				});
			},
			getAreaData() {
				this.request('/app_api/carPool/loadAreaData').then(res => {
					// console.log("loadAreaData:", res)
					if (res) {
						let tmp = []
						for (var i = 0; i < res.data.length; i++) {
							tmp[i] = {};
							tmp[i]['text'] = res.data[i].name;
							tmp[i]['value'] = res.data[i].id;
						}
						this.snowField = tmp;
					}
				});
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
</style>