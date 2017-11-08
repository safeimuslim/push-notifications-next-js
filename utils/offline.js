/**
 * Safei Muslim
 * Yogyakarta , 10 Oktober 2017
 * PT Skyshi Digital Indonesa
 */

/**
 * import depedencies
 */
import * as firebase from 'firebase'
import localforage from 'localforage'

if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  /**
   * config options fcm
   */
  const config = {
    apiKey: '',
    authDomain: '',
    databaseURL: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: ''
  }
  /**
   * initializaation firebase
   */
  firebase.initializeApp(config)
  /**
   * initializaation firebase messaging
   */
  const messaging = firebase.messaging()

  /**
   * On load register service worker
   */
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').then((registration) => {
      /**
       * Successfully registers service worker
       */
      messaging.useServiceWorker(registration)
    })
      .then(() => {
        /**
         * request permission
         */
        return messaging.requestPermission()
      })
      .then(() => {
        /**
         * request token
         */
        return messaging.getToken()
      })
      .then((token) => {
        /**
         * save token to local storage, use when user login/register
         */
        localforage.setItem('FCM_TOKEN', token)
      })
      .catch((err) => {
        /**
         * failed registration
         */
        console.log('ServiceWorker registration failed: ', err)
      })
  })

  /**
   * received message when web active(Foreground)
   */
  messaging.onMessage(function (payload) {
    console.log('Message received. ', payload)
  })
}