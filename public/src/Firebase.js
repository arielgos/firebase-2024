import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const config = {
    apiKey: 'AIzaSyCPV2Vesx8iqp0Rudk_J48sqDwI3kpHGd0',
    authDomain: 'fir-2024-c22e8.firebaseapp.com',
    projectId: 'fir-2024-c22e8',
    storageBucket: 'fir-2024-c22e8.appspot.com',
    messagingSenderId: '1042501105313',
    appId: '1:1042501105313:web:1b152ddcada03732e6e2e0',
    measurementId: 'G-5JZY81497M'
}

const app = initializeApp(config)

export const firestore = getFirestore(app)
export const analytics = getAnalytics(app)
export const auth = getAuth(app)
