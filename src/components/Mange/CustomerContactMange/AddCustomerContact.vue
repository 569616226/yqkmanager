<template>
	<div>
		<div class="page-title">
			<i class="iconfont icon-arrow-left cursor" @click="$router.go(-1)"></i> {{ $route.meta.title }}
		</div>
		<div class="know-container" v-loading="loading">
			<div class="auditDaka">
				<el-form @submit.native.prevent class="margin-top-lg" :label-position="labelPosition" label-width="130px" :model="ruleForm" ref="ruleForm" :rules="rules">

					<el-form-item prop="username" class="margin-left-lg margin-top must" label="联系人姓名">
						<el-input class="form-input-h" v-model="ruleForm.username" placeholder="请输入" maxlength="20"></el-input>
						<p class="form_p_g">填写客户联系人的姓名，1-20字</p>
					</el-form-item>

					<el-form-item prop="phone" class="margin-left-lg margin-top must" label="联系人手机号">
						<el-input class="form-input-h" v-model="ruleForm.phone" placeholder="请输入" @input="checkNo" maxlength="11"></el-input>
						<p class="form_p_g">填写11位手机号，顾问认证时，会作为认证匹配的条件</p>
					</el-form-item>

					<el-form-item label="所属企业" prop="company_id" class="margin-left-lg margin-top must">
						<el-select v-model="ruleForm.company_id" placeholder="请选择企业" multiple filterable class="form-input-h">
							<el-option v-for="item,index in CompaniesData" :key="index" :label="item.name" :value="item.id"></el-option>
						</el-select>
						<p class="form_p_g">选择该联系人所属企业，一个联系人可绑定多个企业</p>
					</el-form-item>

					<el-form-item label="企业主" prop="is_client_admin" class="margin-left-lg margin-top must">
						<el-checkbox v-model="ruleForm.is_client_admin">勾选后，该联系人创建后，拥有企业主的权限，具备分享报告的权限！</el-checkbox>
					</el-form-item>

					<!--<el-form-item label="选择角色" prop="role_id" class="margin-left-lg margin-top must">
						<el-select v-model="ruleForm.role_id" placeholder="请选择角色">
							<el-option v-for="item,index in RolesData" :key="index" :label="item.display_name" :value="item.id"></el-option>
						</el-select>
						<p class="form_p_g">选择角色后，该联系人会拥有角色相对应的权限</p>
					</el-form-item>-->

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
			var validatePass2 = (rule, value, callback) => {
				if(!(/^(13[0-9]|14[5-9]|15[012356789]|166|17[0-8]|18[0-9]|19[8-9])[0-9]{8}$/.test(value))) {
					callback(new Error('请正确输入手机号'))
				} else {
					callback()
				}
			}
			return {
				data: [],
				labelPosition: 'right',
				ruleForm: {
					username: '',
					phone: '',
					company_id: [],
					is_client_admin: true,
					id: this.$route.params.id
				},
				rules: {
					username: [{
						required: true,
						message: '请输入姓名',
						trigger: 'blur'
					}],
					phone: [{
						required: true,
						validator: validatePass2,
						trigger: 'blur'
					}],
					company_id: [{
						required: true,
						message: '请选择企业',
						trigger: 'change'
					}],
					is_client_admin: [{
						required: true,
						message: '请选择分享报告',
						trigger: 'change'
					}],
				},
				loading: false,
				resetdata: false,
			}
		},
		computed: {
			...mapState([
				'RolesData',
				'CompaniesData'
			])
		},
		methods: {
			...mapActions([
				'getRoles',
				'getCompanies'
			]),
			async getData() {
				if(this.$route.params.id) {
					this.loading = true
					const data = await api.getClientsDetail(this.$route.params.id)
					await this.getRoles()
					await this.getCompanies()
					this.ruleForm.username = data.data.username
					this.ruleForm.phone = data.data.phone
					this.ruleForm.is_client_admin = data.data.is_client_admin
					//					this.ruleForm.role_id = data.data.roles.data[0].id
					this.$nextTick(() => {
						data.data.companies.data.forEach(e => {
							this.ruleForm.company_id.push(e.id)
						})
					})
				} else {
					await this.getRoles()
					await this.getCompanies()
				}

				this.loading = false
			},
			//提交表单
			submitForm(formName) {
				let id = this.$route.params.id;
				this.$refs[formName].validate((valid) => {
					if(valid) {
						if(id) {
							this.putClients()
						} else {
							this.postClients()
						}
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			async postClients() {
				this.loading = true
				const data = await api.postClients(this.ruleForm)
				if(data.status) {
					this.$message({
						type: 'success',
						message: data.msg
					})
					this.$router.push({
						name: 'CustomerContactMange'
					})
				} else {
					this.$message({
						type: 'info',
						message: data.msg
					})
				}
				this.loading = false
			},
			async putClients() {
				this.loading = true
				const data = await api.putClients(this.ruleForm)
				if(data.status) {
					this.$message({
						type: 'success',
						message: data.msg
					})
					this.$router.push({
						name: 'CustomerContactMange'
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
			},
			checkNo(value) {
				if(value) {
					this.$nextTick(() => {
						this.ruleForm.phone = this.$valid.onlynumber(value)
					});
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
	.auditDaka {
		&-arrow {
			& .icon-07jiantouxiangzuo {
				vertical-align: middle;
				font-size: 24px;
				color: #444444;
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
		width: 800px;
		padding: 10px;
		min-height: 220px
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