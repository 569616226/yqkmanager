<template>
	<div>
		<div class="page-title">
			<i class="iconfont icon-arrow-left cursor" @click="$router.go(-1)"></i> {{ $route.meta.title }}
		</div>
		<div class="know-container" v-loading="loading">
			<div class="auditDaka">
				<el-form @submit.native.prevent class="margin-top-lg" :label-position="labelPosition" label-width="130px" :model="ruleForm" ref="ruleForm" :rules="rules">

					<el-form-item prop="question" class="margin-left-lg margin-top must" label="问题内容">
						<el-input class="form-input-h" v-model="ruleForm.question" placeholder="请输入"></el-input>
						<p class="form_p_g">填写问题的内容，字数不限</p>
					</el-form-item>

					<el-form-item prop="answer1" class="margin-left-lg margin-top must" label="问题答案">
						<div>
							<span>答案一：</span>
							<el-select v-model="ruleForm.answer1" placeholder="请选择" @change="ChangeAnswer1">
								<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
								</el-option>
							</el-select>
						</div>
						<div style="margin-top: 15px;">
							<span>答案二：</span>
							<el-select v-model="ruleForm.answer2" placeholder="请选择" @change="ChangeAnswer2">
								<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
								</el-option>
							</el-select>
						</div>
						<p class="form_p_g">选择问题的答案，每个选项只能选一个</p>
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
				nav_names: [],
				ruleForm: {
					question: '',
					answer1: '',
					answer2: '',
					plan_depart_id: this.$route.params.id
				},
				rules: {
					question: [{
						required: true,
						message: '请输入内容',
						trigger: 'blur'
					}],
					answer1: [{
						required: true,
						message: '请选择答案',
						trigger: 'blur'
					}]
				},
				loading: false,
				resetdata: false,
				options: [{
					value: '有',
					label: '有'
				}, {
					value: '无',
					label: '无'
				}, {
					value: '是',
					label: '是'
				}, {
					value: '否',
					label: '否'
				}, {
					value: '内部',
					label: '内部'
				}, {
					value: '外包',
					label: '外包'
				}, {
					value: '高',
					label: '高'
				}, {
					value: '低',
					label: '低'
				}]
			}
		},
		computed: {

		},
		methods: {
			async getData() {
				this.loading = true
				const data = await api.getPlanDepartQuestionsDetail(this.$route.params.id)
				this.ruleForm.question = data.data.name
				this.ruleForm.answer1 = data.data.answers[0]
				this.ruleForm.answer2 = data.data.answers[1]
				this.loading = false
			},
			//提交表单
			submitForm(formName) {
				let name = this.$route.name
				this.$refs[formName].validate((valid) => {
					if(valid) {
						if(name == 'EditQuestion') {
							this.patchPlanDepartQuestions()
						} else {
							this.postPlanDepartQuestions()
						}
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			async postPlanDepartQuestions() {
				this.loading = true
				let answers = []
				answers.push(this.ruleForm.answer1)
				answers.push(this.ruleForm.answer2)
				this.ruleForm.answers = answers
				const data = await api.postPlanDepartQuestions(this.ruleForm)
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
			async patchPlanDepartQuestions() {
				this.loading = true
				let answers = []
				answers.push(this.ruleForm.answer1)
				answers.push(this.ruleForm.answer2)
				this.ruleForm.answers = answers
				const data = await api.patchPlanDepartQuestions(this.ruleForm)
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
			},
			ChangeAnswer1(value) {
				if(value == '是'){
					this.ruleForm.answer2 = '否'
				}
				if(value == '否'){
					this.ruleForm.answer2 = '是'
				}
				if(value == '有'){
					this.ruleForm.answer2 = '无'
				}
				if(value == '无'){
					this.ruleForm.answer2 = '有'
				}
				if(value == '内部'){
					this.ruleForm.answer2 = '外包'
				}
				if(value == '外包'){
					this.ruleForm.answer2 = '内部'
				}
				if(value == '高'){
					this.ruleForm.answer2 = '低'
				}
				if(value == '低'){
					this.ruleForm.answer2 = '高'
				}
			},
			ChangeAnswer2(value) {
				if(value == '是'){
					this.ruleForm.answer1 = '否'
				}
				if(value == '否'){
					this.ruleForm.answer1 = '是'
				}
				if(value == '有'){
					this.ruleForm.answer1 = '无'
				}
				if(value == '无'){
					this.ruleForm.answer1 = '有'
				}
				if(value == '内部'){
					this.ruleForm.answer1 = '外包'
				}
				if(value == '外包'){
					this.ruleForm.answer1 = '内部'
				}
				if(value == '高'){
					this.ruleForm.answer1 = '低'
				}
				if(value == '低'){
					this.ruleForm.answer1 = '高'
				}
			}
		},
		mounted: function() {
			if(this.$route.name == 'EditQuestion') {
				this.getData()
			}
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