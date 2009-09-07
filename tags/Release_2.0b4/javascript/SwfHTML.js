/*
unFocus.SwfHTML, version 2.0 (svn $Revision$) $Date$
Copyright: 2005-2009, Kevin Newman (http://www.unfocus.com/)
http://www.opensource.org/licenses/mit-license.php
*/
// Package: unFocus
if (!window.unFocus) var unFocus = {};

/*
Class: SwfHTML
	A class for assembling and outputting html for a Swf file.
	
References:
	<http://www.adobe.com/go/tn_12701>
	<http://www.adobe.com/go/tn_16588>
*/
unFocus.SwfHTML = function() {
	this._properties = {};
	this._params = {};
	this._flashvars = "";
	this._flashvarPairs = {};
	this._version = 0;
	this._majorRevision = 0;
	this._minorRevision = 0;
	this._betaVersion = 0;
	this._src = "";
};
// setters check against valid values http://www.adobe.com/go/tn_12701
unFocus.SwfHTML.prototype = {
	// Method: setSrc
	//	Sets the Src of the swf file.
	setSrc: function($src) {
		this._src = $src;
	},
	// Method: setWidth
	//	Sets the Width of the swf file.
	setWidth: function($width) {
		this._properties.width = $width;
	},
	setHeight: function($height) {
		this._properties.height = $height;
	},
	setId: function($id) {
		this._properties.id = $id;
	},
	getId: function() {
		return this._properties.id;
	},
	setName: function($name) {
		this._properties.name = $name;
	},
	
	setMovie: function($src) {
		this.setSrc($src);
	},
	setSwliveconnect: function($swliveconnect) {
		if (typeof $swliveconnect == "boolean")
			this._params.swliveconnect = $swliveconnect;
		else
			throw "SwfHTML.setSwliveconnect Error: Valid Values for swliveconnect: true, false";
	},
	setPlay: function($play) {
		if (typeof $play == "boolean")
			this._params.play= $play;
		else
			throw "SwfHTML.setPlay Error: Valid Values for play: true, false";
	},
	setLoop: function($loop) {
		if (typeof $loop == "boolean")
			this._params.loop= $loop;
		else
			throw "SwfHTML.setLoop Error: Valid Values for loop: true, false";
	},
	setMenu: function($menu) {
		if (typeof $menu == "boolean")
			this._params.menu= $menu;
		else
			throw "SwfHTML.setMenu Error: Valid Values for menu: true, false";
	},
	setQuality: function($quality) {
		switch ($quality.toLowerCase()) {
			case "low":
			case "medium":
			case "high":
			case "autolow":
			case "autohigh":
			case "best":
				this._params.quality = $quality; /* low, medium, high, autolow, autohigh, best */
				break;
			default:
				throw "SwfHTML.setQuality Error: Valid Values for quality: low, medium, high, autolow, autohigh, best";
		}
	},
	setScale: function($scale) {
		switch ($scale.toLowerCase()) {
			case "showall":
			case "noborder":
			case "exactfit":
			case "noscale":
				this._params.scale = $scale; /* showall, noborder, exactfit, noscale (missing from the documentation) */
				break;
			default:
				throw "SwfHTML.setScale Error: Valid Values for scale: showall, noborder, exactfit, noscale";
		}
	},
	setAlign: function($align) { // :NOTE: There is a conflict here - you can set align on the html element, as well as for the movie. Hhow does this sort out for embed?
		switch ($align.toLowerCase()) {
			case "l":
			case "t":
			case "r":
			case "b":
				this._params.align = $align; /* l, t, r, b (defaults to center, which isn't in the list) */
				break;
			default:
				throw "SwfHTML.setAlign Error: Valid Values for align: l, t, r, b";
		}
	},
	setSAlign: function($salign) {
		switch ($salign.toLowerCase()) {
			case "l":
			case "t":
			case "r":
			case "b":
			case "tl":
			case "tr":
			case "bl":
			case "br":
				this._params.salign = $salign;
				break;
			default:
				throw "SwfHTML.setSAlign Error: Valid Values for salign: l, t, r, b, tl, tr, bl, br";
		}
	},
	setWMode: function($wmode) {
		switch($wmode.toLowerCase()) {
			case "window":
			case "opaque":
			case "transparent":
			case "direct":
			case "gpu":
				this._params.wmode = $wmode;
				break;
			default:
				throw "SwfHTML.setWMode Error: Valid Values for wmode: window, opaque, transparent";
		}
	},
	setBGColor: function($bgcolor) {
		if (/^#[\dA-F]{6}$/i.test($bgcolor))
			this._params.bgcolor = $bgcolor.toUpperCase(); /* #RRGGBB, hexadecimal RGB value */
		else
			throw "SwfHTML.setBGColor Error: Valid Values for bgcolor: a valid html color hex value (#0099FF)";
	},
	setBase: function($base) {
		this._params.base = $base;
	},
	setFlashvars: function($flashvars) {
		this._flashvars = $flashvars;
	},
	addFlashvar: function($name, $value) {
		if ($value)
			this.setFlashvars($name + "=" + escape($value) + "&" + this._flashvars);
	},
	
	// http://www.macromedia.com/cfusion/knowledgebase/index.cfm?id=tn_16494
	setAllowscriptaccess: function($allowscriptaccess) {
		switch ($allowscriptaccess.toLowerCase()) {
			case "never":
			case "always":
				this._params.allowscriptaccess = $allowscriptaccess;
				break;
			default:
				throw "SwfHTML.setAllowscriptaccess Error: Valid Values for allowscriptaccess: never, always";
		}
	},
	
	// for version stuffs
	setVersion: function($version) {
		this._version = $version;
	},
	setMajorRevision: function($majorRevision) {
		this._majorRevision = $majorRevision;
	},
	setMinorRevision: function($minorRevision) {
		this._mainorRevision = $minorRevision;
	},
	setBetaVersion: function($betaVersion) {
		this._betaVersion = $betaVersion;
	},
	
	// misc
	setAdditionalParam: function($name, $value) {
		this._params[$name] = $value;
	},
	setAdditionalProperty: function($name, $value) {
		this._properties[$name] = $value;
	},
	
	// new allowFullScreen prop
	setAllowFullScreen: function($allowFullScreen) {
		if (typeof $allowFullScreen == "boolean")
			this._params.allowFullScreen= $allowFullScreen;
		else
			throw "SwfHTML.setAllowFullScreen Error: Valid Values for allowFullScreen: true, false";
	},
	
	/**
	 * Generates the platform specific HTML for the flash movie
	 *
	 * @return String containing the platform specific HTML for the flash movie
	 */
	getHTML: function() {
		// initialize local variables
		var $key, $html, $ActiveX = window.ActiveXObject && window.print && !window.opera;
		
		if (this._src) {
			if ($ActiveX)
				this._params.movie = this._src;
			else
				this._properties.src = this._src;
		}
		
		if ($ActiveX) {
			$html = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="';
			// solve https popup issue http://www.adobe.com/go/tn_16588
			$html += /^https/.test(window.location)?"https":"http";
			$html += '://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version='+this._version+","+this._majorRevision+","+this._minorRevision+","+this._betaVersion+'"';
		} else
			$html = "<embed";
		
		// output  properties
		for ($key in this._properties)
			$html += ' ' + $key + '="' + this._properties[$key]+'"';
	
		if ($ActiveX) {
			$html += ">";
			for ($key in this._params)
				$html += '<param name="' + $key + '" value="' + this._params[$key] + '">';
			if (this._flashvars)
				$html += '<param name="flashvars" value="' + this._flashvars + '">';
		} else {
			for ($key in this._params)
				$html += " " + $key + '="' + this._params[$key]+'"';
			if (this._flashvars)
				$html += ' flashvars="' + this._flashvars + '"';
		}
		
		// outputs the rest of the platform specific stuff
		if ($ActiveX)
			$html += '</object>';
		else
			$html += '" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer"></embed>';
		return $html;
	}
};

// :NOTE: These can't be compressed within an eval, if they are it triggers the IE patent thingy
unFocus.SwfHTML.prototype.writeToDocument = function($document) {
	$document.write(this.getHTML());
};
unFocus.SwfHTML.prototype.outputToInnerHTML = function($element) {
	$element.innerHTML = this.getHTML();
};
unFocus.SwfHTML.prototype.outputToOuterHTML = function($element) {
	$element.outerHTML = this.getHTML();
};
