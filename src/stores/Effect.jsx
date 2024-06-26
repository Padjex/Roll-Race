import { SSR, DepthOfField, EffectComposer } from "@react-three/postprocessing";

export default function () {
  return (
    <EffectComposer>
      <DepthOfField focusDistance={0.01} focalLength={0.2} bokehScale={3} />
      <SSR
        intensity={0.45}
        exponent={1}
        distance={10}
        fade={140}
        roughnessFade={1}
        thickness={10}
        ior={0.45}
        maxRoughness={1}
        maxDepthDifference={10}
        blend={0.95}
        correction={1}
        correctionRadius={1}
        blur={1}
        blurKernel={1}
        blurSharpness={10}
        jitter={0.75}
        jitterRoughness={0.2}
        steps={40}
        refineSteps={5}
        missedRays={true}
        useNormalMap={true}
        useRoughnessMap={true}
        resolutionScale={1}
        velocityResolutionScale={1}
      />
    </EffectComposer>
  );
}
