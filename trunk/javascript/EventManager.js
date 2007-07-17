/*
unFocus.EventManager, version 1.0b (beta) (2007/07/17)
Copyright: 2005-2007, Kevin Newman (http://www.unfocus.com/Projects/)

This file is part of unFocus.History Keeper.

unFocus.History Keeper is free software; you can redistribute it and/or modify it under the terms of the GNU Lesser General Public License as published by
the Free Software Foundation; either version 3 of the License, or (at your option) any later version.

unFocus.History Keeper is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
// Package: unFocus.Utilities
// make sure faux-namespace is available before adding to it
if (!window.unFocus) var unFocus = {};

/** Class: EventManager
 *	Provides the interface and functionality to a Subscriber/Subscriber Pattern.
 * 
 **/
/*
Constructor: EventManager
	The Constructor (Prototype) function.

Parameters:
	[type1 [, type2 [, etc.]]] - Optionally sets up an empty array for each named event.
*/
unFocus.EventManager = function() {
	this._listeners = {};
	for (var i = 0; i < arguments.length; i++) {
		this._listeners[arguments[i]] = [];
	}
};

unFocus.EventManager.prototype = {
	/*
	Method: addEventListener
		Adds an event listener to the specified type.

	Parameters:
		$name		- The event name.
		$listener	- The function to be called when the event fires.
	*/
	addEventListener: function($name, $listener) {
		// check that listener is not in list
		for (var i = 0; i < this._listeners[$name].length; i++)
			if (this._listeners[$name][i] == $listener) return;
		// add listener to appropriate list
		this._listeners[$name].push($listener);
	},
	/*
	Method: removeEventListener
		Removes an event listener.
	
	Parameters:
		$name		- The event name.
		$listener	- The function to be removed.
	*/
	removeEventListener: function($name, $listener) {
		// search for the listener method
		for (var i = 0; i < this._listeners[$name].length; i++) {
			if (this._listeners[$name][i] == $listener) {
				this._listeners.splice(i,1);
				return;
			}
		}
	},
	/* Method: notifyListeners
		Notifies the listeners of an event.
	
	Parameters:
		$name	- The name of event to fire.
		$data	- The object to pass to the subscribed method (the Event Object).
	*/
	notifyListeners: function($name, $data) {
		for (var i = 0; i < this._listeners[$name].length; i++)
			this._listeners[$name][i]($data);
	}
};
