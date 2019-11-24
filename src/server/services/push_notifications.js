
const admin = require('firebase-admin');

function getGoogleCredentials() {
  const googleCredentials = Buffer.from(process.env.GOOGLE_APPLICATION_CREDENTIALS_B64, 'base64').toString();
  const jsonGCredentials = JSON.parse(googleCredentials);
  return jsonGCredentials;
}

class PushNotificationsService {
  constructor() {
    const googleCredentials = getGoogleCredentials();
    this.app = admin.initializeApp({
      credential: admin.credential.cert(googleCredentials),
      databaseURL: 'https://myhealthapp-255602.firebaseio.com'
    });
    this.messaging = admin.messaging(this.app);
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
