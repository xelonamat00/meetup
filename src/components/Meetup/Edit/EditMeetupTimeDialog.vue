<template>
    <v-dialog width="350px" v-model="editDialog">
        <v-btn  accent slot="activator">
            Edit Time
        </v-btn>
        <v-card>
            <v-container>
                <v-layout row wrap>
                    <v-flex xs12>
                        <v-card-title>Edit Meetup Time</v-card-title>
                    </v-flex>
                </v-layout>
                <v-divider></v-divider>
                <v-layout row wrap>
                    <v-flex xs12>
                        
                    </v-flex>
                </v-layout>
                <v-divider></v-divider>
                <v-layout>
                    <v-layout row wrap>
                        <v-flex xs12>
                            <v-time-picker v-model="editableTime" style="width: 100%" actions format="24hr">
                                <v-btn
                                    class="blue--text darken-1"
                                    flat
                                    @click.native="editDialog = false">Close</v-btn>
                                <v-btn
                                    class="blue--text darken-1"
                                    flat
                                    @click.native="onSaveChanges">Save</v-btn>
                            </v-time-picker>
                        </v-flex>
                    </v-layout>
                </v-layout>
            </v-container>
        </v-card>
    </v-dialog>    
</template>

<script>
import moment from 'moment'
    export default {
        props: ['meetup'],
        data () {
            return {
                editDialog: false,
                editableTime: null
            }
        },
        // created: function() {
        //     const dateTime = moment()
        //     this.editableDate = dateTime.format('YYYY-MM-DD')
        //     // this.time = dateTime.format('HH:mm')
        // },
        methods: {
            onSaveChanges () {
                this.editDialog = false
                const newDate = new Date(this.meetup.date)
                const hours = this.editableTime.match(/^(\d+)/)[1]
                const minutes = this.editableTime.match(/:(\d+)/)[1]
                newDate.setHours(hours)
                newDate.setMinutes(minutes)
                this.$store.dispatch('updateMeetupData', {
                    id: this.meetup.id,
                    date: newDate
                })
            }
        },
        created () {
            this.editableTime = new Date(this.meetup.date)
        }
    }
</script>