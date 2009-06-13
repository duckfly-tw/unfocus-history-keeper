/*
unFocus.utils.URIManager - (svn $Revision$) $Date$
Copyright: 2009, Kevin Newman - http://www.unfocus.com
http://www.opensource.org/licenses/mit-license.php
*/
 package unFocus.utils
{
	import 	flash.utils.Dictionary;
	
	/**
	 * URIManager is used as a simple URIManager or as a base to build complex sets of URIManagement
	 * modules on top of.
	 * 
	 * @author Kevin Newman
	 */
	public class URIManager
	{
		/**
		 * Holds the registerd state objects in an Object. States referenced by hash (deep link URIs).
		 */
		protected var _states:Object;
		
		/**
		 * Gets the _states object, which stores the state objects by hash (deep link URI).
		 */
		public function get states():Object {
			return _states;
		}
		
		/**
		 * The Dictionary object that holds URI Handlers, indexed by URIs' RegExp objects.
		 */
		protected var _handlers:Dictionary;
		
		/**
		 * Constructor. Creates a URIManager using whatever referenced object. Hash URIs should be the 
		 * keys to the stored objects.
		 * 
		 * @param aStataes A referenced table of the state data to store - ususally a simple Object.
		 */
		public function URIManager(aStates:Object = null):void
		{
			if (aStates == null)
				_states = {};
			else
				_states = aStates;
		}
		
		/**
		 * Gets a stored data object referenced with a hash value.
		 * 
		 * @param aHash A hash to lookup in the _states table.
		 * 
		 * @return Whatever state data was stored with that hash value - or false if hash not found.
		 */
		public function getState(aHash:String):*
		{
			// if there is a handler grab the state from there
			if (_handlers)
				for (var reg:* in _handlers)
					if (reg.test(aHash))
						return _handlers[reg].getState(aHash);
			
			if (_states[aHash])
				return _states[aHash];
			else
				return false;
		}
		
		/**
		 * Registers a URI object (state).
		 * 
		 * @param aHash A hash to lookup in the _states table.
		 * @param aState The data to store by that hash.
		 */
		public function registerURI(aHash:String, aState:*):void
		{
			if (!_handlers[aHash])
				_handlers[aHash] = aState;
			//else
				// throw some kind of error?
		}
		
		/**
		 * Unregisters a URI object (state).
		 * 
		 * @param aHash The hash to lookup in the _states table, and remove.
		 * 
		 * @return The unregistered URI object if any, or <code>false</code> if none.
		 */
		public function unregisterURI(aHash:String):*
		{
			var deadState:*;
			if (_states[aHash]) {
				deadState = _states[aHash];
				delete _states[aHash];
				return deadState;
			}
			else
				return false;
		}
		
		/**
		 * Registers a URI handler. Uses a RegExp on a hash to determine if the handler should be used.
		 * 
		 * @param aRegExp The RegExp to apply to the hash when getting URI data.
		 * @param aHandler The URIManager to pass getState duties to - usually a subclass of URIManager.
		 */
		public function registerURIHandler(aRegExp:RegExp, aHandler:URIManager):void
		{
			if (!_handlers)
				_handlers = new Dictionary;
			
			if (!_handlers[aRegExp])
				_handlers[aRegExp] = aHandler;
		}
		
		/**
		 * Unregisters a URI handler by passing in previously registered RegExp.
		 * 
		 * @param aRegExp The RegExp to use to look up the handler and delete it.
		 * 
		 * @return The unregistered URI Handler object if any, or <code>false</code> if none.
		 */
		public function unregisterURIHandler(aRegExp:RegExp):*
		{
			var deadURIManager:*;
			if (_handlers && _handlers[aRegExp]) {
				deadURIManager = _handlers[aRegExp];
				delete _handlers[aRegExp];
				return deadURIManager;
			}
			else
				return false;
		}
		
	}
}
