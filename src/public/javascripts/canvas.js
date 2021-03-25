/**
 * this file contains the functions to control the drawing on the canvas
 */
let room;
let userId;
let color = 'red', thickness = 4;

let pathBuffer = []

function pushPath(data){
    pathBuffer.push(data)

    let cvx = document.getElementById('canvas');
    let ctx = cvx.getContext('2d');

    drawOnCanvas(ctx, data.canvas.width, data.canvas.height, data.paths[0].x1, data.paths[0].y1, data.paths[0].x2, data.paths[0].y2, data.color, data.thickness)
}

function redrawPaths(){
    let cvx = document.getElementById('canvas');
    let ctx = cvx.getContext('2d');
        
    pathBuffer.forEach(data => {
        drawOnCanvas(ctx, data.canvas.width, data.canvas.height, data.paths[0].x1, data.paths[0].y1, data.paths[0].x2, data.paths[0].y2, data.color, data.thickness)
    });
}

function clearPaths(){
    pathBuffer = []

    let canvas_jq = $('#canvas');
    let canvas = document.getElementById('canvas');
    let ctx = canvas.getContext('2d');
    
    let c_width = canvas_jq.width();
    let c_height = canvas_jq.height();
    ctx.clearRect(0, 0, c_width, c_height);
}


/**
 * it inits the image canvas to draw on. It sets up the events to respond to (click, mouse on, etc.)
 * @param onDrawingCallback Callback function when user is drawing.
 */
function initCanvas(onDrawingCallback) {
    let flag = false,
        prevX, prevY, currX, currY = 0;
    let canvasJq = $('#canvas');
    let canvasEle = document.getElementById('canvas');
    let imgEle = document.getElementById('image');

    // event on the canvas when the mouse is on it
    canvasJq.on('mousemove mousedown mouseup mouseout', function (e) {
        prevX = currX;
        prevY = currY;
        currX = e.clientX - canvasJq.position().left;
        currY = e.clientY - canvasJq.position().top;
        if (e.type === 'mousedown') {
            flag = true;
        }
        if (e.type === 'mouseup' || e.type === 'mouseout') {
            flag = false;
        }
        // if the flag is up, the movement of the mouse draws on the canvas
        if (e.type === 'mousemove') {
            if (flag) {                
                data = { canvas: { width:canvasEle.width, height:canvasEle.height }, paths: [{ x1:prevX, y1:prevY, x2:currX, y2:currY }], color:color, thickness:thickness };
                pushPath(data);
                onDrawingCallback(data);
            }
        }
    });

    // this is called when the src of the image is loaded
    // this is an async operation as it may take time
    imgEle.addEventListener('load', () => {
        repositionCanvas();
    });

    window.addEventListener('resize', () => {
        repositionCanvas();
    });

    // If the image has already been loaded.
    if (imgEle.naturalHeight && imgEle.clientWidth > 0) {
        repositionCanvas();
    }
}

function repositionCanvas(){
    let canvas = document.getElementById('canvas');
    let img = document.getElementById('image');
    
    canvas.width = img.clientWidth;
    canvas.height = img.clientHeight;

    redrawPaths();
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
