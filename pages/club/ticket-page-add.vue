<template>
	<view class="container">
		<!-- 自定义表单校验 -->
		<uni-forms ref="ticketInfoForm" :rules="rules" :model="formData">
			<uni-card title="雪票信息" extra=" ">
				<uni-forms-item label="交易类型" required name="type" label-width="auto">
					<uni-data-select :clear="false" :localdata="select_data_type" v-model="formData.type"></uni-data-select>
				</uni-forms-item>
				<uni-forms-item label="雪票价格" required name="price" label-width="auto">
					<uni-easyinput :clearable="false" type="digit" format="[0-9]+(.[0-9]{1,2})?$" placeholder="请输入价格" v-model="formData.price" />
				</uni-forms-item>
				<uni-forms-item label="雪票数量" required name="ticketNum" label-width="auto">
					<uni-number-box v-model="formData.ticketNum" />
				</uni-forms-item>
				<uni-forms-item label="使用雪场" required name="snowFieldId" label-width="auto">
					<uni-data-picker :clear-icon="false" popup-title="请选择雪场" :localdata="snowField" v-model="formData.snowFieldId" @change="onchange" />
				</uni-forms-item>
				<uni-forms-item label="使用时间" required name="applyTime" label-width="auto">
					<uni-datetime-picker :clear-icon="false" type="datetime" v-model="formData.applyTime" />
				</uni-forms-item>
				<uni-forms-item label="雪票时段" required name="snowType" label-width="auto">
					<uni-data-select :clear="false" :localdata="select_data_snowType" v-model="formData.snowType" />
				</uni-forms-item>
				<uni-forms-item label="交易地点" required name="location" label-width="auto">
					<uni-easyinput :clearable="false" v-model="formData.location" />
				</uni-forms-item>
				<uni-forms-item label="详细信息" name="remark" label-width="auto">
					<uni-easyinput type="textarea" placeholder="请输入详细描述" v-model="formData.remark" />
				</uni-forms-item>
			</uni-card>
			<uni-card title="联系方式" extra=" ">
				<view>
					<uni-forms-item label="电话" name="phone">
						<uni-easyinput :clearable="false" placeholder="请输入电话" v-model="formData.phone" />
					</uni-forms-item>
					<uni-forms-item label="微信" name="wechat">
						<uni-easyinput :clearable="false" placeholder="请输入微信" v-model="formData.wechat" />
					</uni-forms-item>
				</view>
			</uni-card>
		</uni-forms>
		<button class="button" type="primary" @click="submit('ticketInfoForm')">提交</button>
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
					ticketNum: '',
					snowFieldArea: '',
					snowFieldId: '',
					applyTime: '',
					snowType: '',
					location: '',
					remark: '',
					phone: '',
					wechat: '',
					uid: ''
				},
				select_data_type: [{
						value: "1",
						text: "转卖"
					},
					{
						value: "2",
						text: "求购"
					},
				],
				select_data_snowType: [],
				snowField: [],
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
					ticketNum: {
						rules: [{
							required: true,
							errorMessage: '数量不能为空'
						}]
					},
					snowFieldId: {
						rules: [{
							required: true,
							errorMessage: '雪场不能为空'
						}]
					},
					applyTime: {
						rules: [{
							required: true,
							errorMessage: '时间不能为空'
						}]
					},
					snowType: {
						rules: [{
							required: true,
							errorMessage: '时段不能为空'
						}]
					},
					location: {
						rules: [{
							required: true,
							errorMessage: '地点不能为空'
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
			this.getTicketTypeData();
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
						this.request('/app_api/ticketMarket/addTicketInfo', this.formData, 'POST').then(res => {
							// console.log("addTicketInfo:", this.formData)
							if (res) {
								if (res.code == 200) {
									//关闭当前页面，跳转到拼车列表页面，加载最新数据，这个页面在tabBar 中配置了，所以这里使用reLaunch进行跳转
									uni.reLaunch({
										url: '/pages/club/submitSuccess?tabIndex=2'
									})
								}
							}
						});
					} else {
						//id!=null页面是从编辑进来的，带有id走update方法，更新数据
						this.request('/app_api/ticketMarket/updateTicketInfo', this.formData, 'POST').then(res => {
							// console.log("updateTicketInfo:", this.formData)
							if (res) {
								if (res.code == 200) {
									uni.reLaunch({
										url: '/pages/club/submitSuccess?tabIndex=2'
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
				this.request('/app_api/ticketMarket/getTicketInfo', this.formData, 'GET').then(res => {
					if (res) {
						if (res.code == 200) {
							// console.log("getTicketInfo:", res.data)
							this.formData.avatar = res.data.avatar;
							this.formData.type = res.data.type;
							this.formData.price = res.data.price;
							this.formData.ticketNum = res.data.ticketNum;
							this.formData.snowFieldArea = res.data.snowFieldArea;
							this.formData.snowFieldId = res.data.snowFieldId;
							this.formData.applyTime = res.data.applyTime;
							this.formData.snowType = res.data.snowType;
							this.formData.location = res.data.location;
							this.formData.remark = res.data.remark;
							this.formData.phone = res.data.phone;
							this.formData.wechat = res.data.wechat;
							this.formData.uid = res.data.uid;
						}
					}
				});
			},
			getAreaData() {
				// 加载雪场数据
				this.request('/app_api/ticketMarket/loadAreaData', '', 'GET').then(res => {
					if (res) {
						let tmp = []
						for (var i = 0; i < res.data.length; i++) {
							tmp[i] = {};
							tmp[i]['text'] = res.data[i].label;
							tmp[i]['value'] = res.data[i].id;
							tmp[i]['id'] = res.data[i].id;
							tmp[i]['pid'] = res.data[i].pid;
						}
						this.snowField = this.handleTree(tmp, "id", "pid");
						// console.log("loadAreaData:", this.snowField)
					}
				});
			},
			getTicketTypeData() {
				//加载雪票类型数据
				this.request('/app_api/ticketMarket/loadTicketType', '', 'GET').then(res => {
					if (res) {
						let tmp = []
						for (var i = 0; i < res.data.length; i++) {
							tmp[i] = {};
							tmp[i]['text'] = res.data[i].dictLabel;
							tmp[i]['value'] = res.data[i].dictValue;
						}
						this.select_data_snowType = tmp;
						// console.log("loadTicketType:", this.select_data_snowType)
					}
				});
			},
			onchange(e) {
				console.log('onchange:', e);
				this.formData.snowFieldArea = e.detail.value[0].value;
				this.formData.snowFieldId = e.detail.value[1].value;
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
</style>