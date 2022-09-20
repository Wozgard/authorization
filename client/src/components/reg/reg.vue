<template>
    <div class="auth__form reg-auth">
        <!-- We catch the submit to send the data manually -->
        <form name="reg" class="reg-auth__body" @submit.prevent="createUser">
            <h2 class="reg-auth__title">Create Account</h2>

            <div class="reg-auth__social-links">
                <a href="" class="reg-auth__link"><img src="@/assets/google.svg" alt=""></a>
                <a href="" class="reg-auth__link"><img src="@/assets/facebook.svg" alt=""></a>
                <a href="" class="reg-auth__link"><img src="@/assets/twitter.svg" alt=""></a>
                <a href="" class="reg-auth__link"><img src="@/assets/vkontakte.svg" alt=""></a>
            </div>
            <p class="reg-auth__sub-title">or use your email for registration</p>
            <!-- At focus red border around error filds delete -->
            <input @focus="ucorectRemove" v-model="user.login" name="userLogin" type="text" class="reg-auth__input" placeholder="Login">
            <input @focus="ucorectRemove" v-model="user.mail" name="userMail" type="email" class="reg-auth__input" placeholder="Email">
            <div class="reg-auth__pass">
                <input @focus="ucorectRemove" name="userPass" type="password" class="reg-auth__input" placeholder="Password">
                <!-- Button for show & hide password -->
                <div @click="showHidePass" id="passHidde" class="reg-auth__passHidden"></div>
            </div>
            <div class="reg-auth__pass">
                <input @focus="ucorectRemove" name="userPass" type="password" class="reg-auth__input" placeholder="Repeat password">
                <!-- Button for show & hide password -->
                <div @click="showHidePass" id="passHidde" class="reg-auth__passHidden"></div>
            </div>

            <div class="reg-auth__buttons-box">
                <button type="submit" class="reg-auth__button">Sing Up</button>
                <button type="button" class="reg-auth__button _singin">Sing In</button>
            </div>
        </form>
    </div>
</template>

<script>
import { isMobile } from '@/components/scripts/mobile.js';

export default {
    props: {
        user: Object,
        server: Object,
        defaultHeders: Object
    },
    methods: {
        createUser() {
            const user = this.user;

            /* Delete probels */
            for (let i in user) {
                user[i] = user[i].trim();
            }

            console.log(user)

            /* Checking filds & Send request*/
            if (this.checkCorrectFilds()) {
                window.addEventListener('keydown', k => {
                    console.log(k);
                    if (k.key === 'Enter') {
                        k.prevenDefault();
                    }
                })
                const regButton = document.querySelector('.reg-auth__button');
                regButton.setAttribute('disabled', '');
                regButton.classList.add('_done');

                //Send to server
                this.sendData(user, this.server[0], 'POST');
            }

        }, checkCorrectFilds() {
            const user = this.user;

            //Counter of errors in filds
            let countUncor = 0;

            //Ckecking Login
            if (user.login.length < 3) {
                countUncor++;
                document.querySelector('[name = "userLogin"]').classList.add('_uncorrect');
            }

            //Ckecking Email
            if (!this.validateEmail(user.mail)) {
                countUncor++;
                document.querySelector('[name = "userMail"]').classList.add('_uncorrect');
            }

            //Ckecking Password
            const userPassFilds = document.querySelectorAll('[name = "userPass"]');
            if (!this.validatePass(userPassFilds[0].value) || userPassFilds[0].value !== userPassFilds[1].value) {
                countUncor++;
                userPassFilds.forEach(i => {
                    i.classList.add('_uncorrect');
                });
            }

            // Add password to odject user Amal@777
            user.password = userPassFilds[0].value;

            /* Return */
            if (countUncor === 0) {
                return true
            }
            else {
                return false
            }
        },
        ucorectRemove(e) {
            const element = e.target;
            const regButton = document.querySelector('.reg-auth__button');

            //remove the highlight from the fields
            if (element.classList.contains('_uncorrect')) {
                element.classList.remove('_uncorrect');
            }

            //remove the disable from the button
            element.addEventListener('keydown', () => {
                regButton.removeAttribute('disabled');
                regButton.classList.remove('_done');
            });
        },
        validateEmail(email) {
            const pattern = /^[\w]{1}[\w-\.]*@[\w-]+\.[a-z]{2,4}$/i;
            return pattern.test(email);
        },
        validatePass(pass) {
            const pattern = /(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*]{6,}/g;
            return pattern.test(pass);
        },
        async sendData(data = null, url, method = 'GET', headers = this.defaultHeders) {
            try {
                let body;
                if (data) {
                    body = JSON.stringify(data);
                }
                const response = await fetch(url, {
                    method,
                    headers,
                    body
                });
                if (this.messageAnswerServer(response)) {
                    return response.json();
                } else {
                    return null;
                }
            }
            catch (e) {
                alert('Извините, похоже произошла ошибка! ', e.message);
            }
        },
        messageAnswerServer(res) {
            if (res.status == 400) {
                alert('Пожалуйста заполните все поля формы');
                return false;
            }
            if (res.status == 503) {
                alert('Извините, произошла какая-то ошибка на сервере. Попробуйте еще раз');
                return false;
            }
            if (res.status >= 200) {
                return true;
            }
        },
        showHidePass(e) {
            const target = e.target;
            const input = target.parentElement.querySelector('input');

            target.classList.toggle('_show');
            if (input.getAttribute('type') == 'password' && target.classList.contains('_show')) {
                input.setAttribute('type', 'text');
            }
            if (input.getAttribute('type') == 'text' && !target.classList.contains('_show')) {
                input.setAttribute('type', 'password');
            }
        }

    },
    mounted() {
        console.log(this.server[0])
        if (isMobile.any()) {
            const regFormContainer = document.forms['reg'].parentElement;
            regFormContainer.classList.add('_mobile');

            // checking mobile orientation
            if (window.innerWidth > window.innerHeight) {
                regFormContainer.classList.add('_horizontal');
            }

            window.addEventListener('orientationchange', () => {
                if (window.innerWidth < window.innerHeight) {
                    regFormContainer.classList.add('_horizontal');
                }
                if (window.innerWidth > window.innerHeight && regFormContainer.classList.contains('_horizontal')) {
                    regFormContainer.classList.remove('_horizontal');
                }
            })
        }

    }
}
</script>

<style lang="scss">
//import variables
@import '@/components/styles/variables.scss';
//import mixins
@import '@/components/styles/mixins.scss';
//import styles
@import 'style.scss';
//import media requests
@import 'media.scss';
</style>