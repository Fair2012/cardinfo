$(document).ready(function() {
	var $cardnr = $("#cardnr");
	var $month = $("#validMONTH");
	var $year = $("#validYEAR");
	var $cvc2 = $("#cvc2");
	var $cardname = $("#cardname");
	var tooltip;
	var errorsMsg = {
		onlyVM : 'К оплате принимаются только карты VISA и MATERCARD',
		cardnr : 'Проверьте правильность ввода номера карты',
		cardMonth : 'Месяц срока действия карты введен не верно',
		cardYear : 'Год срока действия карты введен не верно',
		cardDate : 'Проверьте срок действия карты',
		cardNameEmpty : 'Укажите фамилию и имя владельца карты',
		cardNameTwo : 'Фамилия и имя должны содержать не менее двух символов',
		cardNameIncorrect : 'Введите полную фамилию и имя владельца карты',
		cardNameNotLatin : 'Фамилия и имя владельца должны быть указаны латинскими буквами',
		cvc2 : 'CVV2/CVC2 должен содержать не менее трех символов'
	};

	init();

	function init() {
		$cardnr.mask("9999 9999 9999 9999");
		// $month.mask("?99");
		// $year.mask("?99");

		$cardnr.focus();

		$cardnr.keyup(function (e) {
			var input = $(this).val(), count, match;
			match = input.match(/\d/g);
			if (match) {
				count = match.length;
			}
			if (count && count === 16) {
				closeTooltip();
				$month.focus();
			}
		});

		$('[name=quantity]').bind("change keyup input click", function() {
			if (this.value.match(/[^0-9]/g)) {
				this.value = this.value.replace(/[^0-9]/g, '');
			}
		});

		// $cardnr.keyup(function (e) {
		// 	var input, count, match;
		// 	if (this.value.match(/[^0-9_]/g)) {
		// 		this.value = this.value.replace(/[^0-9_]/g, '');
		// 	}
		// });

		$month.keyup(function (e) {
			var input, count, match;
			if (this.value.match(/[^0-9]/g)) {
				this.value = this.value.replace(/[^0-9]/g, '');
			}
			// input = $(this).val();
			input = this.value;
			match = input.match(/\d/g);
			if (match) {
				count = match.length;
			}
			if (count && count === 2) {
				closeTooltip();
				$year.focus();
			}
		});
		$month.blur(function (e) {
			var input = $month.val(), count, match;
			match = input.match(/\d/g);
			if (match) {
				count = match.length;
			}
			if (count === 1) {
				$month.val('0' + $month.val());
			}
		});
		$year.keyup(function (e) {
			var input, count, match;
			if (this.value.match(/[^0-9]/g)) {
				this.value = this.value.replace(/[^0-9]/g, '');
			}
			input = this.value;
			match = input.match(/\d/g);
			if (match) {
				count = match.length;
			}
			if (count && count === 2) {
				closeTooltip();
				$cvc2.focus();
			}
		});
		$cardname.keyup(function (e) {
			var s = $cardname.val();
			if (s) {
				$cardname.val(s.replace(/\s+/g, ' '));
			}
		});

		$('#submit').click(function (e) {
			e.stopImmediatePropagation();
			closeTooltip();
			validate();
		});
		$('.cardname').click(function () {
			$cardname.focus();
		});
		$('.card-date').click(function () {
			$month.focus();
		});
		$('.card-cvc2').click(function () {
			$cvc2.focus();
		});

		$(document).click(function () {
			closeTooltip()
		});
	}

	function closeTooltip(){
		if (tooltip) {
			tooltip.close();
			tooltip = null;
		}
	};

	function validate() {
		var check = true;
		if (check === true) {
			check = checkCardnr();
		}
		if (check === true) {
			check = checkVisaMastercard();
		}
		if (check === true) {
			check = checkMonth();
		}
		if (check === true) {
			check = checkYear();
		}
		if (check === true) {
			check = checkCvc2();
		}
		if (check === true) {
			check = checkName();
		}
		if (check === true) {
			normalizeFields();
			$('#cardentry').submit();
		}
	}

	function normalizeFields() {
		var s = $cardname.val();
		$cardnr.val($cardnr.val().replace(/\s/g, ""));
		$cardname.val(s.trim().replace(/\s+/g, ' '));
	}

	function showError($field, msg) {
		var id = $field.attr('id');
		$field.focus();
		tooltip = new jBox('Tooltip', {target: '#' + id, content: msg});
		tooltip.open();
		$('#' + tooltip.id).find('.jBox-container').addClass('jbox-' + id);
		$('html, body').animate({scrollTop: 0}, 1000);
	}

	function checkVisaMastercard() {
		var first = $cardnr.val()[0];
		if (first && (first !== '2' && first !== '4' && first !== '5')) {
			showError($cardnr, errorsMsg.onlyVM);
			return false;
		}
		return true;
	}

	function checkCardnr() {
		var input = $cardnr.val(), count, match;
		match = input.match( /\d/g );
		if (match) {
			count = match.length;
		}
		if (!match || count !== 16) {
			showError($cardnr, errorsMsg.cardnr);
			return false;
		}
		return true;
	}

	function checkMonth() {
		var input = $month.val(), count, match;
		match = input.match( /\d/g );
		if (match) {
			count = match.length;
		}
		if (!match || count !== 2 || parseInt(input) < 1 || parseInt(input) > 12) {
			showError($month, errorsMsg.cardMonth);
			return false;
		}

		return true;
	}

	function checkYear() {
		var input = $year.val(), count, match, currYear, currMonth, date = new Date();
		currYear = date.getFullYear().toString();
		currYear = currYear.substring(2);
		currMonth = parseInt(date.getMonth()) + 1;
		match = input.match( /\d/g );
		if (match) {
			count = match.length;
		}
		if (!match || count !== 2 || parseInt(input) < parseInt(currYear)) {
			showError($year, errorsMsg.cardYear);
			return false;
		}
		//if (parseInt(input) === parseInt(currYear) && parseInt($month.val()) <  currMonth) {
		//	showError($month, errorsMsg.cardDate);
		//	return false;
		//}

		return true;
	}

	function checkCvc2() {
		var input = $cvc2.val(), count, match;
		//match = input.match( /\d/g );
		//if (match) {
			count = input.length;
		//}
		if (!count || count < 3) {
			showError($cvc2, errorsMsg.cvc2);
			return false;
		}
		return true;
	}

	function checkName() {
		var input, count, match, words, i;
		input = $cardname.val().trim().replace(/_/g, "");
		count = input.length;
		if (!count) {
			showError($cardname, errorsMsg.cardNameEmpty);
			return false;
		}
		words = input.split(' ');
		words.forEach(function(item, i, arr) {

		});
		for (i = 0; i < words.length; i++) {
			if (words[i].length <= 1) {
				showError($cardname, errorsMsg.cardNameTwo);
				return false;
			}
		}
		match = input.match( /\s/g );
		if (!match) {
			showError($cardname, errorsMsg.cardNameIncorrect);
			return false;
		}
		match = input.match( /[^a-z\s-`]+/ig );
		if (match) {
			showError($cardname, errorsMsg.cardNameNotLatin);
			return false;
		}

		return true;
	}
});
		
