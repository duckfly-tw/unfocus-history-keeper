// Written by Kevin Newman and Elibol, and drawn inspiration from Karina Steffens's ObjectSwap - Thanks!
function ObjectPatentMagic(i,j,_objects,_object,_params) {
	_objects = document.getElementsByTagName("object");
	// rebuild object html for each object in the page
	for (i = 0; i < _objects.length; i++) {
		_object = _objects[i].outerHTML.split(">")[0] + '>'; // from ObjectSwap
		_params = _objects[i].getElementsByTagName('param');
		for (j = 0; j < _params.length; j++)
			_object += '<param name="'+_params[j].name+'" value="'+_params[j].value+'">';
		// do actual replacement
		_objects[i].outerHTML = _object + "</object>";
	}
	document.getElementById("ObjectPatentMagic").disabled = true;
}
window.attachEvent('onload', ObjectPatentMagic);
