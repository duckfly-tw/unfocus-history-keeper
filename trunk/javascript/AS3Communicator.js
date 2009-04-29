/*
unFocus.AS3Communicator, version 1.0a (2007/09/11)
Copyright: 2005-2007, Kevin Newman (http://www.unfocus.com/Projects/)

This file is part of unFocus.History Keeper.

unFocus.History Keeper is free software; you can redistribute it and/or modify it under the terms of the GNU Lesser General Public License as published by
the Free Software Foundation; either version 3 of the License, or (at your option) any later version.

unFocus.History Keeper is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
unFocus.AS3Communicator = {
	createFSCommand: function(id) {
		if (/*@cc_on!@*/0) {
			var script = window.document.createElement('<script event="FSCommand(cmd,args)" for="' +id+ '">');
				script.text = "(args)?(window[cmd])?window[cmd](args):eval(cmd)(args):eval(cmd);";
			window.document.getElementsByTagName("head").item(0).appendChild(script);
		} else
			var funcName = id + "_DoFSCommand";
			if (!window[funcName])
				window[funcName] = function(cmd,args) {
					(args)?(window[cmd])?window[cmd](args):eval(cmd)(args):eval(cmd);
				};
	}
};