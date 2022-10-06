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
            <p class="reg-auth__sub-title">{{regSubTitleNow}}</p>
            <!-- At focus red border around error filds delete -->
            <input @focus="ucorectRemove" @blure="focusRemove" v-model="user.login" name="userLogin" type="text" class="reg-auth__input" placeholder="Login">
            <input @focus="ucorectRemove" @blure="focusRemove" v-model="user.mail" name="userMail" type="email" class="reg-auth__input" placeholder="Email">
            <div class="reg-auth__pass">
                <input @focus="ucorectRemove" @blure="focusRemove" name="userPass" type="password" class="reg-auth__input" placeholder="Password">
                <!-- Button for show & hide password -->
                <div @click="showHidePass" id="passHidde" class="reg-auth__passHidden"></div>
            </div>
            <div class="reg-auth__pass">
                <input @focus="ucorectRemove" @blure="focusRemove" name="userPass" type="password" class="reg-auth__input" placeholder="Repeat password">
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
import '@/assets/eye.svg';
import '@/assets/hidden.svg';
import { isMobile } from '@/components/scripts/mobile.js';

export default {
    data() {
        return {
            // For lock create user with Enter
            unlockCreateUser: true,
            // For show required subtitle
            regSubTitleNow: this.regSubTitle[0]
        }
    },
    props: {
        user: Object,
        server: Array,
        defaultHeders: Object,
        regSubTitle: Array
    },
    methods: {
        createUser() {
            // For lock create user with Enter
            if (this.unlockCreateUser) {

                // Normalize subtitle
                document.querySelector('.reg-auth__sub-title').classList.remove('_uncorrectTitle')
                this.regSubTitleNow = this.regSubTitle[0];

                const user = this.user;

                /* Delete probels */
                for (let i in user) {
                    user[i] = user[i].trim();
                }

                /* Checking filds & Send request*/
                if (this.checkCorrectFilds()) {
                    document.querySelectorAll('._uncorrect').forEach(i => {
                        i.classList.remove('_uncorrect');
                    });


                    // Lock send second request
                    const regButton = document.querySelector('.reg-auth__button');
                    regButton.setAttribute('disabled', '');
                    regButton.classList.add('_done');
                    // Lock send with Enter
                    this.unlockCreateUser = false;

                    // Send to server
                    this.sendData(user, this.server[0], 'POST');
                }
            }
        }, checkCorrectFilds() {
            const user = this.user;

            // Subtitle
            const subtitle = document.querySelector('.reg-auth__sub-title');

            // Counter of errors in filds
            let countUncor = 0;

            // Ckecking Login
            if (user.login.length < 3) {
                countUncor++;
                subtitle.classList.add('_uncorrectTitle');
                this.regSubTitleNow = this.regSubTitle[1];
                document.querySelector('[name = "userLogin"]').classList.add('_uncorrect');
            }

            // Ckecking Email
            if (!this.validateEmail(user.mail)) {
                countUncor++;
                subtitle.classList.add('_uncorrectTitle');
                if (countUncor > 1) {
                    this.regSubTitleNow = this.regSubTitleNow + '; ' + this.regSubTitle[2];
                } else {
                    this.regSubTitleNow = this.regSubTitle[2];
                }
                document.querySelector('[name = "userMail"]').classList.add('_uncorrect');
            }

            // Ckecking Password
            const userPassFilds = document.querySelectorAll('[name = "userPass"]');
            if (!this.validatePass(userPassFilds[0].value) || userPassFilds[0].value !== userPassFilds[1].value) {
                countUncor++;
                subtitle.classList.add('_uncorrectTitle');
                if (countUncor > 1) {
                    this.regSubTitleNow = this.regSubTitleNow + '; ' + this.regSubTitle[3];
                } else {
                    this.regSubTitleNow = this.regSubTitle[3];
                }
                userPassFilds.forEach(i => {
                    i.classList.add('_uncorrect');
                });
            }


            /* Return */
            if (countUncor === 0) {
                // Add password to odject user Amal@777
                user.password = userPassFilds[0].value;
                return true
            }
            else {
                return false
            }
        },
        ucorectRemove(e) {
            const element = e.target;
            const regButton = document.querySelector('.reg-auth__button');

            // Add focus class for keydown listener
            element.classList.add('_focus');
            // Remove the highlight from the fields
            if (element.classList.contains('_uncorrect')) {
                element.classList.remove('_uncorrect');
            }

            // Remove the disable from the button
            if (this.unlockCreateUser === false) {
                element.addEventListener('keydown', k => {
                    if ((k.keyCode == 8 || (k.keyCode >= 46 && k.keyCode <= 90) || (k.keyCode >= 96 && k.keyCode <= 111) || (k.keyCode >= 186 && k.keyCode <= 222)) && k.key != "Enter") {
                        // For unlock create user
                        regButton.removeAttribute('disabled');
                        regButton.classList.remove('_done');
                        // For unlock create user with Enter
                        this.unlockCreateUser = true;
                    }
                });
            }
        },
        focusRemove(e) {
            const element = e.target;
            element.classList.remove('_focus');
        },
        /*  keyDownInForm() {
             const regForm = document.forms.reg;
             const inputs = regForm.querySelectorAll('input');
             inputs.forEach(i => {
                 i.addEventListener('keydown', k => {
                     console.log('yes');
                     console.log(this.unlockCreateUser);
                     if (!this.unlockCreateUser) {
                         if ((k.keyCode == 8 || (k.keyCode >= 46 && k.keyCode <= 90) || (k.keyCode >= 96 && k.keyCode <= 111) || (k.keyCode >= 186 && k.keyCode <= 222)) && k.key != "Enter") {
                             console.log("aaaaaaaa");
                             // Uncor remove
                             i.classList.remove('_uncorrect');
                             // For unlock create user
                             regButton.removeAttribute('disabled');
                             regButton.classList.remove('_done');
                             // For unlock create user with Enter
                             this.unlockCreateUser = true;
                         }
                     }
                 });
             });
 
         }, */
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
        // Event listener keydown to input in reg form
        //this.keyDownInForm()
        // On mobile
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
// Import variables
@import '@/components/styles/variables.scss';
// Import mixins
@import '@/components/styles/mixins.scss';
// Import styles
@import 'style.scss';
// Import media requests
@import 'media.scss';
</style>