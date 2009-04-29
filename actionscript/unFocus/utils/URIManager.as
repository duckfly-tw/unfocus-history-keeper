package unFocus.utils
{
	import 	flash.utils.Dictionary;
	
	public class URIManager
	{
		protected var _states:Object;
		public function get states():Object {
			return _states;
		}
		
		public var _statesIndex:Array = [];
		
		protected var _handlers:Dictionary;
		
		// NOTE: This assumes a referenced object - it will not attempt to enforce that.
		public function URIManager(aStates:Object = null):void
		{
			if (aStates)
				_states = aStates;
			else
				_states = {};
		}
		
		public function getState(aHash:String):*
		{
			// if there is a handler grab the state from there
			if (_handlers)
				for (var reg in _handlers)
					if (reg.test(aHash))
						return _handlers[reg].getState(aHash);
			
			if (_states[aHash])
				return _states[aHash];
			else
				return false;
		}
		
		public function registerURI(aHash:String, aState:*):void
		{
			if (!_handlers[aHash])
				_handlers[aHash] = aState;
			//else
				// throw some kind of error?
		}
		
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
		
		public function registerURIHandler(aRegExp:RegExp, aHandler:URIManager):void
		{
			if (!_handlers)
				_handlers = new Dictionary;
			
			if (!_handlers[aRegExp])
				_handlers[aRegExp] = aHandler;
		}
		
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
