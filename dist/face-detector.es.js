var x = (u, t) => () => (t || u((t = { exports: {} }).exports, t), t.exports);
var M = x((g, h) => {
  class m {
    constructor(t = {}) {
      if (this.initialized = !1, this.options = {
        timeoutDuration: t.timeoutDuration || 3e3,
        onFaceTimeout: t.onFaceTimeout || (() => {
        }),
        onFaceDetected: t.onFaceDetected || (() => {
        }),
        onPupilTimeout: t.onPupilTimeout || (() => {
        }),
        onPupilDetected: t.onPupilDetected || (() => {
        }),
        onInit: t.onInit || (() => {
        }),
        showFaceCircle: t.showFaceCircle !== void 0 ? t.showFaceCircle : !0,
        showPupilPoints: t.showPupilPoints !== void 0 ? t.showPupilPoints : !0,
        faceCircleColor: t.faceCircleColor || "#ff0000",
        pupilPointsColor: t.pupilPointsColor || "#ff0000",
        faceCircleLineWidth: t.faceCircleLineWidth || 3,
        pupilPointsLineWidth: t.pupilPointsLineWidth || 3,
        detectionMode: t.detectionMode || "both",
        resources: t.resources || {
          facefinder: "./resources/facefinder.bin",
          puploc: "./resources/puploc.bin"
        }
      }, !["face", "pupil", "both"].includes(this.options.detectionMode))
        throw new Error('Invalid detection mode. Must be "face", "pupil", or "both"');
      this.options.showFaceCircle = this.options.showFaceCircle && (this.options.detectionMode === "face" || this.options.detectionMode === "both"), this.options.showPupilPoints = this.options.showPupilPoints && (this.options.detectionMode === "pupil" || this.options.detectionMode === "both"), this.lastPupilDetectionTime = Date.now(), this.pupilTimeoutInterval = null, this.lastValidPupilPositions = {
        left: null,
        right: null
      }, this.smoothingFactor = 0.7;
    }
    async init(t) {
      if (!(t instanceof HTMLCanvasElement))
        throw new Error("Canvas element is required");
      if (this.canvas = t, this.ctx = this.canvas.getContext("2d"), this.update_memory = pico.instantiate_detection_memory(5), this.options.detectionMode === "face" || this.options.detectionMode === "both") {
        const s = await (await fetch(this.options.resources.facefinder)).arrayBuffer(), o = new Int8Array(s);
        this.facefinder_classify_region = pico.unpack_cascade(o);
      }
      if (this.options.detectionMode === "pupil" || this.options.detectionMode === "both") {
        const s = await (await fetch(this.options.resources.puploc)).arrayBuffer(), o = new Int8Array(s);
        this.do_puploc = lploc.unpack_localizer(o);
      }
      this.initialized = !0, this.options.onInit();
    }
    rgba_to_grayscale(t, a, s) {
      for (var o = new Uint8Array(a * s), e = 0; e < a; ++e)
        for (var i = 0; i < s; ++i)
          o[e * s + i] = (2 * t[e * 4 * s + 4 * i + 0] + 7 * t[e * 4 * s + 4 * i + 1] + 1 * t[e * 4 * s + 4 * i + 2]) / 10;
      return o;
    }
    processFace(t) {
      if (!this.initialized) throw new Error("FaceDetector not initialized. Call init() first");
      this.ctx.drawImage(t, 0, 0);
      const a = this.ctx.getImageData(0, 0, 640, 480).data, s = {
        pixels: this.rgba_to_grayscale(a, 480, 640),
        nrows: 480,
        ncols: 640,
        ldim: 640
      }, o = {
        shiftfactor: 0.1,
        minsize: 100,
        maxsize: 1e3,
        scalefactor: this.options.detectionMode === "pupil" ? 1.2 : 1.1
        // Faster scanning in pupil mode
      };
      let e = [];
      if (this.facefinder_classify_region && (e = pico.run_cascade(s, this.facefinder_classify_region, o), e = this.update_memory(e), e = pico.cluster_detections(e, 0.2)), this.options.detectionMode === "face" || this.options.detectionMode === "both") {
        let i = !1;
        for (let n = 0; n < e.length; ++n)
          e[n][3] > 50 && (i = !0, this.lastFaceDetectionTime = Date.now(), this.drawDetection(e[n], s), this.options.onFaceDetected(e[n]));
        !i && Date.now() - this.lastFaceDetectionTime > this.options.timeoutDuration && (this.options.onFaceTimeout(), this.lastFaceDetectionTime = Date.now());
      } else if (this.options.detectionMode === "pupil") {
        let i = null;
        for (let n = 0; n < e.length; ++n)
          if (e[n][3] > 20) {
            i = e[n];
            break;
          }
        i ? (this.lastValidDet && (i[0] = i[0] * 0.3 + this.lastValidDet[0] * 0.7, i[1] = i[1] * 0.3 + this.lastValidDet[1] * 0.7, i[2] = i[2] * 0.3 + this.lastValidDet[2] * 0.7), this.lastValidDet = [...i]) : this.lastValidDet ? i = this.lastValidDet : i = [240, 320, 200, 100], this.drawDetection(i, s);
      }
    }
    drawDetection(t, a) {
      if (this.options.showFaceCircle && ["face", "both"].includes(this.options.detectionMode) && (this.ctx.beginPath(), this.ctx.arc(t[1], t[0], t[2] / 2, 0, 2 * Math.PI, !1), this.ctx.lineWidth = this.options.faceCircleLineWidth, this.ctx.strokeStyle = this.options.faceCircleColor, this.ctx.stroke()), this.options.showPupilPoints && ["pupil", "both"].includes(this.options.detectionMode)) {
        let s = !1, o = !1;
        if (this.do_puploc) {
          const e = this.options.detectionMode === "pupil" ? 0.5 : 0.35, i = -0.1 * t[2];
          s = this.drawEye(t, a, -0.2, "left", e, i), o = this.drawEye(t, a, 0.2, "right", e, i);
        }
        s || o ? this.lastPupilDetectionTime = Date.now() : Date.now() - this.lastPupilDetectionTime > this.options.timeoutDuration && this.options.detectionMode === "pupil" && (this.options.onPupilTimeout(), this.lastPupilDetectionTime = Date.now());
      }
    }
    drawEye(t, a, s, o, e = 0.35, i = 0) {
      let n = t[0] + i, w = t[1] + s * t[2], p = e * t[2];
      const D = [p, p * 0.8, p * 1.2];
      let d = [-1, -1];
      for (let r of D) {
        const [f, P] = this.do_puploc(n, w, r, 63, a);
        if (f >= 0 && P >= 0) {
          d = [f, P];
          break;
        }
      }
      let [l, c] = d;
      if (l >= 0 && c >= 0)
        return this.lastValidPupilPositions[o] && (l = l * (1 - this.smoothingFactor) + this.lastValidPupilPositions[o].y * this.smoothingFactor, c = c * (1 - this.smoothingFactor) + this.lastValidPupilPositions[o].x * this.smoothingFactor), this.lastValidPupilPositions[o] = { x: c, y: l }, this.ctx.beginPath(), this.ctx.arc(c, l, 2, 0, 2 * Math.PI, !1), this.ctx.lineWidth = this.options.pupilPointsLineWidth, this.ctx.strokeStyle = this.options.pupilPointsColor, this.ctx.stroke(), this.options.onPupilDetected({ x: c, y: l, eye: o }), !0;
      if (this.lastValidPupilPositions[o]) {
        const r = this.lastValidPupilPositions[o];
        return this.ctx.beginPath(), this.ctx.arc(r.x, r.y, 2, 0, 2 * Math.PI, !1), this.ctx.lineWidth = this.options.pupilPointsLineWidth, this.ctx.strokeStyle = this.options.pupilPointsColor, this.ctx.stroke(), !0;
      }
      return !1;
    }
    start(t) {
      if (!this.initialized)
        throw new Error("FaceDetector must be initialized first");
      if (!(t instanceof HTMLVideoElement))
        throw new Error("Video element is required");
      this.processInterval = setInterval(() => this.processFace(t), 1e3 / 30), (this.options.detectionMode === "pupil" || this.options.detectionMode === "both") && (this.pupilTimeoutInterval = setInterval(() => {
        Date.now() - this.lastPupilDetectionTime > this.options.timeoutDuration && this.options.onPupilTimeout();
      }, 1e3));
    }
    stop() {
      this.initialized = !1, this.processInterval && (clearInterval(this.processInterval), this.processInterval = null), this.pupilTimeoutInterval && (clearInterval(this.pupilTimeoutInterval), this.pupilTimeoutInterval = null);
    }
  }
  typeof h < "u" && h.exports ? h.exports = m : window.FaceDetector = m;
});
export default M();
