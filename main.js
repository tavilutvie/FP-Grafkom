Physijs.scripts.worker = "/libs/physijs_worker.js";
Physijs.scripts.ammo = "/libs/ammo.js";
let render,
  renderer,
  scene,
  light,
  scoreOneTwo = [0, 0];

let firstCamera, secondCamera, thirdCamera, fourthCamera;

function sceneInit() {
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor("#e5e5e5");
  document.body.appendChild(renderer.domElement);

  scene = new Physijs.Scene();
  scene.setGravity(new THREE.Vector3(0, -100, 0));
  const coordinates = {
    'firstCoordinate': [350, 200, 0],
    'secondCoordinate': [0, 200, -350],
    'thirdCoordinate': [-350, 200, 0],
    'fourthCoordinate': [0, 200, 350],
  }
  scene.addEventListener("update", function () {
    scene.simulate(undefined, 2);
    gameController.checkRobotPosition(robot1);
    gameController.checkRobotPosition(robot2);
    gameController.checkBallPosition(ball1);
    gameController.endGame();
  });
  
  // camera = new THREE.PerspectiveCamera(
    //   35,
    //   window.innerWidth / window.innerHeight,
    //   1,
    //   10000 
    // );
    // camera.position.set(300, 0, 0);
    // camera.lookAt(scene.position);
    // camera.far = 10000000000;
    firstCamera = new cameraWrapper(350, 200, 0, null, scene, 1);
    gameController.cameraControlsInit(firstCamera.camera, 4, coordinates, scene);
    // secondCamera = new cameraWrapper(0, 200,  -250, null, scene, 2);
    // thirdCamera = new cameraWrapper(-300, 100, 0, null, scene, 3);
    // fourthCamera = new cameraWrapper(0, 200, 250, null, scene, 4);
    
    // ORBIT CONTROLS
    // controls = new THREE.OrbitControls(firstCamera.camera, renderer.domElement);
  // controls.minPolarAngle = Math.PI * 0.3;
  // controls.maxPolarAngle = Math.PI * 0.4;
  // controls.target.set(0, 40, 0);
  // controls.enableZoom = true;
  // LIGHTS

  const firstLight = new poleLightWrapper(90, 50, -75, 0xffffff, 0.5);
  const secondLight = new poleLightWrapper(90, 50, 75, 0xffffff, 0.5);
  const thirdLight = new poleLightWrapper(-90, 50, 75, 0xffffff, 0.5);
  const fourthLight = new poleLightWrapper(-90, 50, -75, 0xffffff, 0.5);
  // spotLightHelper if needed
    // firstLight.addSpotLightHelper();
    // secondLight.addSpotLightHelper();
    // thirdLight.addSpotLightHelper();
    // fourthLight.addSpotLightHelper();
  // SKYBOX
  const skybox = new skyboxWrapper("skybox", true);

  // GROUND
  // initGroundsTemp();
  const groundObj = new levelGeometry();

  const robot1 = new robotWrapper(0, 5, 50, 0xf6cb1c, 1);
  const robot2 = new robotWrapper(0, 5, -50, 0xc74b0e, 2);

  // MOVEMENT
  gameController.robotControlsInit(robot1);
  gameController.robotControlsInit(robot2);

  // BALL

  const ball1 = new ballWrapper();

  // GUI NOT FINISHED
//   const obj = {
//     message: 'Hello World',
//     displayOutline: false,

//     maxSize: 6.0,
//     speed: 5,

//     height: 10,
//     noiseStrength: 10.2,
//     growthSpeed: 0.2,

//     type: 'three',

//     explode: function () {
//       alert('Bang!');
//     },

//     color0: "#ffae23", // CSS string
//     color1: [ 0, 128, 255 ], // RGB array
//     color2: [ 0, 128, 255, 0.3 ], // RGB with alpha
//     color3: { h: 350, s: 0.9, v: 0.3 } // Hue, saturation, value
// };
//   const gui = new dat.gui.GUI();
//   gui.remember(obj);
  
//   console.log('nyampe sini')
//   gui.add(obj, 'message');
//   gui.add(obj, 'displayOutline');
//   gui.add(obj, 'explode');

//   gui.add(obj, 'maxSize').min(-10).max(10).step(0.25);
//   gui.add(obj, 'height').step(5); // Increment amount
  
  // const cubeFolder = gui.addFolder("ball");
  // cubeFolder.add(ball1.ballObj.ballMesh.rotation, "x", 0, Math.PI * 2);
  // cubeFolder.add(ball1.ballObj.ballMesh.rotation, "y", 0, Math.PI * 2);
  // cubeFolder.add(ball1.ballObj.ballMesh.rotation, "z", 0, Math.PI * 2);
  // cubeFolder.open();
  // const cameraFolder = gui.addFolder("Camera");
  // cameraFolder.add(camera.position, "z", 0, 10);
  // cameraFolder.open();
  requestAnimationFrame(render);
  scene.simulate();
}

render = function () {
  requestAnimationFrame(render);
  renderer.render(scene, firstCamera.camera);
  // controls.update(3);
};

window.onload = sceneInit();
