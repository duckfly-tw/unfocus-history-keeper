' unFocusFlashCommunicator, version 0.7 (alpha) (2005/09/09)
' Copyright: 2005, Kevin Newman (http://www.unfocus.com/)
' License: http://creativecommons.org/licenses/LGPL/2.1/
Sub unFocusCreateFSCommand (FSCmdName)
	ExecuteGlobal "Sub " & FSCmdName & _
		"_FSCommand(ByVal c, ByVal a):" & _
		"call " & FSCmdName & "_DoFSCommand(c, a):" & _
		"End Sub"
End Sub