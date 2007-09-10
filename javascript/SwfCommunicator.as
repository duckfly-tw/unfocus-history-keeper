/*
unFocus.SwfCommunicator, version 0.8 (alpha) (2007/07/17)
Copyright: 2005-2007, Kevin Newman (http://www.unfocus.com/Projects/)

This file is part of unFocus.History Keeper.

unFocus.History Keeper is free software; you can redistribute it and/or modify it under the terms of the GNU Lesser General Public License as published by
the Free Software Foundation; either version 3 of the License, or (at your option) any later version.

unFocus.History Keeper is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.
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
