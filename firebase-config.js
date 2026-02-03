// Firebase Configuration for Karate Academy
// Configured with user's Firebase project

const firebaseConfig = {
    apiKey: "AIzaSyAjozWqZds5uNNtNge6fBkFJjBLDF1HD0o",
    authDomain: "karate-academy-13294.firebaseapp.com",
    databaseURL: "https://karate-academy-13294-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "karate-academy-13294",
    storageBucket: "karate-academy-13294.firebasestorage.app",
    messagingSenderId: "237731746798",
    appId: "1:237731746798:web:9ea6165440c96382e934ff",
    measurementId: "G-X4Q6XPHKDD"
};

// Initialize Firebase
let firebaseApp = null;
let database = null;

if (typeof firebase !== 'undefined') {
    try {
        firebaseApp = firebase.initializeApp(firebaseConfig);
        database = firebase.database();
        console.log('Firebase initialized successfully');
    } catch (error) {
        console.warn('Firebase initialization error:', error);
    }
} else {
    console.warn('Firebase SDK not loaded. Cross-device sync disabled.');
}

// Get settings from localStorage
function getSettings() {
    const stored = localStorage.getItem('karateSettings');
    if (stored) {
        return JSON.parse(stored);
    }
    return {
        siteName: 'Karate Academy',
        logoImage: '',
        logoIcon: 'fas fa-fist-raised',
        contactAddress: '',
        contactPhone: '',
        contactEmail: '',
        contactHours: ''
    };
}

// Get pricing from localStorage
function getPricing() {
    const stored = localStorage.getItem('karatePricing');
    if (stored) {
        return JSON.parse(stored);
    }
    return {
        beginner: { price: 49, discount: 0, features: ['Basic training videos', 'Beginner kata tutorials', 'Community access'] },
        advanced: { price: 89, discount: 0, features: ['All Beginner features', 'Advanced kata training', 'Kumite techniques', 'Priority support'] },
        elite: { price: 149, discount: 0, features: ['All Advanced features', '1-on-1 coaching sessions', 'Exclusive content', 'Personalized training plan'] }
    };
}

// Get payment sessions from localStorage
function getPaymentSessions() {
    const stored = localStorage.getItem('karatePaymentSessions');
    if (stored) {
        return JSON.parse(stored);
    }
    return { upi: true, banking: true, check: true, screenshot: true };
}

// Firebase helper functions
const firebaseSync = {
    isAvailable: () => database !== null,

    save: async (path, data) => {
        if (database) {
            try {
                await database.ref(path).set(data);
                console.log('Saved to Firebase:', path);
                return true;
            } catch (error) {
                console.error('Firebase save error:', error);
                return false;
            }
        }
        return false;
    },

    listen: (path, callback) => {
        if (database) {
            const ref = database.ref(path);
            ref.on('value', (snapshot) => {
                callback(snapshot.val());
            });
            return () => ref.off();
        }
        return () => {};
    },

    push: async (path, data) => {
        if (database) {
            try {
                const newRef = database.ref(path).push();
                await newRef.set(data);
                return newRef.key;
            } catch (error) {
                console.error('Firebase push error:', error);
                return null;
            }
        }
        return null;
    },

    update: async (path, data) => {
        if (database) {
            try {
                await database.ref(path).update(data);
                return true;
            } catch (error) {
                console.error('Firebase update error:', error);
                return false;
            }
        }
        return false;
    },

    remove: async (path) => {
        if (database) {
            try {
                await database.ref(path).remove();
                return true;
            } catch (error) {
                console.error('Firebase remove error:', error);
                return false;
            }
        }
        return false;
    }
};

// Auto-sync all karate data
const autoSync = {
    syncInterval: null,
    
    start: () => {
        if (!firebaseSync.isAvailable()) return;
        
        autoSync.syncInterval = setInterval(() => {
            autoSync.saveAll();
        }, 300000);
        
        console.log('Firebase auto-sync started');
    },
    
    stop: () => {
        if (autoSync.syncInterval) {
            clearInterval(autoSync.syncInterval);
        }
    },
    
    saveAll: () => {
        if (!firebaseSync.isAvailable()) return;
        
        const data = {
            videos: getVideos(),
            masters: getMasters(),
            champions: getChampions(),
            awarded: getAwarded(),
            features: getFeatures(),
            pricing: getPricing(),
            settings: getSettings(),
            paymentSessions: getPaymentSessions()
        };
        
        firebaseSync.save('karateApp', data);
        console.log('Auto-synced to Firebase');
    },
    
    loadAll: async () => {
        if (!firebaseSync.isAvailable()) return null;
        
        try {
            return await new Promise((resolve) => {
                firebaseSync.listen('karateApp', (data) => {
                    resolve(data);
                });
            });
        } catch (error) {
            console.error('Error loading from Firebase:', error);
            return null;
        }
    }
};

if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
        if (firebaseSync.isAvailable()) {
            autoSync.start();
        }
    });
}
