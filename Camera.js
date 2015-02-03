// Global Namespace
var Camera = Camera || function(minWidth, minHeight, video, canvas, image) {
        console.log('camera obj created!');

        console.log('camera obj setting up variables...');

        // Set the navigator.getUserMedia to the appropriate browser
        navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia || navigator.msGetUserMedia);

        // Set the window.URL object to the appropriate browser
        window.URL = (window.URL || window.webkitURL || window.mozURL || window.msURL);

        console.log('camera minwidth x midheight: ' + minWidth + 'x' + minHeight);

        this.video = video;

        this.video.width = minWidth;
        this.video.height = minWidth;

        this.video.style.transform = (this.video.style.transform || this.video.style.webkitTransform || this.video.style.mozTransform ||
        this.video.style.msTransform || this.video.style.oTransform);

        this.canvas = canvas;

        this.image = image;

        this.resolution = {
            "mandatory": {
                "minWidth": minWidth,
                "minHeight": minHeight
            }
        };

        // Setting up the mediaStream so that when the user closes the video, the stream ends
        this.mediaStream = null;

        // Aspect ratio
        this.aspectRatio = null;

        // Video height for aspect ratio
        this.videoHeight = null;

        // Video width for aspect ratio
        this.videoWidth = null;

        // Video rotation
        this.videoRotation = 0;
    };

Camera.prototype.startCamera = function(callback) {
    var self = this;

    //navigator.style.transform = navigator.style.webkitTransform || navigator.style.mozTransform ||
    //    navigator.style.msTransform || navigator.style.oTransform || navigator.style.transform;

    //console.log(navigator.style.transform);

    if (navigator.getUserMedia) {
        navigator.getUserMedia(
            {
                audio: false,
                video: self.resolution
            },
            function successCallBack(stream) {
                self.mediaStream = stream;
                self.video.src = (window.URL && window.URL.createObjectURL(stream));
                self.video.play();

                var retryCount = 0;
                var retryLimit = 50;

                camera.video.onplaying = function(e) {
                    var videoWidth = this.videoWidth;
                    var videoHeight = this.videoHeight;

                    if (!videoWidth || !videoHeight) {
                        if (retryCount < retryLimit) {
                            retryCount++;
                            window.setTimeout(function () {
                                video.pause();
                                video.play();
                            }, 100);
                        }

                    } else if (videoWidth && videoHeight) {
                        self.canvas.width = videoWidth;
                        self.canvas.height = videoHeight;

                        self.image.width = videoWidth;
                        self.image.height = videoHeight;

                        self.aspectRatio =  Number(videoWidth/videoHeight).toFixed(2);
                        var differenceBetweenWidthHeight = (videoWidth - videoHeight);
                        console.log(differenceBetweenWidthHeight);

                        //this.style.margin = differenceBetweenWidthHeight + 'px';

                        //fixMargins(differenceBetweenWidthHeight, self.canvas, self.image);
                    } else {
                        console.log("An error has occurred: Can't retrieve video width and height");
                    }
                };

                callback();
            }, function errorCallback(error) {
                console.log("An error occurred: " + error.code);
            }
        );
    }


};

Camera.prototype.stopCamera = function(callback) {
    this.mediaStream.stop();
    this.mediaStream = null;
    this.video.pause();

    callback();
};

Camera.prototype.takePicture = function() {
    var self = this;

    // Get the frame from the video
    var ctx = self.canvas.getContext('2d');


    if (self.videoRotation != 0) {
        self.canvas.height = self.video.videoWidth;
        self.canvas.width = self.video.videoHeight;

        self.image.height = self.video.videoWidth;
        self.image.width = self.video.videoHeight;

        switch (self.videoRotation) {
            case 90:
                ctx.translate(self.canvas.width, 0);
                break;
            case -90:
                ctx.translate(0, self.canvas.height);
                break;
            default:

                break;
        }

        // Rotate the 2d context base on the degree (90 or -90)
        ctx.rotate(self.videoRotation * (Math.PI/180));
    } else {
        self.canvas.height = self.video.videoHeight;
        self.canvas.width = self.video.videoWidth;

        self.image.height = self.video.videoHeight;
        self.image.width = self.video.videoWidth;
    }

    ctx.drawImage(self.video, 0, 0);

    var imageBaseSrc64 = self.canvas.toDataURL('image/png');

    self.image.src = imageBaseSrc64;
};

Camera.prototype.rotateLeft = function() {
    if (this.videoRotation != -90) {
        this.videoRotation -= 90;
        this.video.style.transform = 'rotate(' + this.videoRotation + 'deg)';
    }
};

Camera.prototype.rotateRight = function() {
    if (this.videoRotation != 90) {
        this.videoRotation += 90;
        this.video.style.transform = 'rotate(' + this.videoRotation + 'deg)';
    }
};