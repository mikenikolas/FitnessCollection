(() => {

	document.documentElement.className = document.documentElement.className.replace(/\bno-js\b/g, 'js');

	var heroImg = document.querySelector('.hero__full-height');
	var isMobile = (window.innerWidth < 680) ? true : false;
	if ( heroImg != null && !isMobile ) {
		heroImg.style.height = window.innerHeight + 'px';
	}

	var menuBtn = $('.main-menu__btn');

	menuBtn.on('click', e => {
		e.preventDefault();

		menuBtn.next().toggleClass('opened');
	});

	if ('serviceWorker' in navigator) {
		navigator.serviceWorker.register('service-worker.js')
		.then(reg => {
		}).catch(err => {
			console.log(err);
		});
	}
})();
