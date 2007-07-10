/*
	unFocusFlash.Utilities, version 0.5 (2006/04/26)
	Copyright: 2004-2006, Kevin Newman (http://www.unfocus.com/)
	License: http://creativecommons.org/licenses/LGPL/2.1/
*/

if (!window.unFocus) var unFocus = {};
if (!unFocus.SwfUtilities) unFocus.SwfUtilities = {
	getSwfReference: function(swfId) {
		var $movieObj;
		if (document.embeds && document.embeds[swfId])
			$movieObj = document.embeds[swfId];
		 else if (document[swfId])
			$movieObj = document[swfId];
		 /*else if (window[$swfId])
			$movieObj = $window[$swfId];
		else if (document.getElementById)
			$movieObj = document.getElementById($swfId);*/
		return $movieObj;
	}
};
