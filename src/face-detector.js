class FaceDetector {
  constructor(options = {}) {
    this.initialized = false;
    this.options = {
      timeoutDuration: options.timeoutDuration || 3000,
      onFaceTimeout: options.onFaceTimeout || (() => {}),
      onFaceDetected: options.onFaceDetected || (() => {}),
      onPupilTimeout: options.onPupilTimeout || (() => {}),
      onPupilDetected: options.onPupilDetected || (() => {}),
      onInit: options.onInit || (() => {}),
      showFaceCircle: options.showFaceCircle !== undefined ? options.showFaceCircle : true,
      showPupilPoints: options.showPupilPoints !== undefined ? options.showPupilPoints : true,
      faceCircleColor: options.faceCircleColor || '#ff0000', // Default red
      pupilPointsColor: options.pupilPointsColor || '#ff0000', // Default red
      faceCircleLineWidth: options.faceCircleLineWidth || 3, // Default line width for face circle
      pupilPointsLineWidth: options.pupilPointsLineWidth || 3, // Default line width for pupil points
      resources: options.resources || {
        facefinder: './resources/facefinder.bin',
        puploc: './resources/puploc.bin'
      }
    };
    this.lastPupilDetectionTime = Date.now();
    this.pupilTimeoutInterval = null;
    this.lastLeftPupilTime = Date.now();
    this.lastRightPupilTime = Date.now();
    this.pupilsDetected = false;
    this.lastPupilCheck = Date.now();
    this.consecutiveMisses = 0;
  }

  async init(canvasElement) {
    if (!(canvasElement instanceof HTMLCanvasElement)) {
      throw new Error('Canvas element is required');
    }
    this.canvas = canvasElement;
    this.ctx = this.canvas.getContext('2d');
    this.update_memory = pico.instantiate_detection_memory(5);
    
    // Initialize face finder
    const cascadeResponse = await fetch(this.options.resources.facefinder);
    const cascadeBuffer = await cascadeResponse.arrayBuffer();
    const cascadeBytes = new Int8Array(cascadeBuffer);
    this.facefinder_classify_region = pico.unpack_cascade(cascadeBytes);
    
    // Initialize pupil localizer
    const puplocResponse = await fetch(this.options.resources.puploc);
    const puplocBuffer = await puplocResponse.arrayBuffer();
    const puplocBytes = new Int8Array(puplocBuffer);
    this.do_puploc = lploc.unpack_localizer(puplocBytes);
    
    this.initialized = true;
    this.options.onInit();
  }

  rgba_to_grayscale(rgba, nrows, ncols) {
    var gray = new Uint8Array(nrows*ncols);
    for(var r=0; r<nrows; ++r)
        for(var c=0; c<ncols; ++c)
            gray[r*ncols + c] = (2*rgba[r*4*ncols+4*c+0]+7*rgba[r*4*ncols+4*c+1]+1*rgba[r*4*ncols+4*c+2])/10;
    return gray;
  }

  processFace(video) {
    if (!this.initialized) throw new Error('FaceDetector not initialized. Call init() first');
    
    this.ctx.drawImage(video, 0, 0);
    const rgba = this.ctx.getImageData(0, 0, 640, 480).data;
    
    const image = {
        "pixels": this.rgba_to_grayscale(rgba, 480, 640),
        "nrows": 480,
        "ncols": 640,
        "ldim": 640
    };
    
    const params = {
        "shiftfactor": 0.1,
        "minsize": 100,
        "maxsize": 1000,
        "scalefactor": 1.1
    };

    let dets = pico.run_cascade(image, this.facefinder_classify_region, params);
    dets = this.update_memory(dets);
    dets = pico.cluster_detections(dets, 0.2);

    let faceDetected = false;
    for(let i=0; i<dets.length; ++i) {
        if(dets[i][3]>50.0) {
            faceDetected = true;
            this.lastFaceDetectionTime = Date.now();
            this.drawDetection(dets[i], image);
            this.options.onFaceDetected(dets[i]);
        }
    }

    if (!faceDetected && (Date.now() - this.lastFaceDetectionTime > this.options.timeoutDuration)) {
        this.options.onFaceTimeout();
        this.lastFaceDetectionTime = Date.now();
    }
  }

  drawDetection(det, image) {
    if (this.options.showFaceCircle) {
      // Draw face circle
      this.ctx.beginPath();
      this.ctx.arc(det[1], det[0], det[2]/2, 0, 2*Math.PI, false);
      this.ctx.lineWidth = this.options.faceCircleLineWidth;
      this.ctx.strokeStyle = this.options.faceCircleColor;
      this.ctx.stroke();
    }

    if (this.options.showPupilPoints) {
      let leftPupil = this.drawEye(det, image, -0.175, 'left');
      let rightPupil = this.drawEye(det, image, 0.175, 'right');
      
      if (leftPupil || rightPupil) {
        this.lastPupilDetectionTime = Date.now();
      }
    }
  }

  drawEye(det, image, offsetFactor, eye) {
    let r = det[0] - 0.075*det[2];
    let c = det[1] + offsetFactor*det[2];
    let s = 0.35*det[2];
    [r, c] = this.do_puploc(r, c, s, 63, image);
    
    if(r>=0 && c>=0) {
        this.ctx.beginPath();
        this.ctx.arc(c, r, 1, 0, 2*Math.PI, false);
        this.ctx.lineWidth = this.options.pupilPointsLineWidth;
        this.ctx.strokeStyle = this.options.pupilPointsColor;
        this.ctx.stroke();

        if (eye === 'left') {
          this.lastLeftPupilTime = Date.now();
        } else {
          this.lastRightPupilTime = Date.now();
        }
        this.options.onPupilDetected({ x: c, y: r, eye: eye });
        return true;
    }
    return false;
  }

  start(videoElement) {
    if (!this.initialized) {
      throw new Error('FaceDetector must be initialized first');
    }
    if (!(videoElement instanceof HTMLVideoElement)) {
      throw new Error('Video element is required');
    }
    this.processInterval = setInterval(() => this.processFace(videoElement), 1000/30); // 30 FPS
    this.pupilTimeoutInterval = setInterval(() => {
      if (Date.now() - this.lastPupilDetectionTime > this.options.timeoutDuration) {
        this.options.onPupilTimeout();
      }
    }, 1000); // Check every second
  }

  stop() {
    this.initialized = false;
    if (this.processInterval) {
      clearInterval(this.processInterval);
      this.processInterval = null;
    }
    if (this.pupilTimeoutInterval) {
      clearInterval(this.pupilTimeoutInterval);
      this.pupilTimeoutInterval = null;
    }
  }
}

// Support both ES modules and CommonJS
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FaceDetector;
} else {
  window.FaceDetector = FaceDetector;
}
