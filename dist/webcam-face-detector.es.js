var B = (e, t) => () => (t || e((t = { exports: {} }).exports, t), t.exports);
var R = B((q, C) => {
  const x = {};
  x.unpack_cascade = function(e) {
    const t = new DataView(new ArrayBuffer(4));
    let i = 8;
    t.setUint8(0, e[i + 0]), t.setUint8(1, e[i + 1]), t.setUint8(2, e[i + 2]), t.setUint8(3, e[i + 3]);
    const s = t.getInt32(0, !0);
    i = i + 4, t.setUint8(0, e[i + 0]), t.setUint8(1, e[i + 1]), t.setUint8(2, e[i + 2]), t.setUint8(3, e[i + 3]);
    const a = t.getInt32(0, !0);
    i = i + 4;
    const o = [], n = [], l = [];
    for (let p = 0; p < a; ++p) {
      Array.prototype.push.apply(o, [0, 0, 0, 0]), Array.prototype.push.apply(o, e.slice(i, i + 4 * Math.pow(2, s) - 4)), i = i + 4 * Math.pow(2, s) - 4;
      for (let r = 0; r < Math.pow(2, s); ++r)
        t.setUint8(0, e[i + 0]), t.setUint8(1, e[i + 1]), t.setUint8(2, e[i + 2]), t.setUint8(3, e[i + 3]), n.push(t.getFloat32(0, !0)), i = i + 4;
      t.setUint8(0, e[i + 0]), t.setUint8(1, e[i + 1]), t.setUint8(2, e[i + 2]), t.setUint8(3, e[i + 3]), l.push(t.getFloat32(0, !0)), i = i + 4;
    }
    const w = new Int8Array(o), f = new Float32Array(n), m = new Float32Array(l);
    function h(p, r, c, u, d) {
      p = 256 * p, r = 256 * r;
      let g = 0, I = 0;
      const D = Math.pow(2, s) >> 0;
      for (let P = 0; P < a; ++P) {
        let M = 1;
        for (let _ = 0; _ < s; ++_)
          M = 2 * M + (u[(p + w[g + 4 * M + 0] * c >> 8) * d + (r + w[g + 4 * M + 1] * c >> 8)] <= u[(p + w[g + 4 * M + 2] * c >> 8) * d + (r + w[g + 4 * M + 3] * c >> 8)]);
        if (I = I + f[D * P + M - D], I <= m[P])
          return -1;
        g += 4 * D;
      }
      return I - m[a - 1];
    }
    return h;
  };
  x.run_cascade = function(e, t, i) {
    const s = e.pixels, a = e.nrows, o = e.ncols, n = e.ldim, l = i.shiftfactor, w = i.minsize, f = i.maxsize, m = i.scalefactor;
    let h = w;
    const p = [];
    for (; h <= f; ) {
      const r = Math.max(l * h, 1) >> 0, c = h / 2 + 1 >> 0;
      for (let u = c; u <= a - c; u += r)
        for (let d = c; d <= o - c; d += r) {
          const g = t(u, d, h, s, n);
          g > 0 && p.push([u, d, h, g]);
        }
      h = h * m;
    }
    return p;
  };
  x.cluster_detections = function(e, t) {
    e = e.sort(function(o, n) {
      return n[3] - o[3];
    });
    function i(o, n) {
      const l = o[0], w = o[1], f = o[2], m = n[0], h = n[1], p = n[2], r = Math.max(0, Math.min(l + f / 2, m + p / 2) - Math.max(l - f / 2, m - p / 2)), c = Math.max(0, Math.min(w + f / 2, h + p / 2) - Math.max(w - f / 2, h - p / 2));
      return r * c / (f * f + p * p - r * c);
    }
    const s = new Array(e.length).fill(0), a = [];
    for (let o = 0; o < e.length; ++o)
      if (s[o] == 0) {
        let n = 0, l = 0, w = 0, f = 0, m = 0;
        for (let h = o; h < e.length; ++h)
          i(e[o], e[h]) > t && (s[h] = 1, n = n + e[h][0], l = l + e[h][1], w = w + e[h][2], f = f + e[h][3], m = m + 1);
        a.push([n / m, l / m, w / m, f]);
      }
    return a;
  };
  x.instantiate_detection_memory = function(e) {
    let t = 0;
    const i = [];
    for (let a = 0; a < e; ++a)
      i.push([]);
    function s(a) {
      i[t] = a, t = (t + 1) % i.length, a = [];
      for (let o = 0; o < i.length; ++o)
        a = a.concat(i[o]);
      return a;
    }
    return s;
  };
  typeof window < "u" && (window.pico = x);
  const F = {};
  F.unpack_localizer = function(e) {
    const t = new DataView(new ArrayBuffer(4));
    let i = 0;
    t.setUint8(0, e[i + 0]), t.setUint8(1, e[i + 1]), t.setUint8(2, e[i + 2]), t.setUint8(3, e[i + 3]);
    const s = t.getInt32(0, !0);
    i = i + 4, t.setUint8(0, e[i + 0]), t.setUint8(1, e[i + 1]), t.setUint8(2, e[i + 2]), t.setUint8(3, e[i + 3]);
    const a = t.getFloat32(0, !0);
    i = i + 4, t.setUint8(0, e[i + 0]), t.setUint8(1, e[i + 1]), t.setUint8(2, e[i + 2]), t.setUint8(3, e[i + 3]);
    const o = t.getInt32(0, !0);
    i = i + 4, t.setUint8(0, e[i + 0]), t.setUint8(1, e[i + 1]), t.setUint8(2, e[i + 2]), t.setUint8(3, e[i + 3]);
    const n = t.getInt32(0, !0);
    i = i + 4;
    const l = [], w = [];
    for (let r = 0; r < s; ++r)
      for (let c = 0; c < o; ++c) {
        Array.prototype.push.apply(l, e.slice(i, i + 4 * Math.pow(2, n) - 4)), i = i + 4 * Math.pow(2, n) - 4;
        for (let u = 0; u < Math.pow(2, n); ++u)
          for (let d = 0; d < 2; ++d)
            t.setUint8(0, e[i + 0]), t.setUint8(1, e[i + 1]), t.setUint8(2, e[i + 2]), t.setUint8(3, e[i + 3]), w.push(t.getFloat32(0, !0)), i = i + 4;
      }
    const f = new Int8Array(l), m = new Float32Array(w);
    function h(r, c, u, d, g, I, D) {
      let P = 0;
      const M = Math.pow(2, n) >> 0;
      for (let v = 0; v < s; ++v) {
        let T = 0, z = 0;
        for (let V = 0; V < o; ++V) {
          let U = 0;
          for (var _ = 0; _ < n; ++_) {
            const y = Math.min(g - 1, Math.max(0, 256 * r + f[P + 4 * U + 0] * u >> 8)), E = Math.min(I - 1, Math.max(0, 256 * c + f[P + 4 * U + 1] * u >> 8)), L = Math.min(g - 1, Math.max(0, 256 * r + f[P + 4 * U + 2] * u >> 8)), W = Math.min(I - 1, Math.max(0, 256 * c + f[P + 4 * U + 3] * u >> 8));
            U = 2 * U + 1 + (d[y * D + E] > d[L * D + W]);
          }
          const A = 2 * (o * M * v + M * V + U - (M - 1));
          T += m[A + 0], z += m[A + 1], P += 4 * M - 4;
        }
        r = r + T * u, c = c + z * u, u = u * a;
      }
      return [r, c];
    }
    function p(r, c, u, d, g) {
      const I = [], D = [];
      for (let P = 0; P < d; ++P) {
        const M = u * (0.925 + 0.15 * Math.random());
        let _ = r + u * 0.15 * (0.5 - Math.random()), v = c + u * 0.15 * (0.5 - Math.random());
        [_, v] = h(_, v, M, g.pixels, g.nrows, g.ncols, g.ldim), I.push(_), D.push(v);
      }
      return I.sort(), D.sort(), [I[Math.round(d / 2)], D[Math.round(d / 2)]];
    }
    return p;
  };
  typeof window < "u" && (window.lploc = F);
  class k {
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
        captureInterval: t.captureInterval || 1e3,
        // Interval for image capture in ms
        onImageCaptured: t.onImageCaptured || (() => {
        }),
        // Callback when image is captured
        resources: t.resources || {
          facefinder: "./resources/facefinder.bin",
          puploc: "./resources/puploc.bin"
        }
      }, !["face", "pupil", "both"].includes(this.options.detectionMode))
        throw new Error('Invalid detection mode. Must be "face", "pupil", or "both"');
      this.options.showFaceCircle = this.options.showFaceCircle && (this.options.detectionMode === "face" || this.options.detectionMode === "both"), this.options.showPupilPoints = this.options.showPupilPoints && (this.options.detectionMode === "pupil" || this.options.detectionMode === "both"), this.lastPupilDetectionTime = Date.now(), this.pupilTimeoutInterval = null, this.captureInterval = null, this.lastValidPupilPositions = {
        left: null,
        right: null
      }, this.smoothingFactor = 0.7;
    }
    async init(t) {
      if (!(t instanceof HTMLCanvasElement))
        throw new Error("Canvas element is required");
      if (this.canvas = t, this.ctx = this.canvas.getContext("2d"), this.update_memory = x.instantiate_detection_memory(5), this.options.detectionMode === "face" || this.options.detectionMode === "both") {
        const s = await (await fetch(this.options.resources.facefinder)).arrayBuffer(), a = new Int8Array(s);
        this.facefinder_classify_region = x.unpack_cascade(a);
      }
      if (this.options.detectionMode === "pupil" || this.options.detectionMode === "both") {
        const s = await (await fetch(this.options.resources.puploc)).arrayBuffer(), a = new Int8Array(s);
        this.do_puploc = F.unpack_localizer(a);
      }
      this.initialized = !0, this.options.onInit();
    }
    rgba_to_grayscale(t, i, s) {
      for (var a = new Uint8Array(i * s), o = 0; o < i; ++o)
        for (var n = 0; n < s; ++n)
          a[o * s + n] = (2 * t[o * 4 * s + 4 * n + 0] + 7 * t[o * 4 * s + 4 * n + 1] + 1 * t[o * 4 * s + 4 * n + 2]) / 10;
      return a;
    }
    /**
     * Capture a single image from the video stream
     * @param {HTMLVideoElement} video - The video element to capture from
     * @param {string} format - Image format ('image/jpeg', 'image/png', etc.)
     * @param {number} quality - Image quality (0-1) for formats that support it
     * @returns {string} - Data URL of the captured image
     */
    captureImage(t, i = "image/jpeg", s = 0.9) {
      if (!this.initialized) throw new Error("FaceDetector not initialized. Call init() first");
      this.ctx.drawImage(t, 0, 0);
      const a = this.canvas.toDataURL(i, s);
      return this.options.onImageCaptured({
        dataUrl: a,
        timestamp: Date.now(),
        format: i,
        width: this.canvas.width,
        height: this.canvas.height
      }), a;
    }
    /**
     * Start capturing images at the configured interval
     * @param {HTMLVideoElement} video - The video element to capture from
     * @param {string} format - Image format ('image/jpeg', 'image/png', etc.)
     * @param {number} quality - Image quality (0-1) for formats that support it
     */
    startCapturing(t, i = "image/jpeg", s = 0.9) {
      if (!this.initialized) throw new Error("FaceDetector not initialized. Call init() first");
      if (!(t instanceof HTMLVideoElement))
        throw new Error("Video element is required");
      this.stopCapturing(), this.captureInterval = setInterval(() => {
        this.captureImage(t, i, s);
      }, this.options.captureInterval);
    }
    /**
     * Stop capturing images
     */
    stopCapturing() {
      this.captureInterval && (clearInterval(this.captureInterval), this.captureInterval = null);
    }
    /**
     * Update the image capture interval
     * @param {number} interval - New interval in milliseconds
     */
    updateCaptureInterval(t) {
      if (typeof t != "number" || t <= 0)
        throw new Error("Capture interval must be a positive number");
      if (this.options.captureInterval = t, this.captureInterval) {
        const i = !!this.captureInterval, s = this.currentVideo;
        this.stopCapturing(), i && s && this.startCapturing(s);
      }
    }
    processFace(t) {
      if (!this.initialized) throw new Error("FaceDetector not initialized. Call init() first");
      this.currentVideo = t, this.ctx.drawImage(t, 0, 0);
      const i = this.ctx.getImageData(0, 0, 640, 480).data, s = {
        pixels: this.rgba_to_grayscale(i, 480, 640),
        nrows: 480,
        ncols: 640,
        ldim: 640
      }, a = {
        shiftfactor: 0.1,
        minsize: 100,
        maxsize: 1e3,
        scalefactor: this.options.detectionMode === "pupil" ? 1.2 : 1.1
        // Faster scanning in pupil mode
      };
      let o = [];
      if (this.facefinder_classify_region && (o = x.run_cascade(s, this.facefinder_classify_region, a), o = this.update_memory(o), o = x.cluster_detections(o, 0.2)), this.options.detectionMode === "face" || this.options.detectionMode === "both") {
        let n = !1;
        for (let l = 0; l < o.length; ++l)
          o[l][3] > 50 && (n = !0, this.lastFaceDetectionTime = Date.now(), this.drawDetection(o[l], s), this.options.onFaceDetected(o[l]));
        !n && Date.now() - this.lastFaceDetectionTime > this.options.timeoutDuration && (this.options.onFaceTimeout(), this.lastFaceDetectionTime = Date.now());
      } else if (this.options.detectionMode === "pupil") {
        let n = null;
        for (let l = 0; l < o.length; ++l)
          if (o[l][3] > 20) {
            n = o[l];
            break;
          }
        n ? (this.lastValidDet && (n[0] = n[0] * 0.3 + this.lastValidDet[0] * 0.7, n[1] = n[1] * 0.3 + this.lastValidDet[1] * 0.7, n[2] = n[2] * 0.3 + this.lastValidDet[2] * 0.7), this.lastValidDet = [...n]) : this.lastValidDet ? n = this.lastValidDet : n = [240, 320, 200, 100], this.drawDetection(n, s);
      }
    }
    drawDetection(t, i) {
      if (this.options.showFaceCircle && ["face", "both"].includes(this.options.detectionMode) && (this.ctx.beginPath(), this.ctx.arc(t[1], t[0], t[2] / 2, 0, 2 * Math.PI, !1), this.ctx.lineWidth = this.options.faceCircleLineWidth, this.ctx.strokeStyle = this.options.faceCircleColor, this.ctx.stroke()), this.options.showPupilPoints && ["pupil", "both"].includes(this.options.detectionMode)) {
        let s = !1, a = !1;
        if (this.do_puploc) {
          const o = this.options.detectionMode === "pupil" ? 0.5 : 0.35, n = -0.1 * t[2];
          s = this.drawEye(t, i, -0.2, "left", o, n), a = this.drawEye(t, i, 0.2, "right", o, n);
        }
        s || a ? this.lastPupilDetectionTime = Date.now() : Date.now() - this.lastPupilDetectionTime > this.options.timeoutDuration && this.options.detectionMode === "pupil" && (this.options.onPupilTimeout(), this.lastPupilDetectionTime = Date.now());
      }
    }
    drawEye(t, i, s, a, o = 0.35, n = 0) {
      let l = t[0] + n, w = t[1] + s * t[2], f = o * t[2];
      const m = [f, f * 0.8, f * 1.2];
      let h = [-1, -1];
      for (let c of m) {
        const [u, d] = this.do_puploc(l, w, c, 63, i);
        if (u >= 0 && d >= 0) {
          h = [u, d];
          break;
        }
      }
      let [p, r] = h;
      if (p >= 0 && r >= 0)
        return this.lastValidPupilPositions[a] && (p = p * (1 - this.smoothingFactor) + this.lastValidPupilPositions[a].y * this.smoothingFactor, r = r * (1 - this.smoothingFactor) + this.lastValidPupilPositions[a].x * this.smoothingFactor), this.lastValidPupilPositions[a] = { x: r, y: p }, this.ctx.beginPath(), this.ctx.arc(r, p, 2, 0, 2 * Math.PI, !1), this.ctx.lineWidth = this.options.pupilPointsLineWidth, this.ctx.strokeStyle = this.options.pupilPointsColor, this.ctx.stroke(), this.options.onPupilDetected({ x: r, y: p, eye: a }), !0;
      if (this.lastValidPupilPositions[a]) {
        const c = this.lastValidPupilPositions[a];
        return this.ctx.beginPath(), this.ctx.arc(c.x, c.y, 2, 0, 2 * Math.PI, !1), this.ctx.lineWidth = this.options.pupilPointsLineWidth, this.ctx.strokeStyle = this.options.pupilPointsColor, this.ctx.stroke(), !0;
      }
      return !1;
    }
    start(t) {
      if (!this.initialized)
        throw new Error("FaceDetector must be initialized first");
      if (!(t instanceof HTMLVideoElement))
        throw new Error("Video element is required");
      this.currentVideo = t, this.processInterval = setInterval(() => this.processFace(t), 1e3 / 30), (this.options.detectionMode === "pupil" || this.options.detectionMode === "both") && (this.pupilTimeoutInterval = setInterval(() => {
        Date.now() - this.lastPupilDetectionTime > this.options.timeoutDuration && this.options.onPupilTimeout();
      }, 1e3));
    }
    stop() {
      this.initialized = !1, this.processInterval && (clearInterval(this.processInterval), this.processInterval = null), this.pupilTimeoutInterval && (clearInterval(this.pupilTimeoutInterval), this.pupilTimeoutInterval = null), this.stopCapturing(), this.currentVideo = null;
    }
  }
  typeof C < "u" && C.exports ? C.exports = k : typeof window < "u" && (window.pico || (window.pico = x), window.lploc || (window.lploc = F), window.FaceDetector = k);
});
export default R();
