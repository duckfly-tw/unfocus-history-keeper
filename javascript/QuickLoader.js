/*
 * unFocus.QuickLoader, version 1.0b2 (beta) (2007/04/23)
 * Copyright: 2005-2006, Kevin Newman (http://www.unfocus.com/Projects/)
 * License: http://creativecommons.org/licenses/LGPL/2.1/
 * Based on the excellent work of Dean Edwards et al:
 * http://dean.edwards.name/weblog/2005/09/busted/
 */
unFocus.QuickLoader = (function() {
	var _eventMgr = new unFocus.EventManager("_quickLoad", "_quickLoadPriority"),
	_loadComplete = false;
	
	function _quickLoad() {
		// cancel the standard load to prevent double call
		if (document.removeEventListener)
			document.removeEventListener("load", _load, false);
		// prevents double load and cleans up possible memory leak issues in IE
		else if (window.detachEvent) window.detachEvent("onload", _load);
		// call loading script
		if (!_loadComplete) _load();
	}
	function _load(e) {
		// prevent load event from firing twice, if _load goes off before _quickLoad
		_loadComplete = true;
		// trigger listeners
		_eventMgr.notifyListeners("_quickLoadPriority");
		_eventMgr.notifyListeners("_quickLoad"); // :TODO: send the event object
		// prevent double load if Safari's Load goes before Quickload
		if (_SafariTimer) clearInterval(_SafariTimer);
	}
	
	// the following lines all attempt to set up the early load events.
	if (document.addEventListener) {
		// add the quick load for Mozilla (and Opera 9+)
    	document.addEventListener("DOMContentLoaded", _quickLoad, false);
		// fail safe load method (in case the quicker load method fails)
		document.addEventListener("load", _load, false);
	} else if (window.attachEvent)
		window.attachEvent("onload", _load);
	
	// For Safari
	// :NOTE: this doesn't seem to work if the document is small enough
	// :FIX?: What if we just check it imediately...
	function _SafariLoadCheck() {
		if (/loaded|complete/.test(document.readyState)) {
			clearInterval(_SafariTimer);
			delete _SafariTimer;
			_quickLoad(); // call the onload handler
			return true;
		}
		return false;
	}
	var _SafariTimer = false;
	if (!_SafariLoadCheck() && /WebKit/i.test(navigator.userAgent)) { // sniff
		_SafariTimer = setInterval(_SafariLoadCheck, 10);
	}
	
	// For IE 
	/*@cc_on @if (@_win32)
		document.write("<script id=__"+"ie_onload defer src=//0><\/script>");
		var _script = document.getElementById("__"+"ie_onload");
		_script.onreadystatechange = function() {
			if (this.readyState == "complete")
				_quickLoad();
		};
	@end @*/
	
	// return an object with public interface
	var _QuickLoader = {
		addListener: function($method, $priority) {
			var $type = (!$priority)?"_quickLoad":"_quickLoadPriority";
			_eventMgr.addEventListener($type, $method);
		},
		removeListener: function($method, $priority) {
			var $type = (!$priority)?"_quickLoad":"_quickLoadPriority";
			_eventMgr.removeEventListener($type, $method);
		}
	};
	return _QuickLoader;
})();