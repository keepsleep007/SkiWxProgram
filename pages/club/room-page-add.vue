<template>
	<view class="container">
		<!-- 自定义表单校验 -->
		<uni-forms ref="roomInfoForm" :rules="rules" :model="formData">
			<uni-card title="拼房信息" extra=" ">
				<uni-forms-item label="拼房类型" required name="type" label-width="auto">
					<uni-data-select :localdata="select_data_type" v-model="formData.type"></uni-data-select>
				</uni-forms-item>
				<uni-forms-item label="拼房价格" required name="price" label-width="auto">
					<uni-easyinput type="digit" format="[0-9]+(.[0-9]{1,2})?$" placeholder="请输入价格" v-model="formData.price" />
				</uni-forms-item>
				<uni-forms-item label="入住时间" required name="inTime" label-width="auto">
					<uni-datetime-picker type="datetime" v-model="formData.inTime" />
				</uni-forms-item>
				<uni-forms-item label="退房时间" required name="outTime" label-width="auto">
					<uni-datetime-picker type="datetime" v-model="formData.outTime" />
				</uni-forms-item>
				<uni-forms-item label="本人性别" required name="iSex" label-width="auto">
					<uni-data-select :localdata="select_data_iSex" v-model="formData.iSex" />
				</uni-forms-item>
				<uni-forms-item label="要求性别" required name="ySex" label-width="auto">
					<uni-data-select :localdata="select_data_ySex" v-model="formData.ySex" />
				</uni-forms-item>
				<uni-forms-item label="拼房地区" required name="region" label-width="auto">
					<uni-data-select :localdata="select_data_region" v-model="formData.region" />
				</uni-forms-item>
				<uni-forms-item label="房间类型" required name="roomType" label-width="auto">
					<uni-data-select v-model="formData.roomType" :localdata="select_data_roomType" placeholder="请选择类型"></uni-data-select>
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
		<button class="button" type="primary" @click="submit('roomInfoForm')">提交</button>
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
					type: '',
					price: '',
					inTime: '',
					outTime: '',
					iSex: '',
					ySex: '',
					region: '',
					roomType: '',
					remark: '',
					createTime: '',
					phone: '',
					wechat: '',
					uid: ''
				},
				snowField: [],
				select_data_type: [{
						value: "1",
						text: "房找人"
					},
					{
						value: "2",
						text: "人找房"
					},
				],
				select_data_iSex: [{
						value: "0",
						text: "男"
					},
					{
						value: "1",
						text: "女"
					},
				],
				select_data_ySex: [{
						value: "0",
						text: "男"
					},
					{
						value: "1",
						text: "女"
					}, {
						value: "2",
						text: "不限"
					}
				],
				select_data_region: [],
				select_data_roomType: [],
				// 校验规则
				rules: {
					type: {
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
					inTime: {
						rules: [{
							required: true,
							errorMessage: '入住时间不能为空'
						}]
					},
					outTime: {
						rules: [{
							required: true,
							errorMessage: '离店时间不能为空'
						}]
					},
					iSex: {
						rules: [{
							required: true,
							errorMessage: '性别不能为空'
						}]
					},
					ySex: {
						rules: [{
							required: true,
							errorMessage: '性别不能为空'
						}]
					},
					region: {
						rules: [{
							required: true,
							errorMessage: '地区不能为空'
						}]
					},
					roomType: {
						rules: [{
							required: true,
							errorMessage: '房型不能为空'
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
			this.getRoomTypeData();
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
					//id==null页面是从新增进来的，没有id
					if (this.id == null) {
						this.request('/app_api/roomPool/addRoomPoolInfo', this.formData, 'POST').then(res => {
							console.log("addRoomPoolInfo:", this.formData)
							if (res) {
								if (res.code == 200) {
									//关闭当前页面，跳转到拼车列表页面，加载最新数据，这个页面在tabBar 中配置了，所以这里使用reLaunch进行跳转
									uni.reLaunch({
										url: '/pages/club/submitSuccess?tabIndex=1'
									})
								}
							}
						});
					} else {
						//id!=null页面是从编辑进来的，带有id走update方法，更新数据
						this.request('/app_api/roomPool/updateRoomPoolInfo', this.formData, 'POST').then(res => {
							console.log("updateRoomPoolInfo:", this.formData)
							if (res) {
								if (res.code == 200) {
									uni.reLaunch({
										url: '/pages/club/submitSuccess?tabIndex=1'
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
				this.request('/app_api/roomPool/getRoomPoolInfo', this.formData, 'GET').then(res => {
					if (res) {
						if (res.code == 200) {
							console.log("getRoomPoolInfo:", res.data)
							this.formData.type = res.data.type;
							this.formData.price = res.data.price;
							this.formData.inTime = res.data.inTime;
							this.formData.outTime = res.data.outTime;
							this.formData.iSex = res.data.iSex;
							this.formData.ySex = res.data.ySex;
							this.formData.region = res.data.region;
							this.formData.roomType = res.data.roomType;
							this.formData.remark = res.data.remark;
							this.formData.phone = res.data.phone;
							this.formData.wechat = res.data.wechat;
							this.formData.uid = res.data.uid;
						}
					}
				});
			},
			getAreaData() {
				this.request('/app_api/roomPool/loadRoomAreaData').then(res => {
					// console.log("loadAreaData:", res)
					if (res) {
						let tmp = []
						for (var i = 0; i < res.data.length; i++) {
							tmp[i] = {};
							tmp[i]['text'] = res.data[i].name;
							tmp[i]['value'] = res.data[i].id;
						}
						this.select_data_region = tmp;
					}
				});
			},
			getRoomTypeData() {
				this.request('/app_api/roomPool/load_roomType', '', 'GET').then(res => {
					if (res) {
						let tmp = []
						for (var i = 0; i < res.data.length; i++) {
							tmp[i] = {};
							tmp[i]['text'] = res.data[i].dictLabel;
							tmp[i]['value'] = res.data[i].dictValue;
						}
						this.select_data_roomType = tmp;
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