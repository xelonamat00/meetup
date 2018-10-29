<template>
    <v-dialog width="350px">
        <v-btn fab accent slot="activator">
            <v-icon>edit</v-icon>
        </v-btn>
        <v-card>
            <v-container>
                <v-layout row wrap>
                    <v-flex xs12>
                        <v-card-title>Edit Meetup</v-card-title>
                    </v-flex>
                </v-layout>
                <v-divider></v-divider>
                <v-layout row wrap>
                    <v-flex xs12>
                        <v-card-text>
                            <v-text-field
                            name="title"
                            label="Title"
                            id="title"
                            v-model="editedTitle"
                            required>
                            </v-text-field>
                        </v-card-text>
                        <v-text-field
                            name="description"
                            label="Description"
                            id="description"
                            v-model="editedDescription"
                            multi-line
                            required>
                            </v-text-field>
                    </v-flex>
                </v-layout>
                <v-divider></v-divider>
                <v-layout>
                    <v-layout row wrap>
                        <v-flex xs12>
                            <v-card-action>
                                <v-btn flat class="blue--text darken-1">Close</v-btn>
                                <v-btn flat class="blue--text darken-1">Save</v-btn>
                            </v-card-action>
                        </v-flex>
                    </v-layout>
                </v-layout>
            </v-container>
        </v-card>
    </v-dialog>    
</template>


<script>
    export default {
        props: ['meetup'],
        data () {
            return {
                editedTitle: '',
                editedDescription: ''
            }
        }
    }
</script>