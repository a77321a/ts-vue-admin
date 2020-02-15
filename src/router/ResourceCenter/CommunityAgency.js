/*
 * @Descripttion:养老机构
 * @Author:
 * @Date: 2019-11-06 10:20:37
 * @LastEditors  : Please set LastEditors
 * @LastEditTime : 2020-01-15 13:41:23
 */
export default [
  {
    path: 'agencyManage',
    name: 'agencyManage',
    component: () => import('@/views/ResourceCenter/CommunityAgency/agencyManage.vue'),
    meta: {
      title: '养老机构',
      root: true
    }
  },
  {
    path: 'agencyManageEdit',
    name: 'agencyManageEdit',
    component: () => import('@/views/ResourceCenter/CommunityAgency/editAgency.vue'),
    meta: {
      title: '编辑机构',
      parent: 'agencyManage'
    }
  },
  {
    path: 'agencyManageAdd',
    name: 'agencyManageAdd',
    component: () => import('@/views/ResourceCenter/CommunityAgency/editAgency.vue'),
    meta: {
      title: '新增机构',
      parent: 'agencyManage'
    }
  },
  {
    path: 'agencyInfo',
    name: 'agencyInfo',
    component: () => import('@/views/ResourceCenter/CommunityAgency/agencyInfo.vue'),
    meta: {
      title: '机构详情',
      parent: 'agencyManage'
    }
  },
  {
    path: 'serviceUser',
    name: 'serviceUser',
    component: () => import('@/views/ServiceHall/ServiceManage/serviceUser.vue'),
    meta: {
      title: '服务人员',
      root: true
    }
  },
  {
    path: 'serviceUserDetail',
    name: 'serviceUserDetail',
    component: () => import('@/views/ServiceHall/ServiceManage/serviceUserInfo.vue'),
    meta: {
      title: '服务人员详情',
      parent: 'serviceUser'
    }
  },
  {
    path: 'serviceUserAdd',
    name: 'serviceUserAdd',
    component: () => import('@/views/ServiceHall/ServiceManage/editServiceUser.vue'),
    meta: {
      title: '新增服务人员',
      parent: 'serviceUser'
    }
  },
  {
    path: 'serviceUserEdit',
    name: 'serviceUserEdit',
    component: () => import('@/views/ServiceHall/ServiceManage/editServiceUser.vue'),
    meta: {
      title: '新增/编辑服务人员',
      parent: 'serviceUser'
    }
  },
  {
    path: 'eventRoom',
    name: 'eventRoom',
    component: () => import('@/views/ServiceHall/EventManage/eventRoom.vue'),
    meta: {
      title: '活动室',
      root: true
    }
  },
  {
    path: 'eventRoomAdd',
    name: 'eventRoomAdd',
    component: () => import('@/views/ServiceHall/EventManage/editEventRoom.vue'),
    meta: {
      title: '新增活动室',
      parent: 'eventRoom'
    }
  },
  {
    path: 'eventRoomEdit',
    name: 'eventRoomEdit',
    component: () => import('@/views/ServiceHall/EventManage/editEventRoom.vue'),
    meta: {
      title: '编辑活动室',
      parent: 'eventRoom'
    }
  },
  {
    path: 'eventRoomPreview',
    name: 'eventRoomPreview',
    component: () => import('@/views/ServiceHall/EventManage/eventRoomInfo.vue'),
    meta: {
      title: '活动室详情',
      parent: 'eventRoom'
    }
  }
]
