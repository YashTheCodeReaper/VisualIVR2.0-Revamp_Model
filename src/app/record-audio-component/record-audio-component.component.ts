import { CommonService } from './../services/common.service';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import * as RecordRTC from 'recordrtc';
import { Subscription, timer } from 'rxjs';

@Component({
  selector: 'app-record-audio-component',
  templateUrl: './record-audio-component.component.html',
  styleUrls: ['./record-audio-component.component.scss'],
})
export class RecordAudioComponentComponent implements OnInit {
  isRecordActive: boolean = false;
  peakHit: boolean = false;
  hitValue: number = 0;
  timerSub!: Subscription;
  currSecond: string = '00';
  currMin: string = '00';
  currHour: string = '00';
  recorder: any;
  currSize: string = '0.00';
  currFileName: string = '';
  sizeCounter: any;
  filesToUpload: any[] = [];
  stream: any;
  recordAudioConfig: any;
  showWarnInfo: boolean = false;
  warnMessage: string = '';
  warnIcon: string = 'warning';

  constructor(private sanitizer: DomSanitizer, private commonService: CommonService) {
    this.recordAudioConfig = this.commonService.applicationConfig.recordAudioComponent;
  }

  ngOnInit(): void {
    this.simulateVisualizer();
  }

  async toggleRecording() {
    if (!this.recordAudioConfig.allowMultipleRecording.enable && this.filesToUpload.length) {
      this.showWarnInfo = true;
      this.warnMessage = `Multiple recordings are not allowed!`;
      return;
    } else if (
      this.recordAudioConfig.allowMultipleRecording.enable &&
      this.filesToUpload.length >= this.recordAudioConfig.allowMultipleRecording.maxLimit
    ) {
      this.showWarnInfo = true;
      this.warnMessage = `Maximum of ${this.recordAudioConfig.allowMultipleRecording.maxLimit} could only be recorded!`;
      return;
    }
    if (this.isRecordActive) {
      this.recorder.stopRecording(async () => {
        let blob = await this.recorder.getBlob();
        console.log(blob);
        const fileName = encodeURIComponent(
          'audioRecord_' +
            new Date().getTime() +
            `.${this.recordAudioConfig.defaultMime.split('/')[1]}`
        );
        const duration = this.currSecond;
        this.filesToUpload.push({
          blob: blob,
          blobURL: this.getBlobURL(blob),
          duration: duration,
          title: fileName,
          size: (blob.size / 1000000).toFixed(2),
        });
        this.resetTimer();
      });
      this.stopStream();
      this.currFileName = '';
      this.currSize = '0.00';
      clearInterval(this.sizeCounter);
    }
    this.isRecordActive = !this.isRecordActive;
    if (this.isRecordActive) {
      this.currFileName = encodeURIComponent(
        'audioRecord_' +
          new Date().getTime() +
          `.${this.recordAudioConfig.defaultMime.split('/')[1]}`
      );
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      this.recorder = new RecordRTC(this.stream, {
        type: 'audio',
        recorderType: RecordRTC.MediaStreamRecorder,
        timeSlice: 1000,
        mimeType: this.recordAudioConfig.defaultMime,
        audioBitsPerSecond: this.recordAudioConfig.bitsPerSecond,
      });
      this.recorder.startRecording();
    }

    this.sizeCounter = setInterval(() => {
      var internal = this.recorder.getInternalRecorder();
      if (internal && internal.getArrayOfBlobs) {
        var blob = new Blob(internal.getArrayOfBlobs(), {
          type: this.recordAudioConfig.defaultMime,
        });
        this.currSize = (blob.size / 1000000).toFixed(2);
      }
    }, 1000);
  }

  async stopRecording() {
    this.isRecordActive = false;
    this.recorder.stopRecording();
    this.stopStream();
    this.resetTimer();
    this.currFileName = '';
    this.currSize = '0.00';
    clearInterval(this.sizeCounter);
  }

  stopStream() {
    if (this.stream) {
      this.stream.getAudioTracks().forEach((track: any) => track.stop());
      this.stream = null;
    }
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
        node.style.setProperty(
          '--level',
          this.isRecordActive ? (data[i] / 255) * (1 + i / numberOfNodes) : '0.0833'
        );
      });
    };

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
      if (this.isRecordActive) this.timerCount();
    });
  }

  timerCount() {
    this.timerSub = timer(1000, 1000).subscribe((val) => {
      const totalSeconds = val + 1;
      this.currHour = Math.floor(totalSeconds / 3600)
        .toString()
        .padStart(2, '0');
      this.currMin = Math.floor((totalSeconds % 3600) / 60)
        .toString()
        .padStart(2, '0');
      this.currSecond = Math.floor((totalSeconds % 3600) % 60)
        .toString()
        .padStart(2, '0');
    });
  }

  resetTimer() {
    this.currHour = '00';
    this.currMin = '00';
    this.currSecond = '00';
    this.timerSub.unsubscribe();
  }

  removeFile(index: number) {
    this.filesToUpload.splice(index, 1);
  }

  getBlobURL(blob: any) {
    return this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob));
  }

  onCatchResult(result: boolean) {
    this.showWarnInfo = false;
    this.warnMessage = '';
  }
}
