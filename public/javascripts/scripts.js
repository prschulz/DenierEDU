$(document).ready(function(){
/* affix the navbar after scroll below header */
$('#nav').affix({
      offset: {
        top: $('header').height()-$('#nav').height()
      }
});

/* highlight the top nav as scrolling occurs */
$('body').scrollspy({ target: '#nav' });

/* smooth scrolling for scroll to top */
$('.scroll-top').click(function(){
  $('body,html').animate({scrollTop:0},1000);
});

/* smooth scrolling for nav sections */
$('#nav .navbar-nav li>a').click(function(){
  var link = $(this).attr('href');
  var posi = $(link).offset().top-80;
  $('body,html').animate({scrollTop:posi},700);
});



    if ( document.location.href.indexOf('state') > -1 ) {
    var posi = $('#representatives').offset().top-80;
    $('body,html').animate({scrollTop:posi},700);
  }

  $("#search").on("submit",function(e){
    // if selected.length < 2...prevent submission and alert
    if($("#state").val().length > 2){
      e.preventDefault();
      alert("Please choose a state");
    }
  });
});
