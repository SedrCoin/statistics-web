import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';


import { routes } from './app-routing.module';
import { provideHttpClient } from '@angular/common/http';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';


const firebaseConfig = {
	apiKey: "AIzaSyCIS00p2LLGxXaQeGBOdIFME07mh-syLCw",
	authDomain: "webstatistics-f05f5.firebaseapp.com",
	projectId: "webstatistics-f05f5",
	storageBucket: "webstatistics-f05f5.appspot.com",
	messagingSenderId: "395657485680",
	appId: "1:395657485680:web:9d04e8d0e4e3f424bc83b5",
	measurementId: "G-BVN24R9M4G"
};


export const appConfig: ApplicationConfig = {
	providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideHttpClient(),
		provideFirebaseApp(() => initializeApp(firebaseConfig)),
		provideAuth(() => getAuth())
	]
};
