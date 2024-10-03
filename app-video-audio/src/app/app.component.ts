import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { SpeechRecognitionService } from 'src/app/services/speechRecognition.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
  title = 'app-video-audio';
  transcript: string = '';
  subscription: any;

  disableButton: boolean = false;
  @ViewChild('target') target!: ElementRef;
  @ViewChild('speechToText') speechToText!: ElementRef;

  constructor(private speechService: SpeechRecognitionService) { }

  startListening() {
    this.disableButton = true;
    this.subscription = this.speechService.listen().subscribe(
      (text: string) => {
        this.transcript += text + ' ';
        this.speechToText.nativeElement.value = this.transcript;

        console.log(this.transcript);

      },
      (error) => {
        console.error('Error with speech recognition', error);
      },
      () => {
        console.log('Speech recognition complete');
      }
    );
  }

  stopListening() {
    this.disableButton = false;

    this.subscription.unsubscribe();
  }
  constraints = {
    video: true,
    audio: true
  }
  src: any;
  // Instantiate a Video.js player OnInit
  ngOnInit() {
    // console.log(this.recognition);


  }

  ngAfterViewInit(): void {
    navigator.mediaDevices.getUserMedia(this.constraints).then((stream: any) => {
      // this.target.nativeElement.muted = true
      this.target.nativeElement.srcObject = stream
    })
  }


  // Dispose the player OnDestroy
  ngOnDestroy() {

  }




}
