/*
 * @Descripttion:资源中心
 * @Author:
 * @Date: 2019-11-05 10:27:14
 * @LastEditors  : Please set LastEditors
 * @LastEditTime : 2020-01-12 21:37:37
 */
import CommunityAgencyRoute from './CommunityAgency'
import SpaceResource from './SpaceResource'
import PensionProduct from './PensionProduct'
import EquipmentResource from './EquipmentResource'
import DataScreen from './DataScreen'
import serviceProductRoute from './serviceProduct'

export default [
  {
    path: 'ResourceCenter',
    component: () => import('@/empty.vue'),
    children: [
      ...CommunityAgencyRoute,
      ...SpaceResource,
      ...PensionProduct,
      ...EquipmentResource,
      ...DataScreen,
      ...serviceProductRoute

    ]
  }
]
