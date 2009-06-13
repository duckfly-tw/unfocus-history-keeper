/*
unFocus.SwfHTML, version 2.0 (beta 3) (svn $Revision$) $Date$
Copyright: 2005-2009, Kevin Newman (http://www.unfocus.com/)
http://www.opensource.org/licenses/mit-license.php
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
	/*if (!shimSwfUrl && !unFocus.SwfShim.shimSwfUrl)
		throw new Error (
			"Argument Error. You must pass the URL of the SwfShim.swf to the constructor, or set the static property - unFocus.SwfShim.shimSwfUrl."
		);*/
	unFocus.SwfHTML.call(this);
	this._shimSwfUrl = shimSwfUrl || unFocus.SwfShim.shimSwfUrl;
};
// static properties and methods
with (unFocus) {
	// :NOTE: this is relative to the document, not this js source file
	SwfShim.shimSwfUrl = "SwfShim.swf";
	SwfShim.prototype = new SwfHTML;
}
with (unFocus.SwfShim) {
	// new methods and overrides
	prototype._realSrc = "";
	prototype._MMdocumentTitle = escape(document.title);
	prototype._MMredirectURL = escape(window.location);
	// :NOTE: This should be overridden by the user.
	prototype.eiCallbackName = false;
	prototype.expressInstall = false;
	prototype.shimMode = false;
	
	prototype.setSrc = function(src) {
		this._realSrc = src;
	};
	prototype.setMMdocumentTitle = function(title) {
		this._MMdocumentTitle = title;
	};
	prototype.setMMredirectURL = function(url) {
		this._MMredirectURL = url;
	};
	prototype.setExpressInstallCallback = function(methodName) {
		this.eiCallbackName = methodName;
	};
	prototype.useExpressInstall = function(useEI) {
		this.expressInstall = useEI;	
	};
	prototype.useShimMode = function(m) {
		this.shimMode = m;	
	};
}
unFocus.SwfShim.prototype.getHTML = function() {
	var theHTML, useEI;
	
	if (this.shimMode)
		this.addFlashvar("movieSrc", this._realSrc);
	else
		unFocus.SwfHTML.prototype.setSrc.call(this,this._realSrc);
	
	if (this.expressInstall) {
		// :NOTE: Uses JS based detection. To use ExpressInstall, without shimMode
		// you need to include unFocus.FlashPlayerInfo. Not needed otherwise.
		with (unFocus.FlashPlayerInfo) {
			var majorRevision = getMajorRevision();
			var version = getVersion() + '.' + majorRevision;
			var minorRevision = getMinorRevision();
		}
		
		var reqVersion = this._version;
		if (this._majorVersion)
			reqVersion = reqVersion + '.' + this._majorVersion;
		
		var reqMinorRevision = this._minorRevision;
		
		if (version < reqVersion || (
				reqMinorRevision && 
				version == reqVersion && 
				minorRevision < reqMinorRevision
			)
		) useEI = true;
	}
	
	if (useEI || this.shimMode) {
		unFocus.SwfHTML.prototype.setSrc.call(this,this._shimSwfUrl);
		
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
	
	return theHTML;
};
