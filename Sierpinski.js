/**
    JavaScript code for
        Shaders
        retreiving webgl context
        buffer data

Points.js - Taken from Professor Montgomery
*/

// Main function
// Runs in Browser
function main() {
    var canvas = document.getElementById('webgl');
    var gl = getWebGLContext(canvas);
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to intialize shaders.');
        return;
    }
    var n = initVertexBuffers(gl);
    if (n < 0) {
        console.log('Failed to set the positions of the vertices');
        return;
    }
    gl.clearColor(10, 10, 10, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.LINES, 0, n);
}

function initVertexBuffers(gl) {
    //CHANGE THIS / DON'T ENTER MORE THAN 10 !!!
    var numOfIterations = 8;
    var numOfVertices = 6*((1-Math.pow(3,(numOfIterations+1)))/(1-3));
    var ourInitialTriangle = [ 0.0,  0.5, -0.5, -0.5,
                              -0.5, -0.5,  0.5, -0.5,
                               0.5, -0.5,  0.0,  0.5];

    //An Array to hold the result of createTriangles (takes iterations, our Base Triangle):
    var surrogateArray = createTriangles(numOfIterations, ourInitialTriangle);
    var verticesArray = new Float32Array(numOfVertices); 
    verticesArray = new Float32Array(surrogateArray);
    var n = numOfVertices;//For num = 6, n = 6558
                          //For num = 0, n = 6
                          //For num = 1, n = 24
                          //For num = 2, n = 78;
                          //For num = 3, n = 240;
                          //For num = 4, n = 726;
                          //For num = 7, n = 19680; 
    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log('Failed to create the buffer object');
        return -1;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verticesArray, gl.STATIC_DRAW);

    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return -1;
    }
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);

    return n;
}

//Triangle defined as (L1, L2, L3) where L1 = x1, y1, x2, y2
function createTriangles(n, T) {
    if (n == 0) {
        return T;
    }
    else {
    var midpointA = [(T[0] + T[4])/2, (T[1] + T[5])/2];
    var midpointB = [(T[4] + T[8])/2, (T[5] + T[9])/2];
    var midpointC = [(T[8] + T[0])/2, (T[9] + T[1])/2];
    //These are the lines drawn with the midpoints
    var LineA = [midpointB[0], midpointB[1], midpointA[0], midpointA[1]];
    var LineB = [midpointC[0], midpointC[1], midpointB[0], midpointB[1]];
    var LineC = [midpointA[0], midpointA[1], midpointC[0], midpointC[1]];

    //Now construct 3 Triangles given as lines
    var lowerleftT = [midpointA[0], midpointA[1],         T[4],         T[5],
                              T[4],         T[5], midpointB[0], midpointB[1],
                      midpointB[0], midpointB[1], midpointA[0], midpointA[1]];

    var lowerrightT = [midpointC[0], midpointC[1], midpointB[0], midpointB[1],
                       midpointB[0], midpointB[1],         T[8],        T[9],
                               T[8],        T[9], midpointC[0], midpointC[1]];

    var upperT      = [        T[0],         T[1], midpointA[0], midpointA[1],
                       midpointA[0], midpointA[1], midpointC[0], midpointC[1],
                       midpointC[0], midpointC[1],         T[0],         T[1]]; 

    var returnArray = T.concat(createTriangles(n-1, lowerleftT));
    returnArray = returnArray.concat(createTriangles(n-1, lowerrightT));
    returnArray = returnArray.concat(createTriangles(n-1, upperT));                  
    return returnArray;
  }
}

// Shaders
// Vertex and Fragment

var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'void main() {\n' +
  '  gl_Position = a_Position;\n' +
  '  gl_PointSize = 10.0;\n' +
  '}\n';

// Fragment shader program
// 
var FSHADER_SOURCE =
  'void main() {\n' +
  '  gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);\n' +
  '}\n';
