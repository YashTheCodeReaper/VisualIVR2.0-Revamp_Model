import { Component, OnInit } from '@angular/core';
declare var window: any;

@Component({
  selector: 'app-record-audio-component',
  templateUrl: './record-audio-component.component.html',
  styleUrls: ['./record-audio-component.component.scss'],
})
export class RecordAudioComponentComponent implements OnInit {
  isRecordActive: boolean = false;
  peakHit: boolean = false;
  hitValue: number = 0;

  constructor() {
  }
  ngOnInit(): void {
    this.simulateVisualizer()
  }

  toggleRecording() {
    this.isRecordActive = !this.isRecordActive;
  }

  simulateVisualizer() {
    const audioCtx = new AudioContext();
    const numberOfNodes = 16;
    const data = new Uint8Array(numberOfNodes * 4);

    const analyserNode = new AnalyserNode(audioCtx, {
      fftSize: Math.max(numberOfNodes * 4, 32),
      maxDecibels: -20,
      minDecibels: -80,
      smoothingTimeConstant: 0.8,
    });

    const updateVisualizer = () => {
      requestAnimationFrame(updateVisualizer);

      analyserNode.getByteFrequencyData(data);
      if(data[0] > 120) this.peakHit = true;
      else this.peakHit = false;

      this.hitValue = 130 - data[0];
      if(this.hitValue < 1) this.hitValue = 10;
    }

    function startStream() {

      return navigator.mediaDevices
        .getUserMedia({ audio: true, video: false })
        .then((stream) => audioCtx.createMediaStreamSource(stream))
        .then((source) => {
          source.connect(analyserNode);
        })
        .then(updateVisualizer);
    }

    document.querySelector('.button')?.addEventListener('click', () => {
      audioCtx.resume();
      startStream();
    });
  }
}
