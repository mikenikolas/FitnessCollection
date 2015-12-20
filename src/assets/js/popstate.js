/*------------------------------------*\

  POPSTATE

\*------------------------------------*/

export const Popper = links => {

	/**
	 * Decode string as HTML
	 */

	String.prototype.decodeHTML = () => {
		return $('div', {
			html: '' + this
		}).text();
	}

	const main = $('.main[role="main"]');

	const init = () => {
		console.log('Running');
	}

	const ajaxLoad = html => {
		document.title = html
			.match(/<title>(.*?)<\/title>/)[0]
      .trim()
      .replace(/<title><\/title>/, '')
      .decodeHTML();

    console.log(document.title);

     init();
	}

	const loadPage = href => {
		main.load(`${href} .main[role="main"]>*`, ajaxLoad);
	}

	init();

	$(window).on('popstate', e => {
		if (e.originalEvent.state !== null) {
			console.log('Running popstate');
		}
	});

	$(links).on('click', e => {
		e.preventDefault();

		var href = e.target.href;

		if (href.indexOf(document.domain) > -1 || href.indexOf(':') === -1) {
      history.pushState({}, '', href);
      loadPage(href);
      return false;
    }
	});
}
