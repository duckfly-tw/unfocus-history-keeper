<?php
// php stuff borrowed from Neil Crosby - http://www.workingwith.me.uk/articles/scripting/mimetypes
$charset = "iso-8859-1";
$mime = "text/html";

if(stristr($_SERVER["HTTP_ACCEPT"],"application/xhtml+xml")) {
   # if there's a Q value for "application/xhtml+xml" then also 
   # retrieve the Q value for "text/html"
   if(preg_match("/application\/xhtml\+xml;q=0(\.[1-9]+)/i",
                 $_SERVER["HTTP_ACCEPT"], $matches)) {
      $xhtml_q = $matches[1];
      if(preg_match("/text\/html;q=0(\.[1-9]+)/i",
                    $_SERVER["HTTP_ACCEPT"], $matches)) {
         $html_q = $matches[1];
         # if the Q value for XHTML is greater than or equal to that 
         # for HTML then use the "application/xhtml+xml" mimetype
         if($xhtml_q >= $html_q) {
            $mime = "application/xhtml+xml";
         }
      }
   # if there was no Q value, then just use the 
   # "application/xhtml+xml" mimetype
   } else {
      $mime = "application/xhtml+xml";
   }
}

# special check for the W3C_Validator
if (stristr($_SERVER["HTTP_USER_AGENT"],"W3C_Validator")) {
   $mime = "application/xhtml+xml";
}

# finally, output the mime type and prolog type
header("Content-Type: $mime;charset=$charset");
header("Vary: Accept");

# set the prolog_type according to the mime type which was determined
if($mime == "application/xhtml+xml") {
	print '<?xml version="1.0" encoding="'.$charset.'"?>';
}
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />
<title>Object Patent Magic</title>
<!--
unFocus.Tests (2007/07/21)
Copyright: 2007, Kevin Newman (http://www.unfocus.com/Projects/)

This file is part of unFocus.History Keeper.

unFocus.History Keeper is free software; you can redistribute it and/or modify it under the terms of the GNU Lesser General Public License as published by
the Free Software Foundation; either version 3 of the License, or (at your option) any later version.

unFocus.History Keeper is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.
-->
<!--[if gte IE 6]>
<style type="text/css" id="ObjectPatentMagic">object{display:none}</style>
<script type="text/javascript" src="../javascript/ObjectPatentMagic-p.js"></script>
<![endif]-->
</head>

<body>
<p><strong>Note:</strong> This embeded active x control (flash) should not need activation in IE (the bookmarking/history stuff is not enabled in this example).</p>
<p>
<object data="rotateTool.swf" type="application/x-shockwave-flash" width="320" height="240">
<param name="allowScriptAccess" value="sameDomain" />
<param name="movie" value="rotateTool.swf" />
<param name="quality" value="high" />
<param name="scale" value="noscale" />
<param name="salign" value="lt" />
<param name="bgcolor" value="#ffffff" />
<param name="flashvars" value="path=objects/plane/" />
</object>
</p>
<p>This is achieved by first hiding all objects on the page using a style sheet, then when the dom is ready (window.onload) the script (which is located in an external file) will get a list of all the objects on the page and replace them with themselves, then disable the stylesheet that hid them way back at the beginning. And conditional comments make sure only IE 6+ sees the scripts. You would embed this after all of your own style sheets in the head section of thlike this:</p>
<p>As a bonus, this page is validating XHTML, so feel free to use it as a template if you need XHTML output.</p>
<pre>&lt;!--[if IE gte 6]&gt;<br />&lt;style type=&quot;text/css&quot; id=&quot;ObjectPatentMagic&quot;&gt;object{display:none}&lt;/style&gt;<br />&lt;script type=&quot;text/javascript&quot; src=&quot;ObjectPatentMagic-p.js&quot;&gt;&lt;/script&gt;<br />&lt;![endif]--&gt;</pre>
<p>Here is the <a href="ObjectPatentMagic.js">javascript source</a> and here is a <a href="ObjectPatentMagic-p.js">packed version</a> for absolute minimum impact on page load time.</p>
<p><a href="http://validator.w3.org/check?uri=referer"><img
src="http://www.w3.org/Icons/valid-xhtml11"
alt="Valid XHTML 1.1" height="31" width="88" /></a></p>
</body>
</html>
