// Every pathToSource can be either a link or an asset path

export interface Captcha {
  allowOnlySecureProtocolForSources: boolean;
  captchaHeader: {
    enable: boolean;
    position: string; // `normal` || `sticky`
    pathToSource: string;
  };
  captchaCarousel: {
    enable: boolean;
    autoSlide: {
      enable: boolean;
      delay: number; // In milliseconds
    };
    manualSlide: boolean;
    position: {
      landscape: string; // `left` || `right`
      portrait: string; // `top` || `bottom`
    };
    carouselContentPathArray: string[]; // Array of paths
    pagination: {
      enable: boolean;
      showIndex: boolean;
      style: 'dot'; // `dot` || `dash` ||
      horizontalPosition: string; // `left` || `center` || `right`
      verticalPosition: string; // `top` || `bottom`
    };
  };
  captchaLogo: {
    enable: boolean;
    pathToSource: string;
    horizontalPosition: string; // `left` || `center` || `right`
    verticalPosition: string; // `top` || `bottom`
  };
  captchaImage: {
    enable: boolean;
    pathToSource: string;
  };
  captchaResetButtonPosition: string; // `left` || `right`
  separatedInputs: {
    enable: boolean;
    letterCount: number;
  };
  captchaFooter: {
    enable: boolean;
    pathToSource: string;
  };
}
