<template>
    <v-dialog width="350px" v-model="editDialog">
        <v-btn  accent slot="activator">
            Edit Date
        </v-btn>
        <v-card>
            <v-container>
                <v-layout row wrap>
                    <v-flex xs12>
                        <v-card-title>Edit Meetup Date</v-card-title>
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
                            <v-date-picker v-model="editableDate" style="width: 100%" actions>
                                <v-btn
                                    class="blue--text darken-1"
                                    flat
                                    @click.native="editDialog = false">Close</v-btn>
                                <v-btn
                                    class="blue--text darken-1"
                                    flat
                                    @click.native="onSaveChanges">Save</v-btn>
                            </v-date-picker>
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
                editableDate: null
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
                const newDay = new Date(this.editableDate).getUTCDate()
                const newMonth = new Date(this.editableDate).getUTCMonth()
                const newYear = new Date(this.editableDate).getUTCFullYear()
                newDate.setUTCDate(newDay)
                newDate.setUTCMonth(newMonth)
                newDate.setUTCFullYear(newYear)
                this.$store.dispatch('updateMeetupData', {
                    id: this.meetup.id,
                    date: newDate
                })
            }
        },
        created () {
            this.editableDate = new Date(this.meetup.date).toISOString().substr(0, 10)
        }
    }
</script>