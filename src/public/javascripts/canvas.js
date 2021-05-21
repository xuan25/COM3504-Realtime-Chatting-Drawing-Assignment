/**
 * this file contains the functions to control the drawing on the canvas
 */

// ink params

let inkColor = 'red', thickness = 4;

// store all paths on the canvas
let pathBuffer = []

/**
 * Push a path to the buffer and draw it on the canvas
 * @param data path data object
 */
function pushPath(data){
  pathBuffer.push(data)

  let cvx = document.getElementById('canvas');
  let ctx = cvx.getContext('2d');

  drawOnCanvas(ctx, data.canvas.width, data.canvas.height, data.paths[0].x1, data.paths[0].y1, data.paths[0].x2, data.paths[0].y2, data.color, data.thickness)
}

/**
 * Redraw all the paths in the buffer
 */
function redrawPaths(){
  let cvx = document.getElementById('canvas');
  let ctx = cvx.getContext('2d');
    
  pathBuffer.forEach(data => {
    drawOnCanvas(ctx, data.canvas.width, data.canvas.height, data.paths[0].x1, data.paths[0].y1, data.paths[0].x2, data.paths[0].y2, data.color, data.thickness)
  });
}

/**
 * Clear canvas
 */
function clearPaths(){
  pathBuffer = []

  let canvasJq = $('#canvas');
  let canvas = document.getElementById('canvas');
  let ctx = canvas.getContext('2d');
  
  let c_width = canvasJq.width();
  let c_height = canvasJq.height();
  ctx.clearRect(0, 0, c_width, c_height);
}


/**
 * it inits the image canvas to draw on. It sets up the events to respond to (click, mouse on, etc.)
 * @param onDrawingCallback Callback function when user is drawing. (for socket.io)
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
        data = { 
          canvas: { 
            width: canvasEle.width, 
            height: canvasEle.height 
          }, 
          paths: [
            { 
              x1: prevX, 
              y1: prevY, 
              x2: currX, 
              y2: currY 
            }
          ], 
          color: inkColor, 
          thickness: thickness 
        }
        pushPath(data);
        onDrawingCallback(data);
      }
    }
  });

  // Loaded & resize event
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

/**
 * Re-position the canvas (size & position)
 * then restore all the paths
 */
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

  ctx.beginPath();
  ctx.arc(currX, currY, thickness / 2, 0, 2 * Math.PI);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();
}
