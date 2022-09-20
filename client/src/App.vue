<template>
    <formAuth v-bind:user="user" v-bind:server="server" v-bind:defaultHeders="defaultHeders" />
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
