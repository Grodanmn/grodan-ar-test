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
    patternUrl: 'pattern-logo.patt',
    changeMatrixMode: 'cameraTransformMatrix'
})
scene.visible = false;

// instantiate a loader
const loader = new THREE.TextureLoader();

// load a resource
loader.load(
    // resource URL
    './1175.png',

    // onLoad callback
    function (texture) {
        // in this example we create the material when the texture is loaded
        init(texture);
    },

    // onProgress callback currently not supported
    undefined,

    // onError callback
    function (err) {
        console.error('An error happened.');
    }
);

const normalMaterial = new THREE.MeshNormalMaterial();

normalMaterial.side = THREE.FrontSide;

function init(selectedTexture) {
    const width = selectedTexture.image.width / 512;
    const height = selectedTexture.image.height / 512;

    const geometry = new THREE.BoxGeometry(width*5, 0.01, height*5);

    const textMaterial = new THREE.MeshBasicMaterial({map: selectedTexture});

    textMaterial.side = THREE.FrontSide;

    const cube = new THREE.Mesh(geometry, [
        normalMaterial,
        normalMaterial,
        textMaterial,
        normalMaterial,
        normalMaterial,
        normalMaterial,
    ]);

    cube.position.y = 0;
    cube.position.z = -geometry.parameters.width / 2;
    scene.add(cube);

    camera.position.z = 5;

    function animate() {
        requestAnimationFrame(animate);
        ArToolkitContext.update(ArToolkitSource.domElement);
        scene.visible = camera.visible;
        renderer.render(scene, camera);
    };

    animate();
}
