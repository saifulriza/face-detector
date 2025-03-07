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
      faceCircleColor: options.faceCircleColor || '#ff0000',
      pupilPointsColor: options.pupilPointsColor || '#ff0000',
      faceCircleLineWidth: options.faceCircleLineWidth || 3,
      pupilPointsLineWidth: options.pupilPointsLineWidth || 3,
      detectionMode: options.detectionMode || 'both',
      resources: options.resources || {
        facefinder: './resources/facefinder.bin',
        puploc: './resources/puploc.bin'
      }
    };

    // Validate detection mode
    if (!['face', 'pupil', 'both'].includes(this.options.detectionMode)) {
      throw new Error('Invalid detection mode. Must be "face", "pupil", or "both"');
    }

    // Update show options based on detection mode
    this.options.showFaceCircle = this.options.showFaceCircle && 
      (this.options.detectionMode === 'face' || this.options.detectionMode === 'both');
    this.options.showPupilPoints = this.options.showPupilPoints && 
      (this.options.detectionMode === 'pupil' || this.options.detectionMode === 'both');

    this.lastPupilDetectionTime = Date.now();
    this.pupilTimeoutInterval = null;

    // Add smoothing for pupil positions
    this.lastValidPupilPositions = {
      left: null,
      right: null
    };
    this.smoothingFactor = 0.7;
  }

  async init(canvasElement) {
    if (!(canvasElement instanceof HTMLCanvasElement)) {
      throw new Error('Canvas element is required');
    }
    this.canvas = canvasElement;
    this.ctx = this.canvas.getContext('2d');
    this.update_memory = pico.instantiate_detection_memory(5);
    
    // Initialize face finder only if needed
    if (this.options.detectionMode === 'face' || this.options.detectionMode === 'both') {
      const cascadeResponse = await fetch(this.options.resources.facefinder);
      const cascadeBuffer = await cascadeResponse.arrayBuffer();
      const cascadeBytes = new Int8Array(cascadeBuffer);
      this.facefinder_classify_region = pico.unpack_cascade(cascadeBytes);
    }
    
    // Initialize pupil localizer only if needed
    if (this.options.detectionMode === 'pupil' || this.options.detectionMode === 'both') {
      const puplocResponse = await fetch(this.options.resources.puploc);
      const puplocBuffer = await puplocResponse.arrayBuffer();
      const puplocBytes = new Int8Array(puplocBuffer);
      this.do_puploc = lploc.unpack_localizer(puplocBytes);
    }
    
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

    // Base face detection parameters - lighter for pupil mode
    const params = {
        "shiftfactor": 0.1,
        "minsize": 100,
        "maxsize": 1000,
        "scalefactor": this.options.detectionMode === 'pupil' ? 1.2 : 1.1 // Faster scanning in pupil mode
    };

    // Run face detection in all modes, but with different processing
    let dets = [];
    if (this.facefinder_classify_region) {
      dets = pico.run_cascade(image, this.facefinder_classify_region, params);
      dets = this.update_memory(dets);
      dets = pico.cluster_detections(dets, 0.2);
    }

    if (this.options.detectionMode === 'face' || this.options.detectionMode === 'both') {
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
    else if (this.options.detectionMode === 'pupil') {
      // In pupil mode, use face detection just for positioning, with lower threshold
      let det = null;
      for(let i=0; i<dets.length; ++i) {
          if(dets[i][3]>20.0) { // Lower threshold further for better pupil tracking
              det = dets[i];
              break;
          }
      }
      
      // If no face detected, use last known position or fallback to center
      if (!det) {
          if (this.lastValidDet) {
              det = this.lastValidDet;
          } else {
              det = [240, 320, 200, 100]; // Fallback to center
          }
      } else {
          // Smooth the face detection position
          if (this.lastValidDet) {
              det[0] = det[0] * 0.3 + this.lastValidDet[0] * 0.7; // y
              det[1] = det[1] * 0.3 + this.lastValidDet[1] * 0.7; // x
              det[2] = det[2] * 0.3 + this.lastValidDet[2] * 0.7; // scale
          }
          this.lastValidDet = [...det]; // Clone the array
      }
      
      this.drawDetection(det, image);
    }
  }

  drawDetection(det, image) {
    // Draw face circle only if in face or both mode
    if (this.options.showFaceCircle && ['face', 'both'].includes(this.options.detectionMode)) {
      this.ctx.beginPath();
      this.ctx.arc(det[1], det[0], det[2]/2, 0, 2*Math.PI, false);
      this.ctx.lineWidth = this.options.faceCircleLineWidth;
      this.ctx.strokeStyle = this.options.faceCircleColor;
      this.ctx.stroke();
    }

    // Process pupils only if in pupil or both mode
    if (this.options.showPupilPoints && ['pupil', 'both'].includes(this.options.detectionMode)) {
      let leftPupil = false;
      let rightPupil = false;

      if (this.do_puploc) {
        // Adjust search area based on detection mode
        const searchScale = this.options.detectionMode === 'pupil' ? 0.5 : 0.35; // Increased search area for pupil mode
        // Adjust vertical offset for better eye position estimation
        const verticalOffset = -0.1 * det[2]; // Adjusted based on face proportions
        
        leftPupil = this.drawEye(det, image, -0.2, 'left', searchScale, verticalOffset);
        rightPupil = this.drawEye(det, image, 0.2, 'right', searchScale, verticalOffset);
      }
      
      if (leftPupil || rightPupil) {
        this.lastPupilDetectionTime = Date.now();
      } else if (Date.now() - this.lastPupilDetectionTime > this.options.timeoutDuration) {
        // Only trigger timeout in pupil mode
        if (this.options.detectionMode === 'pupil') {
          this.options.onPupilTimeout();
          this.lastPupilDetectionTime = Date.now();
        }
      }
    }
  }

  drawEye(det, image, offsetFactor, eye, searchScale = 0.35, verticalOffset = 0) {
    let r = det[0] + verticalOffset;
    let c = det[1] + offsetFactor * det[2];
    let s = searchScale * det[2];

    // Multiple attempts with different scales for better detection
    const scales = [s, s * 0.8, s * 1.2];
    let bestResult = [-1, -1];
    
    for (let currentScale of scales) {
      const [tr, tc] = this.do_puploc(r, c, currentScale, 63, image);
      if (tr >= 0 && tc >= 0) {
        bestResult = [tr, tc];
        break;
      }
    }
    
    let [finalR, finalC] = bestResult;
    
    if (finalR >= 0 && finalC >= 0) {
      // Apply smoothing to pupil positions
      if (this.lastValidPupilPositions[eye]) {
        finalR = finalR * (1 - this.smoothingFactor) + this.lastValidPupilPositions[eye].y * this.smoothingFactor;
        finalC = finalC * (1 - this.smoothingFactor) + this.lastValidPupilPositions[eye].x * this.smoothingFactor;
      }
      
      // Store the smoothed position
      this.lastValidPupilPositions[eye] = { x: finalC, y: finalR };
      
      this.ctx.beginPath();
      this.ctx.arc(finalC, finalR, 2, 0, 2*Math.PI, false);
      this.ctx.lineWidth = this.options.pupilPointsLineWidth;
      this.ctx.strokeStyle = this.options.pupilPointsColor;
      this.ctx.stroke();
      
      this.options.onPupilDetected({ x: finalC, y: finalR, eye: eye });
      return true;
    } else if (this.lastValidPupilPositions[eye]) {
      // If detection failed but we have a previous position, use it
      const lastPos = this.lastValidPupilPositions[eye];
      this.ctx.beginPath();
      this.ctx.arc(lastPos.x, lastPos.y, 2, 0, 2*Math.PI, false);
      this.ctx.lineWidth = this.options.pupilPointsLineWidth;
      this.ctx.strokeStyle = this.options.pupilPointsColor;
      this.ctx.stroke();
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
    
    // Only set up pupil timeout if in pupil or both mode
    if (this.options.detectionMode === 'pupil' || this.options.detectionMode === 'both') {
      this.pupilTimeoutInterval = setInterval(() => {
        if (Date.now() - this.lastPupilDetectionTime > this.options.timeoutDuration) {
          this.options.onPupilTimeout();
        }
      }, 1000); // Check every second
    }
  }

  stop() {
    this.initialized = false;
    if (this.processInterval) {
      clearInterval(this.processInterval);
      this.processInterval = null;
    }
    // Only clear pupil timeout interval if it exists
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
