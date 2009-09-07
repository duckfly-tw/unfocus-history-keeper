' unFocusFlashCommunicator, version 0.7 (alpha) (svn $Revision$) $Date$
' Copyright: 2005-2009, Kevin Newman (http://www.unfocus.com/)
'http://www.opensource.org/licenses/mit-license.php
Sub unFocusCreateFSCommand (FSCmdName)
	ExecuteGlobal "Sub " & FSCmdName & _
		"_FSCommand(ByVal c, ByVal a):" & _
		"call " & FSCmdName & "_DoFSCommand(c, a):" & _
		"End Sub"
End Sub