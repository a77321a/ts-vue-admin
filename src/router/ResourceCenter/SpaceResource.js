/*
 * @Descripttion:空间资源
 * @Author:
 * @Date: 2019-11-06 10:20:37
 * @LastEditors:
 * @LastEditTime: 2019-11-06 22:19:37
 */
export default [
  {
    path: 'spaceResource',
    name: 'spaceResource',
    component: () => import('@/views/ResourceCenter/SpaceResource/spaceResource.vue'),
    meta: {
      title: '空间资源',
      root: true
    }
  }
]
