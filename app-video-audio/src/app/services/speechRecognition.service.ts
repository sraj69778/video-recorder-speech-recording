import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class SpeechRecognitionService {
    recognition: any;

    constructor(private zone: NgZone) {
        // Check for browser support
        const SpeechRecognition = (window as any).webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();

        // Set recognition parameters
        this.recognition.continuous = true;
        this.recognition.lang = 'en-US'; // Adjust the language as needed
        // this.recognition.lang = 'hi'; 

    }

    listen(): Observable<string> {
        return new Observable((observer) => {
            this.recognition.start();

            // When a result is recognized
            this.recognition.onresult = (event: any) => {
                this.zone.run(() => {
                    const transcript = event.results[event.resultIndex][0].transcript;
                    observer.next(transcript);
                });
            };

            // When recognition ends
            this.recognition.onend = () => {
                this.zone.run(() => {
                    observer.complete();
                });
            };

            // When there is an error
            this.recognition.onerror = (error: any) => {
                this.zone.run(() => {
                    observer.error(error);
                });
            };

            // Cleanup on unsubscribe
            return () => {
                this.recognition.stop();
            };
        });
    }
}
