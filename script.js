const songName = document.getElementById("song-name");
const bandName = document.getElementById("band-name");
const song = document.getElementById("audio");
const cover = document.getElementById("capa");
const play = document.getElementById("pausar");
const next = document.getElementById("próximo");
const previous = document.getElementById("anterior");
const likeButton = document.getElementById("like");
const currentProgress = document.getElementById("current-progress");
const progressContainer = document.getElementById("progress-container");
const shuffleButton = document.getElementById("embaralhar");
const repeatButton = document.getElementById("repetição");
const songTime = document.getElementById("song-time");
const totalTime = document.getElementById("total-time");


const Friends = {
    songName : "Friends",
    artist : "Chase Atlantic",
    File: "Friends",
    liked: false,
};
const Swim = {
    songName : "Swim",
    artist : "Chase Atlantic",
    File: "Swim",
    liked: true,
};
const Right_Here = {
    songName : "Right Here",
    artist : "Chase Atlantic",
    File: "Right_Here",
    liked: false,
};
let isPlaying = false;
let isShuffled = false;
let repeatOn = false;
const originalPlaylist = JSON.parse(localStorage.getItem("playlist")) ?? [Friends,Swim,Right_Here];
let sortedPlaylist = [...originalPlaylist];
let index = 0;

function playSong(){
    play.querySelector(".bi").classList.remove("bi-play-circle-fill");
    play.querySelector(".bi").classList.add("bi-pause-circle-fill");
    song.play();
    isPlaying = true;
}

function pauseSong(){
    play.querySelector(".bi").classList.add("bi-play-circle-fill");
    play.querySelector(".bi").classList.remove("bi-pause-circle-fill");
    song.pause();
    isPlaying = false;
}

function playPauseDecider(){
    if(isPlaying === true){
        pauseSong();
    }
    else{
        playSong();
    }
}

function likeButtonRender(){
    if (sortedPlaylist[index].liked === true){
        likeButton.querySelector(".bi").classList.remove("bi-heart");
        likeButton.querySelector(".bi").classList.add("bi-heart-fill");
        likeButton.classList.add("button-active");
    } 
    else{
        likeButton.querySelector(".bi").classList.add("bi-heart");
        likeButton.querySelector(".bi").classList.remove("bi-heart-fill");
        likeButton.classList.remove("button-active");
    }
}

function initializeSong(){
    cover.src = `Imagens/${sortedPlaylist[index].File}.jpg`;
    song.src = `Songs/${sortedPlaylist[index].File}.mp3`;
    songName.innerText = sortedPlaylist[index].songName;
    bandName.innerText = sortedPlaylist[index].artist;
    likeButtonRender();
}

function previousSong(){
    if(index === 0){
        index = sortedPlaylist.length - 1;
    }
    else{
        index -= 1;
    }
    initializeSong();
    playSong();
}

function nextSong(){
    if(index === sortedPlaylist.length - 1){
        index = 0;
    }
    else{
        index += 1;
    }
    initializeSong();
    playSong();
}

function updateProgress(){
    const barWidht = (song.currentTime/song.duration)*100;
    currentProgress.style.setProperty("--progress", `${barWidht}%`);
    songTime.innerText = toHHMMSS(song.currentTime);
}

function jumplo(event){
    const Widht = progressContainer.clientWidth;
    const clickPosition = event.offsetX;
    const jumpToTime = (clickPosition/Widht)*song.duration;
    song.currentTime = jumpToTime;
}

function shuffleArray(preShuffleArray){
    const size = preShuffleArray.length;
    let currentIndex = size - 1;
    while(currentIndex > 0){
        let ramdomIndex = Math.floor(Math.random()* size);
        let aux = preShuffleArray[currentIndex];
        preShuffleArray[currentIndex] = preShuffleArray[ramdomIndex];
        preShuffleArray[ramdomIndex] = aux;
        currentIndex -= 1;
    }
}

function shuffleButtonClicked(){
    if(isShuffled === false){
        isShuffled = true;
        shuffleArray(sortedPlaylist);
        shuffleButton.classList.add('button-active');
    }
    else{
        isShuffled = false;
        sortedPlaylist = [...originalPlaylist];
        shuffleButton.classList.remove('button-active');
    }
}

function repeatButtonClicked(){
    if(repeatOn === false){
        repeatOn = true;
        repeatButton.classList.add('button-active'); 
    }
    else{
        repeatOn = false;
        repeatButton.classList.remove('button-active'); 
    }
}

function nextOrRepeat(){
    if(repeatOn === false){
        nextSong();
    }
    else{
        playSong();
    }
}

function toHHMMSS(originalNumber){
    let hours = Math.floor(originalNumber/3600);
    let min = Math.floor((originalNumber - hours * 3600)/60);
    let secs = Math.floor(originalNumber - hours * 3600 - min * 60);

    return `${hours.toString().padStart(2, "0")}:${min
    .toString()
    .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}


function updateTotalTime(){
    totalTime.innerText = toHHMMSS(song.duration);
}

function likeButtonClicked(){
    if(sortedPlaylist[index].liked === false){
        sortedPlaylist[index].liked = true;
    }else{
        sortedPlaylist[index].liked = false;
    }
    likeButtonRender();
    localStorage.setItem( "playlist", JSON.stringify(originalPlaylist));
}


initializeSong();

play.addEventListener("click", playPauseDecider);
previous.addEventListener("click", previousSong);
next.addEventListener("click", nextSong);
song.addEventListener("timeupdate", updateProgress);
song.addEventListener("ended", nextOrRepeat);
song.addEventListener("loadedmetadata", updateTotalTime);
progressContainer.addEventListener("click", jumplo);
shuffleButton.addEventListener("click", shuffleButtonClicked);
repeatButton.addEventListener("click", repeatButtonClicked);
likeButton.addEventListener("click", likeButtonClicked);



