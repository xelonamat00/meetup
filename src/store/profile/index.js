import * as firebase from 'firebase'

export default {
  state: {
    data: [],
    dataRegistered: []
    // key: this.$store.getters.registeredMeetups
  },
  getters: {
    loadedMeetupsProfile (state) {
      return state.data.sort((meetupA, meetupB) => {
        return meetupA.date > meetupB.date
      })
    },
    loadedMyMeetupsProfile (state) {
      return state.dataRegistered.sort((meetupA, meetupB) => {
        return meetupA.date > meetupB.date
      })
    }
  },
  mutations: {
    loadMeetupProfile: (state, payload) => {
      state.data = payload
    },
    loadMyMeetupProfile: (state, payload) => {
      state.dataRegistered = payload
    },
    deleteMyMeetup: (state, payload) => {
      state.dataRegistered = state.dataRegistered.filter(entry => {
        return entry.id !== payload
      })
    }
  },
  actions: {
    loadMeetupProfile: ({commit, getters}) => {
      const key = getters.user.registeredMeetups
      // const uid = getters.user.id
      var rootRef = firebase.database().ref()
      rootRef.child('meetups').once('value').then(snapshot => {
        const tempData = []
        key.forEach(element => {
          let smoothie = snapshot.val()[element]
          smoothie.id = element
          tempData.push(smoothie)
        })
        commit('loadMeetupProfile', tempData)
      }).catch(error => {
        console.log(error)
      })
    },
    loadMyMeetupProfile: ({commit, getters}) => {
      const uid = getters.user.id
      var rootRef = firebase.database().ref()
      rootRef.child('meetups').once('value').then(snapshot => {
        const tempData = []
        snapshot.forEach(doc => {
          if (snapshot.val()[doc.key].creatorId === uid) {
            let registered = snapshot.val()[doc.key]
            registered.id = doc.key
            tempData.push(registered)
          }
        })
        commit('loadMyMeetupProfile', tempData)
      }).catch(error => {
        console.log(error)
      })
    },
    deleteMyMeetup: ({commit}, payload) => {
      firebase.database().ref('users').once('value')
      .then(snapshot => {
        snapshot.forEach(childSnap => {
          childSnap.forEach(outerChild => {
            outerChild.forEach(innerChild => {
              const key = innerChild.val()
              if (key === payload) {
                firebase.database().ref('/users/' + childSnap.key + '/registrations/').child(innerChild.key)
                .remove()
              }
            })
          })
        })
        firebase.database().ref('meetups').child(payload).remove()
        commit('deleteMyMeetup', payload)
      }).catch(error => {
        console.log(error)
      })
    }
  }

}
