import { createCamera } from "./components/camera.js";
import { createScene } from "./components/scene.js";
import { createCameraControls } from "./systems/cameraControls.js";
import { createRenderer } from "./systems/renderer.js";
import { Resizer } from "./systems/Resizer.js";
import { gltfLoad } from "./components/gltf_loader/gltfLoad.js";
import { hdriLoad } from "./components/hdri_loader/hdri_loader.js";
import { DebugUI } from "./systems/DebugUi.js";
import { AnimLoop } from "./systems/AnimLoop.js";

import { MathUtils } from "three";

// These variables are module-scoped: we cannot access them
// from outside the module
let camera;
let renderer;
let scene;
let controls;
let loop;
let debugUI;


class World {
  constructor(container) {
    camera = createCamera();
    scene = createScene();
    renderer = createRenderer();

    loop = new AnimLoop(camera, scene, renderer);

    debugUI = new DebugUI(scene);
    loop.updatables.push(debugUI.stats);

    //WINDOW RESIZER
    const resizer = new Resizer(container, camera, renderer);
    container.append(renderer.domElement);

    controls = createCameraControls(camera, renderer.domElement);
    loop.updatables.push(controls);
  }

  //SETS UP BACKGROUND
  async loadBackground() {
    const { background1, hdri1 } = await hdriLoad();
    scene.environment = hdri1;
  }

  //GLTF LOADER
  async loadGltf() {
    const { loadedmodel } = await gltfLoad(renderer);

    const radiansPerSecond = MathUtils.degToRad(30);
    loadedmodel.tick = (delta) => {
      loadedmodel.rotation.y += radiansPerSecond * delta;
    };
    loop.updatables.push(loadedmodel);
    scene.add(loadedmodel);
  }




  start() {
    loop.start();


  }

  stop() {
    loop.stop();
  }
}

export { World };
