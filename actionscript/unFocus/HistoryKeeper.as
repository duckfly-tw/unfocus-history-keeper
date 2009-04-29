package unFocus
{
	import flash.events.EventDispatcher;
	import flash.external.ExternalInterface;
	
	import unFocus.HistoryEvent;
	import unFocus.JSCommunicator;
	
	public class HistoryKeeper extends EventDispatcher
	{
		protected static var _currentHash:String = "";
		public static function get hash():String
		{
			return _currentHash;
		}
		
		//  setting this property will automatically attempt to change the location.hash property
		public static function set hash(aHash:String):void
		{
			addHistory(aHash);
		}
		
		protected static var _available:Boolean;
		public static function get available():Boolean
		{
			return _available;
		}
		
		private static const dispatcher:EventDispatcher = new EventDispatcher;
		
		public static const addEventListener:Function = dispatcher.addEventListener;
		public static const dispatchEvent:Function = dispatcher.dispatchEvent;
		public static const hasEventListener:Function = dispatcher.hasEventListener;
		public static const removeEventListener:Function = dispatcher.removeEventListener;
		public static const willTrigger:Function = dispatcher.willTrigger;
		
		protected static var isInit:Boolean = false;
		public static function init():void 
		{
			if (ExternalInterface.available) {
				try {
					ExternalInterface.addCallback("updateFromHistory", updateFromHistory);
					JSCommunicator.invoke('unFocus.History.addEventListener("historyChange",function(h){unFocus.SwfUtilities.getSwfReference("'+ExternalInterface.objectID+'").updateFromHistory(h)})');
					_currentHash = ExternalInterface.call("unFocus.History.getCurrent");
					_available = true;
				}
				catch(e:Error) {
					_available = false;
				}
			}
			else {
				_available = false;
			}
		}
		
		public static function updateFromHistory(aHash:String):void
		{
			if (aHash != _currentHash)
			{
				_currentHash = aHash;
				dispatchEvent(new HistoryEvent(HistoryEvent.HASH_CHANGE, aHash));
			}
		}
		
		public static function addHistory(aHash:String):void
		{
			_currentHash = aHash;
			if (_available)
				JSCommunicator.invoke("unFocus.History.addHistory", aHash);
		}
		
		// to match the JS API
		public static function getCurrent():String
		{
			return hash;
		}
		
	}
}

unFocus.HistoryKeeper.init();
