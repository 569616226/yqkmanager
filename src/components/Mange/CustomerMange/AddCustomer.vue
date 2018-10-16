<template>
	<div>
		<div class="page-title">
			<i class="iconfont icon-arrow-left cursor" @click="$router.go(-1)"></i> {{ $route.meta.title }}
		</div>
		<div class="know-container" v-loading="loading">
			<div class="auditDaka">
				<el-form @submit.native.prevent class="margin-top-lg" :label-position="labelPosition" label-width="130px" :model="ruleForm" ref="ruleForm" :rules="rules">

					<el-form-item prop="name" class="margin-left-lg margin-top must" label="企业名称">
						<el-input class="form-input-h" v-model="ruleForm.name" placeholder="请输入"></el-input>
						<p class="form_p_g">填写企业名，字数不限</p>
					</el-form-item>

					<el-form-item label="选择联系人" prop="user_ids" class="margin-left-lg margin-top must">
						<el-select v-model="ruleForm.user_ids" placeholder="请选择" multiple filterable class="form-input-h">
							<el-option v-for="item,index in ClientsData" :key="index" :label="item.username" :value="item.id"></el-option>
						</el-select>
						<span class="blue margin-left-sm cursor" @click="outerVisible = true">新建联系人</span>
						<p class="form_p_g">选择联系人后，联系人可在微信端查看企业的诊断报告</p>
					</el-form-item>

					<el-form-item prop="logo" class="margin-left-lg margin-top must" label="企业logo">
						<el-upload name="image" class="avatar-uploader" :headers="uploadheaders" :action="uploadimgurl" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
							<img v-if="ruleForm.logo" :src="ruleForm.logo" class="avatar">
							<i v-else class="el-icon-plus avatar-uploader-icon"></i>
						</el-upload>
						<p class="form_p_g">只能上传jpg/png文件，且不超过1MB，图片尺寸要在256*256像素</p>
					</el-form-item>

					<el-form-item class="text-center margin-top-lg">
						<el-button :disabled="loading" type="primary" @click="submitForm('ruleForm')">提交</el-button>
						<el-button @click="resetForm('ruleForm')">返回</el-button>
					</el-form-item>
				</el-form>
			</div>
		</div>
		<el-dialog title="新建客户联系人" :visible.sync="outerVisible" append-to-body v-loading="loading3">
			<el-form @submit.native.prevent class="margin-top-lg" :label-position="labelPosition" label-width="130px" :model="ruleForm3" ref="ruleForm3" :rules="rules3">

				<el-form-item prop="username" class="margin-left-lg margin-top must" label="联系人姓名">
					<el-input class="form-input-h" v-model="ruleForm3.username" placeholder="请输入" maxlength="20"></el-input>
					<p class="form_p_g">填写客户联系人的姓名，1-20字</p>
				</el-form-item>

				<el-form-item prop="phone" class="margin-left-lg margin-top must" label="联系人手机号">
					<el-input class="form-input-h" v-model="ruleForm3.phone" placeholder="请输入" @input="checkNo" maxlength="11"></el-input>
					<p class="form_p_g">填写11位手机号，顾问认证时，会作为认证匹配的条件</p>
				</el-form-item>

				<!--<el-form-item label="所属企业" prop="company_id" class="margin-left-lg margin-top must">
					<el-select v-model="ruleForm3.company_id" placeholder="请选择企业" multiple filterable class="form-input-h">
						<el-option v-for="item,index in CompaniesData" :key="index" :label="item.name" :value="item.id"></el-option>
					</el-select>
					<p class="form_p_g">选择该联系人所属企业，一个联系人可绑定多个企业</p>
				</el-form-item>-->

				<el-form-item label="企业主" prop="is_client_admin" class="margin-left-lg margin-top must">
					<el-checkbox v-model="ruleForm3.is_client_admin">勾选后，该联系人创建后，拥有企业主的权限，具备分享报告的权限！</el-checkbox>
				</el-form-item>

				<!--<el-form-item label="选择角色" prop="role_id" class="margin-left-lg margin-top must">
						<el-select v-model="ruleForm3.role_id" placeholder="请选择角色">
							<el-option v-for="item,index in RolesData" :key="index" :label="item.display_name" :value="item.id"></el-option>
						</el-select>
						<p class="form_p_g">选择角色后，该联系人会拥有角色相对应的权限</p>
					</el-form-item>-->
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="outerVisible = false">取 消</el-button>
				<el-button type="primary" @click="submitForm3('ruleForm3')">提交</el-button>
			</div>
		</el-dialog>
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
				outerVisible: false,
				ruleForm: {
					name: '',
					user_ids: [],
					logo: '',
					id: this.$route.params.id
				},
				rules: {
					name: [{
						required: true,
						message: '请输入姓名',
						trigger: 'blur'
					}],
					user_ids: [{
						required: true,
						message: '请选择联系人',
						trigger: 'change'
					}]
				},
				loading: false,
				loading3: false,
				//新建客户联系人
				ruleForm3: {
					username: '',
					phone: '',
					company_id: [],
					is_client_admin: true,
					id: this.$route.params.id
				},
				rules3: {
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
				resetdata: false,
				//上传头像请求地址的头部信息
				uploadheaders: {
					Accept: 'application/json',
					Authorization: 'Bearer ' + getCookie('token')
				},
				uploadimgurl: this.$uploadimgurl,
			}
		},
		computed: {
			...mapState([
				'ClientsData'
			])
		},
		methods: {
			...mapActions([
				'getClients'
			]),
			//提交新建客户联系人表单
			submitForm3(formName) {
				this.$refs[formName].validate(async(valid) => {
					if(valid) {
						this.loading3 = true
						const data = await api.postClients(this.ruleForm3)
						if(data.status) {
							this.$message({
								type: 'success',
								message: data.msg
							})
							await this.getClients()
							this.ruleForm.user_ids.push(this.ClientsData[0].id)
							this.$refs[formName].resetFields()
							this.outerVisible = false
						} else {
							this.$message({
								type: 'info',
								message: data.msg
							})
						}
						this.loading3 = false
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			checkNo(value) {
				if(value) {
					this.$nextTick(() => {
						this.ruleForm3.phone = this.$valid.onlynumber(value)
					});
				}
			},
			async getData() {
				if(this.$route.params.id) {
					this.loading = true
					const data = await api.getCompaniesDetail(this.$route.params.id)
					await this.getClients()
					this.ruleForm.name = data.data.name
					this.ruleForm.logo = data.data.logo
					data.data.users.data.forEach(e => {
						this.ruleForm.user_ids.push(e.id)
					})
				} else {
					await this.getClients()
				}

				this.loading = false
			},
			handleAvatarSuccess(res, file) {
				this.ruleForm.logo = res.url
			},
			beforeAvatarUpload(file) {
				let isJPGorPNG = false;
				if(file.type === 'image/jpeg' || file.type === 'image/png') {
					isJPGorPNG = true;
				}
				const isLt1M = file.size / 1024 / 1024 < 1;
				if(!isJPGorPNG) {
					this.$message.error('上传图片只能是 JPG或者PNG 格式!');
				}
				if(!isLt1M) {
					this.$message.error('上传图片大小不能超过 1MB!');
				}
				return isJPGorPNG && isLt1M;
			},
			//提交表单
			submitForm(formName) {
				let id = this.$route.params.id;
				this.$refs[formName].validate((valid) => {
					if(valid) {
						if(id) {
							this.patchCompanies()
						} else {
							this.postCompanies()
						}
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			async postCompanies() {
				this.loading = true
				const data = await api.postCompanies(this.ruleForm)
				if(data.status) {
					this.$message({
						type: 'success',
						message: data.msg
					})
					this.$router.push({
						name: 'CustomerMange'
					})
				} else {
					this.$message({
						type: 'info',
						message: data.msg
					})
				}
				this.loading = false
			},
			async patchCompanies() {
				this.loading = true
				const data = await api.patchCompanies(this.ruleForm)
				if(data.status) {
					this.$message({
						type: 'success',
						message: data.msg
					})
					this.$router.push({
						name: 'CustomerMange'
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