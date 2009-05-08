package unFocus.utils
{
	import unFocus.JSCommunicator;
	
	/**
	 * @author Kevin Newman
	 * 
	 * Sets the title of the html page the current swf is embedded on.
	 * 
	 * @param title The title to set document.title.
	 */
	public function setBrowserTitle(t:String):void
	{
		if (!isInit)
		{
			JSCommunicator.invoke("window.unFocus_utils_setBrowserTitle=function(t){document.title=t}");
			isInit = true;
		}
		JSCommunicator.invoke("unFocus_utils_setBrowserTitle", t);
	}
}
internal var isInit:Boolean = false;
