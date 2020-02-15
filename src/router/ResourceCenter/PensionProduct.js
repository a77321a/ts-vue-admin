/*
 * @Descripttion:养老产品
 * @Author:
 * @Date: 2019-11-06 10:20:37
 * @LastEditors:
 * @LastEditTime: 2019-11-18 18:26:06
 */
export default [
  {
    path: 'pensionProduct',
    name: 'pensionProduct',
    component: () => import('@/views/ResourceCenter/PensionProduct/pensionProduct.vue'),
    meta: {
      title: '产品中心',
      root: true
    }
  },
  {
    path: 'pensionProductAdd',
    name: 'pensionProductAdd',
    component: () => import('@/views/ResourceCenter/PensionProduct/editPensionProduct.vue'),
    meta: {
      title: '新增产品',
      parent: 'pensionProduct'
    }
  },
  {
    path: 'pensionProductEdit',
    name: 'pensionProductEdit',
    component: () => import('@/views/ResourceCenter/PensionProduct/editPensionProduct.vue'),
    meta: {
      title: '编辑产品',
      parent: 'pensionProduct'
    }
  },
  {
    path: 'productType',
    name: 'productType',
    component: () => import('@/views/ResourceCenter/PensionProduct/productType.vue'),
    meta: {
      title: '产品类型',
      root: true
    }
  }
]
