import * as firebase from 'firebase'

export default {
  state: {
    registeredMeetups: [],
    user: null
  },
  mutations: {
    setRegisteredMeetups (state, payload) {
      state.registeredMeetups = payload
    },
    setMyMeetup (state, payload) {
      state.registeredMeetups = payload
    },
    setUser (state, payload) {
      state.user = payload
    }
  },
  actions: {
    setLoadRegisteredMeetups ({commit}) {
      commit('setLoading', true)
      const key = this.$store.getters.user.registeredMeetups
      const uid = this.$store.getters.user.id
      var rootRef = firebase.database().ref()
      rootRef.child('meetups').once('value').then(snapshot => {
        const data = []
        const dataRegistered = []
        key.forEach(element => {
          let smoothie = snapshot.val()[element]
          smoothie.id = element
          data.push(smoothie)
        })
        snapshot.forEach(doc => {
          if (snapshot.val()[doc.key].creatorId === uid) {
            let registered = snapshot.val()[doc.key]
            registered.id = doc.key
            dataRegistered.push(registered)
          }
        })
        commit('setRegisteredMeetups', data)
        // commit('setMyMeetup', data)
        commit('setLoading', false)
      })
    }
  },
  getters: {
    loadedRegistrationMeetups (state) {
      return state.registeredMeetups.sort((meetupA, meetupB) => {
        return meetupA.date > meetupB.date
      })
    }
  }
}
