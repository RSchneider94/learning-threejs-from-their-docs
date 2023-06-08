import * as THREE from 'three';
import { Text } from 'troika-three-text';
import { AddTextConfig } from './types/Text';
import { Position } from './types/Common';

class GameBase {
  scene: THREE.Scene;
  camera: THREE.Camera;
  renderer: THREE.Renderer;
  elements: number[] = [];
  texts: string[] = [];

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
  }

  addElementToScene<ElementType extends THREE.Object3D>(
    element: ElementType,
    position?: Position
  ) {
    this.scene.add(element);
    this.elements.push(element.id);

    if (position) {
      element.position.set(position.x, position.y, position.z);
    }
  }

  addTextToScene(text: Text) {
    console.log(text);
    this.scene.add(text);
    this.texts.push(text.uuid);
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

  render() {
    try {
      requestAnimationFrame(this.render.bind(this));
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
  game.render();

  APP.appendChild(game.renderer.domElement);
})();
