const playSection = document.querySelector('.play-section');
const musicTitle = document.getElementById('music-title');
const musicTimer = document.getElementById('musictimer');
const currTime = document.getElementById('currTime')
const musicLength = document.getElementById('musicLength')
const cardContainer = document.querySelector('.cardcontainer');
const loopBtn = document.getElementById('loop-music')

const prev = document.getElementById('prev')
const toggleplay = document.getElementById('toggleplay')
const next = document.getElementById('next')
const currMusic = document.getElementById('audio');

let allsongs = songs;
let currentSong = 0;

toggleplay.addEventListener('click',()=>{
    let state = toggleplay.classList.contains('play');
    if(state){
        toggleplay.classList.remove('play');
        toggleplay.innerHTML = `<i class="fa-regular fa-circle-play"></i>`
        currMusic.pause();
    }
    else{
        toggleplay.classList.add('play');
        toggleplay.innerHTML = `<i class="fa-regular fa-circle-pause"></i>`
        currMusic.play();
    }
})

function resetState(){
    currentSong = 0;
}


function playSong(){
    console.log("play");

    
    let songdata = songs[currentSong];
    musicTitle.textContent = songdata.name;
    currMusic.src = `/medispot/songs/${songdata.musicNo}/${songdata.audioSrc}.mp3`

    currTime.textContent = '00 : 00'
    setTimeout(()=>{
        musicTimer.max = currMusic.duration;
        musicLength.textContent = setTime(currMusic.duration);
    },100)
    toggleplay.classList.add('play');
    toggleplay.innerHTML = `<i class="fa-regular fa-circle-pause"></i>`
    currMusic.play();
}


function setTime(time){
    if(!time){
        return `-- : --`
    }
    let min = Math.floor(time/60);
    if(min < 10){
        min = `0${min}`
    }
    let sec = Math.floor(time % 60);
    if(sec < 10){
        sec = `0${sec}`
    }
    return `${min} : ${sec}`
}

setInterval(()=>{
    musicTimer.value = currMusic.currentTime;
    currTime.textContent = setTime(currMusic.currentTime)
},500)

musicTimer.addEventListener('change',()=>{
    currMusic.currentTime = musicTimer.value
})


next.addEventListener('click',()=>{
    if(currentSong >= songs.length - 1){
        currentSong = 0;
    }
    else{
        currentSong = currentSong + 1;
    }
    playSong();
    return;
})
prev.addEventListener('click',()=>{
    if(currentSong <= 0){
        currentSong = songs.length - 1;
    }
    else{
        currentSong = currentSong - 1;
    }
    playSong();
    return;
})

function main(){
    let cardsHtml = songs.map(song => {
        return `
        <div class="card p-0 col-5 col-sm-5 col-lg-2" data-id=${song.sn} onclick="playMusic(${song.sn})">
        <i class="fa-solid fa-circle-play hoverplay"></i>
            <img src="/medispot/songs/${song.musicNo}/cover.jpg" class="card-img-top" alt="Cover Image">
            <div class="card-body">
            <h5 class="card-title">${song.name}</h5>
            <p class="card-text">${song.description}</p>
            </div>
        </div>
        `
    }).join('');

    loopBtn.addEventListener('click',()=>{
        if(currMusic.loop){
            currMusic.loop = false;
            loopBtn.style.color = "grey"
        }
        else{
            currMusic.loop = true;
            loopBtn.style.color = "blue"
        }
    })

    cardContainer.innerHTML = cardsHtml;

    let songdata = songs[currentSong];
    musicTitle.textContent = songdata.name;
    currMusic.src = `/medispot/songs/${songdata.musicNo}/${songdata.audioSrc}.mp3`

    currTime.textContent = '00 : 00'
    setTimeout(()=>{
        musicTimer.max = currMusic.duration;
        console.log(currMusic);
        musicLength.textContent = setTime(currMusic.duration);
    },200)

}
main();

function playMusic(songId){
    currentSong = parseInt(songId);
    playSong();
}

function filterSongs(){
    console.log("filter ");
    let ipvalue = document.getElementById('searchsong').value;
    songs = allsongs.filter(song => {
        return ((song.name+" "+song.description).toLowerCase()).includes(ipvalue.toLowerCase());
    })
    let cardsHtml = songs.map(song => {
        return `
        <div class="card p-0 col-5 col-sm-5 col-lg-2" data-id=${song.sn} onclick="playMusic(${song.sn})">
        <i class="fa-solid fa-circle-play hoverplay"></i>
            <img src="/medispot/songs/${song.musicNo}/cover.jpg" class="card-img-top" alt="Cover Image">
            <div class="card-body">
            <h5 class="card-title">${song.name}</h5>
            <p class="card-text">${song.description}</p>
            </div>
        </div>
        `
    }).join('');
    cardContainer.innerHTML = cardsHtml;
}
