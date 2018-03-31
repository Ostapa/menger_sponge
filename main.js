function init() {
    let scene = new THREE.Scene();
    let stats = new Stats();
    document.body.appendChild(stats.domElement);

    // setup 2 lights 
    let leftLight = getSpotLight(1, 'rgb(255, 220, 180)');
    let rightLight = getSpotLight(1, 'rgb(255, 220, 180)');
    let bottomLight = getPointLight(.33, 'rgb(255, 220, 180)');

    leftLight.position.x = -5;
    leftLight.position.y = 15;
    leftLight.position.z = -4;

    rightLight.position.x = 5;
    rightLight.position.y = 15;
    rightLight.position.z = -4;

    bottomLight.position.x = 0;
    bottomLight.position.y = 10;
    bottomLight.position.z = 0;

    scene.add(leftLight, rightLight, bottomLight);

    // setup camera 
    let cameraGroup = new THREE.Group();
    let camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 1, 1000);
    camera.position.x = 0;
    camera.position.y = 15;
    camera.position.z = 50;
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

function update(renderer, scene, camera, stats, controls) {
    renderer.render(scene, camera);
    controls.update();
    stats.update();

    requestAnimationFrame(() => {
        update(renderer, scene, camera, stats, controls);
    });
}

var scene = init(); // to access scene object in the browser's console