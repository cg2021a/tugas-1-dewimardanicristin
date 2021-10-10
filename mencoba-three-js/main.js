let scene, camera, renderer;
let rot = 0.01;

let cube;
function cubeGeometri() {
    let geometry = new THREE.BoxGeometry(0.4, 0.4, 0.4);
    let material = new THREE.MeshBasicMaterial({color: 0xEDE8E8});
    cube = new THREE.Mesh(geometry,material );
    scene.add(cube);
};

let cone;
function coneGeometri() {
    let geometry = new THREE.ConeGeometry(0.2, 0.5, 32);
    let material = new THREE.MeshPhongMaterial({ color: 0xffffff});
    cone = new THREE.Mesh(geometry, material);
    scene.add(cone);
}

let lathe;
function latheGeometry(){
    const geometry = new THREE.CircleGeometry(0.4, 2.1);
    let material = new THREE.MeshBasicMaterial({color: 0xaafbcc});
    lathe = new THREE.Mesh(geometry,material );
    scene.add(lathe);
}

let sphere;
function sphereGeometri(){
    let geometry = new THREE.SphereGeometry( 0.2, 32, 16 );
    let material = new THREE.MeshPhongMaterial({color: 0xbbaa00});
    sphere = new THREE.Mesh( geometry, material );
    scene.add(sphere);
};

let torus;
function torusGeometri(){
    let geometry = new THREE.TorusGeometry( 0.2, 0.1, 16, 100 );
    let material = new THREE.MeshPhongMaterial( { color: 0xffafbf } );
    torus = new THREE.Mesh( geometry, material );
    scene.add( torus );
};

let line, wireframe;
function torusKnotGeometri() {
    let geometry = new THREE.TorusKnotGeometry( 0.2, 0.05, 100, 16 );
    wireframe = new THREE.WireframeGeometry(geometry);
    line = new THREE.LineSegments( wireframe );
    line.material.depthTest = true;
    line.material.opacity = 0.5;
    line.material.transparent = true;

    scene.add( line );
};

function lights(){
    const ambientLight = new THREE.AmbientLight(0xD86A6A);
    const hemisphereLight = new THREE.HemisphereLight(0x404040, 0xFFFFFF, 0.5);
    const directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
    const pointLight = new THREE.PointLight( 0xffffff, 1, 100 );
    pointLight.position.set( 50, 50, 50 );
    const spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(50, 50, 50);

    scene.add(hemisphereLight);
    scene.add(ambientLight);
    scene.add(directionalLight);
};

function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    
    camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 5;
    cubeGeometri()    
    latheGeometry();
    sphereGeometri();
    coneGeometri();
    torusGeometri();
    torusKnotGeometri();
    lights();
    
    renderer = new THREE.WebGLRenderer();   
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    document.body.appendChild(renderer.domElement);
};

function cubeOne() {
    cube.rotation.z -= rot
    cube.rotation.x -= rot
    cube.position.x = -2
    cube.position.y =0.8
}

var speedRot = 0.05;
var speedPos = 0.01;

function latheGeo() {
    lathe.rotation.z -= rot
    lathe.rotation.x -= rot
    lathe.rotation.y -= rot
    lathe.position.x = 0
    lathe.position.y = -0.8
}

function sphereOne() {
    sphere.rotation.z -= rot
    sphere.rotation.x -= rot
    sphere.position.x = 0
    sphere.position.y = 0.8
}

function coneOne() {
    cone.rotation.z -= rot;
    cone.rotation.x -= rot;
    cone.position.y = 0.8
    cone.position.x = 2
}

function torusOne() {
    torus.position.x = 2
    torus.position.y = -0.8
    torus.rotation.z -= rot
    torus.rotation.x -= rot
}

function torusKnotOne() {
    line.position.x = -2
    line.position.y = -0.8
    line.rotation.z -= rot
    line.rotation.x -= rot
}

function render() {
    cubeOne();
    latheGeo();
    sphereOne();
    coneOne();
    torusOne();
    torusKnotOne();
    renderer.render(scene, camera);
    requestAnimationFrame(render);
};

init();
render();