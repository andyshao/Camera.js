// Global Namespace
var Camera = Camera || function(minWidth, minHeight, video, canvas, image, scale) {
        this.video = video;

        this.scale = scale;

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

        // Video rotation
        this.videoRotation = 0;
    };

Camera.prototype.startCamera = function(success, error) {
    var self = this;

    navigator.getUserMedia(
        {
            audio: false,
            video: self.resolution
        },
        function successCallBack(stream) {
            var retryCount = 0;
            var retryLimit = 50;

            self.mediaStream = stream;

            console.log(self.minWidth);

            self.video.src = (window.URL && window.URL.createObjectURL(stream));

            self.video.play();

            camera.video.onplaying = function(e) {
                var videoWidth = this.videoWidth;
                var videoHeight = this.videoHeight;
                self.video.width = videoWidth * self.scale;
                self.video.height = videoHeight * self.scale;


                if (!videoWidth || !videoHeight) {
                    if (retryCount < retryLimit) {
                        retryCount++;
                        window.setTimeout(function () {
                            video.pause();
                            video.play();
                        }, 100);
                    }

                } else if (videoWidth && videoHeight) {
                    self.canvas.width = videoWidth * self.scale;
                    self.canvas.height = videoHeight * self.scale;

                    self.image.width = videoWidth * self.scale;
                    self.image.height = videoHeight * self.scale;
                } else {
                    console.log("An error has occurred: Can't retrieve video width and height");
                }
            };

            success();
        }, function errorCallback(error) {
            console.log("An error occurred: " + error.code);

            error();
        }
    );
};

Camera.prototype.stopCamera = function(success, error) {
    this.mediaStream.stop();
    this.mediaStream = null;
    this.video.pause();

    if ((this.mediaStream == null) && (this.video.paused)) {
        success();
    } else {
        console.log("Error: Could not pause/stop camera");
        error();
    }
};

Camera.prototype.takePicture = function(callback) {
    var self = this;

    // Get the frame from the video
    var ctx = self.canvas.getContext('2d');

    // If the video is turned/rotated
    if (self.videoRotation % 180 != 0) {
        // Set the translate pointer to the correct coordinate before drawing
        switch (self.videoRotation) {
            case (self.videoRotation > 0):
                ctx.translate(self.canvas.width, 0);
                break;
            case (self.videoRotation < 0):
                ctx.translate(0, self.canvas.height);
                break;
            default:
                break;
        }


        self.image.height = self.video.videoWidth;
        self.image.width = self.video.videoHeight;

        // Rotate the 2d context base on the degree
        ctx.rotate(self.videoRotation * (Math.PI/180));
    } else if (self.videoRotation < 0) {
        self.image.height = self.video.videoHeight;
        self.image.width = self.video.videoWidth;

        ctx.translate(self.canvas.width, self.canvas.height);
        ctx.rotate(self.videoRotation * (Math.PI/180));
    }

    // Draw the image to the canvas
    ctx.drawImage(self.video, 0, 0);

    // Set the source
    self.image.src = self.canvas.toDataURL('image/png', 1.0);

    callback();
};

Camera.prototype.rotateLeft = function() {
    var self = this;
    self.videoRotation -= 90;

    // If rotation mod 180 is 0, then the video is horizontal
    if (self.videoRotation % 180 == 0) {
        self.canvas.height = self.video.videoHeight;
        self.canvas.width = self.video.videoWidth;

        self.video.height = self.video.videoHeight * self.scale;
    } else if (self.videoRotation % 90 == 0) {
        self.canvas.height = self.video.videoWidth;
        self.canvas.width = self.video.videoHeight;

        self.video.height = self.video.videoWidth * self.scale;
    } else {
        console.log("Error: Failed to calculate rotation");
    }

    self.video.style.transform = ' rotate(' + this.videoRotation + 'deg)';
};

Camera.prototype.rotateRight = function() {
    var self = this;
    self.videoRotation += 90;

    if (self.videoRotation % 180 == 0) {
        self.canvas.height = self.video.videoHeight;
        self.canvas.width = self.video.videoWidth;

        self.video.height = self.video.videoHeight * self.scale;
    } else if (self.videoRotation % 90 == 0) {
        self.canvas.height = self.video.videoWidth;
        self.canvas.width = self.video.videoHeight;

        self.video.height = self.video.videoWidth * self.scale;
    } else {
        console.log("Error: Failed to calculate rotation");
    }

    self.video.style.transform = ' rotate(' + this.videoRotation + 'deg)';
};