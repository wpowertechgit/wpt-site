import { Clone, useGLTF } from "@react-three/drei";

export default function MachineGLB(props: any) {
  const { scene } = useGLTF("/machine.glb");
  return <Clone object={scene} {...props} />;
}

useGLTF.preload("/machine.glb");
