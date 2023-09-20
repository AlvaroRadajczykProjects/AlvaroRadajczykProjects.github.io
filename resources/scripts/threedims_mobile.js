import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FirstPersonControls } from 'three/addons/controls/FirstPersonControls.js';

$(document).ready(function() {
	
	var touch_pos_x = 0.0;
	var touch_pos_y = 0.0;
	
	var hipotenusa = 0.0;
	var seno = 0.0;
	var coseno = 0.0;
	
	function getOffset(el) {
		const rect = el.getBoundingClientRect();
		return {
			left: rect.left + window.scrollX,
			top: rect.top + window.scrollY
		};
	}

	function dragElementComputer(elmnt) {
		var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
		
		elmnt.onmousedown = dragMouseDown;

		function dragMouseDown(e) {
			e = e || window.event;
			e.preventDefault();
			// get the mouse cursor position at startup:
			pos3 = e.clientX;
			pos4 = e.clientY;
			document.onmouseup = closeDragElement;
			// call a function whenever the cursor moves:
			document.onmousemove = elementDrag;
		}

		function elementDrag(e) {
			e = e || window.event;
			e.preventDefault();
			// calculate the new cursor position:
			
			pos1 = pos3 - e.clientX;
			pos2 = pos4 - e.clientY;
			pos3 = e.clientX;
			pos4 = e.clientY;
			
			touch_pos_x = e.clientX;
			touch_pos_y = e.clientY;
			
			if ( elmnt.parentElement != "" || elmnt.parentElement != null ) {
			
				var padre = elmnt.parentElement
				var padre_centrox = getOffset(padre).left + padre.offsetWidth/2;
				var padre_centroy = getOffset(padre).top + padre.offsetHeight/2;
				var hijo_centrox = getOffset(elmnt).left + elmnt.offsetWidth/2;
				var hijo_centroy = getOffset(elmnt).top + elmnt.offsetHeight/2;
			
				hipotenusa = Math.sqrt( Math.pow(padre_centrox -  e.clientX, 2.0) + Math.pow(padre_centroy -  e.clientY, 2.0) )
				seno = (e.clientX-padre_centrox)/hipotenusa;
				coseno = (e.clientY-padre_centroy)/hipotenusa;
			
				if( hipotenusa < 50 ){
					elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
					elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
				} else {
					//Math.PI
					elmnt.style.left = ( padre.offsetWidth/2 - elmnt.offsetWidth/2 ) + seno*50 + "px";
					elmnt.style.top = ( padre.offsetHeight/2 - elmnt.offsetHeight/2 ) + coseno*50 + "px";
				}

			}
		}

		function closeDragElement() {
			// stop moving when mouse button is released:
			var padre = elmnt.parentElement

			elmnt.style.top = padre.offsetHeight/2 - elmnt.offsetHeight/2 + "px";
			elmnt.style.left = padre.offsetWidth/2 - elmnt.offsetWidth/2 + "px";
			
			seno = 0;
			coseno = 0;
			
			document.onmouseup = null;
			document.onmousemove = null;
		}
	  
	}
	
	function dragElementMobile(elmnt) {
	
		var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

		elmnt.addEventListener("touchstart", handleStart);
		elmnt.addEventListener("touchend", handleEnd);
		elmnt.addEventListener("touchcancel", handleCancel);
		elmnt.addEventListener("touchmove", handleMove);
		
		function handleStart(evt) {
			evt.preventDefault();
			var touches = evt.changedTouches;
			var touch = touches[0];
			pos3 = touch.pageX;
			pos4 = touch.pageY;
		}

		function handleMove(evt) {
			evt.preventDefault();
			var touches = evt.changedTouches;
			var touch = touches[0];
			
			pos1 = pos3 - touch.pageX;
			pos2 = pos4 - touch.pageY;
			pos3 = touch.pageX;
			pos4 = touch.pageY;
			
			if ( elmnt.parentElement != "" || elmnt.parentElement != null ) {
			
				var padre = elmnt.parentElement
				var padre_centrox = getOffset(padre).left + padre.offsetWidth/2;
				var padre_centroy = getOffset(padre).top + padre.offsetHeight/2;
				var hijo_centrox = getOffset(elmnt).left + elmnt.offsetWidth/2;
				var hijo_centroy = getOffset(elmnt).top + elmnt.offsetHeight/2;
			
				hipotenusa = Math.sqrt( Math.pow(padre_centrox -  touch.pageX, 2.0) + Math.pow(padre_centroy -  touch.pageY, 2.0) )
				seno = (touch.pageX-padre_centrox)/hipotenusa;
				coseno = (touch.pageY-padre_centroy)/hipotenusa;
			
				if( hipotenusa < 50 ){
					elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
					elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
				} else {
					//Math.PI
					elmnt.style.left = ( padre.offsetWidth/2 - elmnt.offsetWidth/2 ) + seno*50 + "px";
					elmnt.style.top = ( padre.offsetHeight/2 - elmnt.offsetHeight/2 ) + coseno*50 + "px";
				}

			}
		}

		function handleEnd(evt) {
			evt.preventDefault();
			var padre = elmnt.parentElement
			elmnt.style.top = padre.offsetHeight/2 - elmnt.offsetHeight/2 + "px";
			elmnt.style.left = padre.offsetWidth/2 - elmnt.offsetWidth/2 + "px";
			seno = 0;
			coseno = 0;
		}

		function handleCancel(evt) {
			evt.preventDefault();
		}
	  
	}
	
	function dragElement(elmnt) {
		if ( elmnt.parentElement != "" || elmnt.parentElement != null ) {
			var padre = elmnt.parentElement
			elmnt.style.left = padre.offsetWidth/2 - elmnt.offsetWidth/2 + "px";
			elmnt.style.top = padre.offsetHeight/2 - elmnt.offsetHeight/2 + "px";
		}
	
		if ('ontouchstart' in window || navigator.maxTouchPoints) {
			dragElementMobile(elmnt);
		} else {
			dragElementComputer(elmnt);
		}
	}

	dragElement(document.getElementById("joystick_control"));
	
/* =========================================================== THREE JS ======================================================= */

	let pointerLockActivatedAt = null;

	let camera, scene, renderer, controls;

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

	init();
	animate();

	function init() {

		camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );
		camera.position.y = 10;

		scene = new THREE.Scene();
		scene.background = new THREE.Color( 0xffffff );
		scene.fog = new THREE.Fog( 0xffffff, 0, 750 );

		const light = new THREE.HemisphereLight( 0xeeeeff, 0x777788, 2.5 );
		light.position.set( 0.5, 1, 0.75 );
		scene.add( light );

		controls = new OrbitControls(camera, document.getElementById("container"));
  
		  const updateCameraOrbit = () => {
			const forward = new THREE.Vector3();
			camera.getWorldDirection(forward);

			controls.target.copy(camera.position).add(forward);
		  };
		  
		  controls.addEventListener('end', () => {
			updateCameraOrbit();
		  });
		  
		  updateCameraOrbit();

		scene.add( controls );

		raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );

		// floor

		let floorGeometry = new THREE.PlaneGeometry( 2000, 2000, 100, 100 );
		floorGeometry.rotateX( - Math.PI / 2 );

		// vertex displacement

		let position = floorGeometry.attributes.position;

		for ( let i = 0, l = position.count; i < l; i ++ ) {

			vertex.fromBufferAttribute( position, i );

			vertex.x += Math.random() * 20 - 10;
			vertex.y += Math.random() * 2;
			vertex.z += Math.random() * 20 - 10;

			position.setXYZ( i, vertex.x, vertex.y, vertex.z );

		}

		floorGeometry = floorGeometry.toNonIndexed(); // ensure each face has unique vertices

		position = floorGeometry.attributes.position;
		const colorsFloor = [];

		for ( let i = 0, l = position.count; i < l; i ++ ) {

			color.setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75, THREE.SRGBColorSpace );
			colorsFloor.push( color.r, color.g, color.b );

		}

		floorGeometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colorsFloor, 3 ) );

		const floorMaterial = new THREE.MeshBasicMaterial( { vertexColors: true } );

		const floor = new THREE.Mesh( floorGeometry, floorMaterial );
		scene.add( floor );

		// objects

		const boxGeometry = new THREE.BoxGeometry( 20, 20, 20 ).toNonIndexed();

		position = boxGeometry.attributes.position;
		const colorsBox = [];

		for ( let i = 0, l = position.count; i < l; i ++ ) {

			color.setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75, THREE.SRGBColorSpace );
			colorsBox.push( color.r, color.g, color.b );

		}

		boxGeometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colorsBox, 3 ) );

		for ( let i = 0; i < 500; i ++ ) {

			const boxMaterial = new THREE.MeshPhongMaterial( { specular: 0xffffff, flatShading: true, vertexColors: true } );
			boxMaterial.color.setHSL( Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75, THREE.SRGBColorSpace );

			const box = new THREE.Mesh( boxGeometry, boxMaterial );
			box.position.x = Math.floor( Math.random() * 20 - 10 ) * 20;
			box.position.y = Math.floor( Math.random() * 20 ) * 20 + 10;
			box.position.z = Math.floor( Math.random() * 20 - 10 ) * 20;

			scene.add( box );
			objects.push( box );

		}

		//

		renderer = new THREE.WebGLRenderer( { antialias: true } );
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize( window.innerWidth, window.innerHeight );
		document.body.appendChild( renderer.domElement );

		//

		window.addEventListener( 'resize', onWindowResize );

	}

	function onWindowResize() {

		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();

		renderer.setSize( window.innerWidth, window.innerHeight );

	}

	function animate() {

		const time = performance.now();

		requestAnimationFrame( animate );


		raycaster.ray.origin.copy( camera.position );
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

		camera.translateX( seno );
		camera.translateZ( coseno );
		
		//controls.getObject().position.x = camera.position.x;
		//controls.getObject().position.z = camera.position.z;
		
		/*camera.position.y += ( velocity.y * delta );
		
		if ( camera.position.y < 10 ) {

			velocity.y = 0;
			camera.position.y = 10;

			canJump = true;

		}*/
		
		/*controls.moveRight( - velocity.x * delta );
		controls.moveForward( - velocity.z * delta );

		controls.getObject().position.y += ( velocity.y * delta ); // new behavior

		if ( controls.getObject().position.y < 10 ) {

			velocity.y = 0;
			controls.getObject().position.y = 10;

			canJump = true;

		}*/

		prevTime = time;

		renderer.render( scene, camera );

	}
	
});