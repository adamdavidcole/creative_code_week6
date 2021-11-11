import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";
import { Int8Attribute } from "three";

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

const parameters = {
  sphereCount: 1000,
  emptyCenterSphereRadius: 7,
  emptyCenterSpherePosition: new THREE.Vector3(0, 2, 0),
};

const emptyCenterSphereGeometry = new THREE.SphereGeometry(
  parameters.emptyCenterSphereRadius,
  32,
  16
);
const emptyCenterSphere = new THREE.Mesh(emptyCenterSphereGeometry);

function intersectsEmptyCenterSphere(sphereRadius, spherePosition) {
  const { emptyCenterSphereRadius, emptyCenterSpherePosition } = parameters;

  return (
    spherePosition.distanceTo(emptyCenterSpherePosition) <=
    sphereRadius + emptyCenterSphereRadius
  );
}

console.log("emptyCenterSphere", emptyCenterSphere);

// Textures
const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();

const doorColorTexture = textureLoader.load("/textures/door/color.jpg");
const doorAlphaTexture = textureLoader.load("/textures/door/alpha.jpg");
const doorAmbientOcclusionTexture = textureLoader.load(
  "/textures/door/ambientOcclusion.jpg"
);
const doorHeightTexture = textureLoader.load("/textures/door/height.jpg");
const doorNormalTexture = textureLoader.load("/textures/door/normal.jpg");
const doorMetalnessTexture = textureLoader.load("/textures/door/metalness.jpg");
const doorRoughnessTexture = textureLoader.load("/textures/door/roughness.jpg");
const matcapTexture = textureLoader.load("/textures/matcaps/8.png");
const gradientTexture = textureLoader.load("/textures/gradients/5.jpg");

const environmentMapTexture = cubeTextureLoader.load([
  "/textures/environmentMaps/0/px.jpg",
  "/textures/environmentMaps/0/nx.jpg",
  "/textures/environmentMaps/0/py.jpg",
  "/textures/environmentMaps/0/ny.jpg",
  "/textures/environmentMaps/0/pz.jpg",
  "/textures/environmentMaps/0/nz.jpg",
]);

// Canvas
const canvas = document.querySelector("canvas.webgl");
const video = document.getElementById("video");

// Scene
const scene = new THREE.Scene();

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const light = new THREE.PointLight(0xffffff, 0.5);
light.position.x = 2;
light.position.y = 3;
light.position.z = 4;
scene.add(light);

// function init() {
//   const videoTexture = new THREE.VideoTexture(video);
// }

/**
 * Objects
 */
// const material = new THREE.MeshBasicMaterial()
// material.map = doorColorTexture
// material.color = new THREE.Color('#ff0000')
// material.wireframe = true
// material.transparent = true
// material.opacity = 0.5
// material.alphaMap = doorAlphaTexture
// material.side = THREE.DoubleSide
// material.flatShading = true

// const material = new THREE.MeshNormalMaterial()
// material.flatShading = true

// const material = new THREE.MeshMatcapMaterial()
// material.matcap = matcapTexture

// const material = new THREE.MeshDepthMaterial()

// const material = new THREE.MeshLambertMaterial()

// const material = new THREE.MeshPhongMaterial()
// material.shininess = 100
// material.specular = new THREE.Color(0x1188ff)

// const material = new THREE.MeshToonMaterial()
// gradientTexture.generateMipmaps = false
// gradientTexture.minFilter = THREE.NearestFilter
// gradientTexture.magFilter = THREE.NearestFilter
// material.gradientMap = gradientTexture

// const material = new THREE.MeshStandardMaterial()
// material.metalness = 0
// material.roughness = 1
// gui.add(material, 'metalness').min(0).max(1).step(0.0001)
// gui.add(material, 'roughness').min(0).max(1).step(0.0001)
// material.map = doorColorTexture
// material.aoMap = doorAmbientOcclusionTexture
// material.aoMapIntensity = 1
// material.displacementMap = doorHeightTexture
// material.displacementScale = 0.05
// material.metalnessMap = doorMetalnessTexture
// material.roughnessMap = doorRoughnessTexture
// material.normalMap = doorNormalTexture
// material.normalScale.set(0.5, 0.5)
// material.transparent = true
// material.alphaMap = doorAlphaTexture

// const material = new THREE.MeshPhysicalMaterial()
// material.metalness = 0
// material.roughness = 1
// gui.add(material, 'metalness').min(0).max(1).step(0.0001)
// gui.add(material, 'roughness').min(0).max(1).step(0.0001)
// material.map = doorColorTexture
// material.aoMap = doorAmbientOcclusionTexture
// material.aoMapIntensity = 1
// material.displacementMap = doorHeightTexture
// material.displacementScale = 0.05
// material.metalnessMap = doorMetalnessTexture
// material.roughnessMap = doorRoughnessTexture
// material.normalMap = doorNormalTexture
// material.normalScale.set(0.5, 0.5)
// material.transparent = true
// material.alphaMap = doorAlphaTexture
// material.clearcoat = 1
// material.clearcoatRoughness = 0

// Textures
const videoTexture = new THREE.VideoTexture(video);

// Materials

const material = new THREE.MeshStandardMaterial({
  //   map: videoTexture,
});
material.metalness = 0.7;
material.roughness = 0.2;
gui.add(material, "metalness").min(0).max(1).step(0.0001);
gui.add(material, "roughness").min(0).max(1).step(0.0001);
material.envMap = environmentMapTexture;
material.map = videoTexture;
// material.envMap = videoTexture;

const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 64, 64), material);
sphere.geometry.setAttribute(
  "uv2",
  new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2)
);
sphere.position.x = -1.5;
sphere.position.y = 0.5;

const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 100, 100), material);
plane.geometry.setAttribute(
  "uv2",
  new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2)
);
plane.position.y = 0.5;

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 64, 128),
  material
);
torus.geometry.setAttribute(
  "uv2",
  new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2)
);
torus.position.x = 1.5;
torus.position.y = 0.5;
scene.add(sphere, plane, torus);

// generate ground
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(50, 50, 100, 100),
  material
);
ground.rotateX(-Math.PI / 2);
scene.add(ground);

// generate spheres
const spheres = [];
for (let i = 0; i < parameters.sphereCount; i++) {
  const radius = Math.random() * 2;
  const geometry = new THREE.SphereGeometry(radius, 32, 16);
  const sphere = new THREE.Mesh(geometry, material);

  sphere.position.x = (Math.random() - 0.5) * 20;
  sphere.position.y = (Math.random() - 0.5) * 2;
  sphere.position.z = (Math.random() - 0.5) * 20;

  if (!intersectsEmptyCenterSphere(radius, sphere.position)) {
    scene.add(sphere);
  }
}

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  const constraints = {
    video: { width: 1280, height: 720, facingMode: "user" },
  };

  navigator.mediaDevices
    .getUserMedia(constraints)
    .then(function (stream) {
      // apply the stream to the video element used in the texture

      video.srcObject = stream;
      video.play();
    })
    .catch(function (error) {
      console.error("Unable to access the camera/webcam.", error);
    });
} else {
  console.error("MediaDevices interface not available.");
}

/**
 * Camera
 */
// Base camera
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 1;
camera.position.y = 2;
camera.position.z = 3;

// camera.rotateY(Math.PI / 2);

camera.position.set(0, 2, 3);
// camera.lookAt(new THREE.Vector3(0, 2, 0));
// camera.up = new THREE.Vector3(0, 1, 0);

scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enabled = true;

// controls.target = new THREE.Vector3(0, 2, 0);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update objects
  sphere.rotation.y = 0.1 * elapsedTime;
  plane.rotation.y = 0.1 * elapsedTime;
  torus.rotation.y = 0.1 * elapsedTime;

  sphere.rotation.x = 0.15 * elapsedTime;
  plane.rotation.x = 0.15 * elapsedTime;
  torus.rotation.x = 0.15 * elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
