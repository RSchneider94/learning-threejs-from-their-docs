import * as THREE from 'three';

class GameBase {
  scene: THREE.Scene;
  camera: THREE.Camera;
  renderer: THREE.Renderer;
  elements: THREE.Object3D[] = [];

  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  addElementToScene<ElementType extends THREE.Object3D>(element: ElementType) {
    this.scene.add(element);
    this.elements.push(element);
  }

  addCube() {
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x1da2d8 });
    const cube = new THREE.Mesh(geometry, material);

    this.addElementToScene(cube);

    this.camera.position.z = 15;
  }

  render() {
    requestAnimationFrame(this.render.bind(this));

    this.elements[0].rotation.x += 0.01;
    this.elements[0].rotation.y += 0.01;

    this.renderer.render(this.scene, this.camera);
  }
}

(function () {
  const APP = document.getElementById('app') as HTMLElement;
  const game = new GameBase();

  game.addCube();
  game.render();

  APP.appendChild(game.renderer.domElement);
})();