import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

export default function Lights() {
  const directionalLight = useRef();

  useFrame((state) => {
    directionalLight.current.position.z = state.camera.position.z + 1 - 4;
    directionalLight.current.target.position.z = state.camera.position.z - 4;
    directionalLight.current.target.updateMatrixWorld();
  });

  const three = useThree();

  useEffect(() => {
    const cameraHelper = new THREE.CameraHelper(
      directionalLight.current.shadow.camera
    );
    const scene = three.scene;
    // scene.add(cameraHelper);
  }, []);

  return (
    <>
      <directionalLight
        ref={directionalLight}
        castShadow
        position={[4, 4, 1]}
        intensity={1.5}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={1}
        shadow-camera-far={9}
        shadow-camera-top={10}
        shadow-camera-right={20}
        shadow-camera-bottom={-2}
        shadow-camera-left={-10}
      />
      <ambientLight intensity={0.5} />
    </>
  );
}
