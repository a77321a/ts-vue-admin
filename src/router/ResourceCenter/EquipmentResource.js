/*
 * @Descripttion:设备资源
 * @Author:
 * @Date: 2019-11-06 10:20:37
 * @LastEditors:
 * @LastEditTime: 2019-12-21 23:16:24
 */
export default [
  {
    path: 'countingEquipment',
    name: 'countingEquipment',
    component: () => import('@/views/ResourceCenter/EquipmentResource/countingEquipment.vue'),
    meta: {
      title: '计数设备',
      root: true
    }
  },
  {
    path: 'mealEquipment',
    name: 'mealEquipment',
    component: () => import('@/views/ResourceCenter/EquipmentResource/mealEquipment.vue'),
    meta: {
      title: '助餐设备',
      root: true
    }
  },
  {
    path: 'monitoringEquipment',
    name: 'monitoringEquipment',
    component: () => import('@/views/ResourceCenter/EquipmentResource/monitoringEquipment.vue'),
    meta: {
      title: '监控设备',
      root: true
    }
  },
  {
    path: 'monitoringEquipmentEdit',
    name: 'monitoringEquipmentEdit',
    component: () => import('@/views/ResourceCenter/EquipmentResource/editMonitorEquipment.vue'),
    meta: {
      title: '编辑监控设备',
      parent: 'monitoringEquipment'
    }
  },
  {
    path: 'monitoringEquipmentAdd',
    name: 'monitoringEquipmentAdd',
    component: () => import('@/views/ResourceCenter/EquipmentResource/editMonitorEquipment.vue'),
    meta: {
      title: '新增监控设备',
      parent: 'monitoringEquipment'
    }
  },
  {
    path: 'countingEquipmentEdit',
    name: 'countingEquipmentEdit',
    component: () => import('@/views/ResourceCenter/EquipmentResource/editMonitorEquipment.vue'),
    meta: {
      title: '编辑计数设备',
      parent: 'countingEquipment'
    }
  },
  {
    path: 'countingEquipmentAdd',
    name: 'countingEquipmentAdd',
    component: () => import('@/views/ResourceCenter/EquipmentResource/editMonitorEquipment.vue'),
    meta: {
      title: '新增计数设备',
      parent: 'countingEquipment'
    }
  },
  {
    path: 'mealEquipmentAdd',
    name: 'mealEquipmentAdd',
    component: () => import('@/views/ResourceCenter/EquipmentResource/editMonitorEquipment.vue'),
    meta: {
      title: '新增助餐设备',
      parent: 'mealEquipment'
    }
  },
  {
    path: 'mealEquipmentEdit',
    name: 'mealEquipmentEdit',
    component: () => import('@/views/ResourceCenter/EquipmentResource/editMonitorEquipment.vue'),
    meta: {
      title: '编辑助餐设备',
      parent: 'mealEquipment'
    }
  }
]
