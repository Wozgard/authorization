<template>
    <formAuth v-bind:user="user" v-bind:server="server" v-bind:defaultHeders="defaultHeders" v-bind:regSubTitle="regSubTitle" />
</template>

<script>
import formAuth from '@/components/reg/reg.vue';

export default {
    name: 'App',
    data() {
        return {
            defaultHeders: {
                'Content-Type': 'application/json'
            },
            user: {
                login: '',
                mail: '',
                password: ''
            },
            server: [
                '/user/create'
            ],
            regSubTitle: [
                'or use your email for registration',
                'your name is too short',
                'mail must consist of a body, an @ sign and a dot',
                'passwords must be at least 6 characters, including a number, an uppercase letter, a lowercase letter and special characters',

            ]
        }
    },
    components: {
        formAuth
    }
}
</script>

<style lang="scss">
//import general styles
@import '@/components/styles/general.scss';
//import normalize style
@import '@/components/styles/null.scss';
//import for topics
@import '@/components/styles/h.scss';
</style>
