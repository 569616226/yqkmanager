<template>
	<div>
		<div class="know-container" v-loading="loading">
			<div class="auditDaka">
				<el-form @submit.native.prevent class="margin-top-lg" :label-position="labelPosition" label-width="130px">
					<el-form-item class="margin-left-lg margin-top rolement" label="选择模块/问题">
						<el-input placeholder="输入模块/问题关键字进行过滤" v-model="filterText" class="form-input-h" prefix-icon="el-icon-search">
						</el-input>
						<span class="AddSelectPlan-show" @click="PlanShow">
								<i class="iconfont icon-ic_pageview"></i>
								<span>预览方案</span>
						</span>
						<div class="tree-box">
							<!--  :default-expanded-keys="[2, 3]" -->
							<!-- 默认展开的的节点 -->
							<el-tree ref="tree" :data="data" :filter-node-method="filterNode" default-expand-all :expand-on-click-node="false">
								<span class="custom-tree-node" slot-scope="{ node, data }">
								        <span>{{ data.name }}</span>
								<span>
								          	<i class="iconfont icon-ic_add_circle cursor margin-left-xs" v-if="data.children" @click="() => AddMok(data)"></i>
								          	<i class="iconfont icon-pencil cursor margin-left-xs" @click="() => EditMok(data)"></i>
								          	<i class="iconfont icon-delete cursor margin-left-xs" @click="() => RemoveMok(data)"></i>
										</span>
								</span>
							</el-tree>
						</div>
					</el-form-item>
				</el-form>
			</div>
		</div>
		<el-dialog title="预览方案" :visible.sync="dialogVisible">
			<div class="tree-box">
				<!--  :default-expanded-keys="[2, 3]" -->
				<!-- 默认展开的的节点 -->
				<el-tree ref="treeShow" :data="dataShow" :props="defaultProps2" default-expand-all>
				</el-tree>
			</div>
			<span slot="footer" class="dialog-footer">
    			<el-button type="primary" @click="dialogVisible = false">关 闭</el-button>
  			</span>
		</el-dialog>
		<el-dialog title="修改模块名称" :visible.sync="outerVisible" v-loading="loading2">
			<el-form @submit.native.prevent class="margin-top-lg" :label-position="labelPosition" label-width="130px" :model="ruleForm2" ref="ruleForm2" :rules="rules2">

				<div v-if="editData.children">
					<el-form-item prop="name" class="margin-left-lg margin-top must" label="模块名称">
						<el-input class="form-input-h" v-model="ruleForm2.name" placeholder="请输入"></el-input>
					</el-form-item>
				</div>
				<div v-else>
					<el-form-item prop="question" class="margin-left-lg margin-top must" label="问题内容">
						<el-input class="form-input-h" v-model="ruleForm2.question" placeholder="请输入"></el-input>
						<p class="form_p_g">填写问题的内容，字数不限</p>
					</el-form-item>

					<el-form-item prop="rolement" class="margin-left-lg margin-top must" label="问题答案">
						<div>
							<span>答案一：</span>
							<el-select v-model="ruleForm2.answer1" placeholder="请选择">
								<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
								</el-option>
							</el-select>
						</div>
						<div style="margin-top: 15px;">
							<span>答案二：</span>
							<el-select v-model="ruleForm2.answer2" placeholder="请选择">
								<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
								</el-option>
							</el-select>
						</div>
						<p class="form_p_g">选择问题的答案，每个选项只能选一个</p>
					</el-form-item>
				</div>

			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="outerVisible = false">取 消</el-button>
				<el-button type="primary" @click="submitForm2('ruleForm2')">提交</el-button>
			</div>
		</el-dialog>
		<el-dialog :title="title3" :visible.sync="innerVisible" v-loading="loading3">
			<el-form @submit.native.prevent class="margin-top-lg" :label-position="labelPosition" label-width="130px" :model="ruleForm3" ref="ruleForm3" :rules="rules3">

				<el-form-item prop="question" class="margin-left-lg margin-top must" label="问题内容">
					<el-input class="form-input-h" v-model="ruleForm3.question" placeholder="请输入"></el-input>
					<p class="form_p_g">填写问题的内容，字数不限</p>
				</el-form-item>

				<el-form-item prop="rolement" class="margin-left-lg margin-top must" label="问题答案">
					<div>
						<span>答案一：</span>
						<el-select v-model="ruleForm3.answer1" placeholder="请选择">
							<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
							</el-option>
						</el-select>
					</div>
					<div style="margin-top: 15px;">
						<span>答案二：</span>
						<el-select v-model="ruleForm3.answer2" placeholder="请选择">
							<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
							</el-option>
						</el-select>
					</div>
					<p class="form_p_g">选择问题的答案，每个选项只能选一个</p>
				</el-form-item>

			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="innerVisible = false">取 消</el-button>
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
			const coltitle1 = (rule, value, callback) => {
				if(this.ruleForm2.answer1 == '' || this.ruleForm2.answer2 == '') {
					return callback(new Error('请选择答案'))
				} else {
					callback()
				}
			}
			const coltitle2 = (rule, value, callback) => {
				if(this.ruleForm3.answer1 == '' || this.ruleForm3.answer2 == '') {
					return callback(new Error('请选择答案'))
				} else {
					callback()
				}
			}
			return {
				activeName: '0',
				title3: '',
				data: [],
				dataShow: [],
				editData: {},
				labelPosition: 'right',
				//修改模块名称
				ruleForm2: {
					name: '',
					question: '',
					answer1: '',
					answer2: '',
				},
				rules2: {
					name: [{
						required: true,
						message: '请输入模块名称',
						trigger: 'blur'
					}],
					question: [{
						required: true,
						message: '请输入内容',
						trigger: 'blur'
					}],
					rolement: [{
						required: true,
						validator: coltitle1,
						trigger: 'blur'
					}]
				},
				//增加子模块名称
				ruleForm3: {
					question: '',
					answer1: '',
					answer2: '',
				},
				rules3: {
					question: [{
						required: true,
						message: '请输入内容',
						trigger: 'blur'
					}],
					rolement: [{
						required: true,
						validator: coltitle2,
						trigger: 'blur'
					}]
				},
				loading: false,
				loading2: false,
				loading3: false,
				resetdata: false,
				defaultProps: {
					children: 'plan_depart_questions',
					label: 'name'
				},
				defaultProps2: {
					children: 'children',
					label: 'name'
				},
				filterText: '',
				dialogVisible: false,
				outerVisible: false,
				innerVisible: false,
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
			...mapState([

			])
		},
		methods: {
			...mapActions([

			]),
			PlanShow() {
				this.dataShow = this.data
				this.dialogVisible = true
			},
			EditMok(data) {
				if(data.children) {
					this.ruleForm2.name = data.name
				} else {
					this.ruleForm2.question = data.name
					this.ruleForm2.answer1 = data.answers[0]
					this.ruleForm2.answer2 = data.answers[1]
				}
				this.editData = data
				this.outerVisible = true
			},
			AddMok(data) {
				this.editData = data
				this.title3 = `新建子内容（${data.name}）`
				this.innerVisible = true
			},
			RemoveMok(data) {
				this.$confirm('此操作将永久删除该模块内容, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(async () => {
					let is_data = []
					if(data.children) {
						is_data = await api.deletePlanDeparts(data.id)
					} else {
						is_data = await api.deletePlanDepartQuestions(data.id)
					}
					if(is_data.status) {
						this.$message({
							type: 'success',
							message: is_data.msg
						})
						this.getData()
					} else {
						this.$message({
							type: 'info',
							message: is_data.msg
						})
					}
				}).catch(() => {

				})
			},
			filterNode(value, data) {
				if(!value) return true;
				return data.name.indexOf(value) !== -1;
			},
			async getData() {
				this.loading = true
				const data = await api.getOrdersDetail(this.$route.params.id)
				data.data.plan.data.plan_departs.data.forEach(item => {
					item.children = item.plan_depart_questions.data
				})
				this.data = data.data.plan.data.plan_departs.data
				this.loading = false
			},
			//提交新建客户表单
			submitForm2(formName) {
				this.$refs[formName].validate(async(valid) => {
					if(valid) {
						this.loading2 = true
						let data = []
						console.log(this.editData)
						if(this.editData.children) {
							this.ruleForm2.plan_id = this.editData.id
							data = await api.patchPlanDepart(this.ruleForm2)
						} else {
							this.ruleForm2.plan_depart_id = this.editData.id
							let answers = []
							answers.push(this.ruleForm2.answer1)
							answers.push(this.ruleForm2.answer2)
							this.ruleForm2.answers = answers
							data = await api.patchPlanDepartQuestions(this.ruleForm2)
						}
						if(data.status) {
							this.$message({
								type: 'success',
								message: data.msg
							})
						} else {
							this.$message({
								type: 'info',
								message: data.msg
							})
						}
						await this.getData()
						this.loading2 = false
						this.outerVisible = false
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			//提交新建客户表单
			submitForm3(formName) {
				this.$refs[formName].validate(async(valid) => {
					if(valid) {
						this.loading3 = true
						this.ruleForm3.plan_depart_id = this.editData.id
						let answers = []
						answers.push(this.ruleForm3.answer1)
						answers.push(this.ruleForm3.answer2)
						this.ruleForm3.answers = answers
						const data = await api.postPlanDepartQuestions(this.ruleForm3)
						if(data.status) {
							this.$message({
								type: 'success',
								message: data.msg
							})
						} else {
							this.$message({
								type: 'info',
								message: data.msg
							})
						}
						await this.getData()
						this.$refs[formName].resetFields()
						this.loading3 = false
						this.innerVisible = false
					} else {
						console.log('error submit!!')
						return false;
					}
				});
			},
		},
		mounted: function() {
			this.getData()
		},
		watch: {
			filterText(val) {
				this.$refs.tree.filter(val);
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
			margin-left: 15px;
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
		min-height: 420px;
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