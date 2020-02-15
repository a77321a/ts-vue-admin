/*
 * @Descripttion:服务大厅
 * @Author:
 * @Date: 2019-11-05 10:27:14
 * @LastEditors  : Please set LastEditors
 * @LastEditTime : 2020-01-12 21:38:20
 */
import eventManageRoute from './eventManage'
import mealManageRoute from './mealManage'
import serviceManageRoute from './serviceManage'
// import serviceProductRoute from './serviceProduct'

export default [
  {
    path: 'serviceHall',
    component: () => import('@/empty.vue'),
    children: [
      ...eventManageRoute,
      ...mealManageRoute,
      ...serviceManageRoute
      // ...serviceProductRoute
    ]
  }
]
