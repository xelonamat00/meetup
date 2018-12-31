// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import * as firebase from 'firebase'
import router from './router'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import {store} from './store'
import AlerCmp from './components/Shared/Alert.vue'
import DateFilter from './components/filters/date'
import moment from 'moment-timezone'
import './components/stylus/main.css'
import EditMeetupDetailsDialog from './components/Meetup/Edit/EditMeetupDetailsDialog.vue'
import EditMeetupDateDialog from './components/Meetup/Edit/EditMeetupDateDialog.vue'
import EditMeetupTimeDialog from './components/Meetup/Edit/EditMeetupTimeDialog.vue'
import RegisterMeetupDialog from './components/Meetup/Registration/RegisterDialog.vue'
// import DateFilter from './filters/date'

Vue.use(Vuetify, {
  theme: {
    primary: '#D32F2F',
    accent: '#FF5252',
    secondary: '#BDBDBD',
    info: '#1E88E5',
    warning: '#FFA000',
    error: '#D50000',
    success: '#66BB6A'
  }
})
// Vue.filter('date', DateFilter)
Vue.config.productionTip = false
Vue.component('app-alert', AlerCmp)
Vue.filter('date', DateFilter)
Vue.component('app-edit-meetup-details-dialog', EditMeetupDetailsDialog)
Vue.component('app-edit-meetup-date-dialog', EditMeetupDateDialog)
Vue.component('app-edit-meetup-time-dialog', EditMeetupTimeDialog)
Vue.component('app-meetup-register-dialog', RegisterMeetupDialog)
moment.tz.setDefault('Asia/Jakarta')

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  created () {
    firebase.initializeApp({
      apiKey: 'AIzaSyBkVxrlnxoEDn752LW286cHl8P1PUM6KHA',
      authDomain: 'meetup-tugasbudesi.firebaseapp.com',
      databaseURL: 'https://meetup-tugasbudesi.firebaseio.com',
      projectId: 'meetup-tugasbudesi',
      storageBucket: 'gs://meetup-tugasbudesi.appspot.com'
    })
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.$store.dispatch('autoSignin', user)
        this.$store.dispatch('fetchUserData')
      }
    })
    this.$store.dispatch('loadMeetups')
  },
  template: '<App/>'
})
