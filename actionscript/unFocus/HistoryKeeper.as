package unFocus
{
	import flash.events.EventDispatcher;
	import flash.external.ExternalInterface;
	
	import unFocus.HistoryEvent;
	import unFocus.JSCommunicator;
	
	/**
	 * Wrap calls to unFocus.History JS utility.
	 * 
	 * @author Kevin Newman
	 */
	public final class HistoryKeeper extends EventDispatcher
	{
		private var _currentHash:String = "";
		private var _available:Boolean;
		private var isInit:Boolean = false;
		
		private static var instance:HistoryKeeper;
		
		/**
		 * Singleton method. Call to get the single instance of HistoryKeeper.
		 * 
		 * @return the Single instance of HistoryKeeper.
		 */
		public static function getInstance():HistoryKeeper
		{
			if (instance == null)
				instance = new HistoryKeeper(new HistoryKeeperKey());
			
			return instance;
		}
		
		/**
		 * Gets or sets the current value of <code>window.location.hash</code>. Will also set
		 * <code>window.location.hash</code>, creating a history entry. This is a property 
		 * based shortcut for addHistory method.
		 */
		public function get hash():String {
			return _currentHash;
		}
		public function set hash(aHash:String):void {
			addHistory(aHash);
		}
		
		/**
		 * Lets you know if HistoryKeeper is available - depends on ExternalInterface.available.
		 * 
		 * @see flash.external.ExternalInterface.available
		 */
		public function get available():Boolean
		{
			return _available;
		}
		
		/**
		 * Constructor. (should not be called with new operator.)
		 * 
		 * @param key The internal key class to unlock the singleton.
		 * 
		 * @throws Error Will throw if <code>new</code> operator is used. Use HistoryKeeper.getInstance() instead of new.
		 */
		function HistoryKeeper(key:HistoryKeeperKey)
		{
			if (key == null)
				throw new Error("Error - Instantiation failed: Use HistoryKeeper.getInstance() instead of new.");
			
			init();
		}
		
		/**
		 * Initializes HistoryKeeper setting up the eventlistener from JS, and testing for availability.
		 * This is done automatically. There's no need to call this manually.
		 */
		private function init():void 
		{
			if (ExternalInterface.available) {
				try {
					ExternalInterface.addCallback("updateFromHistory", updateFromHistory);
					// Setup a fast path to envoke addHistory.
					// This allows us to bypass eval, which creates noticable hicups in animations.
					// Also setup event listener to notify swf that the history has changed.
					JSCommunicator.invoke(
						"window.unFocus_History_addHistory = unFocus.History.addHistory;" +
						'unFocus.History.addEventListener("historyChange",function(h){unFocus.SwfUtilities.getSwfReference("' +
							ExternalInterface.objectID + '").updateFromHistory(h)});'
					);
					_currentHash = ExternalInterface.call("unFocus_History.getCurrent");
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
		
		/**
		 * Receives the historyChange event from JS unFocus.History.
		 * 
		 * @param aHash The new hash (deep link URI) value from window.location.hash.
		 */
		private function updateFromHistory(aHash:String):void
		{
			if (aHash != _currentHash)
			{
				_currentHash = aHash;
				dispatchEvent(new HistoryEvent(HistoryEvent.HASH_CHANGE, aHash));
			}
		}
		
		/**
		 * Sets a new History entry using the hash (deep link URI) value passed in.
		 * 
		 * @param aHash The new value to use for the deep link (window.location.hash).
		 */
		public function addHistory(aHash:String):void
		{
			_currentHash = aHash;
			if (_available)
				JSCommunicator.invoke("unFocus_History_addHistory", aHash);
		}
		
		/**
		 * Gets the current cached hash (deep link URI) value.
		 * 
		 * @return The current hash (deep link URI) value.
		 */
		public function getCurrent():String
		{
			return _currentHash;
		}
		
	}
}

internal class HistoryKeeperKey { }
