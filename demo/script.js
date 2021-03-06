const messEl = document.querySelector('.message');
//const videoEl = document.querySelector('#video');
let videoEl = null;
const muteEl = document.querySelector('#mute');
const subtitleEl = document.querySelector('#subtitle');
const micEl = document.querySelector('#mic');
const countEl = document.querySelector('#counter');
const timeEl = document.querySelector('#time');
let textTrack = null; 
let cue = null;




let interval = null;


const createVideo = (parentEl, src) => {
  videoEl = document.createElement('video');
  videoEl.id = 'video';
  videoEl.muted = false;
  videoEl.autoplay = true;

  const sourceEl = document.createElement('source');
  sourceEl.src = `${src}_sd.mp4`;
  sourceEl.type= "video/mp4";
  videoEl.appendChild(sourceEl);

  const trackEl = document.createElement('track');
  trackEl.kind = "metadata";
  //trackEl.src = `${src}.vtt`;
  trackEl.src = `${src}.txt`;
  trackEl.srclang = "ru";
  trackEl.label = "Russian";
  trackEl.default = true;
  videoEl.appendChild(trackEl);

  parentEl.appendChild(videoEl);

  

  videoEl.addEventListener('loadedmetadata', () => {
    // let track = videoEl.addTextTrack("captions", "Russina", "ru");
    // track.addCue(new VTTCue(0, 3, "[Test1]"));
    // track.addCue(new VTTCue(3, 6, "[Test2]"));
    //track.mode = "showing";

    textTrack = videoEl.textTracks[0]; 
    cue = textTrack.cues[0];
    textTrack.oncuechange = () => {
      const cue = textTrack.activeCues[0]; // assuming there is only one active cue
      if (cue) {
          subtitleEl.innerText = cue.text;
      }
    }
    console.log('loaded');
      findCapter('Hello', (cue) => {
        videoEl.currentTime = cue.end;
        console.log(cue);
        videoEl.play();
      });
      //videoEl.play();
  });

  

  videoEl.addEventListener('click', (e) => {
    if (videoEl.paused) {
        videoEl.play();
    } else {
        videoEl.pause();
    }
  });

  videoEl.addEventListener('timeupdate', (e) => {
    // if (e.target.currentTime >= 6) {
    //   //videoEl.pause();
    // }

    countEl.innerText = e.target.currentTime;
  });

  // videoEl.addEventListener('loadstart', (e) => { 
  //   // videoEl.play();
  //   console.log('loaded');
  //   findCapter('Hello', (cue) => {
  //     videoEl.currentTime = cue.end;
  //     console.log(cue);
  //     videoEl.play();
  //   });
  // });

  videoEl.addEventListener('play', (e) => { 
      interval = setInterval(() => {
      }, 1000);
  });

  videoEl.addEventListener('ended', (e) => { 
      //subtitleEl.innerText = null;
      clearInterval(interval);
  });
  
};




const findCapter = (id, cb) => {
  textTrack = videoEl.textTracks[0]; 
  console.log(textTrack.cues);
  for(let cue of textTrack.cues) {
    if (cue.id === id) {
      cb({ text: cue.text, start: cue.startTime, end: cue.endTime });
    }
  }
};


micEl.addEventListener('click', (e) => {
    toggleStartStop();
 });
muteEl.addEventListener('click', (e) => {
    if (videoEl.muted) {
        videoEl.muted = false;
        muteEl.classList.add('fa-volume-up');
        muteEl.classList.remove('fa-volume-mute');
    } else {
        videoEl.muted = true;
        muteEl.classList.remove('fa-volume-up');
        muteEl.classList.add('fa-volume-mute');
    }
});

// document.addEventListener('click', () => {
//   setTimeout(() => {
//     createVideo(messEl, './video/elena_4');
//   }, 3000);
// });

createVideo(messEl, '../data/video/vacation/vacation_1.10');

const getTime = (duration = 0, current = 0) => {
    const remind = duration - current;
    const remindMins = parseInt(remind / 60).toString().padStart(2, "0");
    const remindSecs = parseInt(remind % 60).toString().padStart(2, "0");
    return `${remindMins}:${remindSecs}`
};

var recognizing;
var recognition = new webkitSpeechRecognition();
recognition.continuous = true;
reset();
recognition.onend = reset();

recognition.onresult = function (event) {
  for (var i = event.resultIndex; i < event.results.length; ++i) {
    if (event.results[i].isFinal) {
      textarea.value += event.results[i][0].transcript;
    }
  }
}

function reset() {
  recognizing = false;
  //button.innerHTML = "Click to Speak";
}

function toggleStartStop() {
  if (recognizing) {
    recognition.stop();
    reset();
  } else {
    recognition.start();
    recognizing = true;
    button.innerHTML = "Click to Stop";
  }
}