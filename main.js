Physijs.scripts.worker = '/libs/physijs_worker.js';
Physijs.scripts.ammo = '/libs/ammo.js';

let initScene,
    render,
    ground_material,
    border_material,
    robot_material,
    ball_material,
    wheel_material,
    wheel_geometry,
    wheel_pos_y,
    renderer,
    scene,
    ground = {},
    light,
    camera,
    ball,
    robot = {},
    createRobot,
    checkRobotPosition,
    createBall,
    checkBallPosition;

initScene = () => {
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor('#e5e5e5');
    document.body.appendChild(renderer.domElement);

    scene = new Physijs.Scene();
    scene.setGravity(new THREE.Vector3(0, -30, 0));
    scene.addEventListener('update', function () {
        scene.simulate(undefined, 2);
        checkRobotPosition();
        checkBallPosition();
    });

    camera = new THREE.PerspectiveCamera(
        35,
        window.innerWidth / window.innerHeight,
        1,
        1000
    );
    camera.position.set(250, 0, 280);
    camera.lookAt(scene.position);
    scene.add(camera);

    // ORBIT CONTROLS
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.minPolarAngle = Math.PI * 0.3;
    controls.maxPolarAngle = Math.PI * 0.4;
    controls.target.set(0, 40, 0);
    controls.enableZoom = false;

    // LIGHTS
    var light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
    light.position.set(50, 100, 10);
    light.sh;
    scene.add(light);

    // GROUND
    loader = new THREE.TextureLoader();
    var ground_texture = loader.load('/images/dark-grass.jpg', function (texture) {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.offset.set(0, 0);
    });
    ground_material = Physijs.createMaterial(
        new THREE.MeshLambertMaterial({ map: ground_texture }),
        0.9,
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
    var border_texture = loader.load('/images/wood.jpg', function (texture) {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.offset.set(0, 0);
    });
    border_material = Physijs.createMaterial(
        new THREE.MeshLambertMaterial({
            map: border_texture,
        }),
        0.1,
        0.9
    );

    border_material.map.wrapS = border_material.map.wrapT =
        THREE.RepeatWrapping;
    border_material.map.repeat.set(0.5, 0.5);

    let border_height = 10;

    // GROUND - BORDERS - EAST
    ground.east_border = new Physijs.BoxMesh(
        new THREE.BoxGeometry(2, border_height, 200),
        ground_material,
        0, 
        { restitution: 0.9, friction: 0.1 }
    );
    ground.east_border.position.set(99, border_height / 2 + 0.5, 0);
    scene.add(ground.east_border);

    // GROUND - BORDERS - WEST
    ground.west_border = new Physijs.BoxMesh(
        new THREE.BoxGeometry(2, border_height, 200),
        ground_material,
        0, 
        { restitution: 0.9, friction: 0.1 }
    );
    ground.west_border.position.set(-99, border_height / 2 + 0.5, 0);
    scene.add(ground.west_border);

    // GROUND - BORDERS - NORTH
    ground.north_border_1 = new Physijs.BoxMesh(
        new THREE.BoxGeometry(76, border_height, 2),
        ground_material,
        0, 
        { restitution: 0.9, friction: 0.1 }
    );
    ground.north_border_1.position.set(-60, border_height / 2 + 0.5, -99);
    scene.add(ground.north_border_1);

    ground.north_border_2 = new Physijs.BoxMesh(
        new THREE.BoxGeometry(76, border_height, 2),
        ground_material,
        0, 
        { restitution: 0.9, friction: 0.1 }
    );
    ground.north_border_2.position.set(60, border_height / 2 + 0.5, -99);
    scene.add(ground.north_border_2);

    // GROUND - BORDERS - SOUTH
    ground.south_border_1 = new Physijs.BoxMesh(
        new THREE.BoxGeometry(76, border_height, 2),
        ground_material,
        0, 
        { restitution: 0.9, friction: 0.1 }
    );
    ground.south_border_1.position.set(-60, border_height / 2 + 0.5, 99);
    scene.add(ground.south_border_1);

    ground.south_border_2 = new Physijs.BoxMesh(
        new THREE.BoxGeometry(76, border_height, 2),
        ground_material,
        0, 
        { restitution: 0.9, friction: 0.1 }
    );
    ground.south_border_2.position.set(60, border_height / 2 + 0.5, 99);
    scene.add(ground.south_border_2);

    
    // OBSTACLE
    // 1
    let countx = Math.floor((Math.random() * 30) + 10);
    let countz = Math.floor((Math.random() * 9) + 5);
    let countpositionx = Math.floor((Math.random() * -70) + (-10));
    let countpositionz = Math.floor((Math.random() * -70) + (-10));
    ground.obstacle1 = new Physijs.BoxMesh(
        new THREE.BoxGeometry(countx, border_height, countz),
        ground_material,
        0, 
        { restitution: 0.9, friction: 0.1 }
    );
    ground.obstacle1.position.set(countpositionx, border_height / 2 + 0.5, countpositionz);
    scene.add(ground.obstacle1);

    //2
    countx = Math.floor((Math.random() * 30) + 10);
    countz = Math.floor((Math.random() * 9) + 5);
    countpositionx = Math.floor((Math.random() * -70) + (-10));
    countpositionz = Math.floor((Math.random() * 70) + 10);
    ground.obstacle2 = new Physijs.BoxMesh(
        new THREE.BoxGeometry(countx, border_height, countz),
        ground_material,
        0, 
        { restitution: 0.9, friction: 0.1 }
    );
    ground.obstacle2.position.set(countpositionx, border_height / 2 + 0.5, countpositionz);
    scene.add(ground.obstacle2);

    //3
    countx = Math.floor((Math.random() * 30) + 10);
    countz = Math.floor((Math.random() * 9) + 5);
    countpositionx = Math.floor((Math.random() * 70) + 10);
    countpositionz = Math.floor((Math.random() * 70) + 10);
    ground.obstacle3 = new Physijs.BoxMesh(
        new THREE.BoxGeometry(countx, border_height, countz),
        ground_material,
        0, 
        { restitution: 0.9, friction: 0.1 }
    );
    ground.obstacle3.position.set(countpositionx, border_height / 2 + 0.5, countpositionz);
    scene.add(ground.obstacle3);

    //4
    countx = Math.floor((Math.random() * 40) + 10);
    countz = Math.floor((Math.random() * 9) + 5);
    countpositionx = Math.floor((Math.random() * 70) + 10);
    countpositionz = Math.floor((Math.random() * -70) + (-10));
    ground.obstacle4 = new Physijs.BoxMesh(
        new THREE.BoxGeometry(countx, border_height, countz),
        ground_material,
        0, 
        { restitution: 0.9, friction: 0.1 }
    );
    ground.obstacle4.position.set(countpositionx, border_height / 2 + 0.5, countpositionz);
    scene.add(ground.obstacle4);
    
     // ROBOT
     createRobot = () => {
        robot_material = Physijs.createMaterial(
            new THREE.MeshLambertMaterial({ color: 0x5ab7cc  }),
            0.8,
            0.2
        );

        wheel_material = Physijs.createMaterial(
            new THREE.MeshLambertMaterial({ color: 0x444444  }),
            0.9,
            0.6
        );
        wheel_geometry = new THREE.CylinderGeometry(2, 2, 1, 20);
        wheel_pos_fx = 20.5;
        wheel_pos_bx = 29.5;
        wheel_pos_y = 2.5;
        wheel_pos_z = 6;

        // ROBOT BODY
        robot.body = new Physijs.BoxMesh(
            new THREE.BoxGeometry(15, 4, 10),
            robot_material,
            3000
        );
        robot.body.position.set(25, 5, 0);
        robot.body.receiveShadow = robot.body.castShadow = true;

        scene.add(robot.body);

        // ROBOT TOP
        robot.top_central = new Physijs.BoxMesh(
            new THREE.BoxGeometry(10, 10, 10),
            robot_material,
            3000
        );
        robot.top_central.position.x = 0;
        robot.top_central.position.y = 8;
        robot.body.add(robot.top_central);

        
        // ROBOT TOP 2
        robot.top_central = new Physijs.BoxMesh(
            new THREE.BoxGeometry(7, 7, 7),
            robot_material,
            3000
        );
        robot.top_central.position.x = 0;
        robot.top_central.position.y = 15;
        robot.body.add(robot.top_central);

        // robot BODY FRONT
        robot.body_front = new Physijs.CylinderMesh(
            new THREE.CylinderGeometry(
                2,
                2,
                7,
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
        robot.body_front.position.x = -5.5;
        
        robot.body_front.position.y = 10;
        robot.body_front.rotation.x = Math.PI / 2;
        robot.body.add(robot.body_front);
        scene.add(robot.body);

        // robot BODY hand
        robot.body_front = new Physijs.CylinderMesh(
        new THREE.CylinderGeometry(
            2,
            2,
            7,
            10,
            10,
            false,
            Math.PI*2,
            Math.PI*2
        ),
        robot_material,
        200 // mass
        // { restitution: 0.9, friction: 0.1 }
        );
        robot.body_front.position.z = -7.5;    
        robot.body_front.position.y = 10;
        robot.body_front.rotation.x = Math.PI / 2;
        robot.body.add(robot.body_front);
        scene.add(robot.body);
        
        // robot BODY hand
        robot.body_front = new Physijs.CylinderMesh(
        new THREE.CylinderGeometry(
            2,
            2,
            7,
            10,
            10,
            false,
            Math.PI*2,
            Math.PI*2
        ),
        robot_material,
        200 // mass
        // { restitution: 0.9, friction: 0.1 }
        );
        robot.body_front.position.z = 7.5;    
        robot.body_front.position.y = 10;
        robot.body_front.rotation.x = Math.PI / 2;
        robot.body.add(robot.body_front);
        scene.add(robot.body);



        // WHEEL FRONT LEFT
        robot.wheel_fl = new Physijs.CylinderMesh(
            wheel_geometry,
            wheel_material,
            800, // mass
            { restitution: 0, friction: 1 }
        );
        robot.wheel_fl.rotation.x = Math.PI / 2;
        robot.wheel_fl.position.set(wheel_pos_fx, wheel_pos_y, wheel_pos_z);
        robot.wheel_fl.receiveShadow = robot.wheel_fl.castShadow = true;
        scene.add(robot.wheel_fl);
        robot.wheel_fl_constraint = new Physijs.DOFConstraint(
            robot.wheel_fl,
            robot.body,
            new THREE.Vector3(wheel_pos_fx, wheel_pos_y, wheel_pos_z)
        );
        scene.addConstraint(robot.wheel_fl_constraint);
        robot.wheel_fl_constraint.setAngularLowerLimit({
            x: 0,
            y: -Math.PI / 8,
            z: 1,
        });
        robot.wheel_fl_constraint.setAngularUpperLimit({
            x: 0,
            y: Math.PI / 8,
            z: 0,
        });

        // ------------------------------------------------------------------------------
        // WHEEL FRONT RIGHT
        robot.wheel_fr = new Physijs.CylinderMesh(
            wheel_geometry,
            wheel_material,
            800, // mass
            { restitution: 0, friction: 1 }
        );
        robot.wheel_fr.rotation.x = Math.PI / 2;
        robot.wheel_fr.position.set(wheel_pos_fx, wheel_pos_y, -wheel_pos_z);
        robot.wheel_fr.receiveShadow = robot.wheel_fr.castShadow = true;
        scene.add(robot.wheel_fr);
        robot.wheel_fr_constraint = new Physijs.DOFConstraint(
            robot.wheel_fr,
            robot.body,
            new THREE.Vector3(wheel_pos_fx, wheel_pos_y, -wheel_pos_z)
        );
        scene.addConstraint(robot.wheel_fr_constraint);
        robot.wheel_fr_constraint.setAngularLowerLimit({
            x: 0,
            y: -Math.PI / 8,
            z: 1,
        });
        robot.wheel_fr_constraint.setAngularUpperLimit({
            x: 0,
            y: Math.PI / 8,
            z: 0,
        });

        // ------------------------------------------------------------------------------
        // WHEEL BACK LEFT
        robot.wheel_bl = new Physijs.CylinderMesh(
            wheel_geometry,
            wheel_material,
            800, // mass
            { restitution: 0, friction: 1 }
        );
        robot.wheel_bl.rotation.x = Math.PI / 2;
        robot.wheel_bl.position.set(wheel_pos_bx, wheel_pos_y, wheel_pos_z);
        robot.wheel_bl.receiveShadow = robot.wheel_bl.castShadow = true;
        scene.add(robot.wheel_bl);
        robot.wheel_bl_constraint = new Physijs.DOFConstraint(
            robot.wheel_bl,
            robot.body,
            new THREE.Vector3(wheel_pos_bx, wheel_pos_y, wheel_pos_z)
        );
        scene.addConstraint(robot.wheel_bl_constraint);
        robot.wheel_bl_constraint.setAngularLowerLimit({
            x: 0,
            y: 0,
            z: 0,
        });
        robot.wheel_bl_constraint.setAngularUpperLimit({
            x: 0,
            y: 0,
            z: 1,
        });

        // ------------------------------------------------------------------------------
        // WHEEL BACK RIGHT
        robot.wheel_br = new Physijs.CylinderMesh(
            wheel_geometry,
            wheel_material,
            800, // mass
            { restitution: 0, friction: 1 }
        );
        robot.wheel_br.rotation.x = Math.PI / 2;
        robot.wheel_br.position.set(wheel_pos_bx, wheel_pos_y, -wheel_pos_z);
        robot.wheel_br.receiveShadow = robot.wheel_br.castShadow = true;
        scene.add(robot.wheel_br);
        robot.wheel_br_constraint = new Physijs.DOFConstraint(
            robot.wheel_br,
            robot.body,
            new THREE.Vector3(wheel_pos_bx, wheel_pos_y, -wheel_pos_z)
        );
        scene.addConstraint(robot.wheel_br_constraint);
        robot.wheel_br_constraint.setAngularLowerLimit({
            x: 0,
            y: 0,
            z: 0,
        });
        robot.wheel_br_constraint.setAngularUpperLimit({
            x: 0,
            y: 0,
            z: 1,
        });
    };
    createRobot();

    // MOVEMENT
    document.addEventListener('keydown', function (ev) {
        console.log(ev.keyCode);
        switch (ev.keyCode) {
            case 65:
                // ------------------------------------------------------------------
                // Left
                robot.wheel_fl_constraint.configureAngularMotor(
                    1,
                    -Math.PI / 4,
                    Math.PI / 4,
                    1,
                    200
                );
                robot.wheel_fr_constraint.configureAngularMotor(
                    1,
                    -Math.PI / 4,
                    Math.PI / 4,
                    1,
                    200
                );
                robot.wheel_fl_constraint.enableAngularMotor(1);
                robot.wheel_fr_constraint.enableAngularMotor(1);
                break;

            case 68:
                // ------------------------------------------------------------------
                // Right
                robot.wheel_fl_constraint.configureAngularMotor(
                    1,
                    -Math.PI / 4,
                    Math.PI / 4,
                    -1,
                    200
                );
                robot.wheel_fr_constraint.configureAngularMotor(
                    1,
                    -Math.PI / 4,
                    Math.PI / 4,
                    -1,
                    200
                );
                robot.wheel_fl_constraint.enableAngularMotor(1);
                robot.wheel_fr_constraint.enableAngularMotor(1);
                break;

            case 87:
                // ------------------------------------------------------------------
                // Up
                robot.wheel_bl_constraint.configureAngularMotor(
                    2,
                    1,
                    0,
                    15,
                    3000
                );
                robot.wheel_br_constraint.configureAngularMotor(
                    2,
                    1,
                    0,
                    15,
                    3000
                );
                robot.wheel_bl_constraint.enableAngularMotor(2);
                robot.wheel_br_constraint.enableAngularMotor(2);
                break;

            case 83:
                // ------------------------------------------------------------------
                // Down
                robot.wheel_bl_constraint.configureAngularMotor(
                    2,
                    1,
                    0,
                    -10,
                    12000
                );
                robot.wheel_br_constraint.configureAngularMotor(
                    2,
                    1,
                    0,
                    -10,
                    12000
                );
                robot.wheel_bl_constraint.enableAngularMotor(2);
                robot.wheel_br_constraint.enableAngularMotor(2);
                break;
        }
    });

    document.addEventListener('keyup', function (ev) {
        switch (ev.keyCode) {
            case 65:
                // Left
                robot.wheel_fl_constraint.disableAngularMotor(1);
                robot.wheel_fr_constraint.disableAngularMotor(1);
                break;

            case 68:
                // Right
                robot.wheel_fl_constraint.disableAngularMotor(1);
                robot.wheel_fr_constraint.disableAngularMotor(1);
                break;

            case 87:
                // Up
                robot.wheel_bl_constraint.disableAngularMotor(2);
                robot.wheel_br_constraint.disableAngularMotor(2);
                break;

            case 83:
                // Down
                robot.wheel_bl_constraint.disableAngularMotor(2);
                robot.wheel_br_constraint.disableAngularMotor(2);
                break;
        }
    });


    // BALL
    createBall = () => {
        ball_material = Physijs.createMaterial(
            new THREE.MeshLambertMaterial({ color: 0xffffff }),
            0.1,
            1
        );
        ball = new Physijs.SphereMesh(
            new THREE.SphereGeometry(5, 18, 20),
            ball_material,
            20, // mass
            { restitution: 0.9, friction: 0.9 }
        );
        ball.position.x = -10;
        ball.position.y = 25;
        scene.add(ball);
    };
    createBall();

    // CHECK OBJECTS POSITIONS
    checkRobotPosition = () => {
        if (robot.body.position.y < 0) {
            createRobot();
            let readDisclaimer = document.querySelector('.read-disclaimer');
            readDisclaimer.innerHTML = 'Did you read the disclaimer?';
            setTimeout(function () {
                readDisclaimer.innerHTML = '';
            }, 2000);
        }
    };
    checkBallPosition = () => {
        if (ball.position.y < 0) {
            createBall();
        }
    };

    requestAnimationFrame(render);
    scene.simulate();
};

render = function () {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
    controls.update();
};

window.onload = initScene;
