package unFocus
{
	import flash.system.fscommand;
	import flash.external.ExternalInterface;
	
	public class JSCommunicator
	{
		public static const available = ExternalInterface.available;
		
		protected static var isInit:Boolean = false;
		public static function init():void
		{
			if (!isInit && ExternalInterface.available)
			{
				isInit = true;
				ExternalInterface.call("unFocus.AS3Communicator.createFSCommand",ExternalInterface.objectID);
			}
		}
		
		public static function invoke(cmd, args = ""):void
		{
			fscommand(cmd, args);
		}
		
	}
}

unFocus.JSCommunicator.init();
