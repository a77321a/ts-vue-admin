/*
 * @Descripttion:服务管理
 * @Author:
 * @Date: 2019-11-06 10:20:37
 * @LastEditors:
 * @LastEditTime: 2019-12-21 22:59:09
 */
export default [
  {
    path: 'serviceCenter',
    name: 'serviceCenter',
    component: () => import('@/views/ServiceHall/ServiceManage/serviceCenter.vue'),
    meta: {
      title: '服务中心',
      root: true
    }
  },
  // {
  //   path: 'serviceUser',
  //   name: 'serviceUser',
  //   component: () => import('@/views/ServiceHall/ServiceManage/serviceUser.vue'),
  //   meta: {
  //     title: '服务人员',
  //     root: true
  //   }
  // },
  // {
  //   path: 'serviceUserInfo',
  //   name: 'serviceUserInfo',
  //   component: () => import('@/views/ServiceHall/ServiceManage/serviceUserInfo.vue'),
  //   meta: {
  //     title: '服务人员详情',
  //     parent: 'serviceUser'
  //   }
  // },
  // {
  //   path: 'serviceUserAdd',
  //   name: 'serviceUserAdd',
  //   component: () => import('@/views/ServiceHall/ServiceManage/editServiceUser.vue'),
  //   meta: {
  //     title: '新增服务人员',
  //     parent: 'serviceUser'
  //   }
  // },
  // {
  //   path: 'serviceUserEdit',
  //   name: 'serviceUserEdit',
  //   component: () => import('@/views/ServiceHall/ServiceManage/editServiceUser.vue'),
  //   meta: {
  //     title: '新增/编辑服务人员',
  //     parent: 'serviceUser'
  //   }
  // },
  {
    path: 'serviceCenterEdit',
    name: 'serviceCenterEdit',
    component: () => import('@/views/ServiceHall/ServiceManage/editServiceCenter.vue'),
    meta: {
      title: '编辑服务信息',
      parent: 'serviceCenter'
    }
  },
  {
    path: 'serviceCenterAdd',
    name: 'serviceCenterAdd',
    component: () => import('@/views/ServiceHall/ServiceManage/editServiceCenter.vue'),
    meta: {
      title: '新增服务信息',
      parent: 'serviceCenter'
    }
  }
]
