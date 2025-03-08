document.addEventListener('DOMContentLoaded', () => {
    const defaultConfig = {
        timeoutDuration: 3000,
        captureInterval: 2000, // take a picture every 2 seconds
        onFaceTimeout: () => {
            console.log('Face not detected!');
        },
        onFaceDetected: (detection) => {
            console.log('Face detected:', detection);
        },
        onPupilTimeout: () => {
            console.log('Pupils not detected!');
        },
        onPupilDetected: (detection) => {
            console.log('Pupils detected:', detection);
        },
        onInit: () => {
            console.log('Face detector initialized');
        },
        onImageCaptured: (imageData) => {
          // Callback saat gambar diambil
          console.log('Gambar diambil:', imageData.dataUrl);
          // imageData memiliki: dataUrl, timestamp, format, width, height
          
        },
        resources: {
            facefinder: '../src/resources/facefinder.bin',
            puploc: '../src/resources/puploc.bin'
        },
        showFaceCircle: true,
        showPupilPoints: true,
        faceCircleColor: '#00ff00',
        pupilPointsColor: '#ff0000',
        faceCircleLineWidth: 2,
        pupilPointsLineWidth: 7,
        detectionMode: 'both'
    };

    function getConfigFromForm() {
        const config = { ...defaultConfig };
        
        const elements = {
            timeoutDuration: document.getElementById('timeoutDuration'),
            facefinderPath: document.getElementById('facefinderPath'),
            puplocPath: document.getElementById('puplocPath'),
            showFaceCircle: document.getElementById('showFaceCircle'),
            showPupilPoints: document.getElementById('showPupilPoints'),
            faceCircleColor: document.getElementById('faceCircleColor'),
            pupilPointsColor: document.getElementById('pupilPointsColor'),
            faceCircleLineWidth: document.getElementById('faceCircleLineWidth'),
            pupilPointsLineWidth: document.getElementById('pupilPointsLineWidth')
        };

        if (elements.timeoutDuration) config.timeoutDuration = parseInt(elements.timeoutDuration.value);
        if (elements.facefinderPath) config.resources.facefinder = elements.facefinderPath.value;
        if (elements.puplocPath) config.resources.puploc = elements.puplocPath.value;
        if (elements.showFaceCircle) config.showFaceCircle = elements.showFaceCircle.checked;
        if (elements.showPupilPoints) config.showPupilPoints = elements.showPupilPoints.checked;
        if (elements.faceCircleColor) config.faceCircleColor = elements.faceCircleColor.value;
        if (elements.pupilPointsColor) config.pupilPointsColor = elements.pupilPointsColor.value;
        if (elements.faceCircleLineWidth) config.faceCircleLineWidth = parseInt(elements.faceCircleLineWidth.value);
        if (elements.pupilPointsLineWidth) config.pupilPointsLineWidth = parseInt(elements.pupilPointsLineWidth.value);

        return config;
    }

    let faceDetector;

    function updateConfig() {
        if (faceDetector && faceDetector.initialized) {
            const config = getConfigFromForm();
            faceDetector.updateConfig(config);
        }
    }

    document.querySelectorAll('.detector-config').forEach(input => {
        input.addEventListener('change', updateConfig);
    });

    const startButton = document.getElementById('startButton');
    startButton.addEventListener('click', async () => {
        if(faceDetector?.initialized) return;
        
        const config = getConfigFromForm();
        faceDetector = new FaceDetector(config);
        
        const canvas = document.querySelector('canvas');
        const video = document.createElement('video');
        
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            video.srcObject = stream;
            await video.play();
            
            await faceDetector.init(canvas);
            faceDetector.startCapturing(video);
            faceDetector.start(video);
        } catch (err) {
            console.error('Error accessing webcam:', err);
        }
    });

    document.getElementById('hideCamera').addEventListener('change', function(e) {
        const canvas = document.getElementById('cameraView');
        if (e.target.checked) {
            canvas.classList.add('hidden');
        } else {
            canvas.classList.remove('hidden');
        }
    });
});
