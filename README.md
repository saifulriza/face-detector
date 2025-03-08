# Face Detector Library

A framework-agnostic face detection library.

## Installation

### Via NPM
```bash
npm install webcam-face-detector
```

```javascript
import { FaceDetector } from 'webcam-face-detector';
```

### Via CDN
```html
<script src="https://unpkg.com/webcam-face-detector/dist/webcam-face-detector.umd.js"></script>
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| timeoutDuration | number | 3000 | Duration in milliseconds before triggering timeout callbacks |
| captureInterval | number | 2000 | Interval in milliseconds between image captures |
| onFaceDetected | function | () => {} | Callback when face is detected, receives detection data |
| onFaceTimeout | function | () => {} | Callback when face is not detected for timeoutDuration |
| onPupilDetected | function | () => {} | Callback when pupil is detected, receives coordinates and eye type |
| onPupilTimeout | function | () => {} | Callback when pupils are not detected for timeoutDuration |
| onInit | function | () => {} | Callback when detector is initialized |
| onImageCaptured | function | () => {} | Callback when an image is captured, receives imageData object with dataUrl, timestamp, format, width, and height |
| showFaceCircle | boolean | true | Show/hide face detection circle |
| showPupilPoints | boolean | true | Show/hide pupil detection points |
| faceCircleColor | string | '#ff0000' | Color of face detection circle |
| pupilPointsColor | string | '#ff0000' | Color of pupil detection points |
| faceCircleLineWidth | number | 3 | Line width of face detection circle |
| pupilPointsLineWidth | number | 3 | Line width of pupil detection points |
| detectionMode | string | 'both' | Detection mode: 'face', 'pupil', or 'both' |
| resources | object | { facefinder: './resources/facefinder.bin', puploc: './resources/puploc.bin' } | Paths to required detection model files |

## Usage

### Vanilla JS
```html
<!DOCTYPE html>
<html>
<head>
    <title>Face Detector Demo</title>
    <style>
        .container {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 20px;
        }
        video {
            display: none;
        }
        canvas {
            border: 2px solid #333;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Face Detector Demo</h1>
        <video id="video"></video>
        <canvas id="canvas" width="640" height="480"></canvas>
    </div>
    
    <script src="https://unpkg.com/webcam-face-detector/dist/webcam-face-detector.umd.js"></script>
    <script>
        async function initFaceDetector() {
            const detector = new FaceDetector({
                timeoutDuration: 3000, // 
                captureInterval: 2000, // take a picture every 2 second
                onFaceDetected: (detection) => console.log(detection),
                showFaceCircle: true,    // optional: show/hide face circle
                showPupilPoints: true,   // optional: show/hide pupil points
                detectionMode: 'both',
                resources: {
                    facefinder : 'https://cdn.jsdelivr.net/gh/saifulriza/face-detector@main/src/resources/facefinder.bin',
                    puploc :'https://cdn.jsdelivr.net/gh/saifulriza/face-detector@main/src/resources/puploc.bin'
                },
                 onImageCaptured: (imageData) => {
                    console.log('image taken:', imageData.dataUrl);
                    // imageData memiliki: dataUrl, timestamp, format, width, height  
                },
            });

            const video = document.getElementById('video');
            const canvas = document.getElementById('canvas');

            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                video.srcObject = stream;
                await video.play();
                
                await detector.init(canvas);
                detector.startCapturing(video);
                detector.start(video);
            } catch (err) {
                console.error('Error:', err);
            }
        }

        // Start the face detector when page loads
        window.addEventListener('load', initFaceDetector);
    </script>
</body>
</html>
```

### React Example
```jsx
import { useEffect, useRef } from 'react';

function FaceDetectorComponent() {
    const canvasRef = useRef(null);
    const videoRef = useRef(null);

    useEffect(() => {
        const detector = new FaceDetector({
            onFaceDetected: (detection) => console.log(detection),
            showFaceCircle: true,    // optional: show/hide face circle
            showPupilPoints: false   // optional: show/hide pupil points
        });

        async function initDetector() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                videoRef.current.srcObject = stream;
                await videoRef.current.play();
                
                await detector.init(canvasRef.current);
                // detector.startCapturing(videoRef);
                detector.start(videoRef.current);
            } catch (err) {
                console.error('Error:', err);
            }
        }

        initDetector();

        return () => detector.stop();
    }, []);

    return (
        <div>
            <video ref={videoRef} style={{ display: 'none' }} />
            <canvas ref={canvasRef} width={640} height={480} />
        </div>
    );
}
```

### Vue Example
```vue
<template>
    <div>
        <video ref="video" style="display: none"></video>
        <canvas ref="canvas" width="640" height="480"></canvas>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const video = ref(null);
const canvas = ref(null);
let detector;

onMounted(async () => {
    detector = new FaceDetector({
        onFaceDetected: (detection) => console.log(detection),
        showFaceCircle: true,    // optional: show/hide face circle
        showPupilPoints: false   // optional: show/hide pupil points
    });

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.value.srcObject = stream;
        await video.value.play();
        
        await detector.init(canvas.value);
        // detector.startCapturing(video.value)
        detector.start(video.value);
    } catch (err) {
        console.error('Error:', err);
    }
});

onBeforeUnmount(() => {
    if (detector) {
        detector.stop();
    }
});
</script>
