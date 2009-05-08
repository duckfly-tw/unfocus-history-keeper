package unFocus
{
	import flash.system.fscommand;
	import flash.external.ExternalInterface;
	
	/**
	 * JSCommunicator - A simple wrapper for fscommand. NOTE: This currently hijacks fscommand. :-D
	 * 
	 * @author Kevin Newman
	 */
	public class JSCommunicator
	{
		protected static var _available:Boolean = ExternalInterface.available;
		protected static var isInit:Boolean = false;
		
		/**
		 * Gets the detected availability of JSCommunicator to communicate with Javascript.
		 * 
		 * @see flash.external.ExternalInterface.available
		 */
		public static function get available():Boolean {
			return _available;
		}
		
		/**
		 * Can be called to automatically setup fscommand on the Javascript side. 
		 * This setup can optionally be done manually. Once this has been inited, you can call
		 * System.system.fscommand directly, in the same way you an call JSCommunicator.invoke.
		 */
		public static function init():void
		{
			if (!isInit && _available)
			{
				isInit = true;
				// NOTE: try/catch is necessary because sometimes ExternalInterface.available is unreliable.
				try {
					ExternalInterface.call("unFocus.AS3Communicator.createFSCommand", ExternalInterface.objectID);
				}
				catch (e:Error) {
					_available = false;
				}
			}
		}
		
		/**
		 * Invokes the javascript function passed into cmd by using fscommand, to avoid callback locks in 
		 * Actionscript. If the function does not exist in top level JS scope (window.*), will eval, and 
		 * run the result as a function passing args (or if no args set, just evals the cmd).
		 * 
		 * <p>This will also init JSCommunicator the first time you call it.</p>
		 * 
		 * <p>Note: Be sure the result of cmd is a function, if you pass args. You'll get an error if the 
		 * result of cmd is not a javascript function.</p>
		 * 
		 * <p>For the highest performance on the Javascript side, pass a simple global (window scope) function 
		 * name for cmd. This will bypass eval, which will save a modest amount of call time.</p>
		 * 
		 * <p>Also, if you require something extremely performance sensitive, you can invoke 
		 * <code>System.system.fscommand</code> manually - invoke is esentially a simple wrapper around 
		 * that.</p>
		 * 
		 * @param cmd The string representation of a javascript function or command to run.
		 * @param args The optional args to run the results of cmd with.
		 * 
		 * @see flash.system.fscommand
		 * @see flash.external.ExternalInterface.call
		 */
		public static function invoke(cmd, args = ""):void
		{
			if (!isInit) init();
			fscommand(cmd, args);
		}
		
	}
}
