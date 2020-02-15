/*
 * @Descripttion:统计概况
 * @Author:
 * @Date: 2019-11-06 10:20:37
 * @LastEditors:
 * @LastEditTime: 2019-11-06 22:33:10
 */
export default [
  {
    path: 'PensionScaleStatistics',
    name: 'PensionScaleStatistics',
    component: () => import('@/views/StatisticalAnalysis/StatisticsSituation/PensionScaleStatistics.vue'),
    meta: {
      title: '养老规模统计',
      root: true
    }
  },
  {
    path: 'ServiceDevelopmentStatistics',
    name: 'ServiceDevelopmentStatistics',
    component: () => import('@/views/StatisticalAnalysis/StatisticsSituation/ServiceDevelopmentStatistics.vue'),
    meta: {
      title: '服务开展统计',
      root: true
    }
  }
]
