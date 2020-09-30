import React from 'react';

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import model from './models/box.gltf';

import crate1 from './images/crate1.jpg';
import crate2 from './images/crate2.jpg';

// Init the scene
var scene = new THREE.Scene();

// Set background
scene.background = new THREE.Color(0x535669);

// Set camera
var camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 5;
camera.position.y = 5;
camera.position.x = 5;
camera.lookAt(new THREE.Vector3(0, 0, 0)); // Make the camera look at the point of origin

// Set renderer
var renderer = new THREE.WebGLRenderer({ antialias: true });
var devicePixelRatio = window.devicePixelRatio || 1; // To handle high pixel density displays

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(devicePixelRatio);

document.body.appendChild(renderer.domElement);

var loader = new GLTFLoader();

var loadedModel;

var light = new THREE.AmbientLight(0x404040); // soft white light

var directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(10, 5, 15);

// instantiate a texture loader
var textureLoader = new THREE.TextureLoader();
textureLoader.crossOrigin = '';

var map1 = textureLoader.load(crate1);
var map2 = textureLoader.load(crate2);

// If texture is used for color information, set colorspace.
map1.encoding = THREE.sRGBEncoding;
map2.encoding = THREE.sRGBEncoding;

// UVs use the convention that (0, 0) corresponds to the upper left corner of a texture.
map1.flipY = false;
map2.flipY = false;

function loadModel() {
  loader.load(
    model,
    function (gltf) {
      loadedModel = gltf.scene.children[0];
      scene.add(loadedModel, light, directionalLight);
    },
    undefined,
    function (error) {
      console.error(error);
    }
  );
}

function textureModel(textureChosen) {
  loader.load(
    model,
    function (gltf) {
      loadedModel = gltf.scene.children[0];
      loadedModel.material = new THREE.MeshPhongMaterial({
        map: textureChosen,
        color: 0xffffff,
      });
      scene.add(loadedModel, light, directionalLight);
    },
    undefined,
    function (error) {
      console.error(error);
    }
  );
}

var controls = new OrbitControls(camera, renderer.domElement);

export default function App() {
  return (
    <div>
      {/* <div>{<button onClick={loadModel}>Load Model</button>}</div>
      <div>{<button onClick={textureModel(map1)}>Texture1</button>}</div>
      <div>{<button onClick={textureModel(map2)}>Texture2</button>}</div>
      <div>{<button onClick={exportGLTF}>Export Model</button>}</div> */}
    </div>
  );
}

// document.getElementById('load_object').addEventListener('click', function () {
//   loadModel();
// });

document
  .getElementById('texture1_object')
  .addEventListener('click', function () {
    textureModel(map1);
  });

document
  .getElementById('texture2_object')
  .addEventListener('click', function () {
    textureModel(map2);
  });

document.getElementById('export_object').addEventListener('click', function () {
  exportGLTF(loadedModel);
});

function exportGLTF() {
  var gltfExporter = new GLTFExporter();

  var options = {
    // trs: document.getElementById('option_trs').checked,
    // onlyVisible: document.getElementById('option_visible').checked,
    // truncateDrawRange: document.getElementById('option_drawrange').checked,
    // binary: document.getElementById('option_binary').checked,
    // forcePowerOfTwoTextures: document.getElementById('option_forcepot').checked,
    // maxTextureSize: Number(document.getElementById('option_maxsize').value) || Infinity // To prevent NaN value
  };
  gltfExporter.parse(
    loadedModel,
    function (result) {
      if (result instanceof ArrayBuffer) {
        saveArrayBuffer(result, 'scene.glb');
      } else {
        var output = JSON.stringify(result, null, 2);
        console.log(output);
        saveString(output, 'scene.gltf');

        //          // your axios call here
        //    localStorage.setItem("pageData", "Data Retrieved from axios request")
        //    // route to new page by changing window.location
        //    window.open(newPageUrl, "_blank") //to open new page

        // <a href="intent://arvr.google.com/scene-viewer/1.0?
        // file=https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Avocado/glTF/Avocado.gltf
        // #Intent;scheme=https;package=com.google.android.googlequicksearchbox;action=android.intent.action.VIEW;S.browser_fallback_url=https://developers.google.com/ar;end;">Avocado</a>
      }
    },
    options
  );
}

var link = document.createElement('a');
link.style.display = 'none';
document.body.appendChild(link); // Firefox workaround, see #6594

function save(blob, filename) {
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();

  // URL.revokeObjectURL( url ); breaks Firefox...
}

function saveString(text, filename) {
  save(new Blob([text], { type: 'text/plain' }), filename);
}

function saveArrayBuffer(buffer, filename) {
  save(new Blob([buffer], { type: 'application/octet-stream' }), filename);
}

function animate() {
  controls.update();
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

loadModel();
animate();
