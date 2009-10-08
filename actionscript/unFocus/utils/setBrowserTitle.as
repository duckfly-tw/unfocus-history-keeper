/*
unFocus.utils.setBrowserTitle - (svn $Revision$) $Date$
Copyright: 2009, Kevin Newman - http://www.unfocus.com
http://www.opensource.org/licenses/mit-license.php
*/
 package unFocus.utils
{
	import flash.external.ExternalInterface;
	
	/**
	 * @author Kevin Newman
	 * 
	 * Sets the title of the html page the current swf is embedded on.
	 * 
	 * @param title The title to set document.title.
	 */
	public function setBrowserTitle(t:String):void
	{
		ExternalInterface.call("function(){document.title='"+t+"'}");
	}
}
