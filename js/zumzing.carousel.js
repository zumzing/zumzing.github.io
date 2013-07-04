;(function(){

	$.fn.carousel = function(option){
		
		
		/*////////////////////////////////////////////////////////////////// MODEL */
		
		var carouselModel = function($slides) {
			var _slides = [],
					_slideIdx = 0;
			
			$.each($slides, function(idx, el) {
				
				var $image = $(el).find('img')[0];
				
				_slides.push(slide({
					link: $image.getAttribute('data-href'),
					image: $image,
					duration: $image.getAttribute('data-duration'),
					caption: $image.getAttribute('data-caption'),
					transition: option.transition
				}));
				
			});
			
			return {
				getSlides: function() {
					// TODO: implement clone() deep copy
					return _slides;
				},
				nextIndex: function() {
					_slideIdx += 1;
					return _slideIdx % _slides.length;
				},
				previousIndex: function() {
					_slideIdx -= 1;
					return _slideIdx % _slides.length;
				},
				assetsLoaded: function() {
					var slideCount = _slides.length - 1;
					while(slideCount--){
						if(_slides[slideCount].complete === false) {
							return false;
						}
					}
					return true;
				}
			}
		}
		
		var slide = function(init) {
			
			return {
				link: init.link,
				image: init.image,
				duration: init.duration,
				transition: init.transition,
				caption: init.caption
			}
		
		}
		
		
		/*/////////////////////////////////////////////////////////////////// VIEW */
		
		var nextControl = function() {
			return {
				renderTo: function(target) {
					$('<div/>').attr('id', 'carousel-next').bind('click', function() {
						
					}).appendTo(target);
				}
			}
		}
		
		var previousControl = function() {
			return {
				renderTo: function(target) {
					$('<div/>').attr('id', 'carousel-prev').bind('click', function() {
						
					}).appendTo(target);
				}
			}
		}
		
		var slideCaption = function() {
			return {
				renderTo: function(target) {
					$('<div/>').attr('id', 'carousel-caption').appendTo(target);
				},
				updateCaption: function(newCaption) {
					$('#carousel-caption').html(newCaption);
				}
			}
		}
		
		var link = function() {
			
			var _linkSelector = option.carouselLinkID,
					_currentLink = '#'; 
			
			return {
				renderTo: function(target) {
					$('<a/>').attr('id', _linkSelector).attr('href', _currentLink).appendTo(target);
				},
				updateLink: function(link) {
					_currentLink = link;
					$('#' + _linkSelector).attr('href', _currentLink);
				}
			}
		}
		
		var carouselView = function() {
			
			var _slides = {},
					_link = link(),
					canvas,
					ctx,
					next = nextControl(),
					prev = previousControl(),
					myCaption = slideCaption();
			
			_link.renderTo(option.carousel);
			canvas = $('<canvas/>').attr('id', 'my-canvas').attr('width', '820').attr('height', '270').appendTo('#' + option.carouselLinkID)[0];
			ctx = canvas.getContext('2d');
			ctx.setTransform(1, 0, 0, 1, 0, 0);
			next.renderTo(option.carousel);
			prev.renderTo(option.carousel);
			myCaption.renderTo(option.carousel);
			
			return {
				setModel: function(slides) {
					_slides = slides;
				},
				init: function() {
					ctx.drawImage(0,0, this.getSlideAtIndex(0).image);	
				},
				getSlideAtIndex: function(idx) {
					return _slides[idx];
				},
				paintSlideAtIndex: function (idx) {
					idx = idx > 0 ? idx : 0;
					
					var slide = _slides[idx],
							image = slide.image,
							imageCaption = slide.caption,
							imageWidth = image.width,
							imageHeight = image.height,
							sliceCount = 20,
							sliceWidth = imageWidth / sliceCount,
							delay = 30;
					_link.updateLink(slide.link);
					myCaption.updateCaption(slide.caption);
					// console.log('Loaded: ' + image.complete);
					
					TWEEN.start();	
					
					for( var i = 0; i < sliceCount; i += 1) {
						
						var slice, tween, tweenValue;
						
						slice = {
							idx: i,
							image: image,
							x: i * sliceWidth,
							y: 0,
							width: sliceWidth,
							height: imageHeight
						}
						
						tween = new TWEEN.Tween(slice)
							.to({y: imageHeight}, 750)
							.delay(i * delay)
							.easing(TWEEN.Easing.Quintic.EaseOut)
							.onUpdate(function() {
								var dy = Math.round(this.y) === 0 ? 1 : Math.round(this.y);

								try {
									if(this.idx % 2 === 0) {
										tweenValue = this.height - this.y;
										ctx.drawImage(this.image, this.x, tweenValue, sliceWidth, dy, this.x, tweenValue, sliceWidth, dy);
									} else {
										ctx.drawImage(this.image, this.x, 0, sliceWidth, dy, this.x, 0, sliceWidth, dy);
									}
								} catch(e) {
									if(console && console.Error) {
										console.Error(e);
									}
								}
							});
							
						tween.start();
					}
				},
				updateLink: function(url) {
					_link.updateLink(url);
				}
			}
		}
		
		
		/*///////////////////////////////////////////////////////////// CONTROLLER */
		
		var carousel = function($slides, params) {
			var _model = carouselModel($slides),
					_slides = _model.getSlides(),
					_view = carouselView();
			
			$(window).bind('click', function(e) {
				switch(e.target.id) {
					case 'carousel-next':
						_view.paintSlideAtIndex(_model.nextIndex());
						break;
					case 'carousel-prev':
						_view.paintSlideAtIndex(_model.previousIndex());
						break;
				}
			});
			_view.setModel(_slides);
			//_view.init();
			
			var assetLoadChecker = setInterval(function() {
					if(_model.assetsLoaded() === true) {
						// console.log('ass load: ' + _model.assetsLoaded());
						_view.paintSlideAtIndex(0);
						clearInterval(assetLoadChecker);
					}
				}, 1000);
						
			// Remove in production
			window.model = _model;
			window.view = _view;
		}
		
		/*/////////////////////////////////////////////////////////////////// INIT */
		
		option = $.extend({}, $.fn.carousel.defaults, option);
		
		var _carousel = carousel(this, option);

		return this;
	}
	
	$.fn.carousel.defaults = {
		carouselWidth: '820px',
		carouselHeight: '270px',
		carouselScroll: 1,
		carouselIndex: 0,
		carouselNext: null,
		carouselPrev: null,
		carouselLinkID: 'carousel-link',
		carousel: '#carousel',
		transition: 'zipper',
		autoplay: false
	};

})(jQuery);