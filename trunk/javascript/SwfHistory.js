
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
