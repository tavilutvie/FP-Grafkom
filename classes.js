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
