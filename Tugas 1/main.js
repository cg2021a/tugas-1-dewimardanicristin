function main() {
    var canvas = document.getElementById("myCanvas");
    var gl = canvas.getContext("webgl");

    const kiri = {
        
        colorAtas : [1,1,1],
        colorDepan : [0.630, 0.624, 0.624],

        // titik-titik penyusun gambar kiri
        A : [-0.60, 0.49],
        B : [-0.37, 0.49],
        C : [-0.30, 0.38],
        D : [-0.67, 0.38],
        E : [-0.67, -0.75],
        F : [-0.30, -0.75],
    }

    const kanan = {
        colorAtas : [1,1,1],
        colorKiri : [0.630, 0.624, 0.624],

        // titik-titik penyusun gambar kanan
        A : [0.44, 0.48],
        B : [0.54, 0.48],
        C : [0.62, 0.36],
        D : [0.37, 0.36],
        E : [0.37, -0.75],
        F : [0.61, -0.75],
    }

    // kumpulan vertex pada gambar kiri dan kanan
    const vertices = [
        //Segitiga ABD
        ...kiri.A, ...kiri.colorAtas,
        ...kiri.B, ...kiri.colorAtas,
        ...kiri.D, ...kiri.colorAtas,//15
        //Segitiga BCD
        ...kiri.B, ...kiri.colorAtas,
        ...kiri.C, ...kiri.colorAtas,
        ...kiri.D, ...kiri.colorAtas,//30
        //Segitiga CDF
        ...kiri.C, ...kiri.colorDepan,
        ...kiri.D, ...kiri.colorDepan,
        ...kiri.F, ...kiri.colorDepan,//45
        //Segitiga DEF
        ...kiri.D, ...kiri.colorDepan,
        ...kiri.E, ...kiri.colorDepan,
        ...kiri.F, ...kiri.colorDepan,//60

        // objek pada gambar kanan
        //segitiga ABC
        ...kanan.A, ...kanan.colorAtas,//75
        ...kanan.B, ...kanan.colorAtas,
        ...kanan.C, ...kanan.colorAtas,
        //segitiga ACD
        ...kanan.A, ...kanan.colorAtas,//90
        ...kanan.C, ...kanan.colorAtas,
        ...kanan.D, ...kanan.colorAtas,

        //segitiga DCE
        ...kanan.D, ...kanan.colorKiri,//115
        ...kanan.C, ...kanan.colorKiri,
        ...kanan.E, ...kanan.colorKiri,
        //segitiga CEF
        ...kanan.C, ...kanan.colorKiri,//130
        ...kanan.E, ...kanan.colorKiri,
        ...kanan.F, ...kanan.colorKiri,
        
    ]
    var vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    var vertexShaderCode = `
        attribute vec2 aPosition;
        attribute vec3 aColor;
        varying vec3 vColor;
        uniform float uChange;
        void main() {
            gl_Position = vec4(aPosition.x, aPosition.y, 1.0, 1.0);
            vColor = aColor;
        }
    `;

    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);


    var vertexShaderSource = `
        attribute vec2 aPosition;
        attribute vec3 aColor;
        varying vec3 vColor;
        uniform float uChange;
        void main() {
            gl_Position = vec4(aPosition.x, aPosition.y, 1.0, 1.0);
            vColor = aColor;
        }
    `;

    var fragmentShaderSource = `
        precision mediump float;
        varying vec3 vColor;
        void main() {
            gl_FragColor = vec4(vColor, 1.0);
        }
    `;

    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderSource);
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderSource);


    gl.compileShader(vertexShader);
    gl.compileShader(fragmentShader);


    var shaderProgram = gl.createProgram();


    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);


    gl.linkProgram(shaderProgram);


    gl.useProgram(shaderProgram);


    var aPosition = gl.getAttribLocation(shaderProgram, "aPosition");
    gl.vertexAttribPointer(aPosition,2,gl.FLOAT,false,5 * Float32Array.BYTES_PER_ELEMENT,0);
    gl.enableVertexAttribArray(aPosition);
    var aColor = gl.getAttribLocation(shaderProgram, "aColor");
    gl.vertexAttribPointer(aColor,3,gl.FLOAT,false,5 * Float32Array.BYTES_PER_ELEMENT,2 * Float32Array.BYTES_PER_ELEMENT);
    gl.enableVertexAttribArray(aColor);

    var freeze = false;
    // Interactive graphics with mouse
    function onMouseClick(event) {
        freeze = !freeze;
    }
    document.addEventListener("click", onMouseClick);
    // Interactive graphics with keyboard
    function onKeydown(event) {
        if (event.keyCode == 32) freeze = true;
    }

    function onKeyup(event) {
        if (event.keyCode == 32) freeze = false;
    }
    document.addEventListener("keydown", onKeydown);
    document.addEventListener("keyup", onKeyup);

    // kecepatan berdasarkan NRP
    var speed = 0.0225;
    var change = 0;
    var uChange = gl.getUniformLocation(shaderProgram, "uChange");

    function moveVertices() {
        if (vertices[116] < -1.0 || vertices[66] > 1.0) {
            speed = speed * -1;
        }

        for (let i = 61; i < vertices.length; i += 5) {
            vertices[i] = vertices[i] + speed;
        }
    }


    function render() {
        moveVertices();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        change = change + speed;
        gl.uniform1f(uChange, change);

        gl.clearColor(0, 0.3, 0.6, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        var primitive = gl.TRIANGLES;
        var offset = 0;
        var nVertex = 24;
        gl.drawArrays(primitive, offset, nVertex);
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}