(function () {

	'use strict'


	AOS.init({
		duration: 800,
		easing: 'ease-in-out',
		once: true,
		offset: 0, // Trigger animations immediately for elements already in viewport
		anchorPlacement: 'top-bottom', // Trigger when top of element hits bottom of viewport
		startEvent: 'load', // Start animations on page load
		disable: false // Enable on all devices
	});


	var preloader = function() {

		var loader = document.querySelector('.loader');
		var overlay = document.getElementById('overlayer');

		function fadeOut(el) {
			el.style.opacity = 1;
			(function fade() {
				if ((el.style.opacity -= .1) < 0) {
					el.style.display = "none";
				} else {
					requestAnimationFrame(fade);
				}
			})();
		};

		setTimeout(function() {
			fadeOut(loader);
			fadeOut(overlay);
			// Refresh AOS after preloader to ensure animations work on page navigation
			AOS.refresh();
		}, 200);
	};
	preloader();

	// Also refresh AOS when page is fully loaded
	window.addEventListener('load', function() {
		AOS.refresh();
	});


	var tinyslier = function() {

		var heroSlider = document.querySelectorAll('.hero-slide');
		var propertySlider = document.querySelectorAll('.property-slider');
		var imgPropertySlider = document.querySelectorAll('.img-property-slide');
		var testimonialCenter = document.querySelectorAll('.testimonial-center');
		

		if ( heroSlider.length > 0 ) {
			var tnsHeroSlider = tns({
				container: '.hero-slide',
				mode: 'carousel',
				speed: 700,
				autoplay: true,
				controls: false,
				nav: false,
				autoplayButtonOutput: false,
				controlsContainer: '#hero-nav',
			});
		}


		if ( imgPropertySlider.length > 0 ) {
			var tnsPropertyImageSlider = tns({
				container: '.img-property-slide',
				mode: 'carousel',
				speed: 700,
				items: 1,
				autoplay: true,
				controls: false,
				nav: true,
				autoplayButtonOutput: false
			});
		}

		if ( propertySlider.length> 0 ) {
			var tnsSlider = tns({
				container: '.property-slider',
				mode: 'carousel',
				speed: 700,
				items: 3,
				autoplay: true,
				autoplayButtonOutput: false,
				controlsContainer: '#property-nav',
				responsive: {
					0: {
						items: 1
					},
					700: {
						items: 2
					},
					900: {
						items: 3
					}
				}
			});
		}



		if ( testimonialCenter.length> 0 ) {
			var testimonialSlider = tns({
				container: '#testimonial-center',
				items: 1,
				mode: 'carousel',
				slideBy: 'page',
				nav: true,
				controls: true,
				autoplay: true,
				autoplayButtonOutput: false,
				controls: true,
				gutter: 50,
				slideBy: 1,
				edgePadding: 0,
				center: true,
				controlsContainer: '#testimonial-nav',
				autoplayHoverPause: true,
				loop: true,
				swipeAngle: false,
				speed: 700,

				responsive: {
					350: {
						gutter: 10,
						edgePadding: 0,
						items: 1,
					},
					500: {
						gutter: 20,
						edgePadding: 0,
						items: 1,
					},
					700: {
						gutter: 50,
						edgePadding: 20,
						items: 2,
					},
					1000: {
						gutter: 50,
						edgePadding: 50,
						items: 2,
					}
				}

			});
		}

	}
	tinyslier();

	
	var lightboxVideo = GLightbox({
		selector: '.glightbox'
	});

})()