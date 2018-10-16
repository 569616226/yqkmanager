<template>
	<div>
		<div class="page-title">
			<i class="iconfont icon-arrow-left cursor" @click="$router.go(-1)"></i> {{ $route.meta.title }}
		</div>
		<div class="know-container" v-loading="loading">
			<div class="auditDaka">
				<el-form @submit.native.prevent class="margin-top-lg" :label-position="labelPosition" label-width="130px" :model="ruleForm" ref="ruleForm" :rules="rules">

					<el-form-item prop="name" class="margin-left-lg margin-top must" label="部门名称">
						<el-input class="form-input-h" v-model="ruleForm.name" placeholder="请输入"></el-input>
						<p class="form_p_g">填写部门的名称，1-20字</p>
					</el-form-item>

					<el-form-item prop="icon" class="margin-left-lg margin-top must" label="部门图标">
					<el-upload name="image" class="avatar-uploader" :headers="uploadheaders" :action="uploadimgurl" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
						<img v-if="ruleForm.icon" :src="ruleForm.icon" class="avatar">
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
	</div>
</template>

<script>
	import { mapState, mapActions } from 'vuex'
	import api from '@/utils/api'
	import { getCookie } from '@/utils'
	export default {
		data() {
			return {
				data: [],
				labelPosition: 'right',
				ruleForm: {
					name: '',
					icon: '',
					plan_id: this.$route.params.id
				},
				rules: {
					name: [{
						required: true,
						message: '请输入姓名',
						trigger: 'blur'
					}],
					icon: [{
						required: true,
						message: '请选择图片',
						trigger: 'blur'
					}]
				},
				loading: false,
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
			async getData() {
				if(this.$route.name == 'EditDeparts') {
					this.loading = true
					const data = await api.getPlanDepartsDetail(this.$route.params.id)
					this.ruleForm.name = data.data.name
					this.ruleForm.icon = data.data.icon
				}
				this.loading = false
			},
			handleAvatarSuccess(res, file) {
				this.ruleForm.icon = res.url
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
				let name = this.$route.name
				this.$refs[formName].validate((valid) => {
					if(valid) {
						if(name == 'EditDeparts') {
							this.patchPlanDepart()
						} else {
							this.postPlanDepart()
						}
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			async postPlanDepart() {
				this.loading = true
				const data = await api.postPlanDepart(this.ruleForm)
				if(data.status) {
					this.$message({
						type: 'success',
						message: data.msg
					})
					this.$router.go(-1)
				} else {
					this.$message({
						type: 'info',
						message: data.msg
					})
				}
				this.loading = false
			},
			async patchPlanDepart() {
				this.loading = true
				const data = await api.patchPlanDepart(this.ruleForm)
				if(data.status) {
					this.$message({
						type: 'success',
						message: data.msg
					})
					this.$router.go(-1)
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