function init() {
    let scene = new THREE.Scene();
    let stats = new Stats();
    let gui = new dat.GUI();
    document.body.appendChild(stats.domElement);

    let box = getBox(0, 0, 0, 30, new THREE.MeshPhongMaterial({ color: 'rgb(51, 51, 51)', wireframe: true }));
    box.name = 'box';

    let spongeList = [];
    spongeList.push(box);

    let guiControls = new function () {
        this.iterations = 0;
    }

    let spongeGroup = new THREE.Group();
    spongeGroup.name = 'sponge';
    spongeList = generateBoxes(spongeList, 2);
    spongeList.forEach((box) => {
        spongeGroup.add(box);
    });

    scene.add(spongeGroup);

    // setup 2 lights 
    let leftLight = getSpotLight(1, 'rgb(51, 255, 255)');
    let rightLight = getSpotLight(1, 'rgb(255, 51, 51)');
    let bottomLight = getPointLight(.33, 'rgb(255, 220, 180)');
    let ambientLight = getAmbientLight(.5);

    leftLight.position.x = -15;
    leftLight.position.y = spongeList[spongeList.length - 1].position.y + 15;
    leftLight.position.z = -4;

    rightLight.position.x = 15;
    rightLight.position.y = spongeList[spongeList.length - 1].position.y + 15;
    rightLight.position.z = -4;

    bottomLight.position.x = 0;
    bottomLight.position.y = 10;
    bottomLight.position.z = 0;

    scene.add(leftLight, rightLight, bottomLight, ambientLight);

    let plane = getPlane(100);
    plane.position.y = -30;
    plane.rotation.x = Math.PI / 2;
    scene.add(plane);

    // setup camera 
    let cameraGroup = new THREE.Group();
    let camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 1, 1000);
    camera.position.x = 0;
    camera.position.y = 45;
    camera.position.z = 150;
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    cameraGroup.add(camera);
    cameraGroup.name = 'cameraGroup';
    scene.add(cameraGroup);

    // renderer
    let renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setClearColor('rgb(255, 51, 51)');
    document.getElementById('webgl').appendChild(renderer.domElement);

    let controls = new THREE.OrbitControls(camera, renderer.domElement);

    update(renderer, scene, camera, stats, controls);

    return scene;
}

function getBox(x, y, z, size, material) {
    let box = new THREE.BoxGeometry(size, size, size);
    let boxObj = new THREE.Mesh(box, material);
    boxObj.castShadow = true;
    boxObj.position.x = x;
    boxObj.position.y = y;
    boxObj.position.z = z;
    return boxObj;
}

function generateBoxes(spongeList, n) {
    for (let i = 0; i < n; i++) {
        let next = [];
        spongeList.forEach((box) => {
            let temp = generateBox(box, box.geometry.parameters.width);
            temp.forEach((box) => {
                next.push(box);
            });
        });
        spongeList = next;
    }
    return spongeList;
}

// function to generate boxes 
function generateBox(box, size) {
    let totalBoxes = [];
    let n = 0;
    for (let x = -1; x < 2; x++) {
        for (let y = -1; y < 2; y++) {
            for (let z = -1; z < 2; z++) {
                let sum = Math.abs(x) + Math.abs(y) + Math.abs(z);
                let newSize = size / 3;
                if (sum > 1) {
                    let boxObj = getBox(
                        box.position.x + x * newSize,
                        box.position.y + y * newSize,
                        box.position.z + z * newSize, newSize,
                        new THREE.MeshPhongMaterial({ color: 0xffffff }));
                    totalBoxes.push(boxObj);
                }
            }
        }
    }
    return totalBoxes;
}


function getPointLight(intensity, color) {
    let light = new THREE.PointLight(color, intensity);
    light.castShadow = true;

    return light;
}

function getSpotLight(intensity, color) {
    let light = new THREE.SpotLight(color, intensity);
    light.penumbra = .5;
    light.castShadow = true;

    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;
    light.shadow.camera.near = 0.1;
    light.shadow.camera.far = 500
    light.shadow.camera.fov = 30
    light.shadow.bias = 0.001;

    return light;
}

function getAmbientLight(intensity) {
    let light = new THREE.AmbientLight('rgb(10, 30, 50)', intensity);
    return light;
}

function getPlane(size) {
    let geometry = new THREE.PlaneGeometry(size, size);
    let material = new THREE.MeshPhongMaterial({
        color: 'rgb(120,120,120)',
        side: THREE.DoubleSide
    });
    let mesh = new THREE.Mesh(geometry, material);
    mesh.receiveShadow = true;
    return mesh;
}

function update(renderer, scene, camera, stats, controls) {

    let sponge = scene.getObjectByName('sponge');
    sponge.rotation.x += .01;
    sponge.rotation.y += .01;
    sponge.rotation.z += .01;

    renderer.render(scene, camera);
    controls.update();
    stats.update();

    requestAnimationFrame(() => {
        update(renderer, scene, camera, stats, controls);
    });
}

var scene = init(); // to access scene object in the browser's console