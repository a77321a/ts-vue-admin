/*
 * @Descripttion:系统菜单
 * @Author:
 * @Date: 2019-11-06 10:20:37
 * @LastEditors:
 * @LastEditTime: 2019-11-06 22:53:48
 */
export default [
  {
    path: 'settingMenuManage',
    name: 'settingMenuManage',
    component: () => import('@/views/SystemSetting/SystemMenu/settingMenuManage.vue'),
    meta: {
      title: '菜单管理',
      root: true
    }
  }
]
