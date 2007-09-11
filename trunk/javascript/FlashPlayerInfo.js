/*
unFocus.FlashPlayerInfo, version 1.1 b6 (beta) (2007/09/11)
Copyright: 2005-2007, Kevin Newman (http://www.unfocus.com/Projects/)

This file is part of unFocus.History Keeper.

unFocus.History Keeper is free software; you can redistribute it and/or modify it under the terms of the GNU Lesser General Public License as published by
the Free Software Foundation; either version 3 of the License, or (at your option) any later version.

unFocus.History Keeper is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.
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
		_releaseCode = "";
	
	// detection work
	if (navigator.plugins && navigator.plugins.length > 0) {
		_versionRaw = navigator.plugins["Shockwave Flash 2.0"] || navigator.plugins["Shockwave Flash"];
		if (_versionRaw) {
			_versionRaw = _versionRaw.description;
			_installed = true;
			_playerType = "PlugIn";
			if (/Shockwave Flash/.test(_versionRaw)) {
				_version = _versionRaw.match(/Shockwave Flash (\d)\.(\d)/);
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
			if (_versionTemp[3]>0) _beta = true;
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
	} else if (/WebTV/.test(navigator.userAgent)) { // WebTV
		_playerType = "WebTV";
		_versionRaw = navigator.userAgent.match(/WebTV\/(\d\.\d)/)[1];
		if (_versionRaw > 2.5) _version = 4;
		else if (_versionRaw == 2.5) _version = 3;
		else _version = 2;
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
			return _version;
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
		}
	};
	return FlashPlayerInfo;
})();
