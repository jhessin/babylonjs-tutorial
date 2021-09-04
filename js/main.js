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

// create Camera
function createCamera(scene) {
  const camera = new BABYLON.ArcRotateCamera(
    "camera",
    0,
    0,
    15,
    Vector3.Zero(),
    scene
  );
  camera.attachControl(canvas);

  // limit camera movement
  camera.lowerRadiusLimit = 6;
  camera.upperRadiusLimit = 20;

  return camera;
}

// create a light
function createLight(scene) {
  const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
  light.intensity = 0.5;
  light.groundColor = new Color3(0, 0, 1);
  return light;
}

function createSun(scene) {
  const sunMat = new StandardMaterial("sunMat", scene);
  sunMat.emissiveTexture = new Texture("../assets/images/sun.jpg", scene);
  sunMat.diffuseColor = Color3.Black();
  sunMat.specularColor = Color3.Black();

  const sun = MeshBuilder.CreateSphere(
    "sun",
    {
      segments: 16,
      diameter: 4,
    },
    scene
  );
  sun.material = sunMat;

  // sun light
  const sunLight = new BABYLON.PointLight("sunLight", Vector3.Zero(), scene);
  sunLight.intensity = 2;

  return sun;
}

function createPlanet(scene) {
  const planetMat = new StandardMaterial("planetMat", scene);
  planetMat.diffuseTexture = new Texture("assets/images/sand.png");
  planetMat.specularColor = Color3.Black();

  const speeds = [0.01, -0.01, 0.02];
  for (let i = 0; i < 3; i++) {
    const planet = MeshBuilder.CreateSphere(
      `planet${i}`,
      {
        segments: 16,
        diameter: 1,
      },
      scene
    );
    planet.position.x = 2 * i + 4;
    planet.material = planetMat;

    planet.orbit = {
      radius: planet.position.x,
      speed: speeds[i],
      angle: 0,
    };

    scene.registerBeforeRender(() => {
      planet.position.x = planet.orbit.radius * Math.sin(planet.orbit.angle);
      planet.position.z = planet.orbit.radius * Math.cos(planet.orbit.angle);
      planet.orbit.angle += planet.orbit.speed;
    });
  }
}

function createSkybox(scene) {
  const skyboxMat = new StandardMaterial("skyboxMat", scene);
  skyboxMat.backFaceCulling = false;
  // remove reflection in skybox
  skyboxMat.specularColor = Color3.Black();
  skyboxMat.diffuseColor = Color3.Black();
  // texture 6 sides of our box
  skyboxMat.reflectionTexture = new BABYLON.CubeTexture(
    "../assets/images/skybox/skybox",
    scene
  );
  skyboxMat.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;

  const skybox = MeshBuilder.CreateBox(
    "skybox",
    {
      size: 1000,
    },
    scene
  );
  skybox.material = skyboxMat;

  // move skybox with camera
  skybox.infiniteDistance = true;

  return skybox;
}

function createShip(scene) {
  BABYLON.SceneLoader.ImportMesh(
    "",
    "../assets/models/",
    "spaceCraft1.obj",
    scene,
    (meshes) => {
      meshes.forEach((mesh) => {
        mesh.position = new Vector3(0, -5, 10);
        mesh.scaling = new Vector3(0.2, 0.2, 0.2);
      });
    }
  );
}

function createScene() {
  // create a scene
  const scene = new Scene(engine);
  scene.clearColor = Color3.Black();

  // create a camera
  createCamera(scene);

  // create a light
  createLight(scene);

  createSun(scene);

  createPlanet(scene);

  createSkybox(scene);

  createShip(scene);

  return scene;
}

// create our scene
const scene = createScene();

engine.runRenderLoop(() => {
  scene.render();
});

window.addEventListener("resize", () => {
  engine.resize();
});
