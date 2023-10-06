import * as THREE from 'three';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { LoadingManager } from 'three/src/loaders/LoadingManager.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

import { CSS3DRenderer, CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';


$(document).ready(function() {
	
var touch_pos_x = 0.0;
var touch_pos_y = 0.0;

var hipotenusa = 0.0;
var seno = 0.0;
var coseno = 0.0;

var moving = false;

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
		
		moving = true;
		
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
		
		moving = false;
		
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

function getNearestTouchIndex (touches, padrex, padrey) {
	var idx = 0;
	var mindis = 9999;
	for(let i = 0; i < touches.length; i++) {
		var distancia = Math.sqrt( Math.pow(padrex - touches[i].pageX, 2.0) + Math.pow(padrey - touches[i].pageY, 2.0) );
		if( distancia < mindis ){
			mindis = distancia;
			idx = i;
		}
	}
	return idx;
}

function dragElementMobile(elmnt) {

	var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

	elmnt.addEventListener("touchstart", handleStart);
	elmnt.addEventListener("touchend", handleEnd);
	elmnt.addEventListener("touchcancel", handleCancel);
	elmnt.addEventListener("touchmove", handleMove);
	
	function handleStart(evt) {
		evt.preventDefault();
		
		moving = true;
		
		if ( elmnt.parentElement != "" || elmnt.parentElement != null ) {
			var padre = elmnt.parentElement;
			var padre_centrox = getOffset(padre).left + padre.offsetWidth/2;
			var padre_centroy = getOffset(padre).top + padre.offsetHeight/2;
			
			var touches = evt.changedTouches;
			var touch = touches[getNearestTouchIndex(touches, padre_centrox, padre_centroy)]; //
			
			pos3 = touch.pageX;
			pos4 = touch.pageY;
		}
	}

	function handleMove(evt) {
		evt.preventDefault();
		
		if ( elmnt.parentElement != "" || elmnt.parentElement != null ) {
		
			var padre = elmnt.parentElement
			var padre_centrox = getOffset(padre).left + padre.offsetWidth/2;
			var padre_centroy = getOffset(padre).top + padre.offsetHeight/2;
		
			moving = true;
			var touches = evt.changedTouches;
			var touch = touches[getNearestTouchIndex(touches, padre_centrox, padre_centroy)];
			
			pos1 = pos3 - touch.pageX;
			pos2 = pos4 - touch.pageY;
			pos3 = touch.pageX;
			pos4 = touch.pageY;

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
		
		moving = false;
		var padre = elmnt.parentElement
		elmnt.style.top = padre.offsetHeight/2 - elmnt.offsetHeight/2 + "px";
		elmnt.style.left = padre.offsetWidth/2 - elmnt.offsetWidth/2 + "px";
		seno = 0;
		coseno = 0;
	}

	function handleCancel(evt) {
		evt.preventDefault();
		
		moving = false;
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


let camera, scene, renderer, renderer1;
let controls;

const forward = new THREE.Vector3();

const objects = [];

let raycaster;

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

function init() {

	const container = document.getElementById( 'container' );

	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.set( 0, 0, 0 );

	scene = new THREE.Scene();
	
	// lights

	var light, materials;

	scene.add( new THREE.AmbientLight( 0x666666 ) );

	light = new THREE.DirectionalLight( 0xdfebff, 1 );
	light.position.set( 50, 200, 100 );
	light.position.multiplyScalar( 1.3 );

	light.castShadow = true;

	light.shadow.mapSize.width = 1024;
	light.shadow.mapSize.height = 1024;

	var d = 300;

	light.shadow.camera.left = - d;
	light.shadow.camera.right = d;
	light.shadow.camera.top = d;
	light.shadow.camera.bottom = - d;

	light.shadow.camera.far = 1000;

	scene.add( light );

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
	
	container.appendChild( renderer.domElement );
	container.appendChild( renderer1.domElement );
	
	const joystck = document.getElementById("joystick")
	container.appendChild( joystck );
	const joystck_control = document.getElementById("joystick_control")
	joystck.appendChild( joystck_control );
	joystck_control.style.zIndex = '3';
	joystck.style.zIndex = '2';

	const group = new THREE.Group();
	group.add( new Element( 'SJOz3qjfQXU', 0, 0, 240-1000, 0 ) );
	group.add( new Element( 'Y2-xZ-1HE-Q', 240, 0, -1000, Math.PI / 2 ) );
	group.add( new Element( 'IrydklNpcFI', 0, 0, - 240-1000, Math.PI ) );
	group.add( new Element( '9ubytEsCaS0', - 240, 0, -1000, - Math.PI / 2 ) );
	scene.add( group );
	
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

	controls = new OrbitControls( camera, renderer.domElement );
	scene.add(controls);

	window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer1.setSize( window.innerWidth, window.innerHeight );
}

function animate() {

	requestAnimationFrame( animate );
	
	var grados_joystick = Math.asin(seno) * (180/Math.PI);
		
	if( grados_joystick > 0 ){
		if(coseno > 0){ grados_joystick = 180 - grados_joystick; }
	} else {
		if(coseno > 0){ grados_joystick = 180 - grados_joystick; }
		else{ grados_joystick += 360; }
	}
	
	var grados_camara = controls.getAzimuthalAngle() * (180/Math.PI);
	
	if( grados_camara < 0 ){
		grados_camara = -grados_camara;
	} else {
		grados_camara = 360 - grados_camara;
	}
	
	var grados_totales = ( (grados_joystick + grados_camara) ) * (Math.PI/180);
	
	if (moving){
		camera.position.x += Math.sin(grados_totales);
		camera.position.z -= Math.cos(grados_totales);
	}
	
	render()
	
	camera.getWorldDirection(forward);
	controls.target.copy(camera.position).add(forward);

}

function render() {
	renderer.render( scene, camera );
	renderer1.render( scene, camera );
}

})