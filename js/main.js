/// <reference path='./vendor/babylon.d.ts' />
const {
  // Common Resources
  Vector3,
  Color3,
  MeshBuilder,

  // Engine, Scene, etc.
  Engine,
  Scene,

  // Cameras
  UniversalCamera,

  // Lights
  HemisphericLight,

  // Materials and textures
  StandardMaterial,
  Texture,
} = BABYLON;

// get our canvas
const canvas = document.getElementById("renderCanvas");

// create a BabylonJS engine
const engine = new Engine(canvas, true);

function createScene() {
  // create a scene
  const scene = new Scene(engine);

  // create a camera
  //const camera = new FreeCamera("camera", Vector3.Zero(), scene);
  //const camera = new BABYLON.UniversalCamera(
  //"camera",
  //new Vector3(0, 0, -10),
  //scene
  //);
  const camera = new BABYLON.FollowCamera(
    "camera",
    new Vector3(0, 25, -50),
    scene
  );
  camera.radius = 5;
  camera.attachControl(canvas, true);

  // create a light
  //const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
  //light.position = new Vector3(0, 1, 0);
  //const light = new BABYLON.PointLight("light", new Vector3(0, 5, 5), scene);
  const light = new BABYLON.DirectionalLight(
    "light",
    new Vector3(5, -1, 0),
    scene
  );

  // create a box
  const box = MeshBuilder.CreateBox(
    "box",
    {
      size: 1,
    },
    scene
  );
  box.rotation.x = 2;
  box.rotation.y = 3;
  camera.lockedTarget = box;

  // create a sphere
  const sphere = MeshBuilder.CreateSphere(
    "sphere",
    {
      segments: 32,
      diameter: 2,
    },
    scene
  );
  sphere.position = new Vector3(3, 0, 0);
  sphere.scaling = new Vector3(0.5, 0.5, 0.5);

  // create a plane
  const plane = MeshBuilder.CreatePlane("plane", {}, scene);
  plane.position = new Vector3(-3, 0, 0);

  // create a line
  const points = [
    new Vector3(2, 0, 0),
    new Vector3(2, 1, 1),
    new Vector3(2, 1, -1),
  ];
  const lines = MeshBuilder.CreateLines(
    "lines",
    {
      points,
    },
    scene
  );

  // create a material
  const material = new StandardMaterial("material", scene);
  material.diffuseColor = Color3.Red();
  material.emissiveColor = Color3.Green();

  box.material = material;

  const mat2 = new StandardMaterial("mat2", scene);
  mat2.diffuseTexture = new Texture("assets/dark rock seamless.png");

  sphere.material = mat2;

  return scene;
}

// create our scene
const scene = createScene();

engine.runRenderLoop(() => {
  scene.render();
});
