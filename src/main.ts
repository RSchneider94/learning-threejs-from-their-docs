import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Text } from 'troika-three-text';
import { AddTextConfig, TextElement } from './types/Text';
import { Position } from './types/Common';
import { AnimationToExecute } from './types/Animations';

class GameBase {
  scene: THREE.Scene;
  camera: THREE.Camera;
  renderer: THREE.Renderer;
  elementsIds: number[] = [];
  texts: TextElement[] = [];
  animationsToExecute: AnimationToExecute[] = [];
  loader: GLTFLoader;

  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.z = 10;
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.loader = new GLTFLoader();
  }

  addElementToScene<ElementType extends THREE.Object3D>(
    element: ElementType,
    position?: Position
  ) {
    this.scene.add(element);
    this.elementsIds.push(element.id);

    if (position) {
      element.position.set(position.x, position.y, position.z);
    }
  }

  addTextToScene(text: Text) {
    this.scene.add(text);
    this.texts.push({
      id: text.uuid,
      element: text,
    });
  }

  addCube() {
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x1da2d8 });
    const cube = new THREE.Mesh(geometry, material);

    this.addElementToScene(cube);

    this.addText('This is my first cube', {
      position: {
        x: -2,
        y: 1.5,
        z: 0,
      },
    });

    this.animationsToExecute.push({
      elementId: cube.id,
      animation: {
        rotation: {
          x: 0.01,
          y: 0.01,
        },
      },
    });
  }

  addLine() {
    const material = new THREE.LineBasicMaterial({ color: 0x1da2d8 });
    const points: THREE.Vector3[] = [];

    points.push(new THREE.Vector3(-10, 0, 0));
    points.push(new THREE.Vector3(0, 5, 0));
    points.push(new THREE.Vector3(10, 0, 0));

    const geometry = new THREE.BufferGeometry().setFromPoints(points);

    const line = new THREE.Line(geometry, material);

    this.addElementToScene(line);

    this.addText('This is my first line', {
      position: {
        x: -2,
        y: 6,
        z: 0,
      },
    });
  }

  addText(text: string, config: AddTextConfig) {
    const textMesh = new Text();
    this.addTextToScene(textMesh);

    textMesh.text = text;
    textMesh.fontSize = config?.fontSize ?? 0.5;
    textMesh.color = config?.color ?? 0xffffff;
    textMesh.position.x = config.position.x;
    textMesh.position.y = config.position.y;
    textMesh.position.z = config.position.z;

    textMesh.sync();
  }

  addDragon() {
    this.loader.load(
      './assets/black_dragon_with_idle_animation.glb',
      (gltf) => {
        this.addElementToScene(gltf.scene, {
          x: 0,
          y: -4,
          z: 0,
        });
      },
      undefined,
      (error) => {
        console.error(error);
      }
    );
  }

  executeAnimations() {
    function executeAxesAnimations(
      element: THREE.Object3D | Text,
      animationToExecute: AnimationToExecute
    ) {
      if (animationToExecute.animation.rotation) {
        Object.keys(animationToExecute.animation.rotation).forEach((axis) => {
          element.rotation[axis] +=
            animationToExecute?.animation?.rotation?.[axis];
        });
      }

      if (animationToExecute.animation.position) {
        Object.keys(animationToExecute.animation.position).forEach((axis) => {
          element.position[axis] +=
            animationToExecute?.animation?.position?.[axis];
        });
      }
    }

    this.animationsToExecute.forEach((animationToExecute) => {
      if (typeof animationToExecute.elementId === 'string') {
        const element = this.texts.find(
          (text) => text.id === animationToExecute.elementId
        )?.element;

        if (element) {
          executeAxesAnimations(element, animationToExecute);
        }
      } else {
        const element = this.scene.getObjectById(animationToExecute.elementId);

        if (element) {
          executeAxesAnimations(element, animationToExecute);
        }
      }
    });
  }

  render() {
    try {
      requestAnimationFrame(this.render.bind(this));
      this.executeAnimations();
      this.renderer.render(this.scene, this.camera);
    } catch (error) {
      console.error(error);
    }
  }
}

(function () {
  const APP = document.getElementById('app') as HTMLElement;
  const game = new GameBase();

  game.addCube();
  game.addLine();
  // Couldn't make this work at the moment
  // Will try to fix it later
  // game.addDragon();
  game.render();

  APP.appendChild(game.renderer.domElement);
})();
