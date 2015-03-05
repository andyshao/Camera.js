# Camera.js
A simple Camera object to invoke HTML5's Stream API (getUserMedia) using JavaScript.

## Browser Compatibility
| Google Chrome | Firefox | Internet Explorer | Opera | Safari |
| :-----------: | :-----: | :---------------: | :---: | :----: |
| 22+           | 17+     | N/A               | 18+   | N/A    |

## Getting Started
### HTML

```html
<script type="text/javascript" src="Camera.js"></script>
```

### JS

```javascript
// Set the navigator.getUserMedia to the appropriate browser
navigator.getUserMedia = navigator.getUserMedia||navigator.webkitGetUserMedia||
navigator.mozGetUserMedia||navigator.msGetUserMedia;


// Set the window.URL object to the appropriate browser
window.URL = window.URL||window.webkitURL||window.mozURL||window.msURL;

// If the browser supports getUserMedia, create the camera object
if (navigator.getUserMedia) {
	var camera = new Camera(minWidth, minHeight, videoTagID, canvasTagID, imageTagID, scale);
}
```

## Functions
#### constructor
    Creates the Camera object

    minWidth - integer - minimum width of the video webcam wanted
    minHeight - integer - minimum height of the video webcam wanted
    videoTagID - string - id of video element in DOM - where the video will be streaming
    canvasTagID - string - id of canvas element in DOM - where the video frame will be captured
    imageTagID - string - id of image element in DOM - where the picture will be showed as an image
    scale - integer - scales the video to the scale size e.g. 640x480 at scale = .55 will scale the video element to 352x264
#### startCamera(success, error)
    Grabs the video feed from webcam

    success - function - calls success after the camera object successfully streams video from webcam
    error - function - calls error after the camera object fails to stream video from webcam
#### stopCamera(success, error)
    Stops the video feed from webcam

    success - function - calls success after the video stream is successfully stopped
    error - function - calls error after the video stream fails to stop
#### takePicture(callback)
    Takes a frame from webcam and stores it as a picture
    
    callback - function - calls callback after taking a picture from the stream
#### rotateLeft()
    Rotates the video/canvas element left (or -90 degrees)
#### rotateRight()
    Rotates the video/canvas element right (or 90 degrees)