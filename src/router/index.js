import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Admin from '@/components/Admin'
import Home from '@/components/Home'
//管理
import CustomerContactMange from '@/components/Mange/CustomerContactMange'
import AddCustomerContact from '@/components/Mange/CustomerContactMange/AddCustomerContact'
import CustomerMange from '@/components/Mange/CustomerMange'
import AddCustomer from '@/components/Mange/CustomerMange/AddCustomer'
import DiagnoseMange from '@/components/Mange/DiagnoseMange'
import AddDiagnose from '@/components/Mange/DiagnoseMange/AddDiagnose'
import EditDiagnose from '@/components/Mange/DiagnoseMange/EditDiagnose'
import AddQuestion from '@/components/Mange/DiagnoseMange/EditDiagnose/AddQuestion'
import DepartsMange from '@/components/Mange/DiagnoseMange/EditDiagnose/DepartsMange'
import AddDeparts from '@/components/Mange/DiagnoseMange/EditDiagnose/DepartsMange/AddDeparts'
import OrderMange from '@/components/Mange/OrderMange'
import SelectPlan from '@/components/Mange/OrderMange/SelectPlan'
import AddSelectPlan from '@/components/Mange/OrderMange/AddSelectPlan'
import AddSelectPlanOrder from '@/components/Mange/OrderMange/AddSelectPlanOrder'
import EditSelectPlanOrder from '@/components/Mange/OrderMange/EditSelectPlanOrder'
//系统设置
import PermissionsMange from '@/components/SetUp/PermissionsMange'
import AddPermissions from '@/components/SetUp/PermissionsMange/AddPermissions'
import RoleMange from '@/components/SetUp/RoleMange'
import AddRole from '@/components/SetUp/RoleMange/AddRole'
import UsersMange from '@/components/SetUp/UsersMange'
import AddUsers from '@/components/SetUp/UsersMange/AddUsers'
import PubnuMange from '@/components/SetUp/PubnuMange'
import SysOperationLog from '@/components/SetUp/SysOperationLog'

const parentComponent = {
	template: `<router-view></router-view>`
}
Vue.use(Router)

export default new Router({
	mode: 'history',
	routes: [{
		path: '',
		component: Admin,
		children: [{
			path: '/',
			name: 'Home',
			meta: {
				title: '主页',
				requireAuth: true,
				cid: 1
			},
			component: Home,
		}, {
			path: 'Mange',
			name: 'Mange',
			meta: {
				title: '管理',
				requireAuth: true,
			},
			component: parentComponent,
			children: [{
				path: 'CustomerContactMange',
				name: 'CustomerContactMange',
				meta: {
					title: '客户联系人管理',
					requireAuth: true,
					cid: 12
				},
				component: CustomerContactMange,
			}, {
				path: 'AddCustomerContact',
				name: 'AddCustomerContact',
				meta: {
					title: '新建客户联系人',
					requireAuth: true,
					cid: 12
				},
				component: AddCustomerContact,
			}, {
				path: 'EditCustomerContact/:id',
				name: 'EditCustomerContact',
				meta: {
					title: '编辑客户联系人',
					requireAuth: true,
					cid: 12
				},
				component: AddCustomerContact,
			}, {
				path: 'CustomerMange',
				name: 'CustomerMange',
				meta: {
					title: '客户管理',
					requireAuth: true,
					cid: 5
				},
				component: CustomerMange,
			}, {
				path: 'AddCustomer',
				name: 'AddCustomer',
				meta: {
					title: '新建客户',
					requireAuth: true,
					cid: 5
				},
				component: AddCustomer,
			}, {
				path: 'EditCustomer/:id',
				name: 'EditCustomer',
				meta: {
					title: '编辑客户',
					requireAuth: true,
					cid: 5
				},
				component: AddCustomer,
			}, {
				path: 'DiagnoseMange',
				name: 'DiagnoseMange',
				meta: {
					title: '诊断标准管理',
					requireAuth: true,
					cid: 4
				},
				component: DiagnoseMange,
			}, {
				path: 'AddDiagnose',
				name: 'AddDiagnose',
				meta: {
					title: '新建方案',
					requireAuth: true,
					cid: 4
				},
				component: AddDiagnose,
			}, {
				path: 'EditDiagnose/:id',
				name: 'EditDiagnose',
				meta: {
					title: '编辑方案',
					requireAuth: true,
					cid: 4
				},
				component: EditDiagnose,
			}, {
				path: 'AddQuestion/:id',
				name: 'AddQuestion',
				meta: {
					title: '新建问题',
					requireAuth: true,
					cid: 4
				},
				component: AddQuestion,
			}, {
				path: 'EditQuestion/:id',
				name: 'EditQuestion',
				meta: {
					title: '编辑问题',
					requireAuth: true,
					cid: 4
				},
				component: AddQuestion,
			}, {
				path: 'DepartsMange/:id',
				name: 'DepartsMange',
				meta: {
					title: '部门管理',
					requireAuth: true,
					cid: 4
				},
				component: DepartsMange,
			}, {
				path: 'AddDeparts/:id',
				name: 'AddDeparts',
				meta: {
					title: '新建部门',
					requireAuth: true,
					cid: 4
				},
				component: AddDeparts,
			}, {
				path: 'EditDeparts/:id',
				name: 'EditDeparts',
				meta: {
					title: '编辑部门',
					requireAuth: true,
					cid: 4
				},
				component: AddDeparts,
			}, {
				path: 'OrderMange',
				name: 'OrderMange',
				meta: {
					title: '订单管理',
					requireAuth: true,
					cid: 3
				},
				component: OrderMange,
			}, {
				path: 'SelectPlan',
				name: 'SelectPlan',
				meta: {
					title: '新建订单',
					requireAuth: true,
					cid: 3
				},
				component: SelectPlan,
			}, {
				path: 'AddSelectPlan',
				name: 'AddSelectPlan',
				meta: {
					title: '选择现有方案',
					requireAuth: true,
					cid: 3
				},
				component: AddSelectPlan,
			}, {
				path: 'AddSelectPlanOrder',
				name: 'AddSelectPlanOrder',
				meta: {
					title: '新建方案',
					requireAuth: true,
					cid: 3
				},
				component: AddSelectPlanOrder,
			}, {
				path: 'EditSelectPlanOrder/:id',
				name: 'EditSelectPlanOrder',
				meta: {
					title: '编辑订单',
					requireAuth: true,
					cid: 3
				},
				component: EditSelectPlanOrder,
			}]
		}, {
			path: 'SetUp',
			name: 'SetUp',
			meta: {
				title: '设置',
				requireAuth: true,
			},
			component: parentComponent,
			children: [{
				path: 'PermissionsMange',
				name: 'PermissionsMange',
				meta: {
					title: '权限管理',
					requireAuth: true,
					cid: 7
				},
				component: PermissionsMange,
			}, {
				path: 'AddPermissions',
				name: 'AddPermissions',
				meta: {
					title: '新建权限',
					requireAuth: true,
					cid: 7
				},
				component: AddPermissions,
			}, {
				path: 'EditPermissions/:id',
				name: 'EditPermissions',
				meta: {
					title: '编辑权限',
					requireAuth: true,
					cid: 7
				},
				component: AddPermissions,
			}, {
				path: 'RoleMange',
				name: 'RoleMange',
				meta: {
					title: '角色管理',
					requireAuth: true,
					cid: 8
				},
				component: RoleMange,
			}, {
				path: 'AddRole',
				name: 'AddRole',
				meta: {
					title: '新建角色',
					requireAuth: true,
					cid: 8
				},
				component: AddRole,
			}, {
				path: 'EditRole/:id',
				name: 'EditRole',
				meta: {
					title: '编辑角色',
					requireAuth: true,
					cid: 8
				},
				component: AddRole,
			}, {
				path: 'UsersMange',
				name: 'UsersMange',
				meta: {
					title: '账号管理',
					requireAuth: true,
					cid: 9
				},
				component: UsersMange,
			}, {
				path: 'AddUsers',
				name: 'AddUsers',
				meta: {
					title: '新建账号',
					requireAuth: true,
					cid: 9
				},
				component: AddUsers,
			}, {
				path: 'EditUsers/:id',
				name: 'EditUsers',
				meta: {
					title: '编辑账号',
					requireAuth: true,
					cid: 9
				},
				component: AddUsers,
			}, {
				path: 'PubnuMange',
				name: 'PubnuMange',
				meta: {
					title: '公众号管理',
					requireAuth: true,
					cid: 10
				},
				component: PubnuMange,
			}, {
				path: 'SysOperationLog',
				name: 'SysOperationLog',
				meta: {
					title: '系统操作日志',
					requireAuth: true,
					cid: 11
				},
				component: SysOperationLog,
			}]
		}]
	}, {
		path: '/login',
		name: 'Login',
		meta: {
			title: '登录页',
			requireAuth: false,
		},
		component: Login
	}]
})