//
//
//delayb4scroll = 2000 
//	marqueespeed = 1 
//	pauseit = 1
//	var copyspeed = marqueespeed
//	var pausespeed = (pauseit == 0) ? copyspeed : 0;
//
//function scrollmarquee() {
//	if (parseInt(cross_marquee.style.top) > (actualheight * (-1) + 8))
//		cross_marquee.style.top = parseInt(cross_marquee.style.top) - copyspeed + "px"
//	else
//		cross_marquee.style.top = parseInt(marqueeheight) + 8 + "px"
//}
//function onMouseover(thisid){
//copyspeed=pausespeed
//}
//
//function onMouseout(thisid){
//copyspeed=marqueespeed
//}
//var clicks = 0;
//function runScroller(id,cid){
//
//	
//	if(id=='vmarquee' && clicks ==0){
//			var lefttime=setInterval("scrollmarquee()",60);
//	}	
//	clicks += 1;
//	cross_marquee = document.getElementById(id)
//	console.log(cross_marquee)
//	cross_marquee.style.top = 0
//	marqueeheight = document.getElementById(cid).offsetHeight
//	actualheight = cross_marquee.offsetHeight
//	if (window.opera || navigator.userAgent.indexOf("Netscape/7") != -1) { 
//		cross_marquee.style.height = marqueeheight + "px"
//		cross_marquee.style.overflow = "scroll"
//		return
//	}
//	setTimeout(function(){
//		setTimeout(lefttime, 5000)
//	},500)
//}
//setTimeout(function(){
//runScroller('vmarquee','marqueecontainer')
//
//},100)
//
//
//



delayb4scroll = 2000 
			marqueespeed = 1 
            pauseit = 1
			var copyspeed = marqueespeed
			var pausespeed = (pauseit == 0) ? copyspeed : 0;

function scrollmarquee() {
            if (parseInt(cross_marquee.style.top) > (actualheight * (-1) + 8))
                cross_marquee.style.top = parseInt(cross_marquee.style.top) - copyspeed + "px"
            else
                cross_marquee.style.top = parseInt(marqueeheight) + 8 + "px"
      }
function onMouseover(thisid){
	copyspeed=pausespeed
}

function onMouseout(thisid){
	copyspeed=marqueespeed
}
 var clicks = 0;
function runScroller(id,cid){
			
			if(id=='vmarquee' && clicks ==0){
					var lefttime=setInterval("scrollmarquee()",60);
			}	
			clicks += 1;
		    cross_marquee = document.getElementById(id)
			console.log(cross_marquee)
            cross_marquee.style.top = 0
            marqueeheight = document.getElementById(cid).offsetHeight
            actualheight = cross_marquee.offsetHeight
            if (window.opera || navigator.userAgent.indexOf("Netscape/7") != -1) { 
                cross_marquee.style.height = marqueeheight + "px"
                cross_marquee.style.overflow = "scroll"
                return
            }
			setTimeout(function(){
				setTimeout(lefttime, 5000)
			},500)
	}
	setTimeout(function(){
		runScroller('vmarquee','marqueecontainer')
		
	},500)











