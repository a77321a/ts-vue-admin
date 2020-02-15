/*
 * @Descripttion:人员管理
 * @Author:
 * @Date: 2019-11-05 10:27:14
 * @LastEditors:
 * @LastEditTime: 2019-11-06 22:25:31
 */
import serviceObjectRoute from './serviceObject'

export default [
  {
    path: 'UserManage',
    component: () => import('@/empty.vue'),
    children: [
      ...serviceObjectRoute
    ]
  }
]
