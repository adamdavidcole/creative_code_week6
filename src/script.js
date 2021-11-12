import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as dat from "lil-gui";
import gsap from "gsap";

/**
 * Setup
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");
const video = document.getElementById("video");
const audio = new Audio("sounds/Nina Simone - I put a spell on you.mp3");

const playButtonContainer = document.getElementById("playButtonContainer");
const playButton = document.getElementById("playButton");
let playAudio = async () => {
  // remove play button
  playButtonContainer.remove();

  audio.currentTime = 0;
  audio.play();
};

// This script listens to the play button
playButton.addEventListener("click", () => {
  initScene();
  playAudio();
});

function initScene() {
  // Scene
  const scene = new THREE.Scene();

  // Debug
  // const gui = new dat.GUI();

  const parameters = {
    sphereCount: 1000,
    emptyCenterSphereRadius: 7,
    emptyCenterSpherePosition: new THREE.Vector3(0, 2, 0),
  };

  // Empty Sphere Clearing
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
  const doorMetalnessTexture = textureLoader.load(
    "/textures/door/metalness.jpg"
  );
  const doorRoughnessTexture = textureLoader.load(
    "/textures/door/roughness.jpg"
  );
  const matcapTexture = textureLoader.load("/textures/matcaps/4.png");
  const gradientTexture = textureLoader.load("/textures/gradients/5.jpg");

  const skyboxImagepaths = [
    "/textures/environmentMaps/4/px.jpg",
    "/textures/environmentMaps/4/nx.jpg",
    "/textures/environmentMaps/4/py.jpg",
    "/textures/environmentMaps/4/ny.jpg",
    "/textures/environmentMaps/4/pz.jpg",
    "/textures/environmentMaps/4/nz.jpg",
  ];
  let environmentMapTexture = cubeTextureLoader.load(skyboxImagepaths);

  /**
   * Lights
   */
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.25);
  scene.add(ambientLight);

  // const hemisphereLight = new THREE.HemisphereLight("red", "blue", 0.5);
  // scene.add(hemisphereLight);

  const light = new THREE.PointLight(0xffffff, 0.1);
  light.position.set(2, 2, 2);
  scene.add(light);

  const spotLight = new THREE.SpotLight(0xffffff, 3, 10, Math.PI * 0.15, 1, 1);

  spotLight.castShadow = true;

  spotLight.position.set(0, 2, 3);
  scene.add(spotLight);

  scene.background = environmentMapTexture;

  /**
   * Objects
   */
  // const doorMaterial = new THREE.MeshBasicMaterial();
  // doorMaterial.map = doorColorTexture;
  // doorMaterial.color = new THREE.Color("#ff0000");
  // doorMaterial.wireframe = true;
  // doorMaterial.transparent = true;
  // doorMaterial.opacity = 0.5;
  // doorMaterial.alphaMap = doorAlphaTexture;
  // doorMaterial.side = THREE.DoubleSide;
  // doorMaterial.flatShading = true;

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

  const doorMaterial = new THREE.MeshStandardMaterial();
  doorMaterial.metalness = 0;
  doorMaterial.roughness = 1;
  // gui.add(doorMaterial, "metalness").min(0).max(1).step(0.0001);
  // gui.add(doorMaterial, "roughness").min(0).max(1).step(0.0001);
  doorMaterial.map = doorColorTexture;
  doorMaterial.aoMap = doorAmbientOcclusionTexture;
  doorMaterial.aoMapIntensity = 1;
  doorMaterial.displacementMap = doorHeightTexture;
  doorMaterial.displacementScale = 0.05;
  doorMaterial.metalnessMap = doorMetalnessTexture;
  doorMaterial.roughnessMap = doorRoughnessTexture;
  doorMaterial.normalMap = doorNormalTexture;
  doorMaterial.normalScale.set(0.5, 0.5);
  doorMaterial.transparent = true;
  // doorMaterial.alphaMap = doorAlphaTexture;

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
  const videoTexture = new THREE.VideoTexture(
    video,
    THREE.CubeUVReflectionMapping
  );

  videoTexture.center = new THREE.Vector2(0.5, 0.5);
  videoTexture.wrapS = videoTexture.wrapT = THREE.ClampToEdgeWrapping;
  videoTexture.repeat.set(0.75, 0.75);

  // Materials

  const material = new THREE.MeshStandardMaterial({
    map: videoTexture,
  });
  material.metalness = 0.7;
  material.roughness = 0.2;
  // gui.add(material, "metalness").min(0).max(1).step(0.0001);
  // gui.add(material, "roughness").min(0).max(1).step(0.0001);
  material.envMap = environmentMapTexture;
  material.envMapIntensity = 1;

  // material.map = videoTexture;
  // material.alphaMap = videoTexture;
  // material.transparent = true;
  // material.opacity = 0.9;
  // material.envMap = videoTexture;

  // const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 64, 64), material);
  // sphere.geometry.setAttribute(
  //   "uv2",
  //   new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2)
  // );
  // sphere.position.x = -1.5;
  // sphere.position.y = 0.5;

  // const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 100, 100), material);
  // plane.geometry.setAttribute(
  //   "uv2",
  //   new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2)
  // );
  // plane.position.y = 0.5;

  const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 64, 128),
    material
  );
  torus.geometry.setAttribute(
    "uv2",
    new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2)
  );
  // torus.position.x = 1.5;
  // torus.position.y = 0.5;
  torus.castShadow = true;
  // scene.add(torus);

  /**
   *
   * Models
   */
  // const gltfLoader = new GLTFLoader();
  // gltfLoader.load("/models/female_hand/scene.gltf", (gltf) => {
  //   console.log(gltf);
  //   gltf.scene.scale.set(0.1, 0.1, 0.1);
  //   gltf.scene.position.set(0, -1, 0);
  //   // const mesh = gltf.scene.children[0];
  //   // console.log(mesh);
  //   gltf.scene.traverse(function (node) {
  //     if (node.isMesh) {
  //       node.castShadow = true;
  //     }
  //   });
  //   scene.add(gltf.scene);
  // });

  const gltfLoader = new GLTFLoader();
  gltfLoader.load("/models/hourglass/scene.gltf", (gltf) => {
    console.log(gltf);
    gltf.scene.scale.set(0.05, 0.05, 0.05);
    gltf.scene.position.set(0, -0.95, 0);
    // const mesh = gltf.scene.children[0];
    // console.log(mesh);
    gltf.scene.traverse(function (node) {
      if (node.isMesh) {
        node.castShadow = true;
      }
    });

    scene.add(gltf.scene);
  });

  /**
   * Geometry
   */
  // SKYBOX
  function createMaterialArray() {
    const materialArray = skyboxImagepaths.map((image) => {
      let texture = new THREE.TextureLoader().load(image);

      return new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.BackSide,
      }); // <---
    });
    return materialArray;
  }
  const skyboxGeo = new THREE.BoxGeometry(50, 50, 50);
  const skybox = new THREE.Mesh(skyboxGeo, createMaterialArray());
  scene.add(skybox);

  // GROUND
  const groundMaterial = new THREE.MeshStandardMaterial({
    map: doorColorTexture,
    envMap: environmentMapTexture,
  });
  const ground = new THREE.Mesh(
    new THREE.CylinderGeometry(3, 3, 1.25, 64),
    doorMaterial
  );
  ground.position.y = -1.25;
  ground.receiveShadow = true;
  scene.add(ground);

  // generate spheres
  const center = new THREE.Vector3(0, 2, 0);
  const spheres = [];
  for (let i = 0; i < parameters.sphereCount; i++) {
    const radius = Math.random() * 1.75;
    const geometry = new THREE.SphereGeometry(radius, 32, 16);
    const sphere = new THREE.Mesh(geometry, material);

    spheres.push(sphere);

    sphere.position.x = (Math.random() - 0.5) * 20;
    sphere.position.y = Math.random() * 5;
    sphere.position.z = (Math.random() - 0.5) * 20;

    const distance = sphere.position.sub(center);
    const directionA = new THREE.Vector3(1, 0, 0);
    const directionB = distance.clone().normalize();

    const rotationAngle = Math.acos(directionA.dot(directionB));
    const rotationAxis = directionA.clone().cross(directionB).normalize();

    sphere.rotateOnAxis(rotationAxis, rotationAngle + Math.PI);

    if (!intersectsEmptyCenterSphere(radius, sphere.position)) {
      scene.add(sphere);

      gsap.to(sphere.position, {
        delay: 18 + Math.random() * 120,
        duration: 5 + 25 * Math.random(),
        y: Math.random() * 50 + 50,
        ease: "power1.in",
      });
    }
  }

  // let angleIncrement = (2 * Math.PI) / 10;
  // for (let i = 0; i < 2 * Math.PI; i += angleIncrement) {
  //   const radius = 5;
  //   const x = Math.cos(i) * radius;
  //   const z = Math.sin(i) * radius;

  //   const geometry = new THREE.SphereGeometry(1, 32, 16);
  //   const sphere = new THREE.Mesh(geometry, material);

  //   sphere.position.x = x;
  //   sphere.position.y = 2;
  //   sphere.position.z = z;

  //   const distance = sphere.position.sub(center);
  //   const directionA = new THREE.Vector3(1, 0, 0);
  //   const directionB = distance.clone().normalize();

  //   const rotationAngle = Math.acos(directionA.dot(directionB));
  //   const rotationAxis = directionA.clone().cross(directionB).normalize();

  //   sphere.rotateOnAxis(rotationAxis, rotationAngle + Math.PI);

  //   scene.add(sphere);
  // }

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

  /**
   * Camera
   */
  // Base camera
  // const axesHelper = new THREE.AxesHelper(5);
  // scene.add(axesHelper);

  const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    100
  );
  camera.position.x = 1;
  camera.position.y = 4;
  camera.position.z = 3;

  camera.position.set(0, 4, 3);
  camera.autorot;
  // camera.lookAt(new THREE.Vector3(0, 2, 0));
  scene.add(camera);

  // Controls
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.enabled = true;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 1.0;
  controls.enableZoom = true; // prod: false
  controls.enablePan = true; // prod: false
  // controls.target = new THREE.Vector3(0, 2, 0);

  // fog
  const near = 1;
  const far = 1; // change back to 1
  const color = "lightblue";
  scene.fog = new THREE.Fog(color, near, far);
  scene.background = new THREE.Color(color);
  gsap.to(scene.fog, {
    far: 100,
    delay: 1,
    duration: 120,
  });

  gsap.to(camera.position, {
    y: 1.5,
    delay: 0,
    duration: 5,
  });

  gsap.to(camera.position, {
    z: 4,
    y: 1.75,
    delay: 18,
    duration: 10,
  });

  /**
   * Renderer
   */
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
  });
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;

  /**
   * Animate
   */
  const clock = new THREE.Clock();

  const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
  };

  tick();
}

// initScene();
// playButtonContainer.remove();
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
