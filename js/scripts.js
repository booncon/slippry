jQuery(document).ready(function(){
  jQuery('#demo1').slippry();

  // Generic
  jQuery('#out-of-the-box-demo').slippry({
    //adaptHeight: false
  });
  
  // Pictures Slider
  jQuery('#pictures-demo').slippry({
    // general elements & wrapper
    slippryWrapper: '<div class="slippry_box pictures-slider" />', // wrapper to wrap everything, including pager

    // options
    adaptHeight: false, // height of the sliders adapts to current slide
    captions: false, // Position: overlay, below, custom, false

    // pager
    usePager: false,
    
    // controls
    useControls: false,

    // transitions
    transition: 'kenburns', // fade, horizontal, kenburns, false
    kenZoom: 1.4,
    transTime: 2000, // time the transition takes (ms)
  });

  // Portfolio
  jQuery('#portfolio-demo').slippry({
    // general elements & wrapper
    slippryWrapper: '<div class="slippry_box portfolio-slider" />', // wrapper to wrap everything, including pager

    // options
    adaptHeight: false, // height of the sliders adapts to current slide
    start: 'random', // num (starting from 1), random
    loop: false, // first -> last & last -> first arrows
    captions: 'custom', // Position: overlay, below, custom, false
    captionsClass: 'external-captions',

    // transitions
    transition: 'fade', // fade, horizontal, kenburns, false
    transEase: 'linear', // easing to use in the animation [(see... [jquery www])]
    continuous: false,

    //slideshow
    auto: false,
  });

  // News
  jQuery('#news-demo').slippry({
    // general elements & wrapper
    slippryWrapper: '<div class="slippry_box news-slider" />', // wrapper to wrap everything, including pager
    elements: 'article', // elments cointaining slide content

    // options
    adaptHeight: false, // height of the sliders adapts to current slide

    // pager
    // pagerClass: 'news-pager',

    // transitions
    transition: 'horizontal', // fade, horizontal, kenburns, false
    useCSS: true, // true, false -> fallback to js if no browser support

    // slideshow
    autoDirection: 'prev',
  });

  // Shop
  jQuery('#shop-demo').slippry({
    // general elements & wrapper
    slippryWrapper: '<div class="slippry_box shop-slider" />', // wrapper to wrap everything, including pager
    elements: 'article', // elments cointaining slide content

    // options
    adaptHeight: false, // height of the sliders adapts to current slide
    start: 2, // num (starting from 1), random
    loop: false, // first -> last & last -> first arrows
    captions: 'custom', // Position: overlay, below, custom, false
    captionsClass: 'product-name',

    // pager
    usePager: false,

    // transitions
    slideMargin: 20, // spacing between slides (in %)
    useCSS: true,

    //slideshow
    auto: false,
  });
  
  jQuery('#css-demo').slippry({
    // general elements & wrapper
    slippryWrapper: '<div class="slippry_box css-demo" />', // wrapper to wrap everything, including pager
    // options
    adaptHeight: true, // height of the sliders adapts to current slide
    useCSS: true, // true, false -> fallback to js if no browser support
  });

  jQuery('#jquery-demo').slippry({
    // general elements & wrapper
    slippryWrapper: '<div class="slippry_box jquery-demo" />', // wrapper to wrap everything, including pager
    // options
    adaptHeight: false, // height of the sliders adapts to current slide
    useCSS: false, // true, false -> fallback to js if no browser support
  });
});