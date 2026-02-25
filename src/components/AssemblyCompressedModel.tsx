import { Clone, useGLTF } from "@react-three/drei";
import modelUrl from "../assets/assembly/machinecluj-transformed.glb";

export default function AssemblyCompressedModel(props: any) {
  const { scene } = useGLTF(modelUrl, true);
  return <Clone object={scene} {...props} />;
}

useGLTF.preload(modelUrl, true);

