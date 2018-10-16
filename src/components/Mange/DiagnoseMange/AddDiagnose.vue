<template>
	<div>
		<div class="page-title">
			<i class="iconfont icon-arrow-left cursor" @click="$router.go(-1)"></i> {{ $route.meta.title }}
		</div>
		<div class="know-container" v-loading="loading">
			<div class="auditDaka">
				<el-form @submit.native.prevent class="margin-top-lg" :label-position="labelPosition" label-width="130px" :model="ruleForm" ref="ruleForm" :rules="rules">

					<el-form-item prop="name" class="margin-left-lg margin-top must" label="方案名称">
						<el-input class="form-input-h" v-model="ruleForm.name" placeholder="请输入"></el-input>
						<p class="form_p_g">给方案起个名字吧，字数不限</p>
					</el-form-item>

					<el-form-item prop="rolement" class="margin-left-lg margin-top rolement" label="选择模块/问题">
						<el-radio-group v-model="radio" @change="changeRadio">
							<el-radio :label="0">从现有方案中复制</el-radio>
							<el-radio :label="1">不复制</el-radio>
						</el-radio-group>
						<el-select v-if="!is_show" v-model="value" @change="changePlans" placeholder="请选择" filterable class="form-input-h margin-top-sm margin-bottom-sm form_block">
							<el-option v-for="item,index in PlansData" :key="index" :label="item.name" :value="item.id">
							</el-option>
						</el-select>
						<el-input placeholder="输入模块/问题关键字进行过滤" v-model="filterText" class="form-input-h form_block" prefix-icon="el-icon-search">
						</el-input>
						<div class="tree-box">
							<!--  :default-expanded-keys="[2, 3]" -->
							<!-- 默认展开的的节点 -->
							<el-tree ref="tree" :data="data" show-checkbox node-key="name" @node-click="CheckChange" :props="defaultProps" :default-checked-keys="per_ids" :filter-node-method="filterNode" default-expand-all>
							</el-tree>
						</div>
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
			const coltitle2 = (rule, value, callback) => {
				if(this.$refs.tree.getCheckedKeys() == '') {
					return callback(new Error('请勾选权限'))
				} else {
					callback()
				}
			}
			return {
				data: [],
				labelPosition: 'right',
				per_ids: [],
				ruleForm: {
					name: ''
				},
				rules: {
					name: [{
						required: true,
						message: '请输入方案名称',
						trigger: 'blur'
					}],
					rolement: [{
						required: true,
						validator: coltitle2,
						trigger: 'blur'
					}]
				},
				loading: false,
				resetdata: false,
				defaultProps: {
					children: 'children',
					label: 'name'
				},
				radio: 0,
				filterText: '',
				value: '',
				is_show: false
			}
		},
		computed: {
			...mapState([
				'PlanDepartIndexData',
				'PlansData'
			])
		},
		methods: {
			...mapActions([
				'getPlanDepartIndex',
				'getPlans'
			]),
			CheckChange(value, Node, VueComponent){
				Node.checked = !Node.checked
			},
			filterNode(value, data) {
				if(!value) return true;
				return data.name.indexOf(value) !== -1;
			},
			async getData() {
				this.loading = true
				const data2 = await api.getPlanDepartIndex()
				await this.getPlans()
				this.PlansData.push({
					name: data2.data.name,
					id: data2.data.id
				})
				this.value = this.PlansData[0].id
				const data3 = await api.getPlanDeparts(this.value)
				data3.data.plan_departs.data.forEach(item => {
					//this.per_ids.push(item.name)
					item.plan_depart_questions.data.forEach(item2 => {
						this.per_ids.push(item2.name)
					})
				})
				this.data = data2.data.plan_departs.data
				data2.data.plan_departs.data.forEach(item => {
					item.children = item.plan_depart_questions.data
				})
				this.loading = false
			},
			async changePlans() {
				this.per_ids = []
				this.$refs.tree.setCheckedKeys([])
				const data3 = await api.getPlanDeparts(this.value)
				data3.data.plan_departs.data.forEach(item => {
					//this.per_ids.push(item.name)
					item.plan_depart_questions.data.forEach(item2 => {
						this.per_ids.push(item2.name)
					})
				})
				this.$refs.tree.setCheckedKeys(this.per_ids)
			},
			async changeRadio() {
				if(this.radio == 1) {
					this.per_ids = []
					this.$refs.tree.setCheckedKeys([])
					this.is_show = true
				} else {
					const data3 = await api.getPlanDeparts(this.value)
					data3.data.plan_departs.data.forEach(item => {
						//this.per_ids.push(item.name)
						item.plan_depart_questions.data.forEach(item2 => {
							this.per_ids.push(item2.name)
						})
					})
					this.$refs.tree.setCheckedKeys(this.per_ids)
					this.is_show = false
				}
			},
			//提交表单
			submitForm(formName) {
				let id = this.$route.params.id;
				this.$refs[formName].validate((valid) => {
					if(valid) {
						this.postPlans()
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			async postPlans() {
				let allnames = []
				const Cnode = this.$refs.tree.getCheckedNodes()
				Cnode.forEach(item => {
					const nameParent = this.$refs.tree.getNode(item.name).parent.data.name
					const iconParent = this.$refs.tree.getNode(item.name).parent.data.icon
					if(nameParent != undefined) {
						let isItem = false
						allnames.forEach(item2 => {
							if(item2.name == nameParent) {
								isItem = true
								item2.plan_depart_questions.push({
									question: item.name,
									answers: item.answers
								})
							}
						})
						if(!isItem) {
							allnames.push({
								name: nameParent,
								icon: iconParent,
								plan_depart_questions: [{
									question: item.name,
									answers: item.answers
								}]
							})
						}

					}
				})
				this.loading = true
				this.ruleForm.plan_departs = allnames
				const data = await api.postPlans(this.ruleForm)
				if(data.status) {
					this.$message({
						type: 'success',
						message: data.msg
					})
					this.$router.push({
						name: 'DiagnoseMange'
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
			},
			filterText(val) {
				this.$refs.tree.filter(val);
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
	
	.form_block {
		display: block;
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