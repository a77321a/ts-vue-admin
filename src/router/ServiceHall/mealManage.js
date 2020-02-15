/*
 * @Descripttion:助餐管理
 * @Author:
 * @Date: 2019-11-06 10:20:37
 * @LastEditors:
 * @LastEditTime: 2019-11-23 16:32:43
 */
export default [
  {
    path: 'dishManage',
    name: 'dishManage',
    component: () => import('@/views/ServiceHall/MealManage/dishManage.vue'),
    meta: {
      title: '菜品管理',
      root: true
    }
  },
  {
    path: 'dishManageAdd',
    name: 'dishManageAdd',
    component: () => import('@/views/ServiceHall/MealManage/editDish.vue'),
    meta: {
      title: '新增菜品',
      parent: 'dishManage'
    }
  },
  {
    path: 'dishManageEdit',
    name: 'dishManageEdit',
    component: () => import('@/views/ServiceHall/MealManage/editDish.vue'),
    meta: {
      title: '编辑菜品',
      parent: 'dishManage'
    }
  },
  {
    path: 'mealCenter',
    name: 'mealCenter',
    component: () => import('@/views/ServiceHall/MealManage/mealCenter.vue'),
    meta: {
      title: '助餐中心',
      root: true
    }
  },
  {
    path: 'mealCenterAdd',
    name: 'mealCenterAdd',
    component: () => import('@/views/ServiceHall/MealManage/editMealRecord.vue'),
    meta: {
      title: '新增助餐记录',
      parent: 'mealCenter'
    }
  },
  {
    path: 'mealCenterEdit',
    name: 'mealCenterEdit',
    component: () => import('@/views/ServiceHall/MealManage/editMealRecord.vue'),
    meta: {
      title: '编辑助餐记录',
      parent: 'mealCenter'
    }
  },
  {
    path: 'menuManage',
    name: 'menuManage',
    component: () => import('@/views/ServiceHall/MealManage/menuManage.vue'),
    meta: {
      title: '菜单管理',
      root: true
    }
  },
  {
    path: 'editMenu',
    name: 'editMenu',
    component: () => import('@/views/ServiceHall/MealManage/editMenu.vue'),
    meta: {
      title: '新增菜谱',
      parent: 'menuManage'
    }
  }
]
