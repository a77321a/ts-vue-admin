<!--
 * @Descripttion:高德地图
 * @Author:
 * @Date: 2019-11-18 17:25:15
 * @LastEditors  : Please set LastEditors
 * @LastEditTime : 2020-01-13 17:02:09
 -->
<template>
  <div>
    <div
      style="position:relative"
      :style="{ height: `${$store.state.dialogHeight}px` }"
    >
      <el-amap-search-box
        style="position:absolute;top:5px;right:5px;"
        class="search-box"
        :search-option="searchOption"
        :on-search-result="onSearchResult"
      ></el-amap-search-box>
      <el-amap
        :plugin="plugin"
        vid="amapDemo"
        :amap-manager="amapManager"
        :center="mapCenter"
        :zoom="zoom"
        :events="events"
        class="amap-demo"
      >
        <el-amap-marker
          v-for="(marker, index) in markers"
          :position="marker.position"
          :key="index"
          :vid="index"
          :extData="marker"
          :topWhenClick="true"
          :content="getMarkerContent(marker, 30, 30)"
          :events="markerEvents"
        ></el-amap-marker>
      </el-amap>
    </div>
    <el-divider></el-divider>
    <el-form label-position="left" label-width="90" size="small">
      <el-form-item label="地址名称">
        <el-input style="width:200px" v-model="addressInfo.name"></el-input>
      </el-form-item>
      <el-form-item label="详细地址">
        <span>{{ addressInfo.address }}</span>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import VueAMap, { AMapManager } from 'vue-amap';
let amapManager = new AMapManager()
VueAMap.initAMapApiLoader({
  key: '307510b98ac36649578b31a1c86cb116',
  plugin: [
    'AMap.Autocomplete',
    'AMap.PlaceSearch',
    'AMap.Scale',
    'AMap.OverView',
    'AMap.ToolBar',
    'AMap.MapType',
    'AMap.PolyEditor',
    'AMap.CircleEditor',
    'AMap.Geolocation',
    'AMap.Geocoder'
  ],
  v: '1.4.4'
})
export default {
  name: 'GdMap',
  props: ['city'],
  data () {
    let self = this
    return {
      amapManager,
      map: {},
      addressInfo: {
        address: '',
        name: '',
        position: ['', '']
      },
      searchOption: {
        city: this.city || '',
        citylimit: true
      },
      markers: [],
      dialogVisible: false,
      nearbyInfo: [], // 周边信息---高德反馈（周边建筑信息）
      address: '', // 城市信息---高德反馈（省市区、adcode）
      zoom: 12, // 地图缩放
      events: {
        init: o => {},
        click: e => {
          // 点击地图的时候，获取点的击经纬度，并将地图中心点移自此处
          let { lng, lat } = e.lnglat
          self.lng = lng
          self.lat = lat
          // 这里通过高德 SDK 完成。
          var geocoder = new AMap.Geocoder({
            radius: 1000,
            extensions: 'all'
          })
          geocoder.getAddress([lng, lat], function (status, result) {
            if (status === 'complete' && result.info === 'OK') {
              if (result && result.regeocode) {
                console.log(e)
                self.address = result.regeocode.formattedAddress
                let component = result.regeocode.addressComponent
                let address =
                  result.regeocode.addressComponent.province +
                  result.regeocode.addressComponent.city +
                  result.regeocode.addressComponent.district +
                  result.regeocode.addressComponent.township +
                  result.regeocode.addressComponent.street +
                  result.regeocode.addressComponent.streetNumber
                let name =
                  result.regeocode.pois[result.regeocode.pois.length - 1].name
                self.addressInfo = {
                  address: address,
                  name: name,
                  position: [lng, lat]
                }
                self.$nextTick()
              }
            }
          })
        }
      },
      mapCenter: [118.110221, 24.490474],
      markerEvents: {
        click (e) {
          if (self.clickedMarker === e.target) return // 点击的是同一个Marker
          const data = e.target.getExtData()
          console.log(data)
          self.addressInfo = data
          if (self.clickedMarker) {
            // 先恢复上次点击的Marker的样式
            self.clickedMarker.setOffset(new AMap.Pixel(-10, -30))
            self.clickedMarker.setContent(
              self.getMarkerContent(self.clickedMarker.getExtData(), 30, 30)
            )
          }
          e.target.setContent(self.getMarkerContent(data, 40, 40, true))
          e.target.setOffset(new AMap.Pixel(-18, -50))
          self.clickedMarker = e.target
        }
      },
      plugin: [
        {
          enableHighAccuracy: true, // 是否使用高精度定位，默认:true
          timeout: 100000, // 超过10秒后停止定位，默认：无穷大
          maximumAge: 0, // 定位结果缓存0毫秒，默认：0
          convert: true, // 自动偏移坐标，偏移后的坐标为高德坐标，默认：true
          showButton: true, // 显示定位按钮，默认：true
          buttonPosition: 'RB', // 定位按钮停靠位置，默认：'LB'，左下角
          showMarker: true, // 定位成功后在定位到的位置显示点标记，默认：true
          showCircle: true, // 定位成功后用圆圈表示定位精度范围，默认：true
          panToLocation: true, // 定位成功后将定位到的位置作为地图中心点，默认：true
          zoomToAccuracy: true, // 定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：f
          extensions: 'all',
          pName: 'Geolocation',
          events: {
            init (o) {
              var geolocation = new AMap.Geolocation({
                enableHighAccuracy: true, // 是否使用高精度定位，默认:true
                timeout: 10000, // 超过10秒后停止定位，默认：5s
                buttonPosition: 'RB', // 定位按钮的停靠位置
                zoomToAccuracy: true // 定位成功后是否自动调整地图视野到定位点
              })
              // o 是高德地图定位插件实例

              geolocation.getCurrentPosition((status, result) => {
                if (result && result.position) {
                  self.lng = result.position.lng
                  self.lat = result.position.lat
                  self.center = [self.lng, self.lat]
                  self.loaded = true
                  self.$nextTick()
                }
              })
            }
          }
        }
      ]
    }
  },
  methods: {
    open (str, row) {
      return this.addressInfo
    },
    onSearchResult (pois) {
      let latSum = 0
      let lngSum = 0
      if (pois.length > 0) {
        pois.forEach((poi, v) => {
          let { lng, lat } = poi
          lngSum += lng
          latSum += lat
          this.markers.push({
            position: [poi.lng, poi.lat],
            address: poi.address,
            num: v + 1 + '',
            name: poi.name
          })
        })
        this.addressInfo = this.markers[0]
        let center = {
          lng: lngSum / pois.length,
          lat: latSum / pois.length
        }
        this.mapCenter = [center.lng, center.lat]
      }
    },
    getMarkerContent (item, width, height, isRotate = false) {
      if (item.num === 1) {
        this.getMarkerContent(item, width, height, true)
        return;
      }
      const bgRoate = isRotate ? 'transform: rotate(45deg);' : '';
      const txRotate = isRotate ? 'transform: rotate(-45deg);' : '';
      let backgroundColor =
        item.level === 'A'
          ? '#FF8100'
          : item.level === 'B'
            ? '#8D3ECD'
            : '#2DCD72';
      if (isRotate) {
        backgroundColor = '#0893FF';
      }
      const content = `<div style="display: flex;
                                      justify-content: center;
                                      align-items: center;
                                      height: ${width}px;
                                      width: ${height}px;
                                      border-radius: 10px;
                                      ${bgRoate}
                                      font-family: Arial-BoldMT;
                                      font-size: 16px;
                                      color: #FFFFFF;
                                      box-shadow: 2px 2px 4px 0 rgba(0,0,0,0.30);
                                      background-color: ${backgroundColor};"><div style="${txRotate}"> ${item.num} </div></div>`
      return content
    }
  }
}
</script>
<style lang="scss" scoped></style>
