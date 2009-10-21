/*
unFocus.HistoryEvent - (svn $Revision$) $Date$
Copyright: 2009, Kevin Newman - http://www.unfocus.com
http://www.opensource.org/licenses/mit-license.php
*/
package unFocus
{
	import flash.events.Event;
	
	/**
	 * HistoryEvent
	 * 
	 * @author Kevin Newman
	 */
	public class HistoryEvent extends Event
	{
		/**
		 * Dispatched whenever the location hash changes.
		 * @eventType hashChange
		 */
		public static const HASH_CHANGE:String = "hashChange";
		
		/**
		 * The protected hash value property.
		 */
		private var _hash:String;
		
		/**
		 * The current hash (deep link) value.
		 */
		public function get hash():String {
			return _hash;
		}
		
		/**
		 * Constructor.
		 * 
		 * @param type The type of HistoryEvent.
		 * @param aHash The new/current hash value.
		 */
		public function HistoryEvent(type:String, aHash:String)
		{
			super(type);
			_hash = aHash;
		}
		
		/**
		 * Creates and returns a copy of the current instance.
		 * 
		 * @return A copy of the current instance.
		 */
		public override function clone():Event
		{
			return new HistoryEvent(type, _hash);
		}
		
	}
}
