import { DomSanitizer } from '@angular/platform-browser';
import { CommonService } from './../services/common.service';
import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import * as RecordRTC from 'recordrtc';

@Component({
  selector: 'app-record-video-component',
  templateUrl: './record-video-component.component.html',
  styleUrls: ['./record-video-component.component.scss'],
})
export class RecordVideoComponentComponent implements OnInit {
  recording: boolean = true;
  stream: any;
  recordRTC: any;
  videoFile!: File;
  showRecorderBox: boolean = false;
  recordVideoConfig: any;
  maxHours: number = 0;
  maxMinutes: number = 0;
  maxSeconds: number = 0;
  currentHours: number = 0;
  currentMinutes: number = 0;
  currentSeconds: number = 0;
  counter = 0;
  filesToUpload: any[] = [];
  progress: number = 0;
  counterInterval: any;
  showWarnInfo: boolean = false;
  warnMessage: string = '';
  warnIcon: string = 'warning';
  showVideoPlayer: boolean = false;
  displaySourceIndex: number = 0;
  @ViewChild('videoSrc') videoSrc!: ElementRef;

  constructor(private commonService: CommonService, private sanitizer: DomSanitizer) {
    this.recordVideoConfig = this.commonService.applicationConfig.recordVideoComponent;
    this.maxHours = Math.floor(this.recordVideoConfig.defaultMaximumRecordSeconds / 3600);
    this.maxMinutes = Math.floor(
      (this.recordVideoConfig.defaultMaximumRecordSeconds - this.maxHours * 3600) / 60
    );
    this.maxSeconds =
      this.recordVideoConfig.defaultMaximumRecordSeconds -
      this.maxHours * 3600 -
      this.maxMinutes * 60;
  }

  ngOnInit(): void {
    this.videosuccessCallback.bind(this);
    this.videoerrorCallback.bind(this);
  }

  initCounter() {
    this.counterInterval = setInterval(() => {
      if (this.counter == this.recordVideoConfig.defaultMaximumRecordSeconds) {
        this.stopVideoRecording();
        this.showWarnInfo = true;
        this.warnMessage = `Video can only be recorded for atmost ${this.recordVideoConfig.defaultMaximumRecordSeconds} seconds`;
      }
      this.counter++;
      this.currentHours = Math.floor(this.counter / 3600);
      this.currentMinutes = Math.floor((this.counter - this.currentHours * 3600) / 60);
      this.currentSeconds = this.counter - this.currentHours * 3600 - this.currentMinutes * 60;
      this.progress = this.counter / this.recordVideoConfig.defaultMaximumRecordSeconds;
    }, 1000);
  }

  resetCounter() {
    clearInterval(this.counterInterval);
    this.counter = 0;
    this.currentHours = 0;
    this.currentMinutes = 0;
    this.currentSeconds = 0;
    this.progress = 0;
  }

  toggleRecorder() {
    if (!this.recordVideoConfig.allowMultipleRecording.enable && this.filesToUpload.length) {
      this.showWarnInfo = true;
      this.warnMessage = `Multiple recordings are not allowed!`;
      return;
    } else if (
      this.recordVideoConfig.allowMultipleRecording.enable &&
      this.filesToUpload.length >= this.recordVideoConfig.allowMultipleRecording.maxLimit
    ) {
      this.showWarnInfo = true;
      this.warnMessage = `Maximum of ${this.recordVideoConfig.allowMultipleRecording.maxLimit} could only be recorded!`;
      return;
    }
    this.showRecorderBox = !this.showRecorderBox;
    if (this.showRecorderBox) {
      setTimeout(() => {
        this.startVideoRecording();
      }, 50);
    } else {
      this.recordRTC.stopRecording();
      this.stopStream();
      this.resetCounter();
    }
  }

  stopStream() {
    if (this.stream) {
      this.stream.getVideoTracks().forEach((track: any) => track.stop());
      this.stream.getAudioTracks().forEach((track: any) => track.stop());
      this.stream = null;
    }
  }

  startVideoRecording() {
    try {
      const video: HTMLVideoElement = this.videoSrc.nativeElement;
      video.muted = true;
      video.controls = false;
      video.autoplay = true;
      this.recording = true;
      const mediaConstraints: MediaStreamConstraints & MediaTrackConstraints = {
        video: true,
        audio: true,
      };
      navigator.mediaDevices
        .getUserMedia(mediaConstraints)
        .then(this.videosuccessCallback.bind(this), this.videoerrorCallback.bind(this));
    } catch (error) {
      console.error('%c Error Occured in Start Video Recording - ', 'color: red', error);
    }
  }

  videosuccessCallback = (stream: MediaStream) => {
    try {
      const options: any = {
        type: 'video',
        recorderType: RecordRTC.MediaStreamRecorder,
        timeSlice: 1000,
        mimeType: this.recordVideoConfig.defaultMime,
        videoBitsPerSecond: this.recordVideoConfig.videoBitsPerSecond,
        audioBitsPerSecond: this.recordVideoConfig.audioBitsPerSecond,
      };
      this.stream = stream;
      this.recordRTC = new RecordRTC(stream, options);
      this.recordRTC.startRecording();
      const video: HTMLVideoElement = this.videoSrc.nativeElement;
      video.srcObject = stream;
      this.initCounter();
    } catch (error) {
      console.error('%c Error Occured in Video Sucess Callback - ', 'color: red', error);
    }
  };

  videoerrorCallback = (error: any) => {
    console.log(error);
  };

  stopVideoRecording = () => {
    try {
      if (this.counter < this.recordVideoConfig.defaultMinimumRecordSeconds) {
        this.recordRTC.stopRecording();
        this.stopStream();
        this.resetCounter();
        this.showRecorderBox = false;
        this.showWarnInfo = true;
        this.warnMessage = `Video should be recorded for atleast ${this.recordVideoConfig.defaultMinimumRecordSeconds} seconds`;
        return;
      }
      this.recording = false;
      this.recordRTC.stopRecording(this.processVideo.bind(this));
      this.stopStream();
    } catch (error) {
      console.error('%c Error Occured in Stop Video Processing - ', 'color: red', error);
    }
  };

  processVideo = async (videoUrl: any) => {
    try {
      const video: HTMLVideoElement | any = this.videoSrc?.nativeElement;
      const recordRTC = this.recordRTC;
      video.src = null;
      video.srcObject = null;
      video.src = videoUrl;
      const recordedBlob = await recordRTC.getBlob();
      console.log(recordedBlob);
      const fileName = encodeURIComponent(
        'videoRecord_' +
          new Date().getTime() +
          `.${this.recordVideoConfig.defaultMime.split('/')[1]}`
      );
      const duration = this.counter;
      this.filesToUpload.push({
        blob: recordedBlob,
        blobURL: this.getBlobURL(recordedBlob),
        duration: duration,
        title: fileName,
        size: (recordedBlob.size / 1000000).toFixed(2),
      });
      this.showRecorderBox = false;
      this.resetCounter();
    } catch (error) {
      console.error('%c Error Occured in Video processing - ', 'color: red', error);
    }
  };

  getBlobURL(blob: any) {
    return this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob));
  }

  onCatchResult(result: boolean) {
    this.showWarnInfo = false;
    this.warnMessage = '';
  }

  removeFile(index: number){
    this.filesToUpload.splice(index, 1)
  }

  toggleVideoPlayer(index: number){
    this.displaySourceIndex = index;
    this.showVideoPlayer = !this.showVideoPlayer;
  }
}
