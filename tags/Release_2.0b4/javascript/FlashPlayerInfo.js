/*
unFocus.FlashPlayerInfo, version 1.1 b8 (beta) (svn $Revision$) $Date$
Copyright: 2005-2009, Kevin Newman (http://www.unfocus.com/)
http://www.opensource.org/licenses/mit-license.php
*/
if (!window.unFocus) var unFocus = {};

unFocus.FlashPlayerInfo = (function() {
	// private vars
	var _installed = false,
		_beta = false,
		_version = 0,
		_majorRevision = 0,
		_minorRevision = 0,
		_betaVersion = 0,
		_versionRaw = "",
		_playerType = "",
		_releaseCode = "",
		_updateVer = 0;
	
	// detection work
	if (navigator.plugins && navigator.plugins.length > 0) {
		_versionRaw = navigator.plugins["Shockwave Flash 2.0"] || navigator.plugins["Shockwave Flash"];
		if (_versionRaw) {
			_versionRaw = _versionRaw.description;
			_installed = true;
			_playerType = "PlugIn";
			if (/Shockwave Flash/.test(_versionRaw)) {
				_version = _versionRaw.match(/Shockwave Flash (\d+)\.(\d+)/);
				_majorRevision = _version[2];
				if (/r\d+/.test(_versionRaw)) {
					_releaseCode = "r";
					_minorRevision = _versionRaw.match(/r(\d+)/)[1];
				}
				_version = _version[1];
				if (/[abd]\d+/.test(_versionRaw)) { // I'm not sure what other letters would be here, but I've encountered b, d and a (alpha) so far
					_betaVersion = _versionRaw.match(/([abd])(\d+)/);
					_releaseCode = _betaVersion[1];
					_beta = true;
					_betaVersion = _betaVersion[2];
				}
			} else _version = 1;
		}
	} else if (window.ActiveXObject) {
		// src: Player.vbs 
		var _ax;
		function _getActiveXObject($objectString) {
			try {
				_ax = new ActiveXObject($objectString);
				return true;
			} catch (e){
				return false;
			}
		}
		var _versionTemp;
		
		function _parseVersion() {
			var _versionTemp = _ax.GetVariable("$version");
			_versionRaw = _versionTemp;
			_versionTemp = _versionTemp.split(",");
			_version = _versionTemp[0].match(/\d+/);
			_majorRevision = _versionTemp[1];
			_minorRevision = _versionTemp[2];
			_betaVersion = _versionTemp[3];
			// Flash Player 10+ uses the last place as a build number, so we
			// can't make the same assumptions for 10+.
			if (_version < 10 && _versionTemp[3]>0) _beta = true;
			// if the last number is 0, assume this is a release version
			else _releaseCode = "r";
		}
		
		// we have to detect around Flash 6, since it can crash some versions of IE
		if (_getActiveXObject("ShockwaveFlash.ShockwaveFlash.7"))
			_parseVersion();
		else if (_getActiveXObject("ShockwaveFlash.ShockwaveFlash.6")) {
			// tread lightly
			try {
				// will throw error if < 6.0.47 (info glombed from Adobe's Detection Kit - thanks!)
				_ax.AllowScriptAccess = "always";
				// now safe to call GetVariable
				_parseVersion();
			} catch (e) {
				_version = 6;
				_minorRevision = 0; // cannot be safely detected
			}
		} else if (_getActiveXObject("ShockwaveFlash.ShockwaveFlash.5"))
			_parseVersion();
		else if (_getActiveXObject("ShockwaveFlash.ShockwaveFlash.4"))
			_version = 4;
		else if (_getActiveXObject("ShockwaveFlash.ShockwaveFlash.3"))
			_version = 3;
		else if (_getActiveXObject("ShockwaveFlash.ShockwaveFlash"))
			// Tested on Windows 95 with flash player 2 - using the ".2" at the end doesn't work, but this does ;-)
			// :BUG: This doesn't seem to work when FP2 is installed in WinXP
			_version = 2;
		if (_version) {
			_installed = true;
			_playerType = "ActiveX";
		}
	}
	
	// Flash Player 9 update versions.
	// http://en.wikipedia.org/wiki/Adobe_Flash_Player#History
	if (_version == 9) {
		if (_minorRevision >= 115)
			_updateVer = 3;
		// :NOTE: This linux check is weak, it should use the internal flash player "LNX" flag. doh well. :-)
		else if (_minorRevision >= 48 || (_minorRevision >= 47 && !/Linux/.test(navigator.userAgent)))
			_updateVer = 2;
		else if (_minorRevision > 28)
			_updateVer = 1;
	}
	
	// public/priveleged Getters
	var FlashPlayerInfo = {
		isInstalled: function() {
			return _installed;
		},
		isBeta: function() {
			return _beta;
		},
		getVersion: function() {
			return Number(_version +"."+ _majorRevision);
		},
		getMajorRevision: function() {
			return _majorRevision;
		},
		getMinorRevision: function() {
			return _minorRevision;
		},
		getBetaVersion: function() {
			return _betaVersion;
		},
		getVersionRaw: function() {
			return _versionRaw;
		},
		// for backward compat - deprecated, will be removed in next version
		getPluginType: function() {
			return this.getPlayerType();
		},
		getPlayerType: function() {
			return _playerType;
		},
		getReleaseCode: function() {
			return _releaseCode;
		},
		getUpdateVersion: function() {
			return _updateVer;
		}
	};
	// new methods for Flash Player 10+
	// http://weblogs.macromedia.com/emmy/archives/2008/10/a_small_improvement_to_our_version_numbering_aka_why_there_wont_be_a_flash_player_10_update_1.html
	FlashPlayerInfo.getMajorVersion = FlashPlayerInfo.getVersion;
	FlashPlayerInfo.getMinorVersion = FlashPlayerInfo.getMajorRevision;
	FlashPlayerInfo.getBugfixVersion = FlashPlayerInfo.getMinorRevision;
	return FlashPlayerInfo;
})();
