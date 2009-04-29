package unFocus
{
	import flash.events.Event;
	
	public class HistoryEvent extends Event
	{
		public static const HASH_CHANGE:String = "hashChange";
		
		private var _hash:String;
		public function get hash():String {
			return _hash;
		}
		
		/**
		* Constructor.
		* @param The type of HistoryEvent.
		* @param The new/current hash value.
		*/
		public function HistoryEvent(type:String, aHash:String)
		{
			super(type);
			_hash = aHash;
		}
		
		/**
		* Creates and returns a copy of the current instance.
		* @return A copy of the current instance.
		*/
		public override function clone():Event
		{
			return new HistoryEvent(type, _hash);
		}
		
	}
	
}
