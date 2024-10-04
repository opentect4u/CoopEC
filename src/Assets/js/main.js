
// JavaScript Document
var default_siz = 14;
var min = 12;
var max = 32;

// var p_ = document.querySelectorAll(".body_content_sec p");
//     console.log(p_.length, 'xxxxxxxxx');

function increaseFontSize() {
	
//	alert('llllllll')
    
    // var p = document.getElementsByTagName('p');
    var p = document.querySelectorAll('p');
	
	
	console.log('p.length')
	
    for (i = 0; i < p.length; i++) {
        if (p[i].style.fontSize) {
            var s = parseInt(p[i].style.fontSize.replace("px", ""));
        } else {

            var s = 14;
        }
        if (s != max) {
            s += 1;
        }
        p[i].style.fontSize = s + "px"
    }
	
	
}

function decreaseFontSize() {
    // var p = document.getElementsByTagName('p');
//    var p = document.querySelectorAll('.body_content_sec p');
	var p = document.querySelectorAll('p');

    for (i = 0; i < p.length; i++) {

        if (p[i].style.fontSize) {
            var s = parseInt(p[i].style.fontSize.replace("px", ""));
        } else {
            var s = 12;
        }
        if (s != min) {
            s -= 1;
        }
        p[i].style.fontSize = s + "px"
    }
}

function defaiultFontSize() {
    // var p = document.getElementsByTagName('p');
//    var p = document.querySelectorAll('.body_content_sec p');
	var p = document.querySelectorAll('p');

    for (i = 0; i < p.length; i++) {

        // if (p[i].style.fontSize) {
        //     var s = parseInt(p[i].style.fontSize.replace("px", ""));
        // } else {
        //     var s = 12;
        // }
        // if (s != min) {
        //     s -= 1;
        // }
        p[i].style.fontSize = default_siz + "px"
    }
}

//let active = false;
//
//function toggle(active){
//	
//	active = !active
//	
//	if (active) {
////        toggle.classList.add('active')
////        text.innerHTML = 'N'
//		alert('add active')
//    } else {
////        toggle.classList.remove('active')
////        text.innerHTML = 'FF'
//		alert('remove active')
//    }
//
////	alert('lllll')
//	
//}

let active = false

function toggle() {
    let toggle = document.querySelector('.toggle')
    let text = document.querySelector('.text')
    active = !active
    if (active) {
        toggle.classList.add('active')
//        text.innerHTML = 'N'
		$("body").addClass("black_White");
		
    } else {
        toggle.classList.remove('active')
//        text.innerHTML = 'FF'
		$("body").removeClass("black_White");
    }
}



//$(document).ready(function() {
//    $("#add").click(function() {
//        $("body").addClass("pppp");
//    });
//    $("#remove").click(function() {
//        $("body").removeClass("pppp");
//    });
//
//});