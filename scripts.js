const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

function getVideo() {
    navigator.mediaDevices.getUserMedia({video: true, audio: false})
    .then(localMediaStream => {
        console.log(localMediaStream);
        // video.src = window.URL.createObjectURL(localMediaStream);
        // Code throws error. Replaced with a different form than the code along.  
        video.srcObject = localMediaStream;
        video.play();
    })
    .catch(err => {
        console.error(`Oh NOOOO!!`, err);
    })
}

function paintToCanvas() {
    const width = video.videoWidth;
    const height = video.videoHeight;
    canvas.width = width;
    canvas.height = height;

    return setInterval(() => {
        ctx.drawImage(video, 0, 0, width, height);
        //Take the pixels out
        let pixels = ctx.getImageData(0, 0, width, height);
        // Play with them
        // pixels = redEffect(pixels);
        pixels = rgbSplit(pixels);
        //Put the pixels back
        ctx.putImageData(pixels, 0, 0);
    }, 16);
}

function takePhoto() {
    // Play the sound
    snap.currentTime = 0;
    snap.play();

    // Get the data from canvas
    const data = canvas.toDataURL('image/jpeg');
    const link = document.createElement('a');
    link.href = data;
    link.setAttribute('download', 'tired');
    link.innerHTML = `<img src="${data}" alt="Tired Developer" />`;
    // This is how to do jQuery prepend in vanilla JS
    strip.insertBefore(link, strip.firstChild);
}

function redEffect(pixels) {
    for (let i = 0; i < pixels.data.length; i += 4) {
        pixels.data[i + 0] = pixels.data[i + 0] + 100; //red
        pixels.data[i + 1] = pixels.data[i + 1] - 50; //green
        pixels.data[i + 2] = pixels.data[i + 2] * 0.5;//blue
    }
    return pixels;
}

function rgbSplit(pixels) {
    for (let i = 0; i < pixels.data.length; i += 4) {
        pixels.data[i - 150] = pixels.data[i + 0]; //red
        pixels.data[i + 100] = pixels.data[i + 1]; //green
        pixels.data[i - 150] = pixels.data[i + 2]; //blue
    }
    return pixels;
}

getVideo();

video.addEventListener('canplay', paintToCanvas);