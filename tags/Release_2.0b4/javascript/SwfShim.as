/*
unFocus.SwfShim, version 0.8 (alpha) (svn $Revision$) $Date$
Copyright: 2005-2007, Kevin Newman (http://www.unfocus.com/Projects/)
http://www.opensource.org/licenses/mit-license.php
*/

class SwfShim
{
	var loadIntervalID:Number;
	var updateUrl:String = "http://fpdownload.macromedia.com/pub/flashplayer/update/current/swf/autoUpdater.swf";
	
	function SwfShim()
	{
		var versionPieces:Array = System.capabilities.version.split(' ')[1].split(',');
		var version:Number = parseFloat(versionPieces[0]+'.'+versionPieces[1]);
		var majorRevision:Number = parseInt(versionPieces[2]);
		var minorRevision:Number = parseInt(versionPieces[3]);
		
		var reqVersion:Number = typeof _root.reqVersion != "undefined" ? parseInt(_root.reqVersion) : 0;
		var reqMinorRevision:Number = typeof _root.reqMinorRevision != "undefined" ? parseInt(_root.reqMinorRevision) : 0;
		
		if (typeof _root.reqMajorRevision != "undefined")
			reqVersion = parseFloat(reqVersion + '.' + _root.reqMajorRevision);
		
		if (
			version < reqVersion || 
			(
				reqMinorRevision && 
				version == reqVersion && 
				minorRevision < reqMinorRevision
			)
		) {
			if (
				typeof _root.MMredirectURL != "undefined" &&
				typeof _root.MMdocumentTitle != "undefined" &&
				typeof _root.MMplayerType != "undefined"
			) {
				System.security.allowDomain("fpdownload.macromedia.com");
				
				_root.installStatus = function(status)
				{
					switch (status) {
						//case "Download.Complete":
							// Express Install worked. There's really nothing to do here.
							//break;
						case "Download.Cancelled":
							// User chose not to Express Install new Flash version
						case "Download.Failed":
							// The Download failed for some reason, so kick out message to javascript
							SwfShim.sendEIResults(status);
							break;
					}
				}
				
				_root.createEmptyMovieClip("updateClip", _root.getNextHighestDepth());
				
				loadIntervalID = setInterval(this, "updateClipOnLoad", 20);
				
				_root.updateClip.loadMovie(updateUrl+"?"+Math.random());
			}
			else {
				SwfShim.sendEIResults("Config.Error");
			}
		}
		else if (typeof _root.movieSrc != undefined) // load content
			_root.loadMovie(_root.movieSrc);
		
	}
	
	static function main()
	{
		if (typeof _root.useExpressInstall != undefined)
			return new SwfShim();
		else if (typeof _root.movieSrc != undefined) // load content
			_root.loadMovie(_root.movieSrc);
	}
	
	function updateClipOnLoad():Void
	{
		if (typeof _root.updateClip.startUpdate == 'function') {
			clearInterval(loadIntervalID);
			//The autoUpdater swf looks for _root.MMredirectURL, so setting these might be pointless
			_root.redirectURL = _root.MMredirectURL; // duplicate just in case
			_root.updateClip.redirectURL = _root.MMredirectURL;
			_root.updateClip.MMplayerType = _root.MMplayerType;
			_root.updateClip.MMdoctitle = _root.MMdocumentTitle;
			_root.updateClip.startUpdate();
		}
	}
	
	static function sendEIResults(result:String):Void
	{
		if (typeof _root.eiCallbackName != "undefined")
			getURL('javascript:'+_root.eiCallbackName+'("'+result+'")');
	}
	
}
