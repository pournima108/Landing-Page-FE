try {
    var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    var recognition = new SpeechRecognition();
  }
  catch(e) {
    console.error(e);
    // $('.no-browser-support').show();
    // $('.app').hide();
  }
  
  
//   var noteTextarea = $('#note-textarea');
//   var instructions = $('#recording-instructions');
//   var notesList = $('ul#notes');
  
  var noteContent = '';
  
  // Get all notes from previous sessions and display them.
//   var notes = getAllNotes();
//   renderNotes(notes);
const audiocontext = new AudioContext();



const audioLunchURL ='https://res.cloudinary.com/hexai/video/upload/v1545137087/LunchIntent.mp3'
// audioURL =['https://res.cloudinary.com/hexai/video/upload/v1544785921/transcript_7_1.mp3',
// 'https://res.cloudinary.com/hexai/video/upload/v1545137109/QueryIntent.mp3',
// 'https://res.cloudinary.com/hexai/video/upload/v1545137087/LunchIntent.mp3',
// 'https://res.cloudinary.com/hexai/video/upload/v1545137067/BreakfastIntent.mp3']
const audioBreakfastURL ='https://res.cloudinary.com/hexai/video/upload/v1545137067/BreakfastIntent.mp3'


// const playButton = document.querySelector('#play');

let audioyodelBuffer;
let LunchIntentbuffer;
let BreakfastIntentBuffer

window.fetch(audioLunchURL)
    .then(response => response.arrayBuffer())
    .then(arrayBuffer => context.decodeAudioData(arrayBuffer))
    .then(audioLunchBuffer => {
        // playButton.disabled = false;
        LunchIntentbuffer = audioLunchBuffer;
        console.log(audioLunchBuffer)
        console.log("Audio Loaded =========");
        console.log(LunchIntentbuffer);
    });

    window.fetch(audioBreakfastURL)
    .then(response => response.arrayBuffer())
    .then(arrayBuffer => context.decodeAudioData(arrayBuffer))
    .then(audioBreakfastBuffer => {
        // playButton.disabled = false;
        BreakfastIntentBuffer = audioBreakfastBuffer;
        console.log(audioBreakfastBuffer)
        console.log("Audio Loaded =========");
        console.log(BreakfastIntentBuffer);
    });
  
function playAudio(audioBuffer) {
  console.log(audioBuffer);
  const source = audiocontext.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(audiocontext.destination);
  source.start();
}
  
  /*-----------------------------
        Voice Recognition 
  ------------------------------*/
  
  // If false, the recording will stop after a few seconds of silence.
  // When true, the silence period is longer (about 15 seconds),
  // allowing us to keep recording even when the user pauses. 
  recognition.continuous = true;
  
  // This block is called every time the Speech APi captures a line. 
  recognition.onresult = function(event) {
  
    // event is a SpeechRecognitionEvent object.
    // It holds all the lines we have captured so far. 
    // We only need the current one.
    var current = event.resultIndex;
  
    // Get a transcript of what was said.
    var transcript = event.results[current][0].transcript;
    transcript = transcript.trim();
    console.log(transcript);
    jQuery.ajax({
      type: "POST",
      dataType: "JSON",
      url: "https://api.dialogflow.com/v1/query",
      qs: { v: '20150910' },
      headers: { 
          'cache-control': 'no-cache',
          authorization: 'Bearer '+'2f1667eb74634f249ebf236c6992e593',
          'content-type': 'application/json'
      },
          data: JSON.stringify({ 
            lang: 'en',
            query: transcript,
          sessionId: 12345}),

        error: function(error) {
        console.log(error)
          console.log("Internal Server Error");
      },
      success: function(result) {
        console.log(result)
        if(result.result.action == "input.welcome")
        {
          console.log("welcome intent")
          console.log("song playing");
          playAudio(yodelBuffer)
        }
        if(result.result.action == "breakfast")
        {
          console.log("breakfast  intent")
          console.log("song playing");
          playAudio(BreakfastIntentBuffer)
        }
        if(result.result.action == "Lunch")
        {
          console.log("lunch intent")
          console.log("song playing");
          playAudio(LunchIntentbuffer)
        }
      //  console.log(result.result.speech)
          // $("#div").html(result.queryResult.fulfillmentText);
          console.log("sucess")
      }  ,
          dataType: "JSON",

    
  }); 
    if (document.getElementById(transcript.toString())) {
        document.getElementById(transcript).scrollIntoView(true);
    }
    // Add the current transcript to the contents of our Note.
    // There is a weird bug on mobile, where everything is repeated twice.
    // There is no official solution so far so we have to handle an edge case.
    transcript = "";
    var mobileRepeatBug = (current == 1 && transcript == event.results[0][0].transcript);
  
    // if(!mobileRepeatBug) {
    //   noteContent += transcript;
    //   noteTextarea.val(noteContent);
    // }
  };
  
  recognition.onstart = function() { 
    // instructions.text('Voice recognition activated. Try speaking into the microphone.');
    console.log("Voice recognition activated. Try speaking into the microphone.");
  }
   
  // recognition.onspeechend = function() {
  //   instructions.text('You were quiet for a while so voice recognition turned itself off.');
  // }
  
  recognition.onerror = function(event) {
    if(event.error == 'no-speech') {
    //   instructions.text('No speech was detected. Try again.');
    console.log("No speech was detected. Try again.")
    };
  }
  
  
  
  /*-----------------------------
        App buttons and input 
  ------------------------------*/
  
  // $('#start-record-btn').on('click', function(e) {
    if (noteContent.length) {
      noteContent += ' ';
    }
    // recognition.start();
  // });
  
  
//   $('#pause-record-btn').on('click', function(e) {
//     recognition.stop();
//     instructions.text('Voice recognition paused.');
//   });
  
  // Sync the text inside the text area with the noteContent variable.
//   noteTextarea.on('input', function() {
//     noteContent = $(this).val();
//     console.log("hello");
//   })
  
  
  
  /*-----------------------------
        Speech Synthesis 
  ------------------------------*/
  
  function readOutLoud(message) {
      var speech = new SpeechSynthesisUtterance();
  
    // Set the text and voice attributes.
      speech.text = message;
      speech.volume = 1;
      speech.rate = 1;
      speech.pitch = 1;
    
      window.speechSynthesis.speak(speech);
  }
  
  