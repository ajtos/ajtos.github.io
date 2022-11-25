$(function() {
	var template = $('template').html();
	for(var i = 1; i <= 4; ++i) $('main section').append(template.replace('{key}', i));

	var loader = {};
	$(document).on('change', 'select', function() {
		var src = 'img/' + $(this).val() + '.png';
		var id = $(this).closest('[id]').prop('id');
		loader[id] = new Image;
		loader[id].onload = function() {
			$('#' + id).find('img').prop('src', this.src);
			$('#' + id).addClass('loaded');
		};
		$('#' + id).removeClass('loaded');
		loader[id].src = src;
	});

	var opts = [];
	$('#s1 option').each(function() { opts.push($(this).prop('value')); });

	var isize = { w: $('#s1 span').outerWidth(), h: $('#s1 span').outerHeight() };
	var psize = { w: $('#s1 .cn').outerWidth(), h: $('#s1 .cn').outerHeight() };
	$(window).resize(function() {
		isize = { w: $('#s1 span').outerWidth(), h: $('#s1 span').outerHeight() };
		psize = { w: $('#s1 .cn').outerWidth(), h: $('#s1 .cn').outerHeight() };
		$(document).trigger('mousemove touchmove');
	});

	var px = -Math.round((isize.w - psize.w) * 0.5);
	var py = -Math.round((isize.h - psize.h) * 0.5);
	$('section span').css('transform', 'translate(' + px + 'px, ' + py + 'px)');
	setTimeout(function() { $('section span').addClass('smooth'); }, 50);

	for(var i = 1; i <= 4; ++i) {
		var index = Math.floor(Math.random() * opts.length);
		var opt = opts[index];
		opts.splice(index, 1);
		$('#s' + i + ' select').val(opt).trigger('change');
	}

	$(document).on('mousemove touchmove', 'section', function(e) {
		var el = $('section');
		var w = el.outerWidth();
		var h = el.outerHeight();
		var x = e.pageX - el.offset().left;
		var y = e.pageY - el.offset().top;
		x = x > w ? w : x < 0 ? 0 : x;
		y = y > h ? h : y < 0 ? 0 : y;
		var px = -Math.round((isize.w - psize.w) * (x / w));
		var py = -Math.round((isize.h - psize.h) * (y / h));
		$('section span').css('transform', 'translate(' + px + 'px, ' + py + 'px)');
	});
});