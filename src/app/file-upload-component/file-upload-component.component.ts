import { Component, OnInit } from '@angular/core';
declare var document: any;
@Component({
  selector: 'app-file-upload-component',
  templateUrl: './file-upload-component.component.html',
  styleUrls: ['./file-upload-component.component.scss'],
})
export class FileUploadComponentComponent implements OnInit {
  dragEntered: boolean = false;
  filesToUpload: any[] = [];
  showWarnInfo: boolean = false;
  warnMessage: string = '';
  warnIcon: string = 'warning';
  urlToFetch: string = '';
  constructor() {}

  ngOnInit(): void {
    this.initiateSlider();
  }

  initiateSlider() {
    const sliders = document.querySelectorAll('.info-slider');
    const sliderDots = document.querySelectorAll('.slider-dot');
    const slidersFlex = document.querySelector('.info-sliders-flex');
    const maxSlideCount = sliders.length;
    let slideCount = 0;

    const goToSlider = function (index: number) {
      slidersFlex.style.transform = `translateX(-${12 * index}rem)`;
      sliderDots.forEach((el: any) => {
        el.classList.remove('active-dot');
      });
      document.querySelector(`.slider-dot-${index}`).classList.add('active-dot');
    };

    goToSlider(0);

    setInterval(() => {
      if (slideCount >= maxSlideCount - 1) {
        slideCount = 0;
      } else {
        slideCount++;
      }
      goToSlider(slideCount);
    }, 2000);
  }

  onDrop(event: any) {
    event.preventDefault();
    this.dragEntered = false;
    Object.keys(event.dataTransfer.files).forEach((key: any) => {
      if (event.dataTransfer.files[key].size > 2000000) {
        this.showWarnInfo = true;
        this.warnMessage = 'Maximum allowed file size is 2mb!';
        return;
      } else if (
        event.dataTransfer.files[key].name.split('.').pop() != 'mp3' &&
        event.dataTransfer.files[key].name.split('.').pop() != 'pdf' &&
        event.dataTransfer.files[key].name.split('.').pop() != 'csv' &&
        event.dataTransfer.files[key].name.split('.').pop() != 'jpeg' &&
        event.dataTransfer.files[key].name.split('.').pop() != 'png'
      ) {
        this.showWarnInfo = true;
        this.warnMessage = 'Files containing extensions .mp3, .pdf, .csv, .jpeg and .png are only allowed to upload!';
        return;
      }
      this.filesToUpload.push(
        new File([event.dataTransfer.files[key]], event.dataTransfer.files[key].name, {
          type: event.dataTransfer.files[key].type,
        })
      );
    });

    console.log(this.filesToUpload);
  }

  getFileIcon(fileType: any): string {
    if (fileType.split('/')[1] == 'pdf') return 'picture_as_pdf';
    switch (fileType.split('/')[0]) {
      case 'audio':
        return 'library_music';
      case 'video':
        return 'movie_creation';
      case 'image':
        return 'image';
      case 'text':
        return 'text_fields';
      default:
        return 'attach_file';
    }
  }

  removeFile(index: number) {
    this.filesToUpload.splice(index, 1);
  }

  onCatchResult(result: boolean) {
    this.showWarnInfo = false;
    this.warnMessage = '';
  }

  fetchFile() {
    if (
      this.urlToFetch.split('.').pop() != 'mp3' &&
      this.urlToFetch.split('.').pop() != 'pdf' &&
      this.urlToFetch.split('.').pop() != 'csv' &&
      this.urlToFetch.split('.').pop() != 'jpeg' &&
      this.urlToFetch.split('.').pop() != 'png'
    ) {
      this.showWarnInfo = true;
      this.warnMessage = 'Files containing extensions .mp3, .pdf, .csv, .jpeg and .png are only allowed to upload!';
      return;
    }
    var request = new XMLHttpRequest();
    request.open('GET', `https://${this.urlToFetch}`, true);
    request.responseType = 'blob';
    request.onload = () => {
      const fileType = request.response.type;
      var reader = new FileReader();
      reader.readAsDataURL(request.response);
      reader.onload = (e: any) => {
        fetch(e.target.result)
          .then((res) => res.blob())
          .then((blob) => {
            const file = new File(
              [blob],
              `VisualIVR_${new Date().toJSON().slice(0, 10)}.${this.urlToFetch.split('.').pop()}`,
              {
                type: fileType,
              }
            );
            if (file.size > 2000000) {
              this.showWarnInfo = true;
              this.warnMessage = 'Maximum allowed file size is 2mb!';
              return;
            }
            console.log(file)
            this.filesToUpload.push(file);
            this.urlToFetch = '';
          });
      };
    };
    request.send();
  }

  onPasteURL(){
    if(this.urlToFetch.includes('http://')){
      this.urlToFetch = '';
      this.showWarnInfo = true;
      this.warnMessage = 'Only urls with secured protocols are allowed to fetch!';
      return;
    }else if(!this.urlToFetch.includes('https://')){
      this.urlToFetch = '';
      this.showWarnInfo = true;
      this.warnMessage = 'Please enter a valid url to fetch!';
      return;
    }
    this.urlToFetch = this.urlToFetch.replace(/(^\w+:|^)\/\//, '');
  }

  onFetchClick(){
    if(!this.urlToFetch){
      this.showWarnInfo = true;
      this.warnMessage = 'Please enter valid url to fetch!';
      return;
    }
    this.fetchFile();
  }
}
