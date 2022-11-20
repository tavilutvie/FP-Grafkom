Physijs.scripts.worker = "/libs/physijs_worker.js";
Physijs.scripts.ammo = "/libs/ammo.js";

let render,
  ground_material,
  wall_material,
  renderer,
  scene,
  wall = {},
  ground = {},
  light,
  camera,
  scoreOneTwo = [0, 0];

function sceneInit() {
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor("#e5e5e5");
  document.body.appendChild(renderer.domElement);

  scene = new Physijs.Scene();
  scene.setGravity(new THREE.Vector3(0, -100, 0));
  scene.addEventListener("update", function () {
    scene.simulate(undefined, 2);
    gameController.checkRobotPosition(robot1, robot2);
    gameController.checkBallPosition(ball1);
  });

  camera = new THREE.PerspectiveCamera(
    35,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  camera.position.set(300, 0, 0);
  camera.lookAt(scene.position);
  scene.add(camera);

  // ORBIT CONTROLS
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.minPolarAngle = Math.PI * 0.3;
  controls.maxPolarAngle = Math.PI * 0.4;
  controls.target.set(0, 40, 0);
  controls.enableZoom = true;
  // LIGHTS
  var light = new THREE.HemisphereLight(0xd1cb1d, 0x1d29d1, 1);
  light.position.set(0, 10, 0);
  light.sh;
  scene.add(light);

  // GROUND
  loader = new THREE.TextureLoader();
  var ground_texture = loader.load("/images/field.jpg", function (texture) {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.offset.set(0, 0);
  });
  ground_material = Physijs.createMaterial(
    new THREE.MeshLambertMaterial({ map: ground_texture }),
    2,
    0.4
  );

  ground.plane = new Physijs.BoxMesh(
    new THREE.BoxGeometry(200, 1, 200),
    ground_material,
    0
  );
  ground.plane.receiveShadow = true;
  scene.add(ground.plane);

  // GROUND - BORDERS
  var border_texture = loader.load("/images/wood.jpg", function (texture) {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.offset.set(0, 0);
  });

  border_material = Physijs.createMaterial(
    new THREE.MeshLambertMaterial({
      map: border_texture,
    }),
    10,
    10
  );

  border_material.map.wrapS = border_material.map.wrapT = THREE.RepeatWrapping;
  border_material.map.repeat.set(0.5, 0.5);

  const border_height = 20;
  const borderGeoOne = new THREE.BoxGeometry(2, border_height, 200);
  const borderGeoTwo = new THREE.BoxGeometry(75, border_height, 2);

  // GROUND - BORDERS - EAST
  ground.east_border = new Physijs.BoxMesh(borderGeoOne, border_material, 0, {
    restitution: 10,
    friction: 10,
  });
  ground.east_border.position.set(99, border_height / 2 + 0.5, 0);
  scene.add(ground.east_border);

  // GROUND - BORDERS - WEST
  ground.west_border = new Physijs.BoxMesh(borderGeoOne, border_material, 0, {
    restitution: 10,
    friction: 10,
  });
  ground.west_border.position.set(-99, border_height / 2 + 0.5, 0);
  scene.add(ground.west_border);

  // GROUND - BORDERS - NORTH
  ground.north_border_1 = new Physijs.BoxMesh(
    borderGeoTwo,
    border_material,
    0,
    { restitution: 10, friction: 10 }
  );
  ground.north_border_1.position.set(-60, border_height / 2 + 0.5, -99);
  scene.add(ground.north_border_1);

  ground.north_border_2 = new Physijs.BoxMesh(
    borderGeoTwo,
    border_material,
    0,
    { restitution: 10, friction: 10 }
  );
  ground.north_border_2.position.set(60, border_height / 2 + 0.5, -99);
  scene.add(ground.north_border_2);

  // GROUND - BORDERS - SOUTH
  ground.south_border_1 = new Physijs.BoxMesh(
    borderGeoTwo,
    border_material,
    0,
    { restitution: 10, friction: 10 }
  );
  ground.south_border_1.position.set(-60, border_height / 2 + 0.5, 99);
  scene.add(ground.south_border_1);

  ground.south_border_2 = new Physijs.BoxMesh(
    borderGeoTwo,
    border_material,
    0,
    { restitution: 10, friction: 10 }
  );
  ground.south_border_2.position.set(60, border_height / 2 + 0.5, 99);
  scene.add(ground.south_border_2);
  class robot {
    constructor(rbx, rby, color, rbz) {
      let robot_texture = loader.load("/images/car.jpg", function (texture) {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.offset.set(0, 0);
      });

      let robot_material = Physijs.createMaterial(
        new THREE.MeshLambertMaterial({ map: robot_texture, color: color }),
        0.8,
        0.2
      );

      let wheel_material = Physijs.createMaterial(
        new THREE.MeshLambertMaterial({ color: 0x444444 }),
        0.9,
        0.6
      );
      let wheel_geometry = new THREE.CylinderGeometry(2, 2, 1, 20);
      // wpfx = rbx - 4.5
      // wpbx = rbx + 4.5
      // wpy = rby/2
      // wheel_pos_z = wpz;
      let wheel_pos_fx = rbx - 4.5;
      let wheel_pos_bx = rbx + 4.5;
      let wheel_pos_y = rby / 2;
      let wheel_pos_z = rbz + 6;

      // ROBOT BODY
      this.body = new Physijs.BoxMesh(
        new THREE.BoxGeometry(15, 4, 10),
        robot_material,
        3000
      );
      this.body.position.set(rbx, rby, rbz);
      this.body.receiveShadow = this.body.castShadow = true;

      scene.add(this.body);
      // WHEEL FRONT LEFT
      this.wheel_fl = new Physijs.CylinderMesh(
        wheel_geometry,
        wheel_material,
        800, // mass
        { restitution: 0, friction: 1 }
      );
      this.wheel_fl.rotation.x = Math.PI / 2;
      this.wheel_fl.position.set(wheel_pos_fx, wheel_pos_y, wheel_pos_z);
      this.wheel_fl.receiveShadow = this.wheel_fl.castShadow = true;
      scene.add(this.wheel_fl);
      this.wheel_fl_constraint = new Physijs.DOFConstraint(
        this.wheel_fl,
        this.body,
        new THREE.Vector3(wheel_pos_fx, wheel_pos_y, wheel_pos_z)
      );
      scene.addConstraint(this.wheel_fl_constraint);
      this.wheel_fl_constraint.setAngularLowerLimit({
        x: 0,
        y: -Math.PI / 8,
        z: 1,
      });
      this.wheel_fl_constraint.setAngularUpperLimit({
        x: 0,
        y: Math.PI / 8,
        z: 0,
      });

      // ------------------------------------------------------------------------------
      // WHEEL FRONT RIGHT
      this.wheel_fr = new Physijs.CylinderMesh(
        wheel_geometry,
        wheel_material,
        800, // mass
        { restitution: 0, friction: 1 }
      );
      this.wheel_fr.rotation.x = Math.PI / 2;
      this.wheel_fr.position.set(wheel_pos_fx, wheel_pos_y, wheel_pos_z - 12);
      this.wheel_fr.receiveShadow = this.wheel_fr.castShadow = true;
      scene.add(this.wheel_fr);
      this.wheel_fr_constraint = new Physijs.DOFConstraint(
        this.wheel_fr,
        this.body,
        new THREE.Vector3(wheel_pos_fx, wheel_pos_y, wheel_pos_z - 12)
      );
      scene.addConstraint(this.wheel_fr_constraint);
      this.wheel_fr_constraint.setAngularLowerLimit({
        x: 0,
        y: -Math.PI / 8,
        z: 1,
      });
      this.wheel_fr_constraint.setAngularUpperLimit({
        x: 0,
        y: Math.PI / 8,
        z: 0,
      });

      // ------------------------------------------------------------------------------
      // WHEEL BACK LEFT
      this.wheel_bl = new Physijs.CylinderMesh(
        wheel_geometry,
        wheel_material,
        800, // mass
        { restitution: 0, friction: 1 }
      );
      this.wheel_bl.rotation.x = Math.PI / 2;
      this.wheel_bl.position.set(wheel_pos_bx, wheel_pos_y, wheel_pos_z);
      this.wheel_bl.receiveShadow = this.wheel_bl.castShadow = true;
      scene.add(this.wheel_bl);
      this.wheel_bl_constraint = new Physijs.DOFConstraint(
        this.wheel_bl,
        this.body,
        new THREE.Vector3(wheel_pos_bx, wheel_pos_y, wheel_pos_z)
      );
      scene.addConstraint(this.wheel_bl_constraint);
      this.wheel_bl_constraint.setAngularLowerLimit({
        x: 0,
        y: 0,
        z: 0,
      });
      this.wheel_bl_constraint.setAngularUpperLimit({
        x: 0,
        y: 0,
        z: 1,
      });

      // ------------------------------------------------------------------------------
      // WHEEL BACK RIGHT
      this.wheel_br = new Physijs.CylinderMesh(
        wheel_geometry,
        wheel_material,
        800, // mass
        { restitution: 0, friction: 1 }
      );
      this.wheel_br.rotation.x = Math.PI / 2;
      this.wheel_br.position.set(wheel_pos_bx, wheel_pos_y, wheel_pos_z - 12);
      this.wheel_br.receiveShadow = this.wheel_br.castShadow = true;
      scene.add(this.wheel_br);
      this.wheel_br_constraint = new Physijs.DOFConstraint(
        this.wheel_br,
        this.body,
        new THREE.Vector3(wheel_pos_bx, wheel_pos_y, wheel_pos_z - 12)
      );
      scene.addConstraint(this.wheel_br_constraint);
      this.wheel_br_constraint.setAngularLowerLimit({
        x: 0,
        y: 0,
        z: 0,
      });
      this.wheel_br_constraint.setAngularUpperLimit({
        x: 0,
        y: 0,
        z: 1,
      });
    }
  }
  let robot1 = new robot(0, 5, 0xf6cb1c, 50);
  let robot2 = new robot(0, 5, 0xc74b0e, -50);

  // MOVEMENT
  document.addEventListener("keydown", function (ev) {
    switch (ev.keyCode) {
      case 65:
        // ------------------------------------------------------------------
        // Left
        robot1.wheel_fl_constraint.configureAngularMotor(
          1,
          -Math.PI / 4,
          Math.PI / 4,
          2,
          400
        );
        robot1.wheel_fr_constraint.configureAngularMotor(
          1,
          -Math.PI / 4,
          Math.PI / 4,
          2,
          400
        );
        robot1.wheel_fl_constraint.enableAngularMotor(1);
        robot1.wheel_fr_constraint.enableAngularMotor(1);
        break;

      case 68:
        // ------------------------------------------------------------------
        // Right
        robot1.wheel_fl_constraint.configureAngularMotor(
          1,
          -Math.PI / 4,
          Math.PI / 4,
          -2,
          400
        );
        robot1.wheel_fr_constraint.configureAngularMotor(
          1,
          -Math.PI / 4,
          Math.PI / 4,
          -2,
          400
        );
        robot1.wheel_fl_constraint.enableAngularMotor(1);
        robot1.wheel_fr_constraint.enableAngularMotor(1);
        break;

      case 87:
        // ------------------------------------------------------------------
        // Up
        robot1.wheel_bl_constraint.configureAngularMotor(2, 1, 0, 30, 6000);
        robot1.wheel_br_constraint.configureAngularMotor(2, 1, 0, 30, 6000);
        robot1.wheel_bl_constraint.enableAngularMotor(2);
        robot1.wheel_br_constraint.enableAngularMotor(2);
        break;

      case 83:
        // ------------------------------------------------------------------
        // Down
        robot1.wheel_bl_constraint.configureAngularMotor(2, 1, 0, -20, 24000);
        robot1.wheel_br_constraint.configureAngularMotor(2, 1, 0, -20, 24000);
        robot1.wheel_bl_constraint.enableAngularMotor(2);
        robot1.wheel_br_constraint.enableAngularMotor(2);
        break;
    }
  });

  document.addEventListener("keyup", function (ev) {
    switch (ev.keyCode) {
      case 65:
        // Left
        robot1.wheel_fl_constraint.disableAngularMotor(1);
        robot1.wheel_fr_constraint.disableAngularMotor(1);
        break;

      case 68:
        // Right
        robot1.wheel_fl_constraint.disableAngularMotor(1);
        robot1.wheel_fr_constraint.disableAngularMotor(1);
        break;

      case 87:
        // Up
        robot1.wheel_bl_constraint.disableAngularMotor(2);
        robot1.wheel_br_constraint.disableAngularMotor(2);
        break;

      case 83:
        // Down
        robot1.wheel_bl_constraint.disableAngularMotor(2);
        robot1.wheel_br_constraint.disableAngularMotor(2);
        break;
    }
  });

  // MOVEMENT 2nd ROBOT
  document.addEventListener("keydown", function (ev) {
    switch (ev.keyCode) {
      case 74:
        // ------------------------------------------------------------------
        // Left
        robot2.wheel_fl_constraint.configureAngularMotor(
          1,
          -Math.PI / 4,
          Math.PI / 4,
          2,
          400
        );
        robot2.wheel_fr_constraint.configureAngularMotor(
          1,
          -Math.PI / 4,
          Math.PI / 4,
          2,
          400
        );
        robot2.wheel_fl_constraint.enableAngularMotor(1);
        robot2.wheel_fr_constraint.enableAngularMotor(1);
        break;

      case 76:
        // ------------------------------------------------------------------
        // Right
        robot2.wheel_fl_constraint.configureAngularMotor(
          1,
          -Math.PI / 4,
          Math.PI / 4,
          -2,
          400
        );
        robot2.wheel_fr_constraint.configureAngularMotor(
          1,
          -Math.PI / 4,
          Math.PI / 4,
          -2,
          400
        );
        robot2.wheel_fl_constraint.enableAngularMotor(1);
        robot2.wheel_fr_constraint.enableAngularMotor(1);
        break;

      case 73:
        // ------------------------------------------------------------------
        // Up
        robot2.wheel_bl_constraint.configureAngularMotor(2, 1, 0, 30, 6000);
        robot2.wheel_br_constraint.configureAngularMotor(2, 1, 0, 30, 6000);
        robot2.wheel_bl_constraint.enableAngularMotor(2);
        robot2.wheel_br_constraint.enableAngularMotor(2);
        break;

      case 75:
        // ------------------------------------------------------------------
        // Down
        robot2.wheel_bl_constraint.configureAngularMotor(2, 1, 0, -20, 24000);
        robot2.wheel_br_constraint.configureAngularMotor(2, 1, 0, -20, 24000);
        robot2.wheel_bl_constraint.enableAngularMotor(2);
        robot2.wheel_br_constraint.enableAngularMotor(2);
        break;
    }
  });

  document.addEventListener("keyup", function (ev) {
    switch (ev.keyCode) {
      case 74:
        // Left
        robot2.wheel_fl_constraint.disableAngularMotor(1);
        robot2.wheel_fr_constraint.disableAngularMotor(1);
        break;

      case 76:
        // Right
        robot2.wheel_fl_constraint.disableAngularMotor(1);
        robot2.wheel_fr_constraint.disableAngularMotor(1);
        break;

      case 73:
        // Up
        robot2.wheel_bl_constraint.disableAngularMotor(2);
        robot2.wheel_br_constraint.disableAngularMotor(2);
        break;

      case 75:
        // Down
        robot2.wheel_bl_constraint.disableAngularMotor(2);
        robot2.wheel_br_constraint.disableAngularMotor(2);
        break;
    }
  });

  // BALL
  class ball {
    constructor() {
      this.ball_material = Physijs.createMaterial(
        new THREE.MeshLambertMaterial({ color: 0xffffff }),
        0.1,
        1
      );
      this.ballMesh = new Physijs.SphereMesh(
        new THREE.SphereGeometry(5, 18, 20),
        this.ball_material,
        1, // mass
        { restitution: 10, friction: 10 }
      );
      this.ballMesh.position.x = 0;
      this.ballMesh.position.y = 25;
      scene.add(this.ballMesh);
    }
  }
  let ball1 = new ball();

  class gameController{
    static checkRobotPosition(){
        if (robot1.body.position.y < 0) {
            robot1 = new robot(0, 5, 0xf6cb1c, 50);
          }
          if (robot2.body.position.y < 0) {
            robot2 = new robot(0, 5, 0xc74b0e, -50);
          }
        };
    static checkBallPosition(){
        if (ball1.ballMesh.position.y < 0 && ball1.ballMesh.position.z < 0) {
            // Bola Masuk Kanan
            ball1 = new ball();
            scoreOneTwo[0]++;
            const scoreString = "Gamescore: " + scoreOneTwo[0] + "-" + scoreOneTwo[1];
            window.alert(scoreString);
          } else if (ball1.ballMesh.position.y < 0 && ball1.ballMesh.position.z > 0) {
            // Bola Masuk Kiri
            ball1 = new ball();
            scoreOneTwo[1]++;
            const scoreString = "Gamescore: " + scoreOneTwo[0] + "-" + scoreOneTwo[1];
            window.alert(scoreString);
          }
    }
    }

  // CHECK OBJECTS POSITIONS

  requestAnimationFrame(render);
  scene.simulate();
}

render = function () {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
  controls.update();
};

window.onload = sceneInit();
