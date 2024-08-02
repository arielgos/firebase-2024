import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const config = {
    
}

const app = initializeApp(config)

export const firestore = getFirestore(app)
export const analytics = getAnalytics(app)
export const auth = getAuth(app)
