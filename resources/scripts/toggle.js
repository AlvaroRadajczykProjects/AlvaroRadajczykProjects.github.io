var tresde = true

function toggle() {
	if(tresde) { 
		document.getElementById("frame").src = "plain.html" 
		document.getElementById("frame").scrolling = "yes"
		document.getElementById("texto").innerHTML = "Pulsa aquí para volver a la página 3D"
	} else { 
		document.getElementById("frame").src = "threedims.html" 
		document.getElementById("frame").scrolling = "no"
		document.getElementById("texto").innerHTML = "Pulsa aquí para volver a la página estándar"
	}
	tresde = !tresde
}

document.getElementById("frame").src = "threedims.html"