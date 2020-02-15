/*
 * @Descripttion:统计分析
 * @Author:
 * @Date: 2019-11-05 10:27:14
 * @LastEditors:
 * @LastEditTime: 2019-11-06 22:29:44
 */
import StatisticsSituationRoute from './StatisticsSituation'
export default [
  {
    path: 'StatisticalAnalysis',
    component: () => import('@/empty.vue'),
    children: [
      ...StatisticsSituationRoute
    ]
  }
]
