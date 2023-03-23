console.clear();

const canvas = document.getElementById("canvas");
const video = document.getElementById("video");
const context = canvas.getContext("2d");

// Use the newer navigator.mediaDevices.getUserMedia() method
// navigator.getUserMedia is deprecated and you shouldn't use it.

// We only want video, we don't need/want audio.
// You can set a preferred video size too. See docs.
// https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
let constraints = {
  video: true,
  audio: false
};

navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
  // This part of the "promise", like a callback, is
  // called when the stream becomes available
  console.log("Success - here's the stream: ", stream);

  // Connect the video object to the stream
  video.srcObject = stream;

  // Tell the video object to start playing once it's ready
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });


}).catch((error) => {
  // This part of the "promise", like a callback, is
  // called if there is an error (e.g. no camera, user denies)
  console.log("An error occurred: ", error);

});

// NOTE: if the user doesn't respond to the request for access,
// neither of the above parts of the promise (callbacks) will be called.

// Regularly copy the contents of the <video> element to the <canvas>
setInterval(() => {
  // Draw at 0,0, and force into the same width and height as the canvas
  // This may result in the image being distorted (stretched)
  context.drawImage(video, 0, 0, canvas.width, canvas.height)
}, 200);