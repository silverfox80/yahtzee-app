import { useRef } from "react";
import { extend, useThree } from "@react-three/fiber";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

extend({ OrbitControls });

function Controls(props) {
  const { camera, gl } = useThree()
  const controlsRef = useRef()

  return <orbitControls ref={controlsRef} 
                        minAzimuthAngle={-Math.PI} 
                        maxAzimuthAngle={Math.PI}  
                        minPolarAngle={-Math.PI} 
                        maxPolarAngle={Math.PI / 2.02} // < 90 degree
                        minDistance={5}
                        maxDistance={20}
                        enablePan={false} 
                        enableZoom={true} 
                        enableRotate={true} 
                        attach={"orbitControls"}  
                        args={[camera, gl.domElement]} 
          />;
}

export default Controls;