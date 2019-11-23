
import { initializeApp, credential as _credential, messaging } from 'firebase-admin';

import serviceAccount from '../../../keys/serviceAccountKey.json';

class PushNotificationsService {
  constructor() {
    this.app = initializeApp({
      credential: _credential.cert(serviceAccount),
      databaseURL: 'https://myhealthapp-255602.firebaseio.com'
    });
    this.messaging = messaging();
    this.messaging.usePublicVapidKey('BCGG5rb6Rb9ujWRitZeZ7Bl99CaA4o6Hly_PrM4HCpdNdC4-Dqu21zEiYE-tira8dz2f_mbD0tjWAspNeMeaytE');
    this.options = {
      priority: 'high',
      timeToLive: 60 * 60 * 24
    };
  }

  sendPushNotification(registrationToken, payload) {
    return this.messaging.sendToDevice(registrationToken, payload, this.options);
  }
}

export default PushNotificationsService;
