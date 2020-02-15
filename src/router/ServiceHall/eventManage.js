/*
 * @Descripttion:活动管理
 * @Author:
 * @Date: 2019-11-06 10:20:37
 * @LastEditors  : Please set LastEditors
 * @LastEditTime : 2020-01-21 13:52:32
 */
export default [
  {
    path: 'eventCenter',
    name: 'eventCenter',
    component: () => import('@/views/ServiceHall/EventManage/eventCenter.vue'),
    meta: {
      title: '活动中心',
      root: true
    }
  },
  {
    path: 'eventCenterAdd',
    name: 'eventCenterAdd',
    component: () => import('@/views/ServiceHall/EventManage/editEvent.vue'),
    meta: {
      title: '新增活动',
      parent: 'eventCenter'
    }
  },
  // {
  //   path: 'eventRoom',
  //   name: 'eventRoom',
  //   component: () => import('@/views/ServiceHall/EventManage/eventRoom.vue'),
  //   meta: {
  //     title: '活动室',
  //     root: true
  //   }
  // },
  {
    path: 'eventCenterEdit',
    name: 'eventCenterEdit',
    component: () => import('@/views/ServiceHall/EventManage/editEvent.vue'),
    meta: {
      title: '编辑活动',
      parent: 'eventCenter'
    }
  },
  {
    path: 'eventCenterPreview',
    name: 'eventCenterPreview',
    component: () => import('@/views/ServiceHall/EventManage/eventInfo.vue'),
    meta: {
      title: '活动详情',
      parent: 'eventCenter'
    }
  },
  // {
  //   path: 'eventRoomAdd',
  //   name: 'eventRoomAdd',
  //   component: () => import('@/views/ServiceHall/EventManage/editEventRoom.vue'),
  //   meta: {
  //     title: '新增活动室',
  //     parent: 'eventRoom'
  //   }
  // },
  // {
  //   path: 'eventRoomEdit',
  //   name: 'eventRoomEdit',
  //   component: () => import('@/views/ServiceHall/EventManage/editEventRoom.vue'),
  //   meta: {
  //     title: '编辑活动室',
  //     parent: 'eventRoom'
  //   }
  // },
  // {
  //   path: 'eventRoomPreview',
  //   name: 'eventRoomPreview',
  //   component: () => import('@/views/ServiceHall/EventManage/eventRoomInfo.vue'),
  //   meta: {
  //     title: '活动室详情',
  //     parent: 'eventRoom'
  //   }
  // },
  {
    path: 'eventCenterSummary',
    name: 'eventCenterSummary',
    component: () => import('@/views/ServiceHall/EventManage/editActivitySummary.vue'),
    meta: {
      title: '活动总结',
      parent: 'eventCenter'
    }
  }
]
