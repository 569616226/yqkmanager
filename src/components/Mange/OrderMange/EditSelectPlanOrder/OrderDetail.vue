<template>
	<div>
		<div class="know-container" v-loading="loading">
			<div class="auditDaka">
				<el-form @submit.native.prevent class="margin-top-lg" :label-position="labelPosition" label-width="130px" :model="ruleForm" ref="ruleForm" :rules="rules">

					<div class="AddSelectPlan-form">
						<p class="AddSelectPlan-form-p">方案信息</p>
						<el-form-item prop="plan_name" class="margin-left-lg margin-top must" label="方案名称">
							<el-input class="form-input-h" v-model="ruleForm.plan_name" placeholder="请输入"></el-input>
							<p class="form_p_g">给方案起个名字吧，字数不限</p>
						</el-form-item>
					</div>

					<div class="AddSelectPlan-form">
						<p class="AddSelectPlan-form-p">选择客户</p>
						<el-form-item prop="company_id" class="margin-left-lg margin-top must" label="选择客户">
							<el-select v-model="ruleForm.company_id" placeholder="请选择" class="form-input-h">
								<el-option :label="ruleForm.company_name" :value="ruleForm.company_id"></el-option>
							</el-select>
							<p class="form_p_g">请选择一名客户作为订单的服务对象</p>
						</el-form-item>
					</div>

					<div class="AddSelectPlan-form">
						<p class="AddSelectPlan-form-p">完善订单信息</p>
						<el-form-item prop="name" class="margin-left-lg margin-top must" label="订单名称">
							<el-input class="form-input-h" v-model="ruleForm.name" placeholder="请输入"></el-input>
							<p class="form_p_g">订单名称为默认生成，若对名称不满意，可进行修改！</p>
						</el-form-item>
					</div>

					<el-form-item class="text-center margin-top-lg">
						<el-button :disabled="loading" type="primary" @click="submitForm('ruleForm')">提交</el-button>
						<el-button @click="resetForm('ruleForm')">返回</el-button>
					</el-form-item>
				</el-form>
			</div>
		</div>
	</div>
</template>

<script>
	import { mapState, mapActions } from 'vuex'
	import api from '@/utils/api'
	import { getCookie } from '@/utils'
	export default {
		data() {
			return {
				labelPosition: 'right',
				//新建订单
				ruleForm: {
					plan_id: '',
					company_id: '',
					company_name: '',
					name: '',
					plan_name: '',
					id: this.$route.params.id
				},
				rules: {
					plan_name: [{
						required: true,
						message: '请输入方案名称',
						trigger: 'blur'
					}],
					plan_id: [{
						required: true,
						message: '请选择方案',
						trigger: 'change'
					}],
					company_id: [{
						required: true,
						message: '请选择客户',
						trigger: 'change'
					}],
					name: [{
						required: true,
						message: '请输入订单名称',
						trigger: 'blur'
					}]
				},
				loading: false,
				resetdata: false
			}
		},
		computed: {
			...mapState([

			])
		},
		methods: {
			...mapActions([

			]),
			async getData() {
				this.loading = true
				const data = await api.getOrdersDetail(this.$route.params.id)
				this.ruleForm.plan_name = data.data.plan.data.name
				this.ruleForm.plan_id = data.data.plan.data.id
				this.ruleForm.company_id = data.data.company.data.id
				this.ruleForm.company_name = data.data.company.data.name
				this.ruleForm.name = data.data.name
				this.loading = false
			},
			//提交表单
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if(valid) {
						this.patchOrders()
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			async patchOrders() {
				this.loading = true
				const PatchData = {
					plan_data: {
						name: this.ruleForm.plan_name
					},
					id: this.ruleForm.plan_id
				}
				const PlansData = await api.patchPlans(PatchData)
				const data = await api.patchOrders(this.ruleForm)
				if(data.status) {
					this.$message({
						type: 'success',
						message: data.msg
					})
					this.$router.push({
						name: 'OrderMange'
					})
				} else {
					this.$message({
						type: 'info',
						message: data.msg
					})
				}
				this.loading = false
			},
			resetForm(formName) {
				//this.$refs[formName].resetFields();
				if(this.resetdata) {
					this.$confirm('真的要退出此次编辑？', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消'
					}).then(() => {
						this.$router.go(-1)
					}).catch(() => {
						this.$message({
							type: 'info',
							message: '已取消'
						})
					})
				} else {
					this.$router.go(-1)
				}
			}
		},
		mounted: function() {
			this.getData()
		},
		watch: {
			ruleForm: {
				handler(curVal, oldVal) {
					this.resetdata = true
				},
				deep: true
			}
		}
	}
</script>
<style lang="less" scoped>
	.custom-tree-node {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 14px;
		padding-right: 8px;
	}
	
	.auditDaka {
		&-arrow {
			& .icon-07jiantouxiangzuo {
				vertical-align: middle;
				font-size: 24px;
				color: #444444;
			}
		}
	}
	
	.form_block {
		display: block;
	}
	
	.AddSelectPlan {
		background-color: rgb(245, 247, 250);
		font-size: 14px;
		border-width: 1px;
		color: rgb(152, 160, 176);
		padding: 20px 0;
		text-align: center;
		&-row {
			&-col {
				position: relative;
				&-p {
					& i {
						vertical-align: middle;
					}
					& span {
						vertical-align: middle;
						margin-left: 4px;
					}
				}
				&-icon {
					position: absolute;
					right: 0;
					top: 0;
				}
			}
		}
		&-form {
			&-p {
				margin: 0 3.4rem;
				padding: 15px 0;
				border-bottom: 1px solid rgb(223, 223, 223);
				color: rgb(85, 85, 85);
				font-size: 16px;
				font-weight: bold;
			}
		}
		&-show {
			color: rgb(60, 152, 255);
			background-color: transparent;
			border: 1px solid rgb(60, 152, 255);
			border-radius: 4px;
			font-size: 14px;
			padding: 0 20px;
			margin-top: 15px;
			display: inline-block;
			cursor: pointer;
			& i {
				vertical-align: middle;
				margin-right: 5px;
			}
			& span {
				vertical-align: middle;
			}
		}
	}
</style>
<style scoped>
	.form-input-h {
		width: 400px
	}
	
	.form_p_g {
		font-size: 14px;
		color: #888;
		clear: both
	}
	
	.tree-box {
		margin-top: 10px;
		border: 1px solid #E3E3E3;
		border-radius: 4px;
		max-width: 800px;
		padding: 10px;
		min-height: 220px;
		max-height: 500px;
		overflow-y: scroll;
	}
	/*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
	
	::-webkit-scrollbar {
		width: 8px;
		height: 8px;
		background-color: #FFFFFF;
	}
	/*定义滚动条轨道 内阴影+圆角*/
	
	::-webkit-scrollbar-track {
		border-radius: 10px;
		background-color: #FFFFFF;
	}
	/*定义滑块 内阴影+圆角*/
	
	::-webkit-scrollbar-thumb {
		border-radius: 10px;
		background-color: rgb(216, 217, 224);
	}
	
	.avatar-uploader {
		border: 1px dashed #d9d9d9;
		border-radius: 6px;
		cursor: pointer;
		position: relative;
		overflow: hidden;
		display: inline-block;
		line-height: 1
	}
	
	.avatar-uploader:hover {
		border-color: #409EFF
	}
	
	.avatar-uploader-icon {
		font-size: 28px;
		color: #8c939d;
		width: 100px;
		height: 100px;
		line-height: 100px;
		text-align: center
	}
	
	.avatar {
		width: 100px;
		height: 100px;
		display: block
	}
	
	.colrecom_form {
		width: 200px;
		border: 1px solid #ccc;
		line-height: initial;
		display: inline-block;
		position: relative;
		margin: 0 15px 1rem 0;
		float: left;
		height: 141px;
		border-radius: 4px
	}
	
	.colrecom_form_add {
		width: 200px;
		border: 1px dotted #ccc;
		line-height: initial;
		display: inline-block;
		position: relative;
		margin: 0 15px 1rem 0;
		float: left;
		height: 141px;
		text-align: center;
		border-radius: 4px
	}
	
	.colrecom_form_add>.el-icon-plus {
		height: 80px
	}
	
	.colrecom_form>img {
		width: 100%
	}
	
	.colrecom_form>p {
		line-height: normal;
		text-align: center;
		padding: 0 3px;
		word-wrap: normal;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
		text-align: justify
	}
	
	.colrecom_form>.el-icon-error {
		color: #ff7043;
		position: absolute;
		top: -7px;
		right: -7px;
		font-size: 18px
	}
	
	.input_search_video {
		width: 50%
	}
	
	.span_search_video {
		color: #888;
		margin-left: 5%
	}
	
	.select_show_video {
		width: 685px;
		margin: 0 auto
	}
	
	.show_page {
		margin-top: 2rem;
		text-align: center
	}
</style>