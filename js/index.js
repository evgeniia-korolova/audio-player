import { data } from './data.js';

const player = document.querySelector('.wrapper'),
    prevBtn = document.querySelector('.prev'),
    forwardBtn = document.querySelector('.forward'),
    playBtn = document.querySelector('.play'),
    pauseBtn = document.querySelector('.pause'),
    audio = document.querySelector('.audio'),
    //   progressContainer = document.querySelector('.progress__container'),
    progressBar = document.querySelector('.progress-bar'),
    artistName = document.querySelector('.artist-name'),
    trackName = document.querySelector('.track-name'),
    cover = document.querySelector('.cover__img'),
    currentTime = document.querySelector('.current-time'),
    trackDuration = document.querySelector('.track-duration'),
    imgSrc = document.querySelector('.img__src'),
    inputVolume = document.querySelector('.input-volume'),
    repeat = document.querySelector('.handling__repeat'),
    shuffle = document.querySelector('.handling__shuffle'),
    background = document.getElementById('background');

console.log(data);

let currentTrack = 0;

const formatTime = (time) => {
    let min = Math.floor(time / 60);
    if (min < 10)  min = `0${min}` ;

    let sec = Math.floor(time % 60);
    if (sec < 10)  sec = `0${sec}`;

    return `${min} : ${sec}`
};



const setTrack = (i) => {

    progressBar.value = 0;

    
    let currentSong = data[i];
    console.log(currentSong)

    cover.src = currentSong.cover;
    audio.src = currentSong.audio;
    artistName.innerHTML = currentSong.artistName;
    trackName.innerHTML = currentSong.trackName;
    background.src = currentSong.cover;

    

    setTimeout(() => {

        currentTime.innerHTML = '00 : 00';

       trackDuration.innerHTML = formatTime(audio.duration);
        progressBar.max = audio.duration; 
         console.log(formatTime(audio.duration));     

    }, 300)
    
    audio.volume = inputVolume.value / 100;

}

setTrack(currentTrack);

playBtn.onclick = () => {
    audio.play();
    playBtn.classList.add('hidden');
    pauseBtn.classList.remove('hidden');
}

pauseBtn.onclick = () => {
    audio.pause();
    playBtn.classList.remove('hidden');
    pauseBtn.classList.add('hidden');
}

inputVolume.addEventListener('input', () => {
     audio.volume = inputVolume.value / 100;
})

const playMusic = () => {
    audio.play();
    playBtn.classList.add('hidden');
    pauseBtn.classList.remove('hidden');
}

prevBtn.onclick = () => {
    if (currentTrack <= 0) currentTrack = data.length - 1
    
    else currentTrack --;

    setTrack(currentTrack);
    playMusic();
    // playBtn.click();
}

forwardBtn.onclick = () => {
    if (currentTrack >= data.length - 1) currentTrack = 0;
    else currentTrack ++;

    setTrack(currentTrack);
    playMusic();
    // playBtn.click();
};

setInterval(() => {
    progressBar.value = audio.currentTime;
    currentTime.innerHTML = formatTime(audio.currentTime);
    if (Math.floor(audio.currentTime) == Math.floor(progressBar.max)) {
       forwardBtn.click(); 
    }
   
}, 500);

progressBar.addEventListener('change', () => {
    audio.currentTime = progressBar.value;
})

