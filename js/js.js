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
var count = 0;
var volumeNum = 20;

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
    inp.value = '';
    otherPlay();
}

function otherPlay() {
    init(data[index]);
    startMusic();
    bPosition(playMusic, -1, -167);
    searchResult.innerHTML = '';
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
function controlVolume(flag) {
    searchBox.style.display = 'none';
    volumeBox.style.display = 'block';
    volumeNum = flag?++volumeNum >= 20 ?20:volumeNum:--volumeNum <= 0 ? 0 : volumeNum;
    audio.volume = volumeNum/20;
    volumeCircle.style.left = volumeNum/20*volumeBar.offsetWidth + 'px';
    volumeMove.style.width = volumeNum/20*volumeBar.offsetWidth + 'px';
    noMuted();
}
function noMuted() {
    audio.muted = false;
    musicMute.style.backgroundPositionX = '-260px';
}
document.addEventListener('keydown', function (e) {
    var ev = e || window.event;
    searchBox.style.display = 'block';
    volumeBox.style.display = 'none';
    if(searchResult.innerHTML !== ''){
        var lis = searchResult.getElementsByTagName('li');
        switch (ev.keyCode) {
            case 40:
                countNum(lis, true);
                break;
            case 38:
                countNum(lis, false);
                break;
            case 37:
                count = 0;
                for(var i=0;i<lis.length;i++){
                    lis[i].className = '';
                    lis[i].style.backgroundColor = '#270100';
                }
                lis[0].className = 'active';
                inp.focus();
                break;
            case 39:
                searchResult.innerHTML = '';
                break;
            case 13:
                var li = document.getElementsByClassName('active')[0];
                index = li.getAttribute('data-index') - 0;
                otherPlay();
                inp.value = li.innerHTML;
                break;
            case 32:
                searchResult.innerHTML = '';
                break;
        }
    }else{
        switch (ev.keyCode) {
            case 13:
                inp.focus();
                break;
            case 37:
                controlMusic(false);
                break;
            case 39:
                controlMusic(true);
                break;
            case 38:
                controlVolume(true);
                break;
            case 40:
                controlVolume(false);
                break;
            case 32:
                if (audio.paused) {
                    startMusic();
                    bPosition(playMusic, -1, -167);
                } else {
                    stopMusic();
                    bPosition(playMusic, -153, -206);
                }
                break;
        }
    }
});
inp.addEventListener('focus', function () {
    this.value = '';
    count = 0;
    this.addEventListener('keydown', function (e) {
        var ev = e || window.event;
        if (ev.keyCode === 13) {
            var text = inp.value;
            var txt = parseInt(text.trim());
            if (/[\d]/.test(text) && txt > 0 && txt <= data.length && txt!==index + 1) {
                index = parseInt(text) - 1;
                otherPlay();
            }else if(/[\D]/.test(text) || text === ''){
                var songArr = [];
                var indexArr = [];
                var searchCount = 0;
                searchResult.innerHTML = '';
                for (var i = 0; i < data.length; i++) {
                    var music = data[i].songTitle;
                    var singer = data[i].singer;
                    if (music.search(text) !== -1 || singer.search(text) !== -1) {
                        songArr.push(singer + '---' + music);
                        indexArr.push(i);
                    }else{
                        searchCount ++;
                        if(searchCount === data.length){
                            inp.value = '没有你搜索的歌曲';
                        }
                    }
                }
                for (var k = 0; k < songArr.length; k++) {
                    var li = document.createElement('li');
                    li.innerHTML = songArr[k];
                    if(k === 0){
                        li.className = 'active';
                    }
                    li.setAttribute('data-index', indexArr[k]);
                    searchResult.appendChild(li);
                }
            }
            inp.blur();
        }else if(ev.keyCode === 40){
            var lis = searchResult.getElementsByTagName('li');
            if (count === 0) {
                countNum(lis, true);
            }
            inp.blur();
        }else if(ev.keyCode === 38){
            inp.blur();
            searchResult.innerHTML = '';
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
searchResult.addEventListener('mouseenter', function () {
    var lis = document.getElementsByTagName('li');
    for(var i=0;i<lis.length;i++){
        lis[i].addEventListener('mouseenter',function (e) {
            var ev = e || window.event;
            for(var j=0;j<lis.length;j++){
                lis[j].style.backgroundColor = '#270100';
            }
            this.style.backgroundColor = '#9EDCB5';
            ev.stopPropagation();
        });
        lis[i].addEventListener('mouseleave',function (e) {
            var ev = e || window.event;
            for(var k=0;k<lis.length;k++){
                lis[k].style.backgroundColor = '#270100';
            }
            count = 0;
        })
    }
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
    volumeNum = audio.volume*20;
    noMuted();
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
    if (!audio.muted) {
        audio.muted = true;
        this.style.backgroundPositionX = '-282px';
    } else {
        noMuted();
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

