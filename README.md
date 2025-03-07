# Face Detector Library

A framework-agnostic face detection library.

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| showFaceCircle | boolean | true | Show/hide face detection circle |
| showPupilPoints | boolean | true | Show/hide pupil detection points |

## Usage

### Vanilla JS
```javascript
const detector = new FaceDetector({
    onFaceDetected: (detection) => console.log(detection),
    showFaceCircle: true,    // optional: show/hide face circle
    showPupilPoints: false   // optional: show/hide pupil points
});

// Initialize with canvas
const canvas = document.querySelector('canvas');
await detector.init(canvas);

// Start detection with video
const video = document.querySelector('video');
detector.start(video);
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

<script>
export default {
    mounted() {
        const detector = new FaceDetector({
            onFaceDetected: (detection) => console.log(detection),
            showFaceCircle: true,    // optional: show/hide face circle
            showPupilPoints: false   // optional: show/hide pupil points
        });

        async function initDetector() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                this.$refs.video.srcObject = stream;
                await this.$refs.video.play();
                
                await detector.init(this.$refs.canvas);
                detector.start(this.$refs.video);
            } catch (err) {
                console.error('Error:', err);
            }
        }

        initDetector();

        this.$once('hook:beforeDestroy', () => {
            detector.stop();
        });
    }
}
</script>
