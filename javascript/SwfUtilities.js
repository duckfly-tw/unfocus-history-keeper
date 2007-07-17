/*
unFocusFlash.Utilities, version 0.5 (2007/07/17)
Copyright: 2005-2007, Kevin Newman (http://www.unfocus.com/Projects/)

This file is part of unFocus.History Keeper.

unFocus.History Keeper is free software; you can redistribute it and/or modify it under the terms of the GNU Lesser General Public License as published by
the Free Software Foundation; either version 3 of the License, or (at your option) any later version.

unFocus.History Keeper is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.
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
