

//$('.center').slick({
//  centerMode: true,
//  centerPadding: '60px',
//  slidesToShow: 2,
//  responsive: [
//    {
//      breakpoint: 768,
//      settings: {
//        arrows: false,
//		 prevArrow: false,
//        centerMode: true,
//        centerPadding: '40px',
//        slidesToShow: 2
//      }
//    },
//    {
//      breakpoint: 480,
//      settings: {
//        arrows: false,
//        centerMode: true,
//        centerPadding: '40px',
//        slidesToShow: 1
//      }
//    }
//  ]
//});


$(".bannerSliderMainSlider").slick({
        dots: false,
        vertical: false,
        centerMode: false,
		 autoplay: true,
        slidesToShow:1,
		speed: 500,
		 arrows : true,
        slidesToScroll: 1
});