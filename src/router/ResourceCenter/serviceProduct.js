/*
 * @Descripttion:服务产品
 * @Author:
 * @Date: 2019-11-06 10:20:37
 * @LastEditors:
 * @LastEditTime: 2019-11-19 13:56:09
 */
export default [
  {
    path: 'serviceProduct',
    name: 'serviceProduct',
    component: () => import('@/views/ServiceHall/ServiceProduct/serviceProduct.vue'),
    meta: {
      title: '服务产品',
      root: true
    }
  },
  {
    path: 'serviceProductEdit',
    name: 'serviceProductEdit',
    component: () => import('@/views/ServiceHall/ServiceProduct/editServiceProduct.vue'),
    meta: {
      title: '编辑服务产品',
      parent: 'serviceProduct'
    }
  },
  {
    path: 'serviceProductAdd',
    name: 'serviceProductAdd',
    component: () => import('@/views/ServiceHall/ServiceProduct/editServiceProduct.vue'),
    meta: {
      title: '新增服务产品',
      parent: 'serviceProduct'
    }
  },
  {
    path: 'serviceType',
    name: 'serviceType',
    component: () => import('@/views/ServiceHall/ServiceProduct/serviceType.vue'),
    meta: {
      title: '服务类型',
      root: true
    }
  },
  {
    path: 'editServiceType',
    name: 'editServiceType',
    component: () => import('@/views/ServiceHall/ServiceProduct/editServiceType.vue'),
    meta: {
      title: '新增/编辑服务类型',
      parent: 'serviceType'
    }
  }
]
