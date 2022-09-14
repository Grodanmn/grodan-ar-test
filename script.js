import * as THREEx from 'threex';
import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.Camera();
scene.add(camera);
const renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document
    .body
    .appendChild(renderer.domElement);

var ArToolkitSource = new THREEx.ArToolkitSource({sourceType: 'webcam'});

ArToolkitSource.init(function () {
    setTimeout(function () {
        ArToolkitSource.onResizeElement();
        ArToolkitSource.copyElementSizeTo(renderer.domElement);
    }, 2000)
})

var ArToolkitContext = new THREEx.ArToolkitContext(
    {cameraParametersUrl: 'camera_para.dat', detectionMode: 'color_and_matrix'}
)
ArToolkitContext.init(function () {
    camera
        .projectionMatrix
        .copy(ArToolkitContext.getProjectionMatrix());
})

var ArMarkerControls = new THREEx.ArMarkerControls(ArToolkitContext, camera, {
    type: 'pattern',
    patternUrl: 'number1.patt',
    changeMatrixMode: 'cameraTransformMatrix'
})
scene.visible=false;

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
const cube = new THREE.Mesh(geometry, material);
cube.position.y = geometry.parameters.height / 2;
scene.add(cube);

camera.position.z = 5;

function animate() {
    requestAnimationFrame(animate);
    ArToolkitContext.update(ArToolkitSource.domElement);
    scene.visible = camera.visible;
    renderer.render(scene, camera);
};

animate();