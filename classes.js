class ballWrapper {
  constructor() {
    this.ballObj = {};
    this.createBall();
  }
  createBall() {
    this.ballObj.ball_material = Physijs.createMaterial(
      new THREE.MeshLambertMaterial({ color: 0xffffff }),
      0.1,
      1
    );
    this.ballObj.ballMesh = new Physijs.SphereMesh(
      new THREE.SphereGeometry(5, 18, 20),
      this.ballObj.ball_material,
      1, // mass
      { restitution: 10, friction: 10 }
    );
    this.ballObj.ballMesh.position.x = 0;
    this.ballObj.ballMesh.position.y = 25;
    scene.add(this.ballObj.ballMesh);
  }
}

class gameController {
  static checkRobotPosition(robot) {
    if (robot.robotObj.body.position.y < 0) {
      if (robot.robotNumber == 1) {
        robot.createRobot(0, 5, 50, 0xf6cb1c);
      } else if (robot.robotNumber == 2) {
        robot.createRobot(0, 5, -50, 0xc74b0e);
      }
    }
  }
  static checkBallPosition(ballWrapper) {
    if (
      ballWrapper.ballObj.ballMesh.position.y < 0 &&
      ballWrapper.ballObj.ballMesh.position.z < 0
    ) {
      // Bola Masuk Kanan
      ballWrapper.createBall();
      gameController.updateScore(1, scoreOneTwo);
      // scoreOneTwo[0]++;
      // const scoreString = "Gamescore: " + scoreOneTwo[0] + "-" + scoreOneTwo[1];
      // window.alert(scoreString);
    } else if (
      ballWrapper.ballObj.ballMesh.position.y < 0 &&
      ballWrapper.ballObj.ballMesh.position.z > 0
    ) {
      // Bola Masuk Kiri
      ballWrapper.createBall();
      gameController.updateScore(2, scoreOneTwo);
      // scoreOneTwo[1]++;
      // const scoreString = "Gamescore: " + scoreOneTwo[0] + "-" + scoreOneTwo[1];
      // window.alert(scoreString);
    }
  }
  static updateScore(sideScored, scoreArray){
    // If sidescored == 1, first robot scored, if 2 then second robot scored
    console.log(sideScored);
    if(sideScored < 1 && sideScored > 2) throw new Error('invalid score input');
    const firstScore = document.querySelector('.firstScore');
    const secondScore = document.querySelector('.secondScore');
    if(sideScored == 1){
      scoreArray[0]++;
      firstScore.innerHTML = scoreArray[0];
    }
    else{
      scoreArray[1]++;
      firstScore.innerHTML = scoreArray[1];
    }
  }
  static endGame(){
    if (scoreOneTwo[0] === 5)
    {
      scoreOneTwo[0] = 0;
      window.alert("Player Yellow wins!");
      location.reload();
    }
    else if (scoreOneTwo[1] === 5)
    {
      scoreOneTwo[1] = 0;
      window.alert("Player Red wins!");
      location.reload();
    }
  }
  static robotControlsInit(robot) {
    const controlsKey = new Array();
    if (robot.robotNumber == 1) {
      // create controls for playerone
      controlsKey.push(65, 68, 87, 83);
    } else if (robot.robotNumber == 2) {
      // create controls for playertwo
      controlsKey.push(74, 76, 73, 75);
    }
    const controlsDirection = ["left", "right", "up", "down"];
    controlsKey.forEach((element, index) =>
      robot.controlsMap.set(controlsDirection[index], element)
    );
    // Create a hashmap for directions
    // For keydown
    document.addEventListener("keydown", function (ev) {
      switch (ev.keyCode) {
        case robot.controlsMap.get("left"):
          // ------------------------------------------------------------------
          // Left
          robot.robotObj.wheel_fl_constraint.configureAngularMotor(
            1,
            -Math.PI / 4,
            Math.PI / 4,
            2,
            400
          );
          robot.robotObj.wheel_fr_constraint.configureAngularMotor(
            1,
            -Math.PI / 4,
            Math.PI / 4,
            2,
            400
          );
          robot.robotObj.wheel_fl_constraint.enableAngularMotor(1);
          robot.robotObj.wheel_fr_constraint.enableAngularMotor(1);
          break;

        case robot.controlsMap.get("right"):
          // ------------------------------------------------------------------
          // Right
          robot.robotObj.wheel_fl_constraint.configureAngularMotor(
            1,
            -Math.PI / 4,
            Math.PI / 4,
            -2,
            400
          );
          robot.robotObj.wheel_fr_constraint.configureAngularMotor(
            1,
            -Math.PI / 4,
            Math.PI / 4,
            -2,
            400
          );
          robot.robotObj.wheel_fl_constraint.enableAngularMotor(1);
          robot.robotObj.wheel_fr_constraint.enableAngularMotor(1);
          break;

        case robot.controlsMap.get("up"):
          // ------------------------------------------------------------------
          // Up
          robot.robotObj.wheel_bl_constraint.configureAngularMotor(
            2,
            1,
            0,
            30,
            6000
          );
          robot.robotObj.wheel_br_constraint.configureAngularMotor(
            2,
            1,
            0,
            30,
            6000
          );
          robot.robotObj.wheel_bl_constraint.enableAngularMotor(2);
          robot.robotObj.wheel_br_constraint.enableAngularMotor(2);
          break;

        case robot.controlsMap.get("down"):
          // ------------------------------------------------------------------
          // Down
          robot.robotObj.wheel_bl_constraint.configureAngularMotor(
            2,
            1,
            0,
            -20,
            24000
          );
          robot.robotObj.wheel_br_constraint.configureAngularMotor(
            2,
            1,
            0,
            -20,
            24000
          );
          robot.robotObj.wheel_bl_constraint.enableAngularMotor(2);
          robot.robotObj.wheel_br_constraint.enableAngularMotor(2);
          break;
      }
    });
    document.addEventListener("keyup", function (ev) {
      switch (ev.keyCode) {
        case robot.controlsMap.get("left"):
          // Left
          robot.robotObj.wheel_fl_constraint.disableAngularMotor(1);
          robot.robotObj.wheel_fr_constraint.disableAngularMotor(1);
          break;

        case robot.controlsMap.get("right"):
          // Right
          robot.robotObj.wheel_fl_constraint.disableAngularMotor(1);
          robot.robotObj.wheel_fr_constraint.disableAngularMotor(1);
          break;

        case robot.controlsMap.get("up"):
          // Up
          robot.robotObj.wheel_bl_constraint.disableAngularMotor(2);
          robot.robotObj.wheel_br_constraint.disableAngularMotor(2);
          break;

        case robot.controlsMap.get("down"):
          // Down
          robot.robotObj.wheel_bl_constraint.disableAngularMotor(2);
          robot.robotObj.wheel_br_constraint.disableAngularMotor(2);
          break;
      }
    });
  }
  static cameraControlsInit(camera, totalCameraAngle, coordinates, scene){
    const cameraControlKeys = ['Digit1', 'Digit2', 'Digit3', 'Digit4'];
    const coordinatesKeys = ['firstCoordinate', 'secondCoordinate', 'thirdCoordinate', 'fourthCoordinate'];
    for(let x = 0; x < totalCameraAngle; x++){
      document.addEventListener("keypress", (ev) => {
      if(ev.code === cameraControlKeys[x]){
        // console.log(`this is camera ${coordinates[coordinatesKeys[x]][0]}`);
        // console.log(`this is camera ${coordinates[coordinatesKeys[x]][1]}`);
        // console.log(`this is camera ${coordinates[coordinatesKeys[x]][2]}`);
        camera.position.set(coordinates[coordinatesKeys[x]][0], coordinates[coordinatesKeys[x]][1], coordinates[coordinatesKeys[x]][2]);
        camera.lookAt(scene.position);
        camera.updateProjectionMatrix();
      }
      })
    }
  }
}

class robotWrapper {
  constructor(rbx, rby, rbz, color, robotNumber) {
    this.robotNumber = robotNumber;
    this.robotObj = {};
    this.controlsMap = new Map();
    this.loader = null;
    this.createRobot(rbx, rby, rbz, color);
  }
  createRobot(rbx, rby, rbz, color) {
    const loader = new THREE.TextureLoader();
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
    this.robotObj.body = new Physijs.BoxMesh(
      new THREE.BoxGeometry(15, 4, 10),
      robot_material,
      3000
    );
    this.robotObj.body.position.set(rbx, rby, rbz);
    this.robotObj.body.receiveShadow = this.robotObj.body.castShadow = true;

    scene.add(this.robotObj.body);

        // ROBOT Tail
        this.robotObj.top_central = new Physijs.BoxMesh(
          new THREE.BoxGeometry(7, 1, 1),
          robot_material,
          3000
      );
      this.robotObj.top_central.position.x = 10;
      this.robotObj.top_central.position.y = 0;
      this.robotObj.body.add(this.robotObj.top_central);

    // ROBOT TOP
    this.robotObj.top_central = new Physijs.BoxMesh(
      new THREE.ConeGeometry(5, 8, 30),
      robot_material,
      3000
  );
  this.robotObj.top_central.position.x = 0;
  this.robotObj.top_central.position.y = 7;
  this.robotObj.body.add(this.robotObj.top_central);

  // robot BODY FRONT
  this.robotObj.body_front = new Physijs.CylinderMesh(
      new THREE.CylinderGeometry(
          2,
          2,
          10,
          10,
          10,
          false,
          Math.PI,
          Math.PI
      ),
      robot_material,
      200 // mass
      // { restitution: 0.9, friction: 0.1 }
  );
  this.robotObj.body_front.position.x = -7.5;
  
  this.robotObj.body_front.position.y = 0;
  this.robotObj.body_front.rotation.x = Math.PI / 2;
  this.robotObj.body.add(this.robotObj.body_front);
  scene.add(this.robotObj.body);

  // // robot BODY hand
  // this.robotObj.body_front = new Physijs.CylinderMesh(
  // new THREE.CylinderGeometry(
  //     2,
  //     2,
  //     7,
  //     10,
  //     10,
  //     false,
  //     Math.PI*2,
  //     Math.PI*2
  // ),
  // robot_material,
  // 200 // mass
  // // { restitution: 0.9, friction: 0.1 }
  // );
  // this.robotObj.body_front.position.z = -7.5;    
  // this.robotObj.body_front.position.y = 10;
  // this.robotObj.body_front.rotation.x = Math.PI / 2;
  // this.robotObj.body.add(this.robotObj.body_front);
  // scene.add(this.robotObj.body);
  
  // // robot BODY hand
  // this.robotObj.body_front = new Physijs.CylinderMesh(
  // new THREE.CylinderGeometry(
  //     2,
  //     2,
  //     7,
  //     10,
  //     10,
  //     false,
  //     Math.PI*2,
  //     Math.PI*2
  // ),
  // robot_material,
  // 200 // mass
  // // { restitution: 0.9, friction: 0.1 }
  // );
  // this.robotObj.body_front.position.z = 7.5;    
  // this.robotObj.body_front.position.y = 10;
  // this.robotObj.body_front.rotation.x = Math.PI / 2;
  // this.robotObj.body.add(this.robotObj.body_front);
  // scene.add(this.robotObj.body);

    // WHEEL FRONT LEFT
    this.robotObj.wheel_fl = new Physijs.CylinderMesh(
      wheel_geometry,
      wheel_material,
      800, // mass
      { restitution: 0, friction: 1 }
    );
    this.robotObj.wheel_fl.rotation.x = Math.PI / 2;
    this.robotObj.wheel_fl.position.set(wheel_pos_fx, wheel_pos_y, wheel_pos_z);
    this.robotObj.wheel_fl.receiveShadow =
      this.robotObj.wheel_fl.castShadow = true;
    scene.add(this.robotObj.wheel_fl);
    this.robotObj.wheel_fl_constraint = new Physijs.DOFConstraint(
      this.robotObj.wheel_fl,
      this.robotObj.body,
      new THREE.Vector3(wheel_pos_fx, wheel_pos_y, wheel_pos_z)
    );
    scene.addConstraint(this.robotObj.wheel_fl_constraint);
    this.robotObj.wheel_fl_constraint.setAngularLowerLimit({
      x: 0,
      y: -Math.PI / 8,
      z: 1,
    });
    this.robotObj.wheel_fl_constraint.setAngularUpperLimit({
      x: 0,
      y: Math.PI / 8,
      z: 0,
    });

    // ------------------------------------------------------------------------------
    // WHEEL FRONT RIGHT
    this.robotObj.wheel_fr = new Physijs.CylinderMesh(
      wheel_geometry,
      wheel_material,
      800, // mass
      { restitution: 0, friction: 1 }
    );
    this.robotObj.wheel_fr.rotation.x = Math.PI / 2;
    this.robotObj.wheel_fr.position.set(
      wheel_pos_fx,
      wheel_pos_y,
      wheel_pos_z - 12
    );
    this.robotObj.wheel_fr.receiveShadow =
      this.robotObj.wheel_fr.castShadow = true;
    scene.add(this.robotObj.wheel_fr);
    this.robotObj.wheel_fr_constraint = new Physijs.DOFConstraint(
      this.robotObj.wheel_fr,
      this.robotObj.body,
      new THREE.Vector3(wheel_pos_fx, wheel_pos_y, wheel_pos_z - 12)
    );
    scene.addConstraint(this.robotObj.wheel_fr_constraint);
    this.robotObj.wheel_fr_constraint.setAngularLowerLimit({
      x: 0,
      y: -Math.PI / 8,
      z: 1,
    });
    this.robotObj.wheel_fr_constraint.setAngularUpperLimit({
      x: 0,
      y: Math.PI / 8,
      z: 0,
    });

    // ------------------------------------------------------------------------------
    // WHEEL BACK LEFT
    this.robotObj.wheel_bl = new Physijs.CylinderMesh(
      wheel_geometry,
      wheel_material,
      800, // mass
      { restitution: 0, friction: 1 }
    );
    this.robotObj.wheel_bl.rotation.x = Math.PI / 2;
    this.robotObj.wheel_bl.position.set(wheel_pos_bx, wheel_pos_y, wheel_pos_z);
    this.robotObj.wheel_bl.receiveShadow =
      this.robotObj.wheel_bl.castShadow = true;
    scene.add(this.robotObj.wheel_bl);
    this.robotObj.wheel_bl_constraint = new Physijs.DOFConstraint(
      this.robotObj.wheel_bl,
      this.robotObj.body,
      new THREE.Vector3(wheel_pos_bx, wheel_pos_y, wheel_pos_z)
    );
    scene.addConstraint(this.robotObj.wheel_bl_constraint);
    this.robotObj.wheel_bl_constraint.setAngularLowerLimit({
      x: 0,
      y: 0,
      z: 0,
    });
    this.robotObj.wheel_bl_constraint.setAngularUpperLimit({
      x: 0,
      y: 0,
      z: 1,
    });

    // ------------------------------------------------------------------------------
    // WHEEL BACK RIGHT
    this.robotObj.wheel_br = new Physijs.CylinderMesh(
      wheel_geometry,
      wheel_material,
      800, // mass
      { restitution: 0, friction: 1 }
    );
    this.robotObj.wheel_br.rotation.x = Math.PI / 2;
    this.robotObj.wheel_br.position.set(
      wheel_pos_bx,
      wheel_pos_y,
      wheel_pos_z - 12
    );
    this.robotObj.wheel_br.receiveShadow =
      this.robotObj.wheel_br.castShadow = true;
    scene.add(this.robotObj.wheel_br);
    this.robotObj.wheel_br_constraint = new Physijs.DOFConstraint(
      this.robotObj.wheel_br,
      this.robotObj.body,
      new THREE.Vector3(wheel_pos_bx, wheel_pos_y, wheel_pos_z - 12)
    );
    scene.addConstraint(this.robotObj.wheel_br_constraint);
    this.robotObj.wheel_br_constraint.setAngularLowerLimit({
      x: 0,
      y: 0,
      z: 0,
    });
    this.robotObj.wheel_br_constraint.setAngularUpperLimit({
      x: 0,
      y: 0,
      z: 1,
    });
    console.log(this.robotObj);
  }
}

class skyboxWrapper {
  constructor(textureFileName, isSixSided) {
    this.skyboxObj = {};
    this.pathStringArray = null;
    this.materialArray = null;
    if(!isSixSided)
      this.createSkybox(textureFileName);
    else
      this.createSkyboxSixSides();
  }
  static createPathStrings(fileTypeString){
    const baseString = './images/skybox/';
    const sides = ["ft", "bk", "up", "dn", "rt", "lf"];
    const pathStringArray = sides.map((side) =>  `${baseString}${side}.${fileTypeString}`);
    return pathStringArray;
  }
  static createMaterialArray(texturePathArray){
    const materialArray = texturePathArray.map(image =>{
      const texture = new THREE.TextureLoader().load(image)
      return new THREE.MeshBasicMaterial({map: texture, side: THREE.DoubleSide});
    })
    return materialArray;
  }
  createSkybox(textureFileName) {
    this.skyboxObj.skyboxGeo = new THREE.BoxGeometry(1000, 1000, 1000);
    const filePathString = `./images/${textureFileName}.jpg`;
    this.skyboxObj.texture = new THREE.TextureLoader().load(filePathString);
    this.skyboxObj.material = new THREE.MeshBasicMaterial({
      map: this.skyboxObj.texture,
    });
    this.skyboxObj.material.side = THREE.DoubleSide;
    this.skyboxObj.mesh = new THREE.Mesh(
      this.skyboxObj.skyboxGeo,
      this.skyboxObj.material
      );
    this.skyboxObj.mesh.position.y = 500
    scene.add(this.skyboxObj.mesh);
  }
  createSkyboxSixSides(){
    this.pathStringArray = skyboxWrapper.createPathStrings('png');
    this.materialArray = skyboxWrapper.createMaterialArray(this.pathStringArray);
    this.skyboxObj.skyboxGeo = new THREE.BoxGeometry(10000, 1000, 10000);
    this.skyboxObj.mesh = new THREE.Mesh(
      this.skyboxObj.skyboxGeo,
      this.materialArray
      );
      this.skyboxObj.mesh.position.y = 500
    scene.add(this.skyboxObj.mesh);
  }
}

// TODO NOT FINISHED
class levelGeometry {
  constructor(groundTextureFileName) {
    this.loader = null;
    this.wall = {};
    this.ground = {};
    this.wall_material = null;
    this.ground_material = null;
    this.createGround(groundTextureFileName);
  }
  createGround(groundTextureFileName) {
    // GROUND
    this.loader = new THREE.TextureLoader();
    const ground_texture = this.loader.load("/images/field.jpg", function (texture) {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.offset.set(0, 0);
    });
    this.ground_material = Physijs.createMaterial(
      new THREE.MeshLambertMaterial({ map: ground_texture }),
      2,
      0.4
    );

    this.ground.plane = new Physijs.BoxMesh(
      new THREE.BoxGeometry(200, 1, 200),
      this.ground_material,
      0
    );
    this.ground.plane.receiveShadow = true;
    scene.add(this.ground.plane);
    // const groundTest = new levelGeometry('field');
    // GROUND - BORDERS
    const border_texture = this.loader.load("/images/rocks.jpg", function (texture) {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.offset.set(0, 0);
    });

   const border_material = Physijs.createMaterial(
      new THREE.MeshLambertMaterial({
        map: border_texture,
      }),
      10,
      10
    );

    border_material.map.wrapS = border_material.map.wrapT =
      THREE.RepeatWrapping;
    border_material.map.repeat.set(0.5, 0.5);

    // Goal
    const goal_texture = this.loader.load("/images/wood.jpg", function (texture) {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.offset.set(0, 0);
    });

    const goal_material = Physijs.createMaterial(
      new THREE.MeshLambertMaterial({
        map: goal_texture,
      }),
      10,
      10
    );

    goal_material.map.wrapS = goal_material.map.wrapT = THREE.RepeatWrapping;
    goal_material.map.repeat.set(0.5, 0.5);

    //light-gray-concrete-wall
    const pole_texture = this.loader.load(
      "/images/light-gray-concrete-wall.jpg",
      function (texture) {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.offset.set(0, 0);
      }
    );

    const pole_material = Physijs.createMaterial(
      new THREE.MeshLambertMaterial({
        map: pole_texture,
      }),
      10,
      10
    );

    pole_material.map.wrapS = pole_material.map.wrapT = THREE.RepeatWrapping;
    pole_material.map.repeat.set(0.5, 0.5);

    const border_height = 20;
    const borderGeoOne = new THREE.BoxGeometry(2, border_height, 200);
    const borderGeoTwo = new THREE.BoxGeometry(40, border_height, 2);
    const borderGeoThree = new THREE.BoxGeometry(5, border_height + 30, 2);
    const borderGeoFour = new THREE.BoxGeometry(160, border_height - 15, 2);
    const borderGeoFive = new THREE.BoxGeometry(200, border_height - 15, 2);
    const borderGeoSix = new THREE.BoxGeometry(20, border_height - 17.5, 2);
    this.ground.east_border = new Physijs.BoxMesh(borderGeoOne, border_material, 0, {
      restitution: 10,
      friction: 10,
    });
    this.ground.east_border.position.set(99, border_height / 2 + 0.5, 0);
    scene.add(this.ground.east_border);

    this.ground.east_border_1 = new Physijs.BoxMesh(
      borderGeoThree,
      pole_material,
      0,
      { restitution: 10, friction: 10 }
    );
    this.ground.east_border_1.position.set(95, border_height + 5, 75);
    scene.add(this.ground.east_border_1);

    this.ground.east_border_2 = new Physijs.BoxMesh(
      borderGeoThree,
      pole_material,
      0,
      { restitution: 10, friction: 10 }
    );
    this.ground.east_border_2.position.set(95, border_height + 5, -75);
    scene.add(this.ground.east_border_2);

    this.ground.east_border_3 = new Physijs.BoxMesh(borderGeoSix, pole_material, 0, {
      restitution: 10,
      friction: 10,
    });
    this.ground.east_border_3.position.set(87.5, border_height * 2.5, 75);
    scene.add(this.ground.east_border_3);

    this.ground.east_border_4 = new Physijs.BoxMesh(borderGeoSix, pole_material, 0, {
      restitution: 10,
      friction: 10,
    });
    this.ground.east_border_4.position.set(87.5, border_height * 2.5, -75);
    scene.add(this.ground.east_border_4);

    // GROUND - BORDERS - Top
    this.ground.west_border = new Physijs.BoxMesh(borderGeoOne, border_material, 0, {
      restitution: 10,
      friction: 10,
    });
    this.ground.west_border.position.set(-99, border_height / 2 + 0.5, 0);
    scene.add(this.ground.west_border);

    this.ground.west_border_1 = new Physijs.BoxMesh(
      borderGeoThree,
      pole_material,
      0,
      { restitution: 10, friction: 10 }
    );
    this.ground.west_border_1.position.set(-95, border_height + 5, 75);
    scene.add(this.ground.west_border_1);

    this.ground.west_border_2 = new Physijs.BoxMesh(
      borderGeoThree,
      pole_material,
      0,
      { restitution: 10, friction: 10 }
    );
    this.ground.west_border_2.position.set(-95, border_height + 5, -75);
    scene.add(this.ground.west_border_2);

    this.ground.west_border_3 = new Physijs.BoxMesh(borderGeoSix, pole_material, 0, {
      restitution: 10,
      friction: 10,
    });
    this.ground.west_border_3.position.set(-87.5, border_height * 2.5, 75);
    scene.add(this.ground.west_border_3);

    this.ground.west_border_4 = new Physijs.BoxMesh(borderGeoSix, pole_material, 0, {
      restitution: 10,
      friction: 10,
    });
    this.ground.west_border_4.position.set(-87.5, border_height * 2.5, -75);
    scene.add(this.ground.west_border_4);

    // GROUND - BORDERS - Right
    this.ground.north_border_1 = new Physijs.BoxMesh(
      borderGeoTwo,
      border_material,
      0,
      { restitution: 10, friction: 10 }
    );
    this.ground.north_border_1.position.set(-80, border_height / 2 + 0.5, -99);
    scene.add(this.ground.north_border_1);

    this.ground.north_border_2 = new Physijs.BoxMesh(
      borderGeoTwo,
      border_material,
      0,
      { restitution: 10, friction: 10 }
    );
    this.ground.north_border_2.position.set(80, border_height / 2 + 0.5, -99);
    scene.add(this.ground.north_border_2);

    this.ground.north_border_3 = new Physijs.BoxMesh(
      borderGeoThree,
      goal_material,
      0,
      { restitution: 10, friction: 10 }
    );
    this.ground.north_border_3.position.set(60, border_height + 5, -99);
    scene.add(this.ground.north_border_3);

    this.ground.north_border_4 = new Physijs.BoxMesh(
      borderGeoThree,
      goal_material,
      0,
      { restitution: 10, friction: 10 }
    );
    this.ground.north_border_4.position.set(-60, border_height + 5, -99);
    scene.add(this.ground.north_border_4);

    this.ground.north_border_5 = new Physijs.BoxMesh(
      borderGeoFour,
      goal_material,
      0,
      { restitution: 10, friction: 10 }
    );
    this.ground.north_border_5.position.set(0, border_height + 20, -99);
    scene.add(this.ground.north_border_5);

    this.ground.north_border_6 = new Physijs.BoxMesh(
      borderGeoFive,
      goal_material,
      0,
      { restitution: 10, friction: 10 }
    );
    this.ground.north_border_6.position.set(0, border_height + 30, -99);
    scene.add(this.ground.north_border_6);

    // GROUND - BORDERS - Left
    this.ground.south_border_1 = new Physijs.BoxMesh(
      borderGeoTwo,
      border_material,
      0,
      { restitution: 10, friction: 10 }
    );
    this.ground.south_border_1.position.set(-80, border_height / 2 + 0.5, 99);
    scene.add(this.ground.south_border_1);

    this.ground.south_border_2 = new Physijs.BoxMesh(
      borderGeoTwo,
      border_material,
      0,
      { restitution: 10, friction: 10 }
    );
    this.ground.south_border_2.position.set(80, border_height / 2 + 0.5, 99);
    scene.add(this.ground.south_border_2);

    this.ground.south_border_3 = new Physijs.BoxMesh(
      borderGeoThree,
      goal_material,
      0,
      { restitution: 10, friction: 10 }
    );
    this.ground.south_border_3.position.set(60, border_height + 5, 99);
    scene.add(this.ground.south_border_3);

    this.ground.south_border_4 = new Physijs.BoxMesh(
      borderGeoThree,
      goal_material,
      0,
      { restitution: 10, friction: 10 }
    );
    this.ground.south_border_4.position.set(-60, border_height + 5, 99);
    scene.add(this.ground.south_border_4);

    this.ground.south_border_5 = new Physijs.BoxMesh(
      borderGeoFour,
      goal_material,
      0,
      { restitution: 10, friction: 10 }
    );
    this.ground.south_border_5.position.set(0, border_height + 20, 99);
    scene.add(this.ground.south_border_5);

    this.ground.south_border_6 = new Physijs.BoxMesh(
      borderGeoFive,
      goal_material,
      0,
      { restitution: 10, friction: 10 }
    );
    this.ground.south_border_6.position.set(0, border_height + 30, 99);
    scene.add(this.ground.south_border_6);
  }
}

class poleLightWrapper {
  constructor(xCoordinate, yCoordinate, zCoordinate, lightColor, intensity) {
    // set intensity default 1
    intensity = typeof intensity !== "undefined" ? intensity : 1;

    this.poleLightObj = new THREE.SpotLight(lightColor, intensity);
    this.poleLightObj.position.set(xCoordinate, yCoordinate, zCoordinate);
    scene.add(this.poleLightObj);
    // set spotlighthelper attribute
    this.spotLightHelper = null;
  }
  addSpotLightHelper() {
    this.spotLightHelper = new THREE.SpotLightHelper(this.poleLightObj);
    scene.add(this.spotLightHelper);
  }
}

class cameraWrapper{
  constructor(x, y, z, angle, scene, cameraNumber){
    this.x = x;
    this.y = y;
    this.z = z;
    this.angle = angle;
    this.scene = scene;
    this.cameraNumber = cameraNumber;
    this.camera = null;
    this.initCamera();
    this.initCamera()
  }
  initCamera(){
    this.camera = new THREE.PerspectiveCamera(
      35,
      window.innerWidth / window.innerHeight,
      1,
      10000 
    );
    this.camera.position.set(this.x, this.y, this.z);
    this.camera.lookAt(this.scene.position);
    this.camera.far = 10000000000;
    this.scene.add(this.camera);

  }
}

class coordinates{
  constructor(totalCoordinate){

  }
}