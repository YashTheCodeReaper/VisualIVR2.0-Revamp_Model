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

  constructor() {}
  ngOnInit(): void {
    this.simulateVisualizer();
  }

  toggleRecording() {
    this.isRecordActive = !this.isRecordActive;
  }

  simulateVisualizer() {
    const audioCtx = new AudioContext();
    const numberOfNodes: any = 32;
    const data: any = new Uint8Array(numberOfNodes * 4);
    const elVisualizer: any = document.querySelector('.visualizer');

    const elNodes = Array.from({ length: numberOfNodes }, (n: any, i: any) => {
      let node = document.createElement('div');
      node.className = 'node';
      elVisualizer.appendChild(node);
      return node;
    });

    const analyserNode = new AnalyserNode(audioCtx, {
      fftSize: Math.max(numberOfNodes * 4, 32),
      maxDecibels: -20,
      minDecibels: -80,
      smoothingTimeConstant: 0.8,
    });

    const updateVisualizer = () => {
      requestAnimationFrame(updateVisualizer);
      analyserNode.getByteFrequencyData(data);

      elNodes.forEach((node: any, i: any) => {
        node.style.setProperty('--level', this.isRecordActive ? (data[i] / 255) * (1 + i / numberOfNodes) : '0.0833');
      });
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

    document.querySelector('.record-stop-button')?.addEventListener('click', () => {
      audioCtx.resume();
      startStream();
    });
  }
}
