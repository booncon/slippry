//= require_tree .

function smoothScroll(el) {
  jQuery('body,html').animate({
    scrollTop: $($(el).attr('href')).offset().top
  }, 600);
}

jQuery(document).ready(function(){
  jQuery('#slippry-demo').slippry({
    slippryWrapper: '<div class="sy-box front-page" />'
  });

  jQuery('.button-link.download, .button-link.github-download').click(function () {
    ga('send', 'event', 'Download', 'Click', 'Slippry(zip)');
  })

  jQuery('.github-link').click(function () {
    ga('send', 'event', 'Github', 'Click', 'Ribbon');
  });

  // Generic
  jQuery('#out-of-the-box-demo').slippry();

  jQuery('#settings-jump a:not(#select-setting)').click(function () {
    smoothScroll(this);
  });

  jQuery('#front-link').click(function () {
    smoothScroll(this);
  });
  
  // Pictures Slider
  jQuery('#pictures-demo').slippry({
    // general elements & wrapper
    slippryWrapper: '<div class="sy-box pictures-slider" />', // wrapper to wrap everything, including pager

    // options
    adaptiveHeight: false, // height of the sliders adapts to current slide
    captions: false, // Position: overlay, below, custom, false

    // pager
    pager: false,
    
    // controls
    controls: false,
    autoHover: false,

    // transitions
    transition: 'kenburns', // fade, horizontal, kenburns, false
    kenZoom: 140,
    speed: 2000 // time the transition takes (ms)
  });

  // Portfolio
  jQuery('#portfolio-demo').slippry({
    // general elements & wrapper
    slippryWrapper: '<div class="sy-box portfolio-slider" />', // wrapper to wrap everything, including pager

    // options
    adaptiveHeight: false, // height of the sliders adapts to current slide
    start: 'random', // num (starting from 1), random
    loop: false, // first -> last & last -> first arrows
    captionsSrc: 'li',
    captions: 'custom', // Position: overlay, below, custom, false
    captionsEl: '.external-captions',

    // transitions
    transition: 'fade', // fade, horizontal, kenburns, false
    easing: 'linear', // easing to use in the animation [(see... [jquery www])]
    continuous: false,

    // slideshow
    auto: false
  });

  // News
  jQuery('#news-demo').slippry({
    // general elements & wrapper
    slippryWrapper: '<div class="sy-box news-slider" />', // wrapper to wrap everything, including pager
    elements: 'article', // elments cointaining slide content

    // options
    adaptiveHeight: false, // height of the sliders adapts to current 
    captions: false,

    // pager
    pagerClass: 'news-pager',

    // transitions
    transition: 'horizontal', // fade, horizontal, kenburns, false
    speed: 1200,
    pause: 8000,

    // slideshow
    autoDirection: 'prev'
  });

  // Shop
  jQuery('#shop-demo').slippry({
    // general elements & wrapper
    slippryWrapper: '<div class="sy-box shop-slider" />', // wrapper to wrap everything, including pager
    elements: 'article', // elments cointaining slide content

    // options
    adaptiveHeight: false, // height of the sliders adapts to current slide
    start: 2, // num (starting from 1), random
    loop: false, // first -> last & last -> first arrows
    captionsSrc: 'article',
    captions: 'custom', // Position: overlay, below, custom, false
    captionsEl: '.product-name',

    // pager
    pager: false,

    // transitions
    slideMargin: 20, // spacing between slides (in %)
    useCSS: true,
    transition: 'horizontal',

    // slideshow
    auto: false
  });
  
  // thumbnails
  var thumbs = jQuery('#thumbnails').slippry({
    // general elements & wrapper
    slippryWrapper: '<div class="sy-box thumbnails" />', // wrapper to wrap everything, including pager
    // options
    transition: 'horizontal',
    pager: false,
    auto: false,
    onSlideBefore: function (el, index_old, index_new) {
      jQuery('.thumbs a img').removeClass('active');
      jQuery('img', jQuery('.thumbs a')[index_new]).addClass('active');
    }
  });

  jQuery('.thumbs a').click(function () {
    thumbs.goToSlide($(this).data('slide'));
    return false;
  });

  // CSS vs jQuery
  jQuery('#css-demo').slippry({
    // general elements & wrapper
    slippryWrapper: '<div class="sy-box css-demo" />', // wrapper to wrap everything, including pager
    // options
    adaptiveHeight: true, // height of the sliders adapts to current slide
    useCSS: true, // true, false -> fallback to js if no browser support
    autoHover: false,
    transition: 'horizontal'
  });

  jQuery('#jquery-demo').slippry({
    // general elements & wrapper
    slippryWrapper: '<div class="sy-box jquery-demo" />', // wrapper to wrap everything, including pager
    // options
    adaptiveHeight: false, // height of the sliders adapts to current slide
    useCSS: false, // true, false -> fallback to js if no browser support
    autoHover: false,
    transition: 'horizontal'
  });

  jQuery('#select-setting').click( function() {
    if(jQuery('#settings-jump').hasClass('open')) {
      jQuery('#settings-jump').switchClass('open','closed',1000);
    } else if(jQuery('#settings-jump').hasClass('closed')) {
      jQuery('#settings-jump').switchClass('closed','open',1000);
    } 
    return false;
  });
  jQuery('#settings-jump a').click( function () {
    if(jQuery('#settings-jump').hasClass('open')) {
      jQuery('#settings-jump').switchClass('open','closed',1000);
    }
  });
});