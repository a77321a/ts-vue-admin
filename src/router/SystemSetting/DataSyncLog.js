/*
 * @Descripttion:数据同步日志
 * @Author:
 * @Date: 2019-11-06 10:20:37
 * @LastEditors:
 * @LastEditTime: 2019-11-21 17:57:30
 */
export default [
  {
    path: 'operationLog',
    name: 'operationLog',
    component: () => import('@/views/SystemSetting/DataSyncLog/operationLog.vue'),
    meta: {
      title: '操作日志',
      root: true
    }
  },
  {
    path: 'syncLog',
    name: 'syncLog',
    component: () => import('@/views/SystemSetting/DataSyncLog/syncLog.vue'),
    meta: {
      title: '同步日志',
      root: true
    }
  }

]
