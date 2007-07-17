' unFocusFlashCommunicator, version 0.7 (alpha) (2007/07/17)
' Copyright: 2005-2007, Kevin Newman (http://www.unfocus.com/Projects/)
'
' This file is part of unFocus.History Keeper.
'
' unFocus.History Keeper is free software; you can redistribute it and/or modify it under the terms of the GNU Lesser General Public License as published by
' the Free Software Foundation; either version 3 of the License, or (at your option) any later version.
'
' unFocus.History Keeper is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Lesser General Public License for more details.
'
' You should have received a copy of the GNU Lesser General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.
Sub unFocusCreateFSCommand (FSCmdName)
	ExecuteGlobal "Sub " & FSCmdName & _
		"_FSCommand(ByVal c, ByVal a):" & _
		"call " & FSCmdName & "_DoFSCommand(c, a):" & _
		"End Sub"
End Sub