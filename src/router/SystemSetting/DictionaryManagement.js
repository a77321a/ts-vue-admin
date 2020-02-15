/*
 * @Descripttion:字典管理
 * @Author:
 * @Date: 2019-11-06 10:20:37
 * @LastEditors:
 * @LastEditTime: 2019-11-11 15:00:15
 */
export default [
  {
    path: 'dictionaryConfig',
    name: 'dictionaryConfig',
    component: () => import('@/views/SystemSetting/DictionaryManagement/dictionaryConfig.vue'),
    meta: {
      title: '字典配置',
      root: true
    }
  },
  {
    path: 'dictionaryConfigEdit',
    name: 'dictionaryConfigEdit',
    component: () => import('@/views/SystemSetting/DictionaryManagement/editDictionary.vue'),
    meta: {
      title: '新增/编辑字典',
      parent: 'dictionaryConfig'
    }
  },
  {
    path: 'dictionaryConfigAdd',
    name: 'dictionaryConfigAdd',
    component: () => import('@/views/SystemSetting/DictionaryManagement/editDictionary.vue'),
    meta: {
      title: '新增字典',
      parent: 'dictionaryConfig'
    }
  }

]
