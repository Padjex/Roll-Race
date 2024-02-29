import { useGLTF, useTexture } from "@react-three/drei";
import { BallCollider, RigidBody, useRapier } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import useGame from "./stores/useGame";
import { redux } from "zustand/middleware";

function Ball() {
  const { nodes } = useGLTF("./ball.glb");
  const ballTexture = useTexture("./color.jpg");
  ballTexture.flipY = false;

  return (
    <>
      <mesh castShadow geometry={nodes.Icosphere.geometry} scale={0.264}>
        <meshStandardMaterial
          map={ballTexture}
          flatShading
          roughness={0}
          metalness={0}
        />
      </mesh>
    </>
  );
}
useGLTF.preload("./ball.glb");

export default function Player() {
  const body = useRef();
  const [subscribeKeys, getKeys] = useKeyboardControls();
  const { rapier, world } = useRapier();

  const rapierWorld = world.raw();

  const [smoothedCameraPosition] = useState(
    () => new THREE.Vector3(10, 10, 10)
  );
  const [smoothedCameraTarget] = useState(() => new THREE.Vector3());

  const start = useGame((state) => state.start);
  const end = useGame((state) => state.end);
  const restart = useGame((state) => state.restart);
  const blocksCount = useGame((state) => state.blocksCount);

  const jump = () => {
    const origin = body.current.translation();

    origin.y -= 0.301;

    const direction = { x: 0, y: -1, z: 0 };
    const ray = new rapier.Ray(origin, direction);
    const hit = rapierWorld.castRay(ray, 10, true);

    if (hit.toi < 0.15) {
      body.current.applyImpulse({ x: 0, y: 0.6, z: 0 });
    }
  };

  const reset = () => {
    body.current.setTranslation({ x: 0, y: 1, z: 0 });
    body.current.setLinvel({ x: 0, y: 0, z: 0 });
    body.current.setAngvel({ x: 0, y: 0, z: 0 });
  };

  useEffect(() => {
    const unsubscribeReset = useGame.subscribe(
      (state) => state.phase,
      (phase) => {
        if (phase === "ready") {
          reset();
        }
      }
    );

    const unsubscribeJump = subscribeKeys(
      (state) => state.jump,
      (value) => {
        if (value) jump();
      }
    );

    const unsubscribeAny = subscribeKeys(() => {
      start();
    });

    return () => {
      unsubscribeReset();
      unsubscribeJump();
      unsubscribeAny();
    };
  }, []);
  let x = 0;

  const collisionEnter = (collisionInfo) => {
    console.log(collisionInfo);
    if (collisionInfo.colliderObject.parent.children[0].name === "trap") {
      setTimeout(() => {
        restart();
      }, 440);
    }
  };

  useFrame((state, delta) => {
    const { forward, backward, leftward, rightward } = getKeys();

    const impusle = { x: 0, y: 0, z: 0 };
    const torque = { x: 0, y: 0, z: 0 };

    const impusleStrength = 0.6 * delta;
    const torqueStrength = 0.2 * delta;

    if (forward) {
      impusle.z -= impusleStrength;
      torque.x -= torqueStrength;
    }

    if (rightward) {
      impusle.x += impusleStrength;
      torque.z -= torqueStrength;
    }

    if (backward) {
      impusle.z += impusleStrength;
      torque.x += torqueStrength;
    }

    if (leftward) {
      impusle.x -= impusleStrength;
      torque.z += torqueStrength;
    }

    body.current.applyImpulse(impusle);
    body.current.applyTorqueImpulse(torque);

    // Camera;
    const bodyPosition = body.current.translation();

    const cameraPosition = new THREE.Vector3();
    cameraPosition.copy(bodyPosition);
    cameraPosition.z += 2.25;
    cameraPosition.y += 0.65;

    const cameraTarget = new THREE.Vector3();
    cameraTarget.copy(bodyPosition);
    cameraTarget.y += 0.25;

    smoothedCameraPosition.lerp(cameraPosition, 5 * delta);
    smoothedCameraTarget.lerp(cameraTarget, 5 * delta);

    state.camera.position.copy(smoothedCameraPosition);
    state.camera.lookAt(smoothedCameraTarget);

    // Phases end
    if (bodyPosition.z < -(blocksCount * 4 + 2)) {
      end();
    }
    if (bodyPosition.y < -4) {
      restart();
    }
  });

  return (
    <>
      <RigidBody
        ref={body}
        position={[0, 1, 0]}
        colliders={false}
        restitution={0.2}
        friction={1}
        linearDamping={1}
        angularDamping={1}
        onCollisionEnter={collisionEnter}
      >
        <BallCollider args={[0.3]} />
        <Ball />
      </RigidBody>
    </>
  );
}
