import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-call-element',
  templateUrl: './call-element.component.html',
  styleUrls: ['./call-element.component.scss'],
})
export class CallElementComponent implements OnInit {
  @Input() callerName!: string;
  @Input() isParticipant!: boolean;
  @Input() isMini!: boolean;
  @Input() videoSource!: any;
  @Input() videoId!: number;

  videoEl: HTMLMediaElement | any;
  audioContext: any;
  isSet: boolean = false;
  isPlaying: boolean | any = false;
  randomNumber: number = 1;
  volHigh: boolean = false;
  interval: any;
  showOptionsBox: boolean = false;

  constructor() {
    this.randomNumber = Math.floor(Math.random() * (4 - 1 + 1) + 1);

    document.body.addEventListener('click', (e)=>{
      e.preventDefault();
      this.showOptionsBox = false;
      setTimeout(() => {
      }, 100);
    })
  }

  ngOnInit(): void {
    this.handleAudioVisualizer();
  }

  handleAudioVisualizer(isPlaying?: boolean) {
    if (isPlaying) this.isPlaying = isPlaying;
    setTimeout(() => {
      this.startAudioVisualizationSimulator();
    }, 500);
  }

  startAudioVisualizationSimulator() {
    clearInterval(this.interval);
    this.videoEl = document.querySelector(`.video-${this.videoId}`);
    if (this.videoEl) {
      if (!this.isSet) {
        this.videoEl.play();
      }
      this.audioVisualizationSimulator();
    }
  }

  audioVisualizationSimulator() {
    this.audioContext = new AudioContext();
    const numberOfNodes: any = 32;
    const data: any = new Uint8Array(numberOfNodes * 4);
    const analyserNode = new AnalyserNode(this.audioContext, {
      fftSize: Math.max(numberOfNodes * 4, 32),
      maxDecibels: -20,
      minDecibels: -80,
      smoothingTimeConstant: 0.8,
    });
    const UsrAg = navigator.userAgent;
    var stream = null;

    if (UsrAg.indexOf('Firefox') > -1) {
      stream = this.videoEl.mozCaptureStream();
    } else {
      stream = this.videoEl.captureStream();
    }

    var audioSrc = this.audioContext.createMediaStreamSource(stream);
    audioSrc.connect(analyserNode);

    this.interval = setInterval(() => {
      analyserNode.getByteFrequencyData(data);
      if ((data[8] / 255) * (1 + 8 / numberOfNodes) > 0.1) this.volHigh = true;
      else this.volHigh = false;
    }, 1);
  }

  toggleOptions(){
    setTimeout(() => {
      this.showOptionsBox = true;
    }, 50);
  }
}
