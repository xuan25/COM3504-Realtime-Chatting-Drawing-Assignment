/**
 * this file contains the functions to control the drawing on the canvas
 */
let room;
let userId;
let color = 'red', thickness = 4;

/**
 * Clear local canvas
 */
function clearCanvas(){
    let canvas_jq = $('#canvas');
    let canvas = document.getElementById('canvas');
    let ctx = canvas.getContext('2d');
    let img = document.getElementById('image');
    
    let c_width = canvas_jq.width();
    let c_height = canvas_jq.height();
    ctx.clearRect(0, 0, c_width, c_height);
    
    paintImgToCanvas(img, canvas, ctx);
}


/**
 * it inits the image canvas to draw on. It sets up the events to respond to (click, mouse on, etc.)
 * @param onDrawingCallback Callback function when user is drawing.
 */
function initCanvas(onDrawingCallback) {
    let flag = false,
        prevX, prevY, currX, currY = 0;
    let canvas_jq = $('#canvas');
    let canvas = document.getElementById('canvas');
    let img = document.getElementById('image');
    let ctx = canvas.getContext('2d');

    // event on the canvas when the mouse is on it
    canvas_jq.on('mousemove mousedown mouseup mouseout', function (e) {
        prevX = currX;
        prevY = currY;
        currX = e.clientX - canvas_jq.position().left;
        currY = e.clientY - canvas_jq.position().top;
        if (e.type === 'mousedown') {
            flag = true;
        }
        if (e.type === 'mouseup' || e.type === 'mouseout') {
            flag = false;
        }
        // if the flag is up, the movement of the mouse draws on the canvas
        if (e.type === 'mousemove') {
            if (flag) {
                drawOnCanvas(ctx, canvas.width, canvas.height, prevX, prevY, currX, currY, color, thickness);
                
                data = { canvas: { width:canvas.width, height:canvas.height }, paths: [{ x1:prevX, y1:prevY, x2:currX, y2:currY }], color:color, thickness:thickness }
                onDrawingCallback(data)
            }
        }
    });

    // this is called when the src of the image is loaded
    // this is an async operation as it may take time
    img.addEventListener('load', () => {
        // it takes time before the image size is computed and made available
        // here we wait until the height is set, then we resize the canvas based on the size of the image
        let poll = setInterval(function () {
            if (img.naturalHeight && img.clientWidth > 0) {
                clearInterval(poll);
                paintImgToCanvas(img, canvas, ctx);
            }
        }, 10);
    });

    // If the image has already been loaded.
    if (img.naturalHeight && img.clientWidth > 0) {
        paintImgToCanvas(img, canvas, ctx);
    }
}

function paintImgToCanvas(img, cvx, ctx){
    img.style.display = 'block';

    // resize the canvas
    let ratioX=1;
    let ratioY=1;
    // if the screen is smaller than the img size we have to reduce the image to fit
    if (img.clientWidth > window.innerWidth){
        ratioX = window.innerWidth/img.clientWidth;
    } 
    if (img.clientHeight > window.innerHeight){
        ratioY = img.clientHeight/window.innerHeight;
    }
        
    let ratio = Math.min(ratioX, ratioY);
    // resize the canvas to fit the screen and the image
    
    cvx.width = img.clientWidth*ratio;
    cvx.height = img.clientHeight*ratio;

    // draw the image onto the canvas
    drawImageScaled(img, cvx, ctx);

    img.style.display = 'none';
}

/**
 * called when it is required to draw the image on the canvas. We have resized the canvas to the same image size
 * so ti is simpler to draw later
 * @param img
 * @param canvas
 * @param ctx
 */
function drawImageScaled(img, canvas, ctx) {
    // get the scale
    let scale = Math.min(canvas.width / img.width, canvas.height / img.height);
    // get the top left position of the image
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let x = (canvas.width / 2) - (img.width / 2) * scale;
    let y = (canvas.height / 2) - (img.height / 2) * scale;
    ctx.drawImage(img, x, y, img.width * scale, img.height * scale);


}


/**
 * this is called when we want to display what we (or any other connected via socket.io) draws on the canvas
 * note that as the remote provider can have a different canvas size (e.g. their browser window is larger)
 * we have to know what their canvas size is so to map the coordinates
 * @param ctx the canvas context
 * @param canvasWidth the originating canvas width
 * @param canvasHeight the originating canvas height
 * @param prevX the starting X coordinate
 * @param prevY the starting Y coordinate
 * @param currX the ending X coordinate
 * @param currY the ending Y coordinate
 * @param color of the line
 * @param thickness of the line
 */
function drawOnCanvas(ctx, canvasWidth, canvasHeight, prevX, prevY, currX, currY, color, thickness) {
    //get the ration between the current canvas and the one it has been used to draw on the other comuter
    let ratioX= canvas.width/canvasWidth;
    let ratioY= canvas.height/canvasHeight;
    // update the value of the points to draw
    prevX*=ratioX;
    prevY*=ratioY;
    currX*=ratioX;
    currY*=ratioY;
    ctx.beginPath();
    ctx.moveTo(prevX, prevY);
    ctx.lineTo(currX, currY);
    ctx.strokeStyle = color;
    ctx.lineWidth = thickness;
    ctx.stroke();
    ctx.closePath();
}
