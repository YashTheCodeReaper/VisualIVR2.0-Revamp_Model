// Every pathToSource can be either a link or an asset path

export interface Captcha {
  allowOnlySecureProtocolForSources: boolean;
  captchaHeader: {
    enable: boolean;
    position: string; // `Normal` || `Sticky`
    pathToSource: string;
  };
  captchaCrousel: {
    enable: boolean;
    position: {
      landscape: string, // `Left` || `Right`
      portrait: string // `Top` || `Bottom`
    };
  };
  formPosition: string; // `Left` || `Center` || `Right`
  captchaLogo: {
    enable: boolean;
    pathToSource: string;
    horizontalPosition: string; // `Left` || `Center` || `Right`
    verticalPosition: string; // `Top` || `Center` || `Bottom`
  };
  captchaFooter: {
    enable: boolean;
    pathToSource: string;
  };
}
