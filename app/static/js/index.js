/*----------------------
  Initialized Variables
  ----------------------*/

var photo = document.getElementById("photo");
var context = photo.getContext("2d");
var width = photo.width;
var height = photo.height;
var video = document.getElementById('video');
var board = document.getElementById("board");
var bctx = board.getContext("2d");
var drawOn = document.getElementById("drawon");
var eraserOn = document.getElementById("eraseron");
var clearButton = document.getElementById("clear");
var downloadButton = document.getElementById("download");


/*------------------
  Created Functions
  ------------------*/

var isStreamSupported = function() {
    if (navigator.mediaDevices && navigator.getUserMedia) {
        return true;
    }
    return false;
}


var getCamera = function() {
    navigator.mediaDevices.getUserMedia({video:true}).then(function(stream){
        handleVideo(stream);
    }).catch(function(error){
        console.log("error!");
    });
};

var handleVideo = function(stream) {
    video.src = window.URL.createObjectURL(stream);
};

function videoError(e) {
    alert("bad");
}

var draw = function() {
    var bImgData = snapPhoto();
    setBoard(bImgData);
};


function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

var snapPhoto = function() {
    context.drawImage(video,0,0,width,height); //x,y,width,length
    var imgData = context.getImageData(0,0,width,height);
    var data = imgData.data;

    var bImgData = bctx.getImageData(0,0,width,height);
    var bData = bImgData.data;
    var currentColor = hexToRgb(document.getElementById("color").value);
    var color;
    if (!eraserOn.checked) {
        color = currentColor;
    }
    else {
        color = {"r":255,"g":255,"b":255};
    }

    for (var i = 0; i < data.length && (drawOn.checked || eraserOn.checked); i+=4) {
        if (colorFound(data[i],data[i+1],data[i+2])) {
            bData[i] = color["r"];
            bData[i+1] = color["g"];
            bData[i+2] = color["b"];
            bData[i+3] = 255;

        }
    }
    photo.style.display = "none";
    return bImgData;
};


var setBoard = function(imgData) {
    bctx.putImageData(imgData,0,0);
};


var percentError = function(real,expected) {
    return Math.abs(expected-real)*100/expected;
};


var colorFound = function(r,g,b) {
    return b > 100 && (b > 1.5 * r) && (b > 1.5 * g);
};

/*-------------------------
  Functions to run on load
  -------------------------*/

getCamera();

video.style.cssText = "-moz-transform: scale(-1, 1); \
-webkit-transform: scale(-1, 1); -o-transform: scale(-1, 1); \
transform: scale(-1, 1); filter: FlipH;";

board.style.cssText = "-moz-transform: scale(-1, 1); \
-webkit-transform: scale(-1, 1); -o-transform: scale(-1, 1); \
transform: scale(-1, 1); filter: FlipH;";

video.style.display = "none";
photo.style.display = "none";
board.style.border = "2px solid black";

clearButton.addEventListener("click", function() {
    bctx.clearRect(0,0,width,height);
});

setInterval(function() {draw();},0);
