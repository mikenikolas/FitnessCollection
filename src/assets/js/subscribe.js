/*------------------------------------*\

  SUBSCRIBE

\*------------------------------------*/
/**
 * To use:
 *
 * Subscribe('#formId', 'https://url-to-mailchimp-list.com/')
 */

export const Subscribe = (form, url) => {
	form = $(form);

	/**
	 * Notify in the console if we haven't specified
	 * a url to the Mailchimp list
	 */

	if (url == undefined) {
		console.warn('Please specify a url Mailchimp!');
	}

	/**
	 * Handlers
	 */

	var email = form.find('#mce-EMAIL');
	var postnr = form.find('#mce-POSTNR');
	var messages = $('#mce-MESSAGES');

	/**
	 * Handle submit
	 */

	form.on('submit', e => {
		e.preventDefault();

		if( !email.val() && !postnr.val() ) {
			// Add shaking to form
			form.addClass('non-input');

			/**
			 * Remove the class 'non-input'
			 *
			 * [Todo]: Find a better way to remove class on click
			 */

			setTimeout(() => {
				form.removeClass('non-input');
			}, 1000);

			return;
		}

		if( !isEmail(email.val()) ) {
			// Get error message
			var emailError = email.data('error');

			// Append the message after the <label>
			email.parent().append(`<span class='sign-up__inline-error'>${emailError}</span>`);

			// If there has already been one error message remove the last one
			if (email.parent().next().length > 0) {
				email.parent().next().remove();
			}
			return;
		}

		if( !isPostnr(postnr.val()) ) {
			// Get error message
			var postnrError = postnr.data('error');

			// Append the message after the <label>
			postnr.parent().append(`<span class='sign-up__inline-error'>${postnrError}</span>`);

			// If there has already been one error message remove the last one
			if (postnr.parent().next().length > 0) {
				postnr.parent().next().remove();
			}
			return;
		}

		if( isEmail(email.val()) && isPostnr(postnr.val()) ) {
			register(form, url, messages);
		}
	});

	/**
	 * Add class to label if input has been filled and on blur
	 */

	$('.blur-input').each((i,e) => {
		$(e).on('blur', () => {
			if ( $(e).val().length !== 0) {
				$(e).next().addClass('has-value');
			} else {
				$(e).next().removeClass('has-value');
			}
		});
	});

	/**
	 * Hide error if user starts typing again
	 */

	form.on('input', () => {
		$('.sign-up__inline-error').each((i,e) => {
			if ($(e).length > 0) {
				$(e).addClass('hide-error');
				setTimeout(() => {
					$(e).remove();
				}, 500);
			}
		});
	});

	// Format the postnr input
	postnr.on('keyup', e => {
		var code = (e.keyCode || e.which);

		if ( code == 8 || code == 46 ) {
			return;
		}

		postnrFormat(e);
	});
}


/*------------------------------------*\
	Ajax Functions
\*------------------------------------*/

/**
 * Register function
 */

let register = (handle, ajaxurl, msgContainer) => {
	$.ajax({
    type: 'POST',
    url: ajaxurl,
    data: handle.serialize(),
    cache: false,
    crossDomain: true,
    dataType: 'json',
    contentType: 'application/json; charset=utf-8',
    error: function (err) {
      // Append the response message to msgContainer
      msgContainer.html(`<span class='error'><em>${err}</em></span>`);

      // Hide response message after 3 seconds
      setTimeout(() => {
      	msgContainer.fadeOut();
      }, 3000);
    },
    success: function (data) {
      if (data.result != 'success') {
      	/**
				 * Mailchimp sends a response status code
				 * with the response message, lets cut that out
				 */

        var message = data.msg.replace(/\d\s-\s/, '');

        // Append the response message to msgContainer
        msgContainer.hide().html(`<span class='error'><em>${message}</em></span>`).fadeIn();

        // Hide response message after 3 seconds
        setTimeout(() => {
        	msgContainer.fadeOut();
        }, 3000);

      } else {

        var message = data.msg;

        // Append the response message to msgContainer
        msgContainer.hide().html(`<span class='success'><em>${message}</em></span>`).fadeIn();

        // Hide response message after 4 seconds
        setTimeout(() => {
        	msgContainer.fadeOut();
        }, 4000);
      }
    }
  });
};


/*------------------------------------*\
	Helper functions
\*------------------------------------*/

/**
 * Email validator
 *
 * @return {bool}
 */

let isEmail = val => {
	var emailFilter = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
	if (emailFilter.test(val)) {
		return true;
	}
	return false;
};

/**
 * Postnr validator
 *
 * @return {bool}
 */

let isPostnr = val => {
	var nrFilter = /^\d{3}\s\d{2}$/;
	if (nrFilter.test(val)) {
		return true;
	}
	return false;
};

/**
 * Add spacing format on postnr
 *
 * e.g. [190 00]
 */

let postnrFormat = (e) => {
  var inputVal = e.target.value;
  var newVal   = inputVal.replace(/^([0-9]{3}(?!\s))/, function (a) {
        return a + ' ';
      });

  e.target.value = newVal;
};
