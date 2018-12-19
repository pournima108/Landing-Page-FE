let utils = new Utils('errorMessage');
        // utils.loadCode('codeSnippet', 'codeEditor');
        let streaming = false;
        let videoInput = document.getElementById('videoInput');
        let startAndStop = document.getElementById('startAndStop');
        let canvasOutput = document.getElementById('canvasOutput');
        let canvasContext = canvasOutput.getContext('2d');
        // startAndStop.addEventListener('click', () => {
                if (!streaming) {
                    utils.clearError();
                    utils.startCamera('qvga', onVideoStarted, 'videoInput');
                } else {
                    utils.stopCamera();
                    onVideoStopped();
                }
        // });
        let framecount = 0;
        let distantFaceCount = 0;
        function onVideoStarted() {
            streaming = true;
            startAndStop.innerText = 'Stop';
            videoInput.width = videoInput.videoWidth;
            videoInput.height = videoInput.videoHeight;
            // utils.executeCode('codeEditor');
            let video = document.getElementById('videoInput');
            let src = new cv.Mat(video.height, video.width, cv.CV_8UC4);
            let dst = new cv.Mat(video.height, video.width, cv.CV_8UC4);
            let gray = new cv.Mat();
            let cap = new cv.VideoCapture(video);
            let faces = new cv.RectVector();
            let classifier = new cv.CascadeClassifier();
            // load pre-trained classifiers
            classifier.load('haarcascade_frontalface_default.xml');
            const FPS = 10;

            function processVideo() {
                try {
                    if (!streaming) {
                        // clean and stop.
                        src.delete();
                        dst.delete();
                        gray.delete();
                        faces.delete();
                        classifier.delete();
                        return;
                    }
                    let begin = Date.now();
                    // start processing.
                    cap.read(src);
                    src.copyTo(dst);
                    cv.cvtColor(dst, gray, cv.COLOR_RGBA2GRAY, 0);
                    // detect faces.

                    classifier.detectMultiScale(gray, faces, 1.1, 3, 0);
                    // draw faces.

                    //reseting framecount if user is not not stabilized
                    if (faces.size() == 0) { framecount = 0 };

                    //reseting framecount if multiple people are detected
                    if (faces.size() > 1) {

                        // console.log("detecting multiple faces... considering as croud!!! ");
                        framecount = 0;

                    }

                    //processing each frace
                    for (let i = 0; i < faces.size(); ++i) {
                        let face = faces.get(i);
                        if (faces.size() == 1) {

                            //estimating user distance from kiosk
                            // console.log(face.width, face.height);
                            if (face.width > 100) {

                                console.log("tracking face in frame", framecount++);
                                if (framecount == 10) {
                                    console.log("Taking snap after", framecount);
                                    framecount = 0;
                                    alert("took a snap");
                                    var canvas = document.getElementById("canvasOutput");
                                    var img = canvas.toDataURL("image/png");
                                    // save this img or send it to S3.
                                }
                            }


                        }
                        let point1 = new cv.Point(face.x, face.y);
                        let point2 = new cv.Point(face.x + face.width, face.y + face.height);
                        // cv.rectangle(dst, point1, point2, [255, 0, 0, 255]);
                    }
                    cv.imshow('canvasOutput', dst);
                    // schedule the next one.
                    let delay = 1000 / FPS - (Date.now() - begin);
                    setTimeout(processVideo, delay);
                } catch (err) {
                    utils.printError(err);
                }
            };
            // schedule the first one.
            setTimeout(processVideo, 0);
        }
        function onVideoStopped() {
            streaming = false;
            canvasContext.clearRect(0, 0, canvasOutput.width, canvasOutput.height);
            startAndStop.innerText = 'Start';
        }
        utils.loadOpenCv(() => {
            let faceCascadeFile = 'haarcascade_frontalface_default.xml';
            utils.createFileFromUrl(faceCascadeFile, faceCascadeFile, () => {
                startAndStop.removeAttribute('disabled');
            });
        });