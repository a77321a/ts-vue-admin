/*
 * @Descripttion:路由模拟
 * @Author:
 * @Date: 2019-11-05 16:05:09
 * @LastEditors  : Please set LastEditors
 * @LastEditTime : 2020-02-13 12:03:12
 */
export default [
  {
    name: '首页',
    url: 'Home',
    active: 'Home',
    icon: 'fa-bars'
  },
  {
    name: '服务大厅',
    active: 'serviceHall',
    icon: 'el-icon-platform-eleme',
    children: [
      {
        url: '',
        name: '活动管理',
        icon: '',
        children: [
          {
            url: 'eventCenter',
            name: '活动中心'
          },
          {
            url: 'eventRoom',
            name: '活动室'
          }
        ]
      },
      {
        url: '',
        name: '助餐管理',
        icon: '',
        children: [
          {
            url: 'dishManage',
            name: '菜品管理'
          },
          {
            url: 'mealCenter',
            name: '助餐中心'
          },
          {
            url: 'menuManage',
            name: '菜谱管理'
          }
        ]
      },
      {
        url: '',
        name: '服务管理',
        icon: '',
        children: [
          {
            url: 'serviceCenter',
            name: '服务中心'
          }
        ]
      },
      {
        url: '',
        name: '服务产品',
        icon: '',
        children: [
          {
            url: 'serviceProduct',
            name: '服务产品'
          },
          {
            url: 'serviceType',
            name: '服务类型'
          }
        ]
      }
    ]
  },
  {
    name: '资源中心',
    active: 'ResourceCenter',
    icon: 'fa-users',
    children: [
      {
        url: 'communitAgency',
        name: '养老机构',
        icon: '',
        children: [
          {
            url: 'agencyManage',
            name: '机构管理'
          },
          {
            url: 'serviceUser',
            name: '服务人员'
          }
        ]
      },
      {
        url: 'dataScreen',
        name: '数据大屏',
        icon: '',
        children: [
          {
            url: 'orgScreen',
            name: '机构大屏'
          }
        ]
      },
      {
        url: '',
        name: '空间资源',
        icon: '',
        children: [
          {
            url: 'spaceResource',
            name: '空间资源'
          }

        ]
      },
      {
        url: '',
        name: '设备资源',
        icon: '',
        children: [
          {
            url: 'monitoringEquipment',
            name: '监控设备'
          },
          {
            url: 'countingEquipment',
            name: '计数设备'
          },
          {
            url: 'mealEquipment',
            name: '助餐设备'
          }

        ]
      },
      {
        url: '',
        name: '养老产品',
        icon: '',
        children: [
          {
            url: 'pensionProduct',
            name: '养老产品'
          },
          {
            url: 'productType',
            name: '产品类型'
          }
        ]
      }
    ]
  },
  {
    name: '人员管理',
    url: 'UserManage',
    active: 'UserManage',
    icon: 'fa-users',
    children: [
      {
        url: '',
        name: '服务对象',
        icon: '',
        children: [
          {
            url: 'serviceObject',
            name: '服务对象'
          }

        ]
      }
    ]
  },
  {
    name: '统计分析',
    url: 'courseCenter',
    active: 'StatisticalAnalysis',
    icon: 'fa-users',
    children: [
      {
        url: '',
        name: '统计概况',
        icon: '',
        children: [
          {
            url: 'PensionScaleStatistics',
            name: '养老规模统计'
          },
          {
            url: 'ServiceDevelopmentStatistics',
            name: '服务开展统计'
          }

        ]
      }
    ]
  },
  {
    name: '系统设置',
    url: '',
    active: 'SystemSetting',
    icon: '',
    children: [
      {
        url: '',
        name: '系统菜单',
        icon: '',
        children: [
          {
            url: 'settingMenuManage',
            name: '菜单管理'
          }
        ]
      },
      {
        url: '',
        name: '字典管理',
        icon: '',
        children: [
          {
            url: 'dictionaryConfig',
            name: '字典配置'
          }
        ]
      },
      {
        url: '',
        name: '角色权限',
        icon: '',
        children: [
          {
            url: 'permissionConfig',
            name: '权限管理'
          },
          {
            url: 'roleManage',
            name: '角色管理'
          },
          {
            url: 'accountSetting',
            name: '账号设置'
          }

        ]
      },
      {
        url: '',
        name: '数据同步日志',
        icon: '',
        children: [
          {
            url: 'syncLog',
            name: '同步日志'
          },
          {
            url: 'operationLog',
            name: '操作日志'
          }

        ]
      }
    ]
  }
]
