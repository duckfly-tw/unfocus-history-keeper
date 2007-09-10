/*
unFocus.SwfShim, version 0.8 (alpha) (2007/07/17)
Copyright: 2005-2007, Kevin Newman (http://www.unfocus.com/Projects/)

This file is part of unFocus.History Keeper.

unFocus.History Keeper is free software; you can redistribute it and/or modify it under the terms of the GNU Lesser General Public License as published by
the Free Software Foundation; either version 3 of the License, or (at your option) any later version.

unFocus.History Keeper is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

class SwfShim
{
	private var versionPieces:Array;
	private var version:Number;
	private var majorRevision:Number;
	private var minorRevision:Number;
	// there's no reason to test for beta, since you can't upgrade to a beta using ExpressInstall
	//private var betaVersion:Number;
	private var loadIntervalID:Number;
	private var msgIntervalID:Number;
	private var updateUrl:String = "http://fpdownload.macromedia.com/pub/flashplayer/update/current/swf/autoUpdater.swf";
	
	function SwfShim() {
		versionPieces = System.capabilities.version.split(' ')[1].split(',');
		version = parseFloat(versionPieces[0]+'.'+versionPieces[1]);
		majorRevision = parseInt(versionPieces[2]);
		minorRevision = parseInt(versionPieces[3]);
		//betaVersion = parseInt(versionPieces[4]);
		
		// clean the flashvars
		if (typeof _root.MMredirectURL != "undefined")
			_root.MMredirectURL = new String(_root.MMredirectURL);
		if (typeof _root.MMdocumentTitle != "undefined")
			_root.MMdocumentTitle = new String(_root.MMdocumentTitle);
		if (typeof _root.MMplayerType != 'undefined')
			_root.MMplayerType = new String(_root.MMplayerType);
		
		_root._version = typeof _root._version != "undefined" ? parseInt(_root._version) : 0;
		if (typeof _root._majorRevision != "undefined")
			_root._version = parseFloat(_root._version + '.' +_root._majorRevision);
		
		if (typeof _root._minorRevision != "undefined")
			_root._minorRevision = parseInt(_root._minorRevision);
		
		/*if (typeof _root._betaVersion != "undefined")
			_root._betaVersion = parseInt(_root.betaVersion);*/
		
		// determine if Express Install is necessary (and if requirements are met):
		if (
			_root.MMredirectURL &&
			_root.MMdocumentTitle &&
			_root.MMplayerType &&
			(
				version < _root._version || 
				(
					_root._minorRevision && 
					version == _root._version && 
					minorRevision < _root._minorRevision
				)
			)
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
						this.sendEIResults(status);
						break;
				}
			}
			
			_root.createEmptyMovieClip("updateClip", _root.getNextHighestDepth());
			
			loadIntervalID = setInterval(this, "updateClipOnLoad", 20);
			
			_root.updateClip.loadMovie(updateUrl+"?"+Math.random());
			
		}
		else if (typeof _root.unFocusMovieSrc == "string") // load content
		{
			_root.loadMovie(_root.unFocusMovieSrc);
		}
		/* is all of this really necessary? :TODO: display a config error
		else // complete breakdown (probably left out a variable)
		{
			trace(typeof _root.movieSrc);
			trace('complete breakdown: misconfiguration');
			// probably do some kind of javascript communication here
			//and let javascript turn off the movie, and use whatever
			//non-flash content was specified there.
			var EIResultsMSg:String = 'Misconfiguration';
			sendEIResults(EIResultsMSg);
			
			var msgIntervalID = setInterval(this, 'SendEIResultsBackup', 200, EIResultsMSg);
			
			function sendEIResults(result:String):Void
			{
				// this should respond through swfRef.SetVariable - setting 
				// unFocusShimMsgConfirm to true;
				fscommand('unFocusShim.EIResults', result);
			}
			// fscommand doesn't always work, so we do a backup with this in that case
			function sendIERsultsBackup(result:String):Void
			{
				clearInterval(msgIntervalID);
				getURL('javascript:unFocus.Shim.EIRsultsMsg("'+result+'")');
				// :TODO: turn on generic English message as a final backup plan:
			}
			
			_root.unFocusShimMsgConfirm = false;
			_root.watch('unFocusShimMsgConfirm', function(prop, oldVal, newVal, intervalID) {
				clearInterval(intervalID);
				return newVal;
			}, msgIntervalID);
			
		}*/
	}
	
	public static function main():SwfShim
	{
		return new SwfShim();
	}
	
	private function updateClipOnLoad():Void
	{
		if (typeof _root.updateClip.startUpdate == 'function') {
			clearInterval(loadIntervalID);
			//The autoUpdater swf looks for _root.MMredirectURL, so setting these might be pointless
			_root.redirectURL = _root.MMredirectURL; // duplicate just in case
			_root.updateClip.redirectURL = _root.MMredirectURL;
			_root.updateClip.MMredirectURL = _root.MMredirectURL; // also duplicate just in case
			_root.updateClip.MMplayerType = _root.MMplayerType;
			_root.updateClip.MMdoctitle = _root.MMdocumentTitle;
			_root.updateClip.startUpdate();
		}
	}
	
	private function sendEIResults(result:String):Void
	{
		// this should respond through swfRef.SetVariable - setting 
		// unFocusShimMsgConfirm to true;
		//fscommand('unFocusShim.EIResults', result);
		// :TODO: send a unique ID, to identify the Swf on the outside
		getURL('javascript:unFocus.SwfShim.XIResultsMsg("'+result+'")');
	}
	
}
