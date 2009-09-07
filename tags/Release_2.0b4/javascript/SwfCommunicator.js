/*
unFocus.SwfCommunicator, version 0.8 (alpha) (svn $Revision$) $Date$
Copyright: 2005-2007, Kevin Newman (http://www.unfocus.com/)
http://www.opensource.org/licenses/mit-license.php
*/
// set up function for IE to use to create the fscommand catcher
/*if (window.ActiveXObject && window.print && !window.opera)
	// Communicator.vbs
	document.write('<scr'+'ipt type="text/vbscript"\>Sub unFocusCreateFSCommand (n)\nExecuteGlobal "Sub " & n & ',
		'"_FSCommand(ByVal c, ByVal a):" & "call " & n & "_','DoFSCommand(c, a):" & "End Sub"\nEnd Sub</scr'+'ipt\>');
*/
// do  initialization stuff
unFocus.SwfCommunicator = function(_movieId, _communicatorSWF) {
	var getSwfReference = unFocus.SwfUtilities.getSwfReference;
	/* provides reference for methods attatched to other objects 
	(like _CatchFSCommand) it will compress well too ;-) */
	var _this = this,
		_setVariableQueue = [],
		_comDivId = "unFocusFlashCommunicatorDiv",
		//_comSwfId = 'unFocusFlashCommunicatorSwf',
		_comDivRef,
		_connId,
		_movieObj;
	
	/* Private Method: _routeFSCommand
		Set up FSCommand catch functions - catch, and route fscommand calls.
		:NOTE: "this" keyword is scoped to window, so use the _this ref instead */
	function _routeFSCommand($command, $arguments) {
		// do the command
		// :NOTE: Safari places "FSCommand:" in front of anything sent from flash with fscommand for some reason..
		// This might be due to Safari using getURL with FSCommand as the protocol, which might be causeing some 
		// of the strange behavior with refreshing, and multiple calls. :TODO: look into this to see what versions
		// of Flash and Safari are doing this - also note, this might have been solved in newer Safari and Flash versions.
		if ($command.indexOf('FSCommand:') != -1) $command = $command.substring(10, $command.length);
		
		switch ($command) {
			case "unFocusFlashTestFSCommand":
					/* get reference to the flash Object */
					if (!_movieObj)
						_movieObj = getSwfReference(_movieId);
					// if we are here, then fscommand works!
					_this.setVariable("unFocusJavascriptCommunication","unFocusJavascriptUseFSCommand");
				break;
			case "unFocusFlashSetConnID":
					_connId = $arguments;
					_cycleSetVariableQueue();
				break;
			default:
				// call user's DoFSCommand
				//_DoFSCommand($command, $arguments);
				_this.notifyListeners("FSCommand", [$command,$arguments]);
				// call DoFSCommand (will be ignored by stub method, if not defined by user)
				_this.DoFSCommand($command, $arguments);
		}
	}
	// these all route to _routeFSCommand
	window[_movieId + "_"+"DoFSCommand"] = _routeFSCommand;
	// catch function for IE
	if (typeof unFocusCreateFSCommand != "undefined") unFocusCreateFSCommand(_movieId);
	
	// stub DoFSCommand - to be overwritten by user for classic style DoFSCommand usage.
	_this.DoFSCommand = new Function;

	/* Private Method: _cycleSetVariableQueue
		If a call to setVariable is made before the flash movie and all participants are ready for it,
		it is added to a Queue. This method clears that Queue when things become ready */
	// :TODO: spin this out as a Utility class (Queue Class)
	function _cycleSetVariableQueue() {
		var _localQueue = _setVariableQueue;
		_setVariableQueue = []; // empty the array
		if (_localQueue.length) {
			// we may need a delay here, to give the comSwf time to load (or just pile up the comSwfs in the html)
			for (var i = 0; i < _setVariableQueue.length; i++) {
				_this.setVariable(_localQueue[i].$name, _localQueue[i].$value);
			}
		}
	}
	
	/* Method: setVariable
		Sets the variable in flash. This method emulates Macromedia's setVariable method exactly even when it
		isn't supported natively (it does that using the LocalConnection technique). */
	_this.setVariable = function($name, $value) {
		if (!_movieObj)
			_movieObj = getSwfReference(_movieId);
		// when the native function is available, use that
		if (typeof _movieObj.SetVariable != "undefined") {/* && !window.opera */
			// overwrite the emulated (default) setVariable function
			_this.setVariable = function($name, $value) {
				_movieObj.SetVariable($name, $value);
			};
			_this.SetVariable = _this.setVariable;
			//_cycleSetVariableQueue();
			// now run this call
			_this.setVariable($name, $value);
		// check _connId - if there is none, then the following will not work. _connId is sent out from 
		// the swf file when it fails to detect fscommand (and thus fails the test for SetVariable).
		} else if (_connId) {
			///// do setup ...
			// create the div to hold the communication flash movie(s)
			if (!document.getElementById(_comDivId)) { // in case user sets it up manually
				var _comDivRef = document.createElement("div");
				_comDivRef.id = _comDivId;
				_comDivRef.style.position = "absolute";
				_comDivRef.style.top = "-900px";
				//_historyFrame.runtimeStyle.display = 'none';
				document.body.insertBefore(_comDivRef,document.body.firstChild);
			}
			
			// set up the html object to reuse for sending in the data
			var $element = new unFocus.SwfTools.HTML();
			$element.setSrc(_communicatorSWF);
			$element.setWidth(1);
			$element.setHeight(1);
			$element.setVersion("6");
			$element.setMinorRevision("29");
			$element.setAllowscriptaccess("always");
			
			///// overwrite the original function:
			_this.setVariable = function($name, $value) {
				// :NOTE: this cannot be used until the receiving flash movie passes out the connectionID
				// do localconnection thingy
				$element.setFlashvars("cid="+_connId+"&cmd=setVariable&vName="+$name+"&vValue="+$value);
				
				_comDivRef.innerHTML = $element.getHTML();
			};
			_this.SetVariable = _this.setVariable;
			//_cycleSetVariableQueue();
			// run this call
			_this.setVariable($name, $value);
		} else {
			// add to queue
			_setVariableQueue.push({$name:$name,$value:$value});
		}
	};
	
	/* 
	Method: SetVariable
		Provides an alias to setVariable for consistancy with Flash.
	*/
	_this.SetVariable = _this.setVariable;
	
	// store ref to this object in a static array, for use by LongCallFSCommand
	unFocus.SwfCommunicator._instances.push(_this);
	
	_this._getMovieObj = function() {
		if (!_movieObj)
			_movieObj = getSwfReference(_movieId);
			alert(_movieObj.src);
		return _movieObj; // will be different depending on if it's an object or an embed, or a SATAY
	};
};

unFocus.SwfCommunicator.prototype = new unFocus.EventManager("FSCommand");

/* static */
unFocus.SwfCommunicator._instances = [];
/*unFocus.SwfCommunicator.retrieveSwfId = function($swfName, $connId) {
	
};*/
unFocus.SwfCommunicator.LongCallFSCommand = function($swfName, $cmd, $args)
{
	// loop through all swfs on the page, and figure out which one just called this method.
	// then send in the response.
	var _matches = [],
		_curMovieObj,
		_movieId,
		instances = unFocus.SwfCommunicator._instances;
		
	for (var i =0; i < instances.length; i++)
	{
		_curMovieObj = instances[i]._getMovieObj();
		// :TODO: add checks for Object src tags (look up Satay, and standar object tags)
		/*if (_curMovieObj.src && _curMovieObj.src.indexOf($swfName) != -1)
			_matches.push(_curMovieObj);
		else */
		// check if src is the same as requesting swf movie
		if (
			_curMovieObj.hasAttribute &&
			_curMovieObj.hasAttribute("src") &&
			_curMovieObj.getAttribute("src").indexOf($swfName) != -1
		) {
			// get movie id
			if (_curMovieObj.hasAttribute("id"))
				_movieId = _curMovieObj.getAttribute("id");
			else if (_curMovieObj.hasAttribute("name"))
				_movieId = _curMovieObj.getAttribute("name");
			_matches.push(instances[i]);
		}
		
	}
	
	if (_matches.length === 1)
		_matches[0].setVariable("unFocusJavascriptCommunication","unFocusJavascriptSetMovieId="+_movieId);
	// :TODO: add logic for if there are more than one embedded object with the same src
}
/*unFocus.SwfCommunicator.prototype.setupHTML = function($htmlObj) {
	$htmlObj.addFlashvar("unFocusFlashMovieId",$htmlObj.getId());
};*/
