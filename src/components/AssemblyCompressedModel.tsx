import { Clone, useGLTF } from "@react-three/drei";
import type { ThreeElements } from "@react-three/fiber";

const MODEL_URL = "/model/rig.glb";
useGLTF.setDecoderPath("/draco/");

type ModelProps = ThreeElements["group"];
type ModelCloneProps = Omit<ModelProps, "ref">;

export default function AssemblyCompressedModel(props: ModelCloneProps) {
  const { scene } = useGLTF(MODEL_URL, true);
  return <Clone object={scene} {...props} />;
}

useGLTF.preload(MODEL_URL, true);
