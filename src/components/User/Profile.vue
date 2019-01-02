<template>
  <v-container>
    <v-layout justify-center>
    <v-flex xs12 sm10>
      <!-- <button @click="tampilkanNama()">tampilkan nama</button> -->
      <!-- {{displayName}} -->
      <!-- {{valueData()}} -->
      <!-- {{dataRegistered}} -->
      <!-- {{data}} -->
      <!-- <ul id="example-1">
        <li v-for="item in data" :key="item.id" >
          {{ data}}
        </li>
     </ul> -->
      <!-- <p>{{ new }}</p> -->
      <!-- {{users()}} -->
      <!-- {{tempData}} -->
      <v-card>
        <v-img
            src="https://images.pexels.com/photos/933964/pexels-photo-933964.jpeg?cs=srgb&dl=adolescent-adult-blur-933964.jpg&fm=jpg"
            height="300px"
          >
            <v-layout
              column
              fill-height
            >
              <v-card-title>
                <v-spacer></v-spacer>
                <!-- <v-btn dark icon class="mr-3">
                  <v-icon>edit</v-icon>
                </v-btn> -->
              </v-card-title>
              <v-spacer></v-spacer>
              <v-card-title class="white--text pt-5">
                <div class="display-1 pt-5">{{displayName}}</div>
              </v-card-title>

            </v-layout>
          </v-img>
        <!-- Expansion Panel -->
        
          <v-card>
            <v-divider></v-divider>
            <!-- <v-card-text v-text="lorem"></v-card-text> -->
            <!-- list meetup -->
            <v-layout row>
                <v-flex>
                  <v-tabs>
                    <v-tab class="">
                      Meetups
                    </v-tab>
                
                    <v-tab>
                      My Meetup
                    </v-tab>
                    <!-- Tab Pertama -->
                    <v-tab-item>
                      <v-list two-line>
                        <v-list-tile
                          v-for="item in meetups"
                          :key="item.title"
                          avatar
                          @click="$router.push('meetups/' + item.id)"
                        >
                          <v-list-tile-avatar>
                            <img :src="item.imageUrl">
                          </v-list-tile-avatar>
                          <v-list-tile-content>
                              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                              <v-list-tile-sub-title><span class="deep-purple--text">{{ item.date | date }}</span> - {{ item.description }}</v-list-tile-sub-title>
                            </v-list-tile-content>
                        </v-list-tile>
                      </v-list>
                    </v-tab-item>
                    <!-- Tab Kedua -->
                    <v-tab-item>
                      <v-list two-line>
                        <v-list-tile
                          v-for="item in myMeetups"
                          :key="item.title"
                          avatar
                          
                        >
                          <v-list-tile-avatar>
                            <img :src="item.imageUrl">
                          </v-list-tile-avatar>
                          <v-list-tile-content>
                              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                              <v-list-tile-sub-title><span class="deep-purple--text">{{ item.date | date }}</span> - {{ item.description }}</v-list-tile-sub-title>
                            </v-list-tile-content>
                            <v-list-tile-action>
                              <v-btn icon ripple @click="$router.push('meetups/' + item.id)">
                                <v-icon color="light-green lighten-2">remove_red_eye</v-icon>
                              </v-btn>
                            </v-list-tile-action>
                            <v-list-tile-action>
                              <v-btn icon ripple @click="deleteMeetup(item.id)">
                                <v-icon color="red">delete</v-icon>
                              </v-btn>
                            </v-list-tile-action>
                        </v-list-tile>
                      </v-list>
                    </v-tab-item>
                  <!-- My Meetup -->
                  </v-tabs>
                </v-flex>
            </v-layout>
          </v-card>
      </v-card>
    </v-flex>
  </v-layout>
  </v-container>
</template>

<script>
import moment from 'moment'
import * as firebase from 'firebase'
import {mapActions} from 'vuex'

  export default {
    data () { 
      return {
        // items: [],
        // dataRegistered: [],
        // tempData: []
      }
    },
    computed: {
      displayName() {
        return firebase.auth().currentUser.displayName
      },
      meetups() {
        return this.$store.getters.loadedMeetupsProfile
      },
      myMeetups() {
        return this.$store.getters.loadedMyMeetupsProfile
      }
    },
    created() {
      this.$store.dispatch('loadMeetupProfile')
      this.$store.dispatch('loadMyMeetupProfile')
    },
    // created() {
    //   // console.log(this.$store.getters.user.fbKeys)
    //   const key = this.$store.getters.user.registeredMeetups
    //   const uid = this.$store.getters.user.id
    //   var rootRef = firebase.database().ref()
    //   rootRef.child('meetups').once('value').then(snapshot =>{
    //     key.forEach(element => {
    //       let smoothie = snapshot.val()[element]
    //       smoothie.id = element
    //       this.data.push(smoothie)
    //     })
        // snapshot.forEach(doc =>  {
        //   if(snapshot.val()[doc.key].creatorId == uid) {
        //     let registered = snapshot.val()[doc.key]
        //     registered.id = doc.key
        //     this.dataRegistered.push(registered)
        //   }
        // })        
    //   })
    // },
    methods: {
      deleteMeetup(id) {
        var result = confirm('Delete this Meetup ?')
        if(!result){
          return
        }
        this.$store.dispatch('deleteMyMeetup', id)
        this.$store.dispatch('loadMeetups')
      },
    },
  }
</script>