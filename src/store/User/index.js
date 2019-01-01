import * as firebase from 'firebase'
// import VuexPersistence from 'vuex-persist'
// import VuexPresistence from 'vuex-persist'

// const vuexLocalStorage = new VuexPersistence({
//   key: 'vuex',
//   storage: window.localStorage
// })

export default {
  state: {
    user: null,
    profile: {},
    members: []
    // count:
  },
  // plugins: [vuexLocalStorage.plugin],
  mutations: {
    registerUserForMeetup (state, payload) {
      const id = payload.id
      if (state.user.registeredMeetups.findIndex(meetup => meetup.id === id) >= 0) {
        return
      }
      state.user.registeredMeetups.push(id)
      state.user.fbKeys[id] = payload.fbKey
    },
    unregisterUserFromMeetup (state, payload) {
      const registeredMeetups = state.user.registeredMeetups
      registeredMeetups.splice(registeredMeetups.findIndex(meetup => meetup.id === payload), 1)
      Reflect.deleteProperty(state.user.fbKeys, payload)
    },
    setUser (state, payload) {
      state.user = payload
    },
    totalMembers (state, payload) {
      state.members = payload
    }
    // incMember (state, payload){

    // }
  },
  actions: {
    // incMember ({commit}, payload) {
    //   firebase.database().ref().child('meetup/' + payload).once('value')
    //   .then(snapshot => {
    //     var tempData = snapshot.val().totalMembers
    //     snapshot.update({total: tempData++})
    //     commit('incMember', payload)
    //   }).catch(error => {
    //     console.log(error)
    //   })
    // },
    totalMembers ({commit}) {
      firebase.database().ref('users').once('value')
      .then(snapshot => {
        const data = []
        snapshot.forEach(childSnap => {
          childSnap.forEach(outerChild => {
            console.log(outerChild.val())
            outerChild.forEach(innerChild => {
              let smoothie = innerChild.val()
              data.push(smoothie)
            })
          })
        })
        commit('totalMembers', data)
      }).catch(error => {
        console.log(error)
      })
    },
    registerUserForMeetup ({commit, getters}, payload) {
      commit('setLoading', true)
      const user = getters.user
      firebase.database().ref('/users/' + user.id).child('/registrations/')
      .push(payload)
      .then(data => {
        commit('setLoading', false)
        commit('registerUserForMeetup', {id: payload, fbKey: data.key})

      })
      .catch(error => {
        console.log(error)
        commit('setLoading', false)
      })
    },
    unregisterUserFromMeetup ({commit, getters}, payload) {
      commit('setLoading', true)
      const user = getters.user
      if (!user.fbKeys) {
        return
      }
      const fbKey = user.fbKeys[payload]
      firebase.database().ref('/users/' + user.id + '/registrations/').child(fbKey)
      .remove()
      .then(() => {
        commit('setLoading', false)
        commit('unregisterUserFromMeetup', payload)
      })
      .catch(error => {
        commit('setLoading', false)
        console.log(error)
      })
    },
    signUserUp ({commit}, payload) {
      commit('setLoading', true)
      commit('clearError')
      firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
      .then(
        user => {
          commit('setLoading', false)
          const newUser = {
            id: user.user.uid,
            registeredMeetups: [],
            fbKeys: {}
          }
          commit('setUser', newUser)
        }
      ).then(() => {
        const currentUser = firebase.auth().currentUser
        currentUser.updateProfile({displayName: payload.fullName})
      })
      .catch(
        error => {
          commit('setLoading', false)
          commit('setError', error)
          console.log(error)
        }
      )
    },
    signUserIn ({commit}, payload) {
      commit('setLoading', true)
      commit('clearError')
      firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
      .then(
        user => {
          commit('setLoading', false)
          const newUser = {
            id: user.user.uid,
            registeredMeetups: [],
            fbKeys: {}
          }
          commit('setUser', newUser)
        }
      )
      .catch(
        error => {
          commit('setLoading', false)
          commit('setError', error)
          console.log(error)
        }
      )
    },
    fetchUserData ({commit, getters}) {
      commit('setLoading', true)
      firebase.database().ref('/users/' + getters.user.id + '/registrations/').once('value')
      .then(data => {
        const dataPairs = data.val()
        let registeredMeetups = []
        let swappedPairs = {}
        for (let key in dataPairs) {
          registeredMeetups.push(dataPairs[key])
          swappedPairs[dataPairs[key]] = key
        }
        const updateUser = {
          id: getters.user.id,
          registeredMeetups: registeredMeetups,
          fbKeys: swappedPairs
        }
        commit('setLoading', false)
        commit('setUser', updateUser)
      })
      .catch(error => {
        console.log(error)
        commit('setLoading', false)
      })
    },
    autoSignin ({commit}, payload) {
      commit('setUser', {
        id: payload.uid,
        registeredMeetups: [],
        fbKeys: {}
      })
    },
    logout ({commit}) {
      firebase.auth().signOut()
      commit('setUser', null)
    }
  },
  getters: {
    user (state) {
      return state.user
    },
    loadMembers (state) {
      return state.members
    }
  }
}
