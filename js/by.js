var albumImg = document.querySelector('.album img');
var musicName = document.querySelector('.music-name');
var audio = document.querySelector('audio');
var playMusic = document.querySelector('.play');
var prevMusic = document.querySelector('.prev');
var nextMusic = document.querySelector('.next');
var musicTime = document.querySelector('.music-time');
var circle = document.querySelector('.circle');
var moveBar = document.querySelector('.move-bar');
var musicBarBox = document.querySelector('.music-bar-box');
var musicOrder = document.querySelector('.music-order');
var musicVolume = document.querySelector('.music-volume');
var musicList = document.querySelector('.music-list');
var listText = document.querySelector('.list-text');
var volumeBox = document.querySelector('.volume-bar-box');
var volumeBar = document.querySelector('.volume-bar');
var volumeCircle = document.querySelector('.volume-circle');
var volumeMove = document.querySelector('.volume-move-bar');
var musicMute = document.querySelector('.music-mute');
var inp = document.querySelector('input');
var searchBox = document.querySelector('.search');
var searchResult = document.querySelector('.search-result');

var index = 0;
var timer = null;
var imgDeg = 0;
var clickOrder = 0;
var muteFlag = false;
var count = 0;

function forTime(time) {
    var minute = Math.floor(time / 60);
    var seconds = Math.floor(time % 60);
    return {
        m: minute = minute >= 10 ? minute : '0' + minute,
        s: seconds = seconds >= 10 ? seconds : '0' + seconds
    }
}

function init(obj) {
    albumImg.src = obj.album;
    musicName.innerHTML = obj.songTitle + ' ----- ' + obj.singer;
    audio.src = obj.src;
    listText.innerHTML = (index + 1) + '/' + data.length;
}

init(data[index]);

function randomNum() {
    var num = Math.floor(Math.random() * data.length);
    if (num === index) {
        num = randomNum();
    }
    return num;
}

function bPosition(obj, x, y) {
    obj.style.backgroundPositionX = x + 'px';
    obj.style.backgroundPositionY = y + 'px';
}

function startMusic() {
    audio.play();
    clearInterval(timer);
    timer = setInterval(function () {
        imgDeg++;
        albumImg.style.transform = 'rotate(' + imgDeg + 'deg)';
    }, 50);
}

function stopMusic() {
    audio.pause();
    clearInterval(timer);
    bPosition(playMusic, -193, -206);
}

function controlMusic(flag) {
    if (clickOrder === 2) {
        index = randomNum();
    } else {
        index = flag ? ++index > data.length - 1 ? 0 : index : --index < 0 ? data.length - 1 : index;
    }
    imgDeg = 0;
    otherPlay();
}

function otherPlay() {
    init(data[index]);
    startMusic();
    bPosition(playMusic, -1, -167);
}
function countNum(obj,flag) {
    count = flag?++count > obj.length? 1:count:--count<=0?obj.length:count;
    for(var i=0;i<obj.length;i++){
        obj[i].className = '';
        obj[i].style.backgroundColor = '#270100';
    }
    obj[count-1].style.backgroundColor = '#9EDCB5';
    obj[count-1].className = 'active';
}
document.addEventListener('keyup', function (e) {
    var ev = e || window.event;
    switch (ev.keyCode) {
        case 13:
            if(searchResult.innerHTML === '') {
                inp.focus();
            }
            break;
        case 37:
            controlMusic(false);
            break;
        case 39:
            controlMusic(true);
            break;
        case 32:
            searchResult.innerHTML = '';
            if (audio.paused) {
                startMusic();
                bPosition(playMusic, -1, -167);
            } else {
                stopMusic();
                bPosition(playMusic, -153, -206);
            }
            break;
    }
    if(searchResult.innerHTML !== ''){
        var lis = searchResult.getElementsByTagName('li');
        if(ev.keyCode === 40){
            countNum(lis,true);
        }else if(ev.keyCode === 38){
            countNum(lis,false);
        }else if(ev.keyCode === 13){
            var li = document.getElementsByClassName('active')[0];
            console.log(li);
            index = li.getAttribute('data-index')-0;
            otherPlay();
            searchResult.innerHTML = '';
        }
    }
});
inp.addEventListener('focus', function () {
    count = 0;
    searchResult.innerHTML = '';
    this.value = '';
    this.addEventListener('keyup', function (e) {
        var ev = e || window.event;
        if (ev.keyCode === 13) {
            var text = this.value;
            if (!/[\D]/.test(text) && text > 0 && text <= data.length) {
                index = parseInt(text) - 1;
                init(data[index]);
                startMusic();
                bPosition(playMusic, -1, -167);
            } else {
                var flag = true;
                // var arr = text.split('');
                var songArr = [];
                var indexArr = [];
                searchResult.innerHTML = '';
                for (var i = 0; i < data.length; i++) {
                    var music = data[i].songTitle;
                    var singer = data[i].singer;
                    // for (var j = 0; j < arr.length; j++) {
                    if (music.search(text) !== -1 || singer.search(text) !== -1) {
                        songArr.push(singer + '---' + music);
                        indexArr.push(i);
                        // break;
                    }
                    // }
                }
                for (var k = 0; k < songArr.length; k++) {
                    var li = document.createElement('li');
                    li.innerHTML = songArr[k];
                    li.setAttribute('data-index', indexArr[k]);
                    searchResult.appendChild(li);
                }
            }
            inp.blur();
        }
        ev.stopPropagation();
    });
});
searchResult.addEventListener('click', function (e) {
    var ev = e || window.event;
    var target = ev.target || ev.srcElement;
    index = target.getAttribute('data-index');
    otherPlay();
    ev.stopPropagation();
});

musicOrder.addEventListener('click', function () {
    clickOrder++;
    clickOrder = clickOrder > 2 ? 0 : clickOrder;
    if (clickOrder === 1) {
        bPosition(this, -91, 276);
    } else if (clickOrder === 2) {
        bPosition(this, -91, 372);
    } else {
        bPosition(this, -31, 276);
    }
});
musicOrder.addEventListener('mouseenter', function () {
    if (clickOrder === 1) {
        bPosition(this, -91, 276);
    } else if (clickOrder === 2) {
        bPosition(this, -91, 372);
    } else {
        bPosition(this, -31, 276);
    }
});
musicOrder.addEventListener('mouseleave', function () {
    if (clickOrder === 1) {
        bPosition(this, -64, 276);
    } else if (clickOrder === 2) {
        bPosition(this, -64, 372);
    } else {
        bPosition(this, -1, 276);
    }
});
playMusic.addEventListener('click', function () {
    if (audio.paused) {
        startMusic();
        bPosition(this, -41, -167);
    } else {
        stopMusic();
    }
});
prevMusic.addEventListener('click', function () {
    controlMusic(false);
});
nextMusic.addEventListener('click', function () {
    controlMusic(true);
});
playMusic.addEventListener('mouseenter', function () {
    if (audio.paused) {
        bPosition(this, -193, -206);
    } else {
        bPosition(this, -41, -167);
    }
});
playMusic.addEventListener('mouseleave', function () {
    if (audio.paused) {
        bPosition(this, -153, -206);
    } else {
        bPosition(this, -1, -167);
    }
});

musicVolume.addEventListener('click', function (e) {
    var ev = e || window.event;
    searchBox.style.display = 'none';
    volumeBox.style.display = 'block';
    ev.stopPropagation();
});
volumeBox.addEventListener('click', function (e) {
    var ev = e || window.event;
    var voPosition = ev.offsetX;
    if (voPosition > volumeBar.offsetWidth) {
        voPosition = volumeBar.offsetWidth;
    }
    volumeCircle.style.left = voPosition + 'px';
    volumeMove.style.width = voPosition + 'px';
    audio.volume = voPosition / volumeBar.offsetWidth * 1;
    audio.muted = false;
    musicMute.style.backgroundPositionX = '-260px';
    muteFlag = false;
    ev.stopPropagation();
});
volumeCircle.addEventListener('click', function (e) {
    var ev = e || window.event;
    ev.stopPropagation();
});
document.addEventListener('click', function () {
    searchResult.innerHTML = '';
    volumeBox.style.display = 'none';
    if (volumeBox.style.display === 'none') {
        searchBox.style.display = 'block';
    }
});

musicMute.addEventListener('click', function () {
    if (!muteFlag) {
        audio.muted = true;
        this.style.backgroundPositionX = '-282px';
        muteFlag = true;
    } else {
        audio.muted = false;
        this.style.backgroundPositionX = '-260px';
        muteFlag = false;
    }
});

audio.addEventListener('canplay', function () {
    musicTime.innerHTML = '00:00/' + forTime(audio.duration).m + ':' + forTime(audio.duration).s;
    audio.addEventListener('timeupdate', function () {
        musicTime.innerHTML = forTime(audio.currentTime).m + ':' + forTime(audio.currentTime).s + '/' + forTime(audio.duration).m + ':' + forTime(audio.duration).s;
        var movePosition = audio.currentTime / audio.duration * musicBarBox.offsetWidth;
        circle.style.left = movePosition + 'px';
        moveBar.style.width = movePosition + 'px';

        musicBarBox.addEventListener('click', function (e) {
            audio.currentTime = e.offsetX / musicBarBox.offsetWidth * audio.duration;
            console.log(audio.currentTime)
        });
        circle.addEventListener('click', function (e) {
            var ev = e || window.event;
            ev.stopPropagation();
        });
        if (audio.ended) {
            if (clickOrder === 1) {
                index--;
            }
            controlMusic(true);
        }
    })
});

