import { data } from './data.js';

const player = document.querySelector('.player'),
  prevBtn = document.querySelector('.prev'),
  forwardBtn = document.querySelector('.forward'),
  playPauseBtn = document.querySelector('.play-pause'),
  audio = document.querySelector('.audio'),
  progressArea = document.querySelector('.progress__area'),
  progressBar = document.querySelector('.progress-bar'),
  artistName = document.querySelector('.artist-name'),
  trackName = document.querySelector('.track-name'),
  cover = document.querySelector('.cover__img'),
  currentTime = document.querySelector('.current-time'),
  trackDuration = document.querySelector('.track-duration'),
  background = document.querySelector('.background'),
  inputVolume = document.querySelector('.input-volume'),
  volumeBtn = document.querySelector('.volume-btn'),
  
  musicList = document.querySelector('.music-list'),
  moreMusicBtn = document.querySelector('#more-music'),
  closeMoreMusic = document.querySelector('#close'),
  volumeRange = document.querySelector('.volume-range');
 

audio.onloadeddata = function () {
    trackDuration.innerHTML = formatTime(audio.duration);
    formatTime(time);
    setTrack(currentTrack);
    updateProgress()
  };

const formatTime = (time) => {
  let min = Math.floor(time / 60);
  if (min < 10) min = `0${min}`;

  let sec = Math.floor(time % 60);
  if (sec < 10) sec = `0${sec}`;

  return `${min} : ${sec}`;
};

// выбор трека

let currentTrack = 0;

const setTrack = (i) => {
  progressBar.value = 0;

  let currentSong = data[i];

  cover.src = currentSong.cover;
  audio.src = currentSong.audio;
  artistName.innerHTML = currentSong.artistName;
  trackName.innerHTML = currentSong.trackName;
  background.src = currentSong.cover;

  // setTimeout(() => {
  audio.onloadeddata = (() => {
    currentTime.innerHTML = '00 : 00';

    trackDuration.innerHTML = formatTime(audio.duration);
    progressBar.max = audio.duration;
  }, 300);

  audio.volume = inputVolume.value / 100;
};

setTrack(currentTrack);

playPauseBtn.onclick = () => {
  // audio.play();
  const isPlaying = player.classList.contains('play');
  if (isPlaying) {
    pauseMusic();
  } else {
    playMusic();
  }
};

inputVolume.addEventListener('input', () => {
  audio.volume = inputVolume.value / 100;
});

const changeSpeakerBtn = () => volumeBtn.classList.toggle('mute');

// Клик на кнопке вкл/выкл громкости
let currentVolume = 10;

const clickVolume = () => {
  if (inputVolume.value == 0) {
    inputVolume.value = currentVolume;
    audio.volume = inputVolume.value / 100;
    volumeBtn.querySelector('i').innerText = 'volume_down_alt';
  } else {
    currentVolume = inputVolume.value;
    inputVolume.value = 0;
    audio.volume = 0;
    volumeBtn.querySelector('i').innerText = 'volume_off';
  }

  changeSpeakerBtn();
};
volumeBtn.addEventListener('click', clickVolume);

// проигрывание трэка

const playMusic = () => {
  audio.play();
  player.classList.add('play');
  playPauseBtn.querySelector('i').innerText = 'pause';
};

const pauseMusic = () => {
  audio.pause();
  playPauseBtn.querySelector('i').innerText = 'play_arrow';
  // imgSrc.src = './src/icons/play_icon.png';
  player.classList.remove('play');
};

// switch track

function prevTrack() {
  if (currentTrack <= 0) currentTrack = data.length - 1;
  else currentTrack--;

  setTrack(currentTrack);
  playMusic();
}

prevBtn.addEventListener('click', prevTrack);

function nextTrack() {
  if (currentTrack >= data.length - 1) currentTrack = 0;
  else currentTrack++;

  setTrack(currentTrack);
  playMusic();
}

forwardBtn.addEventListener('click', nextTrack);

// progress

function updateProgress(e) {
  const { duration, currentTime } = e.srcElement;
  const progressPercent = (currentTime / duration) * 100;
  progressBar.style.width = `${progressPercent}%`;
}

audio.addEventListener('timeupdate', updateProgress);

// progress перемотка

function setProgress(e) {
  const areaWidth = this.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;

  audio.currentTime = (clickX / areaWidth) * duration;
}

progressArea.addEventListener('click', setProgress);

// autoplay

// audio.addEventListener('ended', nextTrack);

setInterval(() => {
  progressBar.value = audio.currentTime;
  currentTime.innerHTML = formatTime(audio.currentTime);
  if (Math.floor(audio.currentTime) == Math.floor(progressBar.max)) {
    //    forwardBtn.click();
  }
}, 500);

progressBar.addEventListener('change', () => {
  audio.currentTime = progressBar.value;
});

audio.addEventListener('loadeddata', () => {
  // update song total duration
  let mainAdDuration = audio.duration;
  let totalMin = Math.floor(mainAdDuration / 60);
  if (totalMin < 10) {
    //if sec is less than 10 then add 0 before it
    totalMin = `0${totalMin}`;
  }
  let totalSec = Math.floor(mainAdDuration % 60);
  if (totalSec < 10) {
    //if sec is less than 10 then add 0 before it
    totalSec = `0${totalSec}`;
  }
  trackDuration.innerText = `${totalMin} : ${totalSec}`;
});

//change loop, shuffle, repeat icon onclick
const repeatBtn = document.querySelector('#repeat-plist');
repeatBtn.addEventListener('click', () => {
  let getText = repeatBtn.innerText; //getting this tag innerText
  switch (getText) {
    case 'repeat':
      repeatBtn.innerText = 'repeat_one';
      repeatBtn.setAttribute('title', 'Song looped');
      break;
    case 'repeat_one':
      repeatBtn.innerText = 'shuffle';
      repeatBtn.setAttribute('title', 'Playback shuffled');
      break;
    case 'shuffle':
      repeatBtn.innerText = 'repeat';
      repeatBtn.setAttribute('title', 'Playlist looped');
      break;
  }
});

//code for what to do after song ended
audio.addEventListener('ended', () => {
  // we'll do according to the icon means if user has set icon to
  // loop song then we'll repeat the current song and will do accordingly
  let getText = repeatBtn.innerText; //getting this tag innerText
  switch (getText) {
    case 'repeat':
      nextTrack(); //calling nextMusic function
      break;
    case 'repeat_one':
      audio.currentTime = 0; //setting audio current time to 0
      setTrack(currentTrack); //calling loadMusic function with argument, in the argument there is a index of current song
      playMusic(); //calling playMusic function
      break;
    case 'shuffle':
      let randIndex = Math.floor(Math.random() * data.length + 1); //genereting random index/numb with max range of array length
      do {
        randIndex = Math.floor(Math.random() * data.length + 1);
      } while (currentTrack == randIndex); //this loop run until the next random number won't be the same of current musicIndex
      currentTrack = randIndex; //passing randomIndex to musicIndex
      setTrack(currentTrack);
      playMusic();

      break;
  }
});

// show music list onclick of music icon
moreMusicBtn.addEventListener('click', () => {
  musicList.classList.toggle('show');
});
closeMoreMusic.addEventListener('click', () => {
  moreMusicBtn.click();
});

const ulTag = document.querySelector('.track__list');
// // let create li tags according to array length for list
for (let i = 0; i < data.length; i++) {
  //   //let's pass the song name, artist from the array
  let liTag = `<li li-index="${i + 1}">
               <div class="row">
                  <span>${data[i].trackName}</span>
                  <p>${data[i].artistName}</p>
                 </div>
                 
              </li>`;
  ulTag.insertAdjacentHTML('beforeend', liTag);
}
  
  //inserting the li inside ul tag
  // let liAudioDuartionTag = ulTag.querySelector(`#${data[i].id}`);
  // let liAudioTag = ulTag.querySelector(`#${data[i].id}`);

  // liAudioTag.addEventListener('loadeddata', () => {
  //   let duration = liAudioTag.duration;
  //   let totalMin = Math.floor(duration / 60);
  //   let totalSec = Math.floor(duration % 60);
  //   if (totalSec < 10) {
  //     //if sec is less than 10 then add 0 before it
  //     totalSec = `0${totalSec}`;
  //   }
  //   liAudioDuartionTag.innerText = `${totalMin}:${totalSec}`; //passing total duation of song
  //   liAudioDuartionTag.setAttribute('t-duration', `${totalMin}:${totalSec}`); //adding t-duration attribute with total duration value

