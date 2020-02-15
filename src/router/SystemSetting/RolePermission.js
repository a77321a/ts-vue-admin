/*
 * @Descripttion:角色权限
 * @Author:
 * @Date: 2019-11-06 10:20:37
 * @LastEditors:
 * @LastEditTime: 2019-12-01 19:22:42
 */
export default [
  {
    path: 'roleManage',
    name: 'roleManage',
    component: () => import('@/views/SystemSetting/RolePermission/roleManage.vue'),
    meta: {
      title: '角色管理',
      root: true
    }
  },
  {
    path: 'roleManagePreview',
    name: 'roleManagePreview',
    component: () => import('@/views/SystemSetting/RolePermission/roleInfo.vue'),
    meta: {
      title: '查看角色',
      parent: 'roleManage'
    }
  },
  {
    path: 'accountSetting',
    name: 'accountSetting',
    component: () => import('@/views/SystemSetting/RolePermission/accountSetting.vue'),
    meta: {
      title: '账号设置',
      root: true
    }
  },
  {
    path: 'permissionConfig',
    name: 'permissionConfig',
    component: () => import('@/views/SystemSetting/RolePermission/permissionConfig.vue'),
    meta: {
      title: '权限管理',
      root: true
    }
  },
  {
    path: 'accountSettingEdit',
    name: 'accountSettingEdit',
    component: () => import('@/views/SystemSetting/RolePermission/editAccount.vue'),
    meta: {
      title: '修改账号',
      parent: 'accountSetting'
    }
  },
  {
    path: 'accountSettingAdd',
    name: 'accountSettingAdd',
    component: () => import('@/views/SystemSetting/RolePermission/editAccount.vue'),
    meta: {
      title: '新增账号',
      parent: 'accountSetting'
    }
  },
  {
    path: 'roleManageEdit',
    name: 'roleManageEdit',
    component: () => import('@/views/SystemSetting/RolePermission/editRole.vue'),
    meta: {
      title: '编辑角色',
      parent: 'roleManage'
    }
  },
  {
    path: 'roleManageAdd',
    name: 'roleManageAdd',
    component: () => import('@/views/SystemSetting/RolePermission/editRole.vue'),
    meta: {
      title: '新增角色',
      parent: 'roleManage'
    }
  }
]
