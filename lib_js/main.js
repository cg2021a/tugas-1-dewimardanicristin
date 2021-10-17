let current = document.querySelector("#score_id");
let minArea = -35;
let maxArea = 35;

const colorList = [0x7A9660, 0x10D4F2, 0xEF1524, 
					0xDF07F7, 0x2C29F2, 0x29E1F2, 
					0x9da8fff, 0x9f076e, 0x9f40d9];

let getRandom = function (min, max) {
	let random = Math.random() * (max - min) + min;
	return random;
}

let x,y,z;
function generateObjek(){
	x = getRandom(minArea, maxArea);
	y = getRandom(minArea, maxArea);
	z = getRandom(minArea, maxArea);
}

let dodecahedron;
function createdodecahedron() {
	const color = colorList[Math.floor(getRandom(0, 9))];
	let geometry = new THREE.DodecahedronGeometry(7)
	let material = new THREE.MeshPhongMaterial({
					color: color,
	});
	generateObjek();
	dodecahedron = new THREE.Mesh(geometry, material);
	dodecahedron.position.set(x, y, z);
	scene.add(dodecahedron);
}

function removeObj(objek) {
	objek.geometry.dispose();
	objek.material.dispose();
	scene.remove(objek);
	renderer.renderLists.dispose();
}

let score = 0;
let selected = [];
let original = [];
function calculate_score() {
	if (selected[0].material.color.getHex() === selected[1].material.color.getHex()) {
		selected.forEach(object => {
			removeObj(object);
		});
		score = score + 3;
	}
	else {
		score = score - 1;
	}
	current.innerHTML = score;
	original.length = 0;
	selected.length = 0;
}

let onMouseClick = function (event) {
	clicked = 0;
	mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
	rayCast.setFromCamera(mouse, camera);

	let intersects = rayCast.intersectObjects(scene.children, false);

	if (intersects[0]) {
		let firstObject = intersects[0].object;
		if (selected.length > 0) {
			if (firstObject.uuid === selected[0].uuid) {
				firstObject.material.emissive.setHex(0x000000);
				selected = [];
				originalColors = [];
				return;
			}
		}

		selected.push(firstObject);
		original.push(firstObject.material.color.getHex());
		if (selected.length > 1) {
			calculate_score();
		}

		if (selected.length == 1) {
			if (clicked == 1) {
				selected.pop(firstObject);
				original.pop(firstObject.material.color.getHex());
			}
			clicked = 1;
		}
	}
}

let scene, camera, renderer, aLight, pLight, rayCast, mouse;
function init() {
	//set scene
	scene = new THREE.Scene();
	scene.background = new THREE.Color(0x135B55);;
   
	//set camera
	setCamera();

	//set lighting
	setLight();
	rayCast = new THREE.Raycaster();
	mouse = new THREE.Vector2();
	mouse.x = mouse.y = -1;
          
	for(let i = 0; i < 75; i++){
		createdodecahedron();
	}
	createRender();
};

function setCamera(){
	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight,1, 1000);
	const fov = 90;
  	const aspect = 1; 
  	const near = 0.1;
  	const far = 100;
	return camera.position.set(fov, aspect, near, far);
}

function setLight(){
	//setlighting
	aLight = new THREE.AmbientLight(0xffffff, 0.8);
	pLight = new THREE.PointLight(0xffffff, 1);
	pLight.position.set(0, 0, 0);
	scene.add(aLight);
	scene.add(pLight);
}

function createRender(){
	document.addEventListener("click", onMouseClick);
	renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);

	document.body.appendChild(renderer.domElement);

	const controls = new THREE.OrbitControls(camera, renderer.domElement);

	renderer.render(scene, camera, controls);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}


let clock = new THREE.Clock();

let flag = 0;
let speed = 0.015;
let base = 0.015;

let mainLoop = function () {
	// decGeo();
	if (scene.children.length >= 75) {
		flag = 0;
		speed = base;
		current.innerHTML = score;
	} 
	else {
		flag += speed;
	}
	if (flag > 1) {
		createCube();
		flag = 0;
		speed += 0.002;

	}
  
	const elapsedTime = clock.getElapsedTime();

	if (selected.length > 0) {
		selected[0].material.emissive.setHex(elapsedTime % 0.5 >= 0.25 ? original[0] : 0x000000);
	}
	
	renderer.render(scene, camera);
	requestAnimationFrame(mainLoop);
};

init();
mainLoop();


document.getElementById("btn_id").addEventListener("click", function () {
	location.reload();
});