import { Clone, useGLTF } from "@react-three/drei";
import type { ThreeElements } from "@react-three/fiber";
import modelUrl from "../assets/assembly/machinecluj-transformed.glb";

type ModelProps = ThreeElements["group"];
type ModelCloneProps = Omit<ModelProps, "ref">;

export default function AssemblyCompressedModel(props: ModelCloneProps) {
  const { scene } = useGLTF(modelUrl, true);
  return <Clone object={scene} {...props} />;
}

useGLTF.preload(modelUrl, true);

