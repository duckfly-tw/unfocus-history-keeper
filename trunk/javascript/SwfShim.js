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
	<http://code.google.com/p/swfobject/wiki/faq>
*/
unFocus.SwfShim = function(shimSwfUrl) {
	unFocus.SwfHTML.call(this);
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
	eiCallbackName: false,
	expressInstall: false,
	getHTML: function() {
		var theHTML;
		unFocus.SwfHTML.prototype.setSrc.call(this,this._shimSwfUrl);
		this.addFlashvar("movieSrc", this._realSrc);
		
		if (this.expressInstall) {
			this.addFlashvar("useExpressInstall", "true");
			this.addFlashvar("reqVersion", this._version);
			this.addFlashvar("reqMajorRevision", this._majorRevision);
			this.addFlashvar("reqMinorRevision", this._minorRevision);
			
			var version = this._version,
				minorRev = this._minorRevision;
			
			this.setVersion(6);
			this.setMinorRevision(65);
			
			this.addFlashvar("MMdocumentTitle", this._MMdocumentTitle);
			this.addFlashvar("MMredirectURL", this._MMredirectURL);
			
			if (this.eiCallbackName)
				this.addFlashvar("eiCallbackName", this.eiCallbackName);
			
			if (/*@cc_on!@*/0)
				this.addFlashvar("MMplayerType", "ActiveX");
			else
				this.addFlashvar("MMplayerType", "PlugIn");
			
			theHTML = unFocus.SwfHTML.prototype.getHTML.apply(this);
			
			this.setVersion(version);
			this.setMinorRevision(minorRev);
		}
		else
			theHTML = unFocus.SwfHTML.prototype.getHTML.apply(this);
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
	setExpressInstallCallback: function(methodName) {
		this.eiCallbackName = methodName;
	},
	useExpressInstall: function(useEI) {
		this.expressInstall = useEI;	
	}
}
