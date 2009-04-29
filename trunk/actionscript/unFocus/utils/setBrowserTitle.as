package unFocus.utils
{
	import unFocus.JSCommunicator;
	
	public function setBrowserTitle(title:String):void
	{
		JSCommunicator.invoke("document.title='"+title+"'");
	}
}
