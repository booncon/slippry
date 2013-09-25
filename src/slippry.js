/**
 * slippry v0.1 - Simple responsive content slider
 * http://slippry.com
 *
 * Author(s): Lukas Jakob Hafner - @saftsaak 
 *
 * Copyright 2013, booncon oy - http://booncon.com
 *
 * Released under the MIT license - http://opensource.org/licenses/MIT
 */

(function ($) {
  "use strict";
  var defaults;

  defaults = {
    wrapper: '<div class="slippry_box" />',
    boxClass: 'slippry_list',
    elements: 'li',
    activeClass: 'active',
    useControls: true,
    usePager: true,
    pagerWrap: '<ul class="controls" />',
    pagerPrev: '<li class="slip_prev"><a href="#!">Previous</a></li>',
    pagerNext: '<li class="slip_next"><a href="#!">Next</a></li>',
    fillerClass: 'stay',
    adaptHeight: true,
    initSingle: false
  };

  $.fn.slippry = function (options) {
    var slip, el, refresh, prepareFiller, setFillerProportions, init, goToSlide, initPager, initControls, reset;

    // reference to the object calling the function
    el = this;

    // if no elements just stop
    if (el.length === 0) {
      return this;
    }
    // support mutltiple elements
    if (el.length > 1) {
      el.each(function () {
        $(this).slippry(options);
      });
      return this;
    }

    // variable to access the slider settings across the plugin
    slip = {};

    // sets the aspect ratio of the filler element
    setFillerProportions = function ($slide) {
      var width, height, ratio, p_top;
      width = $slide.width();
      height = $slide.height();
      ratio = width / height;
      p_top = 1 / ratio * 100 + '%';  //cool intrinsic trick: http://alistapart.com/article/creating-intrinsic-ratios-for-video
      $('.' + slip.settings.fillerClass, el.parent()).css({paddingTop: p_top}); // resizing without the need of js, true responsiveness :)
    };

    // prepares a div to occupy the needed space
    prepareFiller = function () {
      if ($('.' + slip.settings.fillerClass, el.parent()).length === 0) {
        el.parent().append($('<div class="' + slip.settings.fillerClass + '" />'));
      }
      if (slip.settings.adaptHeight === true) {  // if the slides shoud alwas adapt to their content
        setFillerProportions($('.' + slip.settings.activeClass, el));  // set the filler height on the active element
      } else {  // otherwise get the highest element
        var slides, $highest, height, count, loop;
        slides = $(slip.settings.elements, el);
        height = 0;
        loop = 0;
        count = slides.length;
        $(slides).each(function () {
          if ($(this).height() > height) {
            $highest = $(this);
            height = $highest.height();
          }
          loop = loop + 1;
          if (loop === count) {
            if ($highest === undefined) {
              $highest = $($(slides)[0]);
            }
            setFillerProportions($highest);
          }
        });
      }
    };

    goToSlide = function (slide) {
      if (slide === 'prev') {

      } else if (slide === 'next') {

      } else {
        if ($(slip.settings.elements, el).length > 0) {
          $(slip.settings.elements, el).removeClass(slip.settings.activeClass);
          $($(slip.settings.elements, el)[slide]).addClass(slip.settings.activeClass);
        }
      }  
    };

    initPager = function () {
      if (slip.settings.usePager) {
        var count, loop, pager;
        count = $(slip.settings.elements, el).length;
        pager = $('<ul class="pager" />');
        for (var i = 0; i < count; i++) {
          pager.append($('<li />').append($('<a href="#' + i + '"></a>')));
        }
        el.parent().append(pager);
      }  
    };

    initControls = function () {
      if (slip.settings.useControls) {
        el.parent().append($(slip.settings.pagerWrap).append(slip.settings.pagerPrev).append(slip.settings.pagerNext));
        $('.slip_prev').click(function(event) {
          goToSlide(1);
        });
      }
    };

    // refreshes the already initialised slider
    refresh = function () {
      prepareFiller();
    };

    // initialises the slider, creates needed markup
    init = function () {
      slip.settings = $.extend({}, defaults, options);
      el.addClass(slip.settings.boxClass).wrap(slip.settings.wrapper);
      initControls();
      initPager();
      refresh();
    };

    reset = function () {
      // todo : delete all the created objects
      el.parent().parent().append(el).remove(el.parent()); // implement this properly
      init(); // re-initialise
    };

    init(); // on startup initialise the slider

    return this;
  };
}(jQuery));