// curl -X POST --header "Authorization: key=AAAAhmWcgyI:APA91bGC7jtDxaH7tQsFH-zwjiNlwosbDPrvjuFBOlMTiyS60PbIq0aNy_I0-GwPWgVSQvQW2TesbgQdmAqvzr5dtLhE1dgfNMeGR4ijM1pidzNS_0TVifqpAI0PWN77LOSxZMOwvtem" --Header "Content-Type:application/json" https://fcm.googleapis.com/fcm/send -d "{\"to\":\"ftNQTdCWHEk:APA91bFkAp3T_8xtAPr2MWcnZOUN_2B6Uhe74oMD8xGtYgzZ9lsm7S4S6dTWY_YmnjO5Wo7auTtIkTtb0XBqQNrHoYdnbBIGYZMZQbB4gvrLUs49m9jCYveWzMpBwIhIV5QHkriomgVX\",\"data\":{\"notification\":{\"body\":\"Are you coming to our party?\",\"title\":\"This is a tester tester\",\"confirm\":\"https://developers.google.com/web/\",\"decline\":\"https://www.yahoo.com/\"}},\"priority\":10}"

// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
/** 
 * import firebase
 * import firebase message
 */

importScripts('https://www.gstatic.com/firebasejs/4.6.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.6.0/firebase-messaging.js');

/**
 * Initialize the Firebase app in the service worker by passing in the
 * [messagingSenderId]
 */

firebase.initializeApp({
  'messagingSenderId': ''
});

/**
 * define message const
 */

const messaging = firebase.messaging();

/**
 * --- Installs service worker ---
 */

self.addEventListener('install', (event) => {
  console.log('Service worker installed');
});

/**
 * --- user click notification ---
 * --- get notification object ---
 * use event.notification.data
 */

self.addEventListener('notificationclick', (event) => {
  // Event actions derived from event.notification.data from data received
  var eventURL = event.notification.data;
  event.notification.close();
  if (event.action === 'confirmAttendance') {
    clients.openWindow(eventURL.confirm);
  } else if (event.action === 'cancel') {
    clients.openWindow(eventURL.decline);
  } else {
    clients.openWindow(eventURL.open);
  }
}, false);

/**
 * --- received message(Background) ---
 * [CUSTOM] dont put notification element in payload
 * --- payload must be like this ---
 * payload : {
 *  data: {
 *    ...
 *    notification: {
 *      title: ''
 *      body: ''
 *    }
 *    ...
 *  }
 * }
 */

messaging.setBackgroundMessageHandler((payload) => {
  let data = JSON.parse(payload.data.custom_notification);
  let notificationTitle = data.title;
  let notificationOptions = {
    body: data.body,
    icon: 'https://image.flaticon.com/icons/png/128/107/107822.png',
    // options event
    actions: [
      {action: 'confirmAttendance', title: '👍 Confirm attendance'},
      {action: 'cancel', title: '👎 Not coming'}
    ],
    // For additional data to be sent to event listeners, needs to be set in this data {}
    data: {confirm: data.confirm, decline: data.decline, open: data.open}
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});