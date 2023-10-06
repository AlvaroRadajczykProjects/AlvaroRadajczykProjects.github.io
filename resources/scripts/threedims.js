import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { LoadingManager } from 'three/src/loaders/LoadingManager.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

import { CSS3DRenderer, CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';

$(document).ready(function() {

	let pointerLockActivatedAt = null;
	
	let camera, scene, renderer, renderer1, controls;

	const objects = [];

	let raycaster;
	
	let moveForward = false;
	let moveBackward = false;
	let moveLeft = false;
	let moveRight = false;
	let canJump = false;

	let prevTime = performance.now();
	const velocity = new THREE.Vector3();
	const direction = new THREE.Vector3();
	const vertex = new THREE.Vector3();
	const color = new THREE.Color();
	
	var manager = new THREE.LoadingManager();

	var fuente1 = null;
	var font_loader = new FontLoader(manager);
	
	font_loader.load('../fonts/helvetiker_bold.typeface.json', function(response) {
		fuente1 = response;
	});

	manager.onLoad = function() { // when all resources are loaded
	  init();
	  animate();
	}

	function d3d_texto1(text, textGeometryProps, textMeshProps, ) {
		const textG = new TextGeometry( text, textGeometryProps );
		const textM = new THREE.MeshPhongMaterial( textMeshProps );
		var textMesh = new THREE.Mesh(textG, textM);
		textMesh.castShadow = true;
		return textMesh;
	}
	
	function Element( id, x, y, z, ry ) {

		const div = document.createElement( 'div' );
		div.style.width = '480px';
		div.style.height = '360px';
		div.style.backgroundColor = '#000';

		const iframe = document.createElement( 'iframe' );
		iframe.style.width = '480px';
		iframe.style.height = '360px';
		iframe.style.border = '0px';
		iframe.src = [ 'https://www.youtube.com/embed/', id, '?rel=0' ].join( '' );
		div.appendChild( iframe );

		const object = new CSS3DObject( div );
		object.position.set( x, y, z );
		object.rotation.y = ry;

		return object;

	}

	function init() {

		camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
		camera.position.y = 10;

		scene = new THREE.Scene();

		const light = new THREE.HemisphereLight( 0xeeeeff, 0x777788, 2.5 );
		light.position.set( 0.5, 1, 0.75 );
		scene.add( light );

		controls = new PointerLockControls( camera, document.body );

		const blocker = document.getElementById( 'blocker' );
		const instructions = document.getElementById( 'instructions' );

		blocker.style.zIndex = '2';
		instructions.style.zIndex = '3';

		instructions.addEventListener( 'click', function () {
			if ( pointerLockActivatedAt == null ){
				controls.lock();
				pointerLockActivatedAt = performance.now();
			} else if ( (performance.now() - pointerLockActivatedAt) < 1000 ){ 
				alert("Pulsa aquí, el motor 3D no permite volver a entrar antes de 1 segundo");
			} else {
				controls.lock();
				pointerLockActivatedAt = performance.now();
			}
		} );

		controls.addEventListener( 'lock', function () {
			instructions.style.display = 'none';
			blocker.style.display = 'none';
		} );

		controls.addEventListener( 'unlock', function () {
			pointerLockActivatedAt = performance.now();
			blocker.style.display = 'block';
			instructions.style.display = '';
		} );

		scene.add( controls.getObject() );

		const onKeyDown = function ( event ) {

			switch ( event.code ) {

				case 'ArrowUp':
				case 'KeyW':
					moveForward = true;
					break;

				case 'ArrowLeft':
				case 'KeyA':
					moveLeft = true;
					break;

				case 'ArrowDown':
				case 'KeyS':
					moveBackward = true;
					break;

				case 'ArrowRight':
				case 'KeyD':
					moveRight = true;
					break;

			}

		};

		const onKeyUp = function ( event ) {

			switch ( event.code ) {

				case 'ArrowUp':
				case 'KeyW':
					moveForward = false;
					break;

				case 'ArrowLeft':
				case 'KeyA':
					moveLeft = false;
					break;

				case 'ArrowDown':
				case 'KeyS':
					moveBackward = false;
					break;

				case 'ArrowRight':
				case 'KeyD':
					moveRight = false;
					break;

			}

		};

		document.addEventListener( 'keydown', onKeyDown );
		document.addEventListener( 'keyup', onKeyUp );

		raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );
		
		var texto1 = d3d_texto1(
			"Actualmente",
			{
				font: fuente1, size: 80, height: 5, curveSegments: 12,
				bevelEnabled: true, bevelThickness: 10, bevelSize: 3, bevelOffset: 0, 
				bevelSegments: 5
			},
			{ 
				color: 0xffaaaa, specular: 0xffaaaa, shininess: 30, shading: THREE.FlatShading
			}
		)
		texto1.scale.set(0.5,0.5,0.5)
		texto1.position.set(-160, 50, -200)
		
		var texto2 = d3d_texto1(
			"en",
			{
				font: fuente1, size: 80, height: 5, curveSegments: 12,
				bevelEnabled: true, bevelThickness: 10, bevelSize: 3, bevelOffset: 0, 
				bevelSegments: 5
			},
			{ 
				color: 0xffaaaa, specular: 0xffaaaa, shininess: 30, shading: THREE.FlatShading
			}
		)
		texto2.scale.set(0.5,0.5,0.5)
		texto2.position.set(-20, 0, -200)
		
		var texto3 = d3d_texto1(
			"desarrollo",
			{
				font: fuente1, size: 80, height: 5, curveSegments: 12,
				bevelEnabled: true, bevelThickness: 10, bevelSize: 3, bevelOffset: 0, 
				bevelSegments: 5
			},
			{ 
				color: 0xffaaaa, specular: 0xffaaaa, shininess: 30, shading: THREE.FlatShading
			}
		)
		texto3.scale.set(0.5,0.5,0.5)
		texto3.position.set(-130, -50, -200)
		
		scene.add(texto1)
		scene.add(texto2)
		scene.add(texto3)
		
		const group = new THREE.Group();
		group.add( new Element( 'SJOz3qjfQXU', 0, 0, 240-1000, 0 ) );
		group.add( new Element( 'Y2-xZ-1HE-Q', 240, 0, -1000, Math.PI / 2 ) );
		group.add( new Element( 'IrydklNpcFI', 0, 0, - 240-1000, Math.PI ) );
		group.add( new Element( '9ubytEsCaS0', - 240, 0, -1000, - Math.PI / 2 ) );
		scene.add( group );

		renderer = new CSS3DRenderer();
		renderer.setSize( window.innerWidth, window.innerHeight );
		renderer.domElement.style.position = 'absolute';
		renderer.domElement.style.top = 0;
		//renderer.domElement.style.zIndex = '1';
		
		renderer1 = new THREE.WebGLRenderer( { alpha: true, antialias: true } );
		renderer1.setSize( window.innerWidth, window.innerHeight );
		renderer1.domElement.style.position = 'absolute';
		renderer1.domElement.style.top = 0;
		renderer1.domElement.style.zIndex = '1';
		renderer1.domElement.style.pointerEvents = 'none'
		
		document.body.appendChild( renderer.domElement );
		document.body.appendChild( renderer1.domElement );

		window.addEventListener( 'resize', onWindowResize );

	}

	function onWindowResize() {

		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();

		renderer.setSize( window.innerWidth, window.innerHeight );
		renderer1.setSize( window.innerWidth, window.innerHeight );

	}

	function animate() {

		const time = performance.now();

		requestAnimationFrame( animate );

		if ( controls.isLocked === true ) {

			raycaster.ray.origin.copy( controls.getObject().position );
			raycaster.ray.origin.y -= 10;

			const intersections = raycaster.intersectObjects( objects, false );

			const onObject = intersections.length > 0;

			const delta = ( time - prevTime ) / 1000;

			velocity.x -= velocity.x * 10.0 * delta;
			velocity.z -= velocity.z * 10.0 * delta;

			velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

			direction.z = Number( moveForward ) - Number( moveBackward );
			direction.x = Number( moveRight ) - Number( moveLeft );
			direction.normalize(); // this ensures consistent movements in all directions

			if ( moveForward || moveBackward ) velocity.z -= direction.z * 400.0 * delta;
			if ( moveLeft || moveRight ) velocity.x -= direction.x * 400.0 * delta;

			if ( onObject === true ) {

				velocity.y = Math.max( 0, velocity.y );
				canJump = true;

			}

			controls.moveRight( - velocity.x * delta );
			controls.moveForward( - velocity.z * delta );

			controls.getObject().position.y += ( velocity.y * delta ); // new behavior

			if ( controls.getObject().position.y < 10 ) {

				velocity.y = 0;
				controls.getObject().position.y = 10;

				canJump = true;

			}

		}

		prevTime = time;

		renderer.render( scene, camera );
		renderer1.render( scene, camera );

	}
	
});