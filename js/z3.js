$(function(){

	if(Modernizr.canvas && $('.carousel-item').size() > 0) {
		$('.carousel-item').carousel({autoplay: false, carouselWidth: '820px', carouselHeight: '270px'});
		$('.carousel-items').css('display', 'none');
		$('.front #cycle').css('display', 'none');
	} else {
		if($('.front .carousel-item').size() > 0) {
			console.log('No canvas support');
			var cItems = $('.front .carousel-items');
			cItems.css('visibility', 'visible');
			$('#carousel').hide();
			$('<div/>').attr('id', 'cycle-next').appendTo('#cycle');
			$('<div/>').attr('id', 'cycle-prev').appendTo('#cycle');
			$('<div/>').attr('id', 'cycle-caption').appendTo('#cycle');
			$('.front .carousel-items').cycle({
				timeout: 0,
				prev: '#cycle-prev',
				next: '#cycle-next',
				before: function (incoming, outgoing, options) {
					var captionIn = $(incoming).find('img')[0].getAttribute('data-caption'),
							captionOut = $(outgoing).find('img')[0].getAttribute('data-caption');
					
					console.log('Caption in: ' + captionIn);
					console.log('Caption out: ' + captionOut);
					$('#cycle-caption').text(captionOut);
				}
			});
		}
	}
});