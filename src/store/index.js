import Vue from 'vue'
import Vuex from 'vuex'
import api from '@/utils/api'
import { setCookie } from '@/utils'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		UserProfile: [],
		PermissionsData: [],
		RolesData: [],
		AdminsData: [],
		FindWechatSettingsData: [],
		RevisionsData: [],
		ClientsData: [],
		CompaniesData: [],
		PlansData: [],
		IndexData: [],
		PlanDepartIndexData: [],
		EditDiagnose: {
			activeName: ''
		},
		OrdersData: []
	},
	mutations: {
		UserProfile(state, data) {
			state.UserProfile = data
		},
		PermissionsData(state, data) {
			state.PermissionsData = data
		},
		RolesData(state, data) {
			state.RolesData = data
		},
		AdminsData(state, data) {
			state.AdminsData = data
		},
		FindWechatSettingsData(state, data) {
			state.FindWechatSettingsData = data
		},
		RevisionsData(state, data) {
			state.RevisionsData = data
		},
		ClientsData(state, data) {
			state.ClientsData = data
		},
		CompaniesData(state, data) {
			state.CompaniesData = data
		},
		PlansData(state, data) {
			state.PlansData = data
		},
		IndexData(state, data) {
			state.IndexData = data
		},
		PlanDepartIndexData(state, data) {
			state.PlanDepartIndexData = data
		},
		OrdersData(state, data) {
			state.OrdersData = data
		},
	},
	actions: {
		async getIndex({
			state,
			commit
		}) {
			const data = await api.getIndex()
			commit('IndexData', data.data)
		},
		async getUserProfile({
			state,
			commit
		}) {
			const data = await api.getUserProfile()
			commit('UserProfile', data.data)
		},
		async getPermissions({
			state,
			commit
		}) {
			const data = await api.getPermissions()
			commit('PermissionsData', data.data)
		},
		async getRoles({
			state,
			commit
		}) {
			const data = await api.getRoles()
			commit('RolesData', data.data)
		},
		async getAdmins({
			state,
			commit
		}) {
			const data = await api.getAdmins()
			commit('AdminsData', data.data)
		},
		async getFindWechatSettings({
			state,
			commit
		}) {
			const data = await api.getFindWechatSettings()
			commit('FindWechatSettingsData', data.data)
		},
		async getRevisions({
			state,
			commit
		}) {
			const data = await api.getRevisions()
			commit('RevisionsData', data.data)
		},
		async getClients({
			state,
			commit
		}) {
			const data = await api.getClients()
			data.data.forEach(item => {
				item.companies_name = item.companies.data.map(v => v.name).join('、')
			})
			commit('ClientsData', data.data)
		},
		async getCompanies({
			state,
			commit
		}) {
			const data = await api.getCompanies()
			commit('CompaniesData', data.data)
		},
		async getPlans({
			state,
			commit
		}) {
			const data = await api.getPlans()
			commit('PlansData', data.data)
		},
		async getPlanDepartIndex({
			state,
			commit
		}) {
			let dataArry = []
			const data = await api.getPlanDepartIndex()
			dataArry.push(data.data)
			commit('PlanDepartIndexData', dataArry)
		},
		async getOrders({
			state,
			commit
		}) {
			const data = await api.getOrders()
			commit('OrdersData', data.data)
		},
	}
})

export default store