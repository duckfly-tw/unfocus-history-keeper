/*
unFocus.SwfCommunicator, version 0.8 (alpha) (2007/09/11)
Copyright: 2005-2009, Kevin Newman (http://www.unfocus.com/)
http://www.opensource.org/licenses/mit-license.php
*/
class SwfCommunicator {
	private function SwfCommunicator() {}
	
	public static function main():Void {
		var c:LocalConnection = new LocalConnection();
		//switch(_root.cmd) {
			//case 'setVariable':
				c.send(_root.cid, _root.cmd, _root.vName, _root.vValue);
				//break;
		//}
		c.close();
		delete c;
	}
}
