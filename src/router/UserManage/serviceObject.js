/*
 * @Descripttion:服务对象
 * @Author:
 * @Date: 2019-11-06 10:20:37
 * @LastEditors:
 * @LastEditTime: 2019-12-21 23:08:09
 */
export default [
  {
    path: 'serviceObject',
    name: 'serviceObject',
    component: () => import('@/views/UserManage/ServiceObject/serviceObject.vue'),
    meta: {
      title: '服务对象',
      root: true
    }
  },
  {
    path: 'serviceObjectEdit',
    name: 'serviceObjectEdit',
    component: () => import('@/views/UserManage/ServiceObject/editObject.vue'),
    meta: {
      title: '编辑服务对象',
      parent: 'serviceObject'
    }
  },
  {
    path: 'serviceObjectAdd',
    name: 'serviceObjectAdd',
    component: () => import('@/views/UserManage/ServiceObject/editObject.vue'),
    meta: {
      title: '新增服务对象',
      parent: 'serviceObject'
    }
  },
  {
    path: 'serviceObjectDetail',
    name: 'serviceObjectDetail',
    component: () => import('@/views/UserManage/ServiceObject/serviceObjectInfo.vue'),
    meta: {
      title: '服务对象详情',
      parent: 'serviceObject'
    }
  }

]
