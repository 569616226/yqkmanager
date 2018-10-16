import request from './request'
import apiUrl from './apiUrl'
const api_url = apiUrl
const api = {
	//登陆
	getToken: (item) => request.post(`${api_url}/v1/clients/web/admin/login`, {
		name: item.name,
		password: item.password
	}),
	//登陆用户信息
	getUserProfile: (id) => request.get(`${api_url}/v1/user/profile?include=roles`),
	//首页
	getIndex: (id) => request.get(`${api_url}/v1/`),
	/*---------------- 设置 -----------------*/
	//编辑用户
	putAdmins: (form) => request.put(`${api_url}/v1/users/${form.id}`, {
		name: form.name,
		email: form.email,
		password: form.password,
		username: form.username,
		phone: form.phone,
		role_id: form.role_id
	}),
	//修改密码
	putUsersPassword: (form) => request.put(`${api_url}/v1/users/${form.id}/password`, {
		password: form.password
	}),
	/*----------------权限管理-------------------*/
	//权限列表
	getPermissions: () => request.get(`${api_url}/v1/permissions`),
	//新建权限
	postPermissions: (form) => request.post(`${api_url}/v1/permissions`, {
		name: form.name,
		description: form.description,
		display_name: form.display_name
	}),
	//编辑权限
	putPermissions: (form) => request.put(`${api_url}/v1/permissions/${form.id}`, {
		description: form.description,
		display_name: form.display_name
	}),
	//删除权限
	deletePermissions: (id) => request.delete(`${api_url}/v1/permissions/${id}`),
	//权限详情
	getPermissionsDetail: (id) => request.get(`${api_url}/v1/permissions/${id}`),
	/*----------------角色管理-------------------*/
	//角色列表
	getRoles: () => request.get(`${api_url}/v1/roles`),
	//新建角色
	postRoles: (form) => request.post(`${api_url}/v1/roles`, {
		name: form.name,
		display_name: form.display_name,
		permissions_ids: form.permissions_ids
	}),
	//编辑角色
	putRoles: (form) => request.post(`${api_url}/v1/permissions/sync`, {
		role_id: form.id,
		name: form.name,
		display_name: form.display_name,
		permissions_ids: form.permissions_ids
	}),
	//删除角色
	deleteRoles: (id) => request.delete(`${api_url}/v1/roles/${id}`),
	//角色详情
	getRolesDetail: (id) => request.get(`${api_url}/v1/roles/${id}`),
	/*----------------账号管理-------------------*/
	//账号列表
	getAdmins: () => request.get(`${api_url}/v1/admins?include=roles`),
	//新建账号
	postAdmins: (form) => request.post(`${api_url}/v1/admins`, {
		password: form.password,
		name: form.name,
		username: form.username,
		phone: form.phone,
		role_id: form.role_id,
		is_audit: form.is_audit
	}),
	//编辑账号
	putAdmins: (form) => request.put(`${api_url}/v1/users/${form.id}`, {
		password: form.password,
		name: form.name,
		username: form.username,
		phone: form.phone,
		role_id: form.role_id,
		is_audit: form.is_audit
	}),
	//删除账号
	deleteAdmins: (id) => request.delete(`${api_url}/v1/users/${id}`),
	//设置负责人
	putUsersAudit: (id) => request.put(`${api_url}/v1/users/${id}/audit`),
	//账号详情
	getAdminsDetail: (id) => request.get(`${api_url}/v1/users/${id}?include=roles`),
	//冻结账号
	putFrozenAdmins: (id) => request.put(`${api_url}/v1/users/${id}/frozen`),
	//解冻账号
	putRefrozenAdmins: (id) => request.put(`${api_url}/v1/users/${id}/refrozen`),
	//公众号内容
	getFindWechatSettings: (id) => request.get(`${api_url}/v1/find_wechat_settings`),
	//更新公众号内容
	patchFindWechatSettings: (data) => request.patch(`${api_url}/v1/set_wechat_settings`, {
		wechat: data.index_count
	}),
	//系统日志
	getRevisions: () => request.get(`${api_url}/v1/revisions`),
	/*-----------------------------管理-------------------------------*/
	/*-------------------------客户联系人----------------------------*/
	//客户联系人列表
	getClients: () => request.get(`${api_url}/v1/clients?include=roles,companies`),
	//客户联系人详情
	getClientsDetail: (id) => request.get(`${api_url}/v1/clients/${id}?include=roles,companies`),
	//新建客户联系人
	postClients: (form) => request.post(`${api_url}/v1/clients`, {
		username: form.username,
		phone: form.phone,
		company_id: form.company_id,
		is_client_admin: form.is_client_admin
	}),
	//编辑客户联系人
	putClients: (form) => request.put(`${api_url}/v1/clients/${form.id}`, {
		username: form.username,
		phone: form.phone,
		company_id: form.company_id,
		is_client_admin: form.is_client_admin
	}),
	/*-------------------------客户----------------------------*/
	//客户列表
	getCompanies: () => request.get(`${api_url}/v1/companies`),
	//新建客户
	postCompanies: (form) => request.post(`${api_url}/v1/companies`, {
		name: form.name,
		logo: form.logo,
		user_ids: form.user_ids
	}),
	//编辑客户
	patchCompanies: (form) => request.patch(`${api_url}/v1/companies/${form.id}`, {
		name: form.name,
		logo: form.logo,
		user_ids: form.user_ids
	}),
	//客户详情
	getCompaniesDetail: (id) => request.get(`${api_url}/v1/companies/${id}?include=users`),
	//删除客户
	deleteCompanies: (id) => request.delete(`${api_url}/v1/companies/${id}`),
	/*--------------------------------诊断标准管理-------------------------------------*/
	//导入标准方案库
	putUploadParentPlanExcel: (plan_excel) => request.put(`${api_url}/v1/upload_parent_plan_excel`, {
		plan_excel: plan_excel
	}),
	//方案列表
	getPlans: () => request.get(`${api_url}/v1/plans`),
	//方案详情(标准库和其他库公用接口)
	getPlanDeparts: (id) => request.get(`${api_url}/v1/plans/${id}?include=plan_departs`),
	//方案详情(标准库)
	getPlanDepartIndex: (id) => request.get(`${api_url}/v1/parent_plan`),
	//新建客户
	postPlans: (plan_datas) => request.post(`${api_url}/v1/plans`, {
		plan_data: plan_datas
	}),
	//删除方案
	deletePlans: (id) => request.delete(`${api_url}/v1/plans/${id}`),
	//更新方案部门
	patchPlans: (form) => request.patch(`${api_url}/v1/plans/${form.id}`, {
		plan_data: form.plan_data
	}),
	//部门问题列表
	getPlanDepartQuestions: (plan_depart_id) => request.get(`${api_url}/v1/plan_depart/${plan_depart_id}/questions`),
	//新建部门问题
	postPlanDepartQuestions: (form) => request.post(`${api_url}/v1/plan_depart_questions`, {
		question: form.question,
		answers: form.answers,
		plan_depart_id: form.plan_depart_id
	}),
	//部门问题详情
	getPlanDepartQuestionsDetail: (id) => request.get(`${api_url}/v1/plan_depart_questions/${id}`),
	//部门问题更新
	patchPlanDepartQuestions: (form) => request.patch(`${api_url}/v1/plan_depart_questions/${form.plan_depart_id}`, {
		question: form.question,
		answers: form.answers
	}),
	//删除部门问题
	deletePlanDepartQuestions: (id) => request.delete(`${api_url}/v1/plan_depart_questions/${id}`),
	//方案部门列表
	getPlanDepartsList: (plan_id) => request.get(`${api_url}/v1/plan/${plan_id}/departs`),
	//方案部门创建
	postPlanDepart: (form) => request.post(`${api_url}/v1/plan_departs`, {
		name: form.name,
		icon: form.icon,
		plan_id: form.plan_id
	}),
	//方案部门详情
	getPlanDepartsDetail: (id) => request.get(`${api_url}/v1/plan_departs/${id}`),
	//更新方案部门
	patchPlanDepart: (form) => request.patch(`${api_url}/v1/plan_departs/${form.plan_id}`, {
		name: form.name,
		icon: form.icon
	}),
	//删除方案部门
	deletePlanDeparts: (id) => request.delete(`${api_url}/v1/plan_departs/${id}`),
	/*--------------------------------订单管理-------------------------------------*/
	//订单列表
	getOrders: () => request.get(`${api_url}/v1/orders?include=company`),
	//删除订单 （只能删除未开始的）
	deleteOrders: (id) => request.delete(`${api_url}/v1/orders/${id}`),
	//启动订单
	patchOrdersStart: (id) => request.patch(`${api_url}/v1/orders/${id}/start`),
	//创建订单
	postOrders: (form) => request.post(`${api_url}/v1/orders`, {
		name: form.name,
		status: form.status,
		plan_id: form.plan_id,
		company_id: form.company_id
	}),
	//创建订单和方案
	postOrdersPlan: (form) => request.post(`${api_url}/v1/plan_orders`, {
		name: form.name,
		status: form.status,
		company_id: form.company_id,
		plan_data: {
			name: form.plan_name,
			plan_departs: form.plan_departs
		}
	}),
	//订单详情
	getOrdersDetail: (id) => request.get(`${api_url}/v1/orders/${id}?include=company,plan`),
	//更新订单
	patchOrders: (form) => request.patch(`${api_url}/v1/orders/${form.id}`, {
		name: form.name
	}),
	//冻结订单
	getOrderDongJie: (id) => request.get(`${api_url}/v1/orders/${id}/frozen`),
	//解冻订单
	getOrderJieDong: (id) => request.get(`${api_url}/v1/orders/${id}/refrozen`),
}

export default api