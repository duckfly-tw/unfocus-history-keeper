/*
unFocus.SwfHistory (2007/07/17)
Copyright: 2005-2007, Kevin Newman (http://www.unfocus.com/Projects/)

This file is part of unFocus.History Keeper.

unFocus.History Keeper is free software; you can redistribute it and/or modify it under the terms of the GNU Lesser General Public License as published by
the Free Software Foundation; either version 3 of the License, or (at your option) any later version.

unFocus.History Keeper is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
unFocus.SwfHistory = function($communicator) {
	// add the initial state to the movie :deprecated: this will now happen automatically when
	// the communication framework tests for fscommand
	//$communicator.getHTML().addFlashvar("unFocusHistoryUpdate",History.getCurrent());
	
	// subscribe to the Communicator
	$communicator.addEventListener("FSCommand", function($data) {
		switch($data[0]) {
			case "History.setTitle":
				document.title = $data[1];
			break;
			case "History.addHistory":
				unFocus.History.addHistory($data[1]);
		}
	});
	
	// subscribe to the History Keeper
	unFocus.History.addEventListener("historyChange", function($hash) {
		$communicator.setVariable("unFocusHistoryUpdate",$hash);
	});

};
