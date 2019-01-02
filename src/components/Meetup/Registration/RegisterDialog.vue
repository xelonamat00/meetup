<template>
    <v-dialog width="350px" persistent v-model="registerDialog">
        <v-btn class="primary" accent slot="activator">
            {{userIsRegistered ? 'Unregister' : 'Register'}}
        </v-btn>
        <v-card>
            <v-container>
                <v-layout row wrap>
                    <v-flex xs12>
                        <!-- {{meetupTotal}} -->
                        <v-card-title v-if="userIsRegistered">Unregister from meetup ?</v-card-title>
                        <v-card-title v-else>Register from meetup ?</v-card-title>
                    </v-flex>
                </v-layout>
                <v-divider></v-divider>
                <v-layout row wrap>
                    <v-flex xs12>
                            <v-card-text>You can always change your desicion later on</v-card-text>
                    </v-flex>
                </v-layout>
                <v-divider></v-divider>
                <v-layout>
                    <v-layout row wrap>
                        <v-flex xs12>
                            <v-card-action>
                                <v-btn
                                class="red--text darken-1"
                                flat
                                @click.native="registerDialog = false">Cancel</v-btn>
                                <v-btn
                                class="green--text darken-1"
                                flat
                                @click.native="onAgree">Confirm</v-btn>
                            </v-card-action>
                        </v-flex>
                    </v-layout>
                </v-layout>
            </v-container>
        </v-card>
    </v-dialog>    
</template>

<script>
import moment from 'moment'
import * as firebase from 'firebase'

    export default {
        props: ['meetupId'],
        data () {
            return {
                registerDialog: false
            }
        },
        computed: {
            userIsRegistered () {
                return this.$store.getters.user.registeredMeetups.findIndex(meetupId => {
                    return meetupId === this.meetupId
                }) >= 0
            },
            meetup () {
                return this.$store.getters.loadedMeetup(this.meetupId)
            }
        },
        methods: {
            onAgree () {
                this.registerDialog = false
                if (this.userIsRegistered) {
                    this.$store.dispatch('unregisterUserFromMeetup', this.meetupId)
                    this.meetup.total -= 1
                    firebase.database().ref('meetups/' + this.meetupId).update({total: this.meetup.total})
                } else {
                    this.$store.dispatch('registerUserForMeetup', this.meetupId)
                    // var updateData = {total: payload.total}
                    // var updates = {}
                    // updates['/meetups/' + payload.id] = updateData
                    // this.meetupTotal += 1
                    this.meetup.total += 1
                    firebase.database().ref('meetups/' + this.meetupId).update({total: this.meetup.total})
                }
            },
            
        }
    }
</script>