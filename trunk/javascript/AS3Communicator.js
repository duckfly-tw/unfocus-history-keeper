/*
unFocus.AS3Communicator, version 1.0a (svn $Revision$) $Date$
Copyright: 2005-2009, Kevin Newman (http://www.unfocus.com/)
http://www.opensource.org/licenses/mit-license.php
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