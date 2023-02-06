import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import * as RecordRTC from 'recordrtc';

@Component({
  selector: 'app-record-video-component',
  templateUrl: './record-video-component.component.html',
  styleUrls: ['./record-video-component.component.scss'],
})
export class RecordVideoComponentComponent implements OnInit {
  recording: boolean = true;
  videoRecorded = false;
  stream: any;
  recordRTC: any;
  videoFile!: File;
  @ViewChild('videoSrc') videoSrc!: ElementRef;

  ngOnInit(): void {
    this.videosuccessCallback.bind(this);
    this.videoerrorCallback.bind(this);
    setTimeout(() => {
      // this.startVideoRecording();
    }, 200);
  }

  /**
   * Method to start video recording
   */
  startVideoRecording() {
    try {
      const video: HTMLVideoElement = this.videoSrc.nativeElement;
      video.muted = true;
      video.controls = false;
      video.autoplay = true;
      this.videoRecorded = false;
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

  /**
   * Method which handles video success callback
   * @param stream : stream of video success callback
   */
  videosuccessCallback = (stream: MediaStream) => {
    try {
      const options: any = {
        mimeType: 'video/webm', // or video/webm\;codecs=h264 or video/webm\;codecs=vp9
      };
      this.stream = stream;
      this.recordRTC = new RecordRTC(stream, options);
      this.recordRTC.startRecording();
      const video: HTMLVideoElement = this.videoSrc.nativeElement;
      video.srcObject = stream;
    } catch (error) {
      console.error('%c Error Occured in Video Sucess Callback - ', 'color: red', error);
    }
  };

  /**
   * Method to handle video capture error callback
   * @param error : video capture error
   */
  videoerrorCallback = (error: any) => {
    console.log(error);
  };

  /**
   * Method to stop video recording
   */
  stopVideoRecording = () => {
    try {
      this.recording = false;
      this.videoRecorded = true;
      const recordRTC = this.recordRTC;
      recordRTC.stopRecording(this.processVideo.bind(this));
      const stream = this.stream;
      stream.getAudioTracks().forEach((track: any) => track.stop());
      stream.getVideoTracks().forEach((track: any) => track.stop());
    } catch (error) {
      console.error('%c Error Occured in Stop Video Processing - ', 'color: red', error);
    }
  };

  /**
   * Method to process Captured video
   * @param audioVideoWebMURL : url of audioVideoWebM
   */
  processVideo = (audioVideoWebMURL: any) => {
    try {
      const video: HTMLVideoElement | any = this.videoSrc.nativeElement;
      const recordRTC = this.recordRTC;
      video.src = null;
      video.srcObject = null;
      video.src = audioVideoWebMURL;
      const recordedBlob = recordRTC.getBlob();
      recordRTC.getDataURL((dataURL: any) => {});
    } catch (error) {
      console.error('%c Error Occured in Video processing - ', 'color: red', error);
    }
  };
}
