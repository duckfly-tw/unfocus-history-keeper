package
{
	import flash.display.Shape;
	import flash.display.Sprite;
	
	import flash.events.Event;
	import flash.events.TextEvent;
	import flash.events.MouseEvent;
	
	import flash.display.Bitmap;
	import flash.display.BitmapData;
	import flash.display.PixelSnapping;
	
	import flash.filters.BlurFilter;
	import flash.geom.Point;
	
	import unFocus.HistoryKeeper;
	import unFocus.HistoryEvent;
	
	final public class HistoryKeeperSwf extends Sprite
	{
		private const CW:Number = -1;
		private const CCW:Number = 1;
		
		private var radius:Number = 100;
		private var speed:Number = 3;
		private var degree:Number = 0;
		private var radian:Number;
		
		private var circleShp:Shape;
		private var bmpData:BitmapData;
		private var bmp:Bitmap;
		
		private var bf:BlurFilter = new BlurFilter(4,4,3);
		
		private var history:HistoryKeeper;
		private var currentHash:String;
		
		private var direction:Number = 1;
		
		public function HistoryKeeperSwf():void
		{
			if (stage) init(null);
			else addEventListener(Event.ADDED_TO_STAGE, init);
		}
		private function init(event:Event):void
		{
			removeEventListener(Event.ADDED_TO_STAGE, init);
			
			// Wireup the stage elements (buttons and text fields).
			fpsTxt.text = stage.frameRate.toString();
			fpsTxt.addEventListener(Event.CHANGE, onFPSInput);
			
			clockwiseBtn.buttonMode = true;
			clockwiseBtn.mouseChildren = false;
			clockwiseBtn.addEventListener(MouseEvent.CLICK, onCWClick);
			
			counterClockwiseBtn.buttonMode = true;
			counterClockwiseBtn.mouseChildren = false;
			counterClockwiseBtn.addEventListener(MouseEvent.CLICK, onCCWClick);
			
			// This sets up the spinner. I consulted the excellent tutorials at
			// gotoandlearn.com for the bitmap blending techniques.
			// http://www.gotoandlearn.com/play?id=63
			circleShp = circle.getChildAt(0) as Shape;
			
			bmpData = new BitmapData(550, 400, false, 0x333333);
			bmp = new Bitmap(bmpData, PixelSnapping.ALWAYS, false);
			
			removeChild(circle);
			addChildAt(bmp, 0);
			
			addEventListener(Event.ENTER_FRAME, onEnterFrame);
			
			// This is where we initialize HistoryKeeper, by getting reference
			// to the Singleton using the getInstance static method.
			history = HistoryKeeper.getInstance();
			
			// Next we add a listener to the HASH_CHANGE event, where most of
			// the action takes place.
			history.addEventListener(HistoryEvent.HASH_CHANGE, onHashChange);
			
			// At this point, we have the basics in place to respond to user
			// history changes - through back and forward button clicks, and
			// direct edits on the url. Next we'll need to handle deep linking.
			
			// First we check the initial hash.
			var initHash:String = history.getCurrent();
			
			// If there is nothing to get, HistoryKeeper.getCurrent will 
			// will return null. In this case, we'll set the default.
			if (initHash === null)
				initHash = "/";
			
			// Once we have the hash, we can get the application state worked
			// out. In this example, we'll utilize the updateByHash method.
			updateByHash(initHash);
		}
		
		private function updateByHash(aHash:String):void
		{
			// This is the nugget right here. In this method, we will
			// parse the url data, and get the app state moving in 
			// the right direction.
			
			// A simple switch statement will work here for many cases.
			switch (aHash) {
				// The default is CCW.
				// :NOTE: When the user uses the back button to go back
				// far enough, they may get a blank aHash, so check for 
				// that as well.
				case "":
				case "/":
					direction = CCW;
				break;
				case "/CW":
					direction = CW;
				break;
				default:
					// Failed to parse hash - kick up somthing like an 
					// Error 404, or 500 or something.
			}
			currentHash = aHash;
		}
		
		private function updateHash():void
		{
			// Here we will construct the state hash, and set the url.
			
			// :NOTE: I'm setting the default to "/" because of an error that
			// I can't quite remember with setting the hash to an empty
			// string (I think that refreshes the page in some browsers).
			// :TODO: Figure out what that error was and document it.
			var newHash:String = "/";
			
			// CCW is the default, so we only need to set something for CW.
			// With a more complicated scheme, we could use a switch statement
			// or an entire frame work to serialize complex data. I even used
			// JSON once. :-)
			if (direction == CW)
				newHash = "/CW";
			
			// Store this locally - this is important, because we'll need to
			// check this in our event handler.
			currentHash = newHash;
			
			// Setting this calls the setter, and triggers a HASH_CHANGE event.
			history.hash = currentHash;
		}
		
		private function onHashChange(event:HistoryEvent):void
		{
			// Check to make sure we need to do something. Keep in mind, 
			// Setting the hash will trigger an event, with the same
			// hash you just set, so we'll need to filter that here.
			if (currentHash != event.hash) {
				updateByHash(event.hash);
			}
		}
		private function onCWClick(event:MouseEvent):void
		{
			direction = CW;
			
			// Update the hash after any user interaction that changes relevant
			// application state.
			updateHash();
		}
		private function onCCWClick(event:MouseEvent):void
		{
			direction = CCW;
			
			// Update the hash.
			updateHash();
		}
		
		private function onEnterFrame(event:Event):void
		{
			degree += speed*direction;
			radian = (degree/180)*Math.PI;
			circleShp.x = 250+Math.cos(radian)*radius;
			circleShp.y = 175-Math.sin(radian)*radius;
			
			bmpData.draw(circle);
			bmpData.applyFilter(bmpData, bmpData.rect, new Point(0,0),bf);
		}
		
		private function onFPSInput(event:Event):void
		{
			stage.frameRate = parseInt(fpsTxt.text);
			
			// Here we don't update the hash, because we are not creating links
			// based on the user entered frame rate.
		}
		
	}
}
