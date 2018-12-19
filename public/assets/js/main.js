// $.ajax({
//     url: " a", 
//     success: function(result) {
       
//     }
// });

function showDetails() {	
  console.log("hello++++++++++++++");	
var a = jQuery(this).closest('.item');
var b = jQuery(a).hasClass('open');
var c = jQuery(a).closest('.accordion').find('.open');
  
if(b != true) {
  jQuery(c).find('.content').slideUp(500);
  jQuery(c).removeClass('open');
}

// $('.accordion .item').click(() => {
// 	console.log("New Function");
// })

jQuery(a).toggleClass('open');
jQuery(a).find('.content').slideToggle(500);

}

jQuery('.nav_slide_button').click(function() {
jQuery('.pull').slideToggle();
});	

console.log("hello");
jQuery("#slider_container > div:gt(0)").hide();

setInterval(function() {
  jQuery('#slider_container > div:first')
    .fadeOut(1000)
    .next()
    .fadeIn(1000)
    .end()
    .appendTo('#slider_container');
}, 5000);


$.ajax({
  url: 'https://api.myjson.com/bins/ix6f0',
  // data: {
  //    format: 'json'
  // },
  error: function() {
     //$('#info').html('<p>An error has occurred</p>');
     console.log("Error Occured");
  },
  // dataType: 'json',
  success: function(data) {
    console.log(data);
    data.agenda.eventdata.forEach((element, i) => {

      var divContainer = document.createElement('div');
      divContainer.className = 'container';

      document.getElementById('section-' + (i+1)).appendChild(divContainer);

      var divAccordion = document.createElement('div');
      divAccordion.className = 'accordion';
      divAccordion.onclick = showDetails;

      divContainer.appendChild(divAccordion);

      var divDay = document.createElement('div');
      divDay.className = 'day';

      divAccordion.appendChild(divDay);

      divDay.innerHTML = element.date;

      element.details.forEach((ele, index) => {
 
  
        var divItemClearfix = document.createElement('div');
        divItemClearfix.className = 'item clearfix';
        divItemClearfix.onclick = showDetails;

        divAccordion.appendChild(divItemClearfix);

        var divHeadingClearfix = document.createElement('div');
        divHeadingClearfix.className = 'heading';

        divItemClearfix.appendChild(divHeadingClearfix);

        var divTime = document.createElement('div');
        divTime.className = 'time col-md-3 col-sm-12 col-xs-12';

        divHeadingClearfix.appendChild(divTime);

        divTime.innerHTML = ele.eventTime;

        var divEventTitle = document.createElement('div');
        divEventTitle.className = 'e-title col-md-9 col-sm-12 col-xs-12';

        divHeadingClearfix.appendChild(divEventTitle);

        divEventTitle.innerHTML = ele.eventName;

        var lineBreak = document.createElement("BR");

        divEventTitle.appendChild(lineBreak);

        var spanName = document.createElement('span');
        spanName.className = 'name';

        divEventTitle.appendChild(spanName);

        spanName.innerHTML = ele.speaker;

        var spanSpeakerDesignation = document.createElement('span');
        spanSpeakerDesignation.className = 'speaker-designaition';

        divEventTitle.appendChild(spanSpeakerDesignation);

        spanSpeakerDesignation.innerHTML = '"Designation"';

        var divOuterdescription = document.createElement('div');
        divOuterdescription.className = 'col-md-12 col-sm-12 col-xs-12';

        divItemClearfix.appendChild(divOuterdescription);

        var divContentVenue = document.createElement('div');;
        divContentVenue.className = 'content venue col-md-3 col-sm-12 col-xs-12';

        divOuterdescription.appendChild(divContentVenue);

        divContentVenue.innerHTML = "\"" + ele.venue + "\"";

        var divContentDetails = document.createElement('div');;
        divContentDetails.className = 'content details col-md-9 col-sm-12 col-xs-12';

        divOuterdescription.appendChild(divContentDetails);

        divContentDetails.innerHTML = "\"" + ele.description + "\"";
        
      })
    })
  },
  type: 'GET'
});