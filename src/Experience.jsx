import Lights from "./Lights.jsx";
import { Level } from "./Level.jsx";
import { Physics, Debug } from "@react-three/rapier";
import Player from "./Player.jsx";
import { Perf } from "r3f-perf";
import { OrbitControls, Sky } from "@react-three/drei";
import useGame from "./stores/useGame.jsx";
import Effect from "./stores/Effect.jsx";

export default function Experience() {
  const blocksCount = useGame((state) => state.blocksCount);
  const blocksSeed = useGame((state) => state.blocksSeed);

  return (
    <>
      <Perf />
      <Sky />
      <Physics>
        <Debug />

        <Level count={blocksCount} seed={blocksSeed} />
        <Player />
      </Physics>
      <Effect />
      <Lights />
    </>
  );
}
