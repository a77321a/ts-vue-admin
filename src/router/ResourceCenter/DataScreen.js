/*
 * @Descripttion:养老机构
 * @Author:
 * @Date: 2019-11-06 10:20:37
 * @LastEditors  : Please set LastEditors
 * @LastEditTime : 2019-12-25 16:04:55
 */
export default [
  {
    path: 'orgScreen',
    name: 'orgScreen',
    component: () => import('@/views/ResourceCenter/DataScreen/orgScreen.vue'),
    meta: {
      title: '机构大屏',
      root: true
    }
  }
]
