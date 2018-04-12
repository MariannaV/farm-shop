; (function () {
  cashboxSlider();

  function cashboxSlider() {
    var owl = $('.cashbox-slider .slider-items-container');
    owl.owlCarousel({
      margin: 0,
      navText: false,
      loop: false,
      lazyLoad: true,
      responsive: {
        320: {
          items: 1,
          nav: true,
          dots: true,
        },
        768: {
          items: 2,
          nav: true,
          dots: true,
        },
        900: {
          items: 3,
          nav: true,
          dots: true,
        },
        1162: {
          dots: false,
          nav: false
        }
      }
    })
  }
}());  