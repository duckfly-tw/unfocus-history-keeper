/*
unFocus.SwfHTML, version 2.0 (beta 2) (2007/09/11)
Copyright: 2005-2007, Kevin Newman (http://www.unfocus.com/Projects/)

This file is part of unFocus.History Keeper.

unFocus.History Keeper is free software; you can redistribute it and/or modify it under the terms of the GNU Lesser General Public License as published by
the Free Software Foundation; either version 3 of the License, or (at your option) any later version.

unFocus.History Keeper is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

/*
Class: SwfHTML
	A class for assembling and outputting html for a Swf file.
	
References:
	<http://www.adobe.com/go/tn_12701>
	<http://www.adobe.com/go/tn_16588>
*/
unFocus.SwfShim = function(shimSwfUrl) {
	/*if (!shimSwfUrl && !unFocus.SwfShim.shimSwfUrl)
		throw new Error (
			"MissingArgument", 
			"You must pass the URL of the SwfShim.swf to the constructor, or set the static property - unFocus.SwfShim.shimSwfUrl."
		);*/
	this._shimSwfUrl = shimSwfUrl || unFocus.SwfShim.shimSwfUrl;
};
// static properties and methods
//SwfShim.shimSwfUrl = "";
with (unFocus) {
	//SwfShim.shimSwfUrl = "";
	SwfShim.EIRegistry = {};
	SwfShim.EIResultsMsg = function(id,msg) {
		SwfShim.EIRegistry[id](msg);
	};
	SwfShim.EIRegister = function(id,method) {
		SwfShim.EIRegistry[id] = method;
	};
	// :NOTE: this is relative to the document, not this js source file
	SwfShim.shimSwfUrl = "SwfShim.swf";
}
// new methods and overrides
unFocus.SwfShim.prototype = {
	__proto__: unFocus.SwfHTML.prototype,
	_realSrc: "",
	_MMdocumentTitle: escape(document.title),
	_MMredirectURL: escape(window.location),
	// :NOTE: This should be overridden by the user.
	ExpressInstallCallback: function(){},
	_useExpressInstall: false,
	getHTML: function() {
		unFocus.SwfHTML.prototype.setSrc.call(this,this._shimSwfUrl);
		this.addFlashvar("unFocusMovieSrc", this._realSrc);
		if (this._useExpressInstall) {
			this.addFlashvar("unFocusVersion", this._version);
			
			this.addFlashvar("unFocusMajorRevision", this._majorRevision);
			this.addFlashvar("unFocusMinorRevision", this._majorRevision);
			this.addFlashvar("unFocusBetaVersion", this._betaVersion);
			
			this.setVersion(6);
			this.setMinorRevision(65);
			
			this.addFlashvar("MMdocumentTitle", this._MMdocumentTitle);
			this.addFlashvar("MMredirectURL", this._MMredirectURL);
			
			if (!this._properties.id)
				this.setID("shimID_" + Math.floor(Math.random()*1000000));
			var swfID = this._properties.id;
			this.addFlashvar("unFocusSwfID", swfID);
			
			if (/*@cc_on!@*/0) {
				// use SwfCommunicator.vbs to add the fscommand catcher method if needed
				if (
					typeof unFocusCreateFSCommand != "undefined" && 
					!window[swfID+"_FSCommand"]
				)
					unFocusCreateFSCommand(swfID);
				this.addFlashvar("MMplayerType", "ActiveX");
			} else {
				this.addFlashvar("MMplayerType", "PlugIn");
			}
			
			// handles cases when users can't upgrade with EI or chooses not to
			unFocus.SwfShim.EIRegister(swfID, this.ExpressInstallCallback);
		}
		// return unFocus.SwfHTML.getHTML.apply(this);
		return unFocus.SwfHTML.prototype.getHTML.apply(this);
	},
	setSrc: function(src) {
		this._realSrc = src;
	},
	setMMdocumentTitle: function(title) {
		this._MMdocumentTitle = title;
	},
	setMMredirectURL: function(url) {
		this._MMredirectURL = url;
	},
	setExpressInstallCallback: function(method) {
		this.ExpressInstallCallback = method;
	},
	useExpressInstall: function(useEI) {
		this._useExpressInstall = useEI;	
	}
}
