/*
 * @Descripttion:系统设置
 * @Author:
 * @Date: 2019-11-05 10:27:14
 * @LastEditors  : Please set LastEditors
 * @LastEditTime : 2019-12-31 23:26:44
 */
import DictionaryManagementRoute from './DictionaryManagement'
import RolePermissionRoute from './RolePermission'
import SystemMenu from './SystemMenu'
import DataSyncLog from './DataSyncLog'
/**
 * default
 */
export default [
  {
    path: 'SystemSetting',
    component: () => import('@/empty.vue'),
    children: [
      ...DictionaryManagementRoute,
      ...RolePermissionRoute,
      ...SystemMenu,
      ...DataSyncLog
    ]
  }
]
