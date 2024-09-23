
/*
Created by: Thirumohan & Team
Date: Jan 2018
*/
var volumeToggle = true
var pausePlay = 'pause'
var playBack
var touchPageX = 0
var ccObj = null
var dragStatus = ''
var strictNavigation = false
var mediaDuration; //slidertimer
/*document.addEventListener("visibilitychange", function() {
  if(document.visibilityState == 'visible'){
    browserMinimize = false
    if (tweenTimeline) {
         tweenTimeline.play()
    }

    currentMedia.play();
  }else{
    browserMinimize = true;

    if (tweenTimeline) {
         tweenTimeline.pause()
    }

    currentMedia.pause();
  }

  playBack.checkPlayPause();
  console.log(document.hidden, document.visibilityState);
}, false);*/



function wndsize(){
  var w = 0;var h = 0;
  //IE
  if(!window.innerWidth){
    console.log("width:",window.innerWidth)
    if(!(document.documentElement.clientWidth == 0)){
      //strict mode
      w = document.documentElement.clientWidth;h = document.documentElement.clientHeight;
    } else{
      //quirks mode
      w = document.body.clientWidth;h = document.body.clientHeight;
    }
  } else {
    //w3c
    w = window.innerWidth;h = window.innerHeight;
  }
  return {width:w,height:h};
   wndsize();
}
var PlaybackView = function() {
     playBack = this
     this.events_Obj = []
     this.audioSync = false
     currentMedia = document.getElementById('courseAudio')
     this.initPlayBack()
     scrubberWidth = $('#f_scrubber').outerWidth()

}

PlaybackView.prototype.initPlayBack = function() {

     volumeBtn = $('#f_volumeBtn').off('click mouseenter mouseleave').on('click mouseenter mouseleave', this.volumeBtnClicked)
     mediaBtn = $('#f_mediaBtn').off('click mouseenter mouseleave').on('click mouseenter mouseleave', this.mediaBtnClicked)
     scrubber = $('#f_scrubber')
     playbackProgress = $('#f_progress')
     playbackProgress.css({
          width: 0
     })
     scrubber.off('mousedown').on('mousedown', this.scrubberDown)
     scrubber.off('touchstart').on('touchstart', this.scrubberDown)
}



PlaybackView.prototype.removePlayBackListener = function() {
     volumeBtn.off('click mouseenter mouseleave');
     mediaBtn.off('click mouseenter mouseleave');
     playbackProgress.css({
          width: 0
     })
     scrubber.off('mousedown')
     scrubber.off('touchstart')

     volumeBtn.css({
          'opacity': 0.5,
          "cursor": "default"
     })
     mediaBtn.css({
          'opacity': 0.5,
          "cursor": "default"
     })
     currentMedia.src = ''
     mediaBtn.removeClass('f_pause').removeClass('f_replay').addClass('f_play')
}


PlaybackView.prototype.pauseMedia = function() {
     if (tweenTimeline) {
          tweenTimeline.pause()
     }
     currentMedia.pause()
}

PlaybackView.prototype.startPlayback = function(_src, obj, _audioSync, _restriction, _videoId) {
     ccObj = null
     ccObj = obj
     strictNavigation = _restriction

     this.audioSync = _audioSync
     volumeBtn.off('click mouseenter mouseleave')
     mediaBtn.off('click mouseenter mouseleave')
     playbackProgress.css({
          width: 0
     })
     scrubber.off('mousedown')
     scrubber.off('touchstart')

     volumeBtn.css({
          'opacity': 0.5
     })
     mediaBtn.css({
          'opacity': 0.5
     })

     currentMedia.src = ''

     var src = _src
        if (_videoId != null) {
			$('.slidertimer').text('00:00 / 00:00');
            src = ''
            currentMedia = document.getElementById(_videoId)
            src = $('#' + _videoId).attr('src')

            currentMedia.src = src
            currentMedia.load()
            currentMedia.addEventListener('loadeddata', this.mediaLoaded)
        } else {
            if(src != null){
				$('.slidertimer').text('00:00 / 00:00');
                currentMedia = document.getElementById('courseAudio')
                currentMedia.src = src
                currentMedia.load()
                currentMedia.addEventListener('loadeddata', this.mediaLoaded)
            }else{
				$('.slidertimer').hide().text('00:00 / 00:00');
                if(!_isKnowledgeCheck){
                    if (!strictNavigation) {
                        playBack.dispatchCustomEvent('pagecompleted')
                    }
                }
            }
        }

		if(src != null){
			setTimeout(function(){
				$('.slidertimer').show();
			}, 400)
		}



}
PlaybackView.prototype.mediaLoaded = function(e) {
     volumeBtn.css({
          'opacity': 1,
          "cursor": "pointer"
     })
     mediaBtn.css({
          'opacity': 1,
          "cursor": "pointer"
     })
     volumeBtn.off('click mouseenter mouseleave').on('click mouseenter mouseleave', playBack.volumeBtnClicked)

     mediaBtn.off('click mouseenter mouseleave').on('click mouseenter mouseleave', playBack.mediaBtnClicked)
     scrubber.off('mousedown').on('mousedown', playBack.scrubberDown)
     scrubber.off('touchstart').on('touchstart', playBack.scrubberDown)
     currentMedia.removeEventListener('loadeddata', playBack.mediaLoaded)
     currentMedia.addEventListener('timeupdate', playBack.updatePlaybackTime)
     currentMedia.addEventListener('ended', playBack.mediaEnded)

     playBack.dispatchCustomEvent('ready')
     pausePlay = 'play'
     playBack.checkPlayPause()
}

PlaybackView.prototype.volumeBtnClicked = function(e) {
     navOver(e.type, "f_volumeBtn")
     if (e.type == "click") {
          if (volumeToggle) {
               currentMedia.volume = 0
               volumeBtn.removeClass('f_unmute').addClass('f_mute')
               volumeToggle = false
          } else {
               currentMedia.volume = 1
               volumeBtn.removeClass('f_mute').addClass('f_unmute')
               volumeToggle = true
          }
     }
}

PlaybackView.prototype.mediaBtnClicked = function(e) {
     navOver(e.type, "f_mediaBtn")
     if (e.type == "click") {
          switch (pausePlay) {
               case 'play':
                    pausePlay = 'pause'
                    break
               case 'pause':
                    pausePlay = 'play'
                    break
               case 'replay':
                    playBack.dispatchCustomEvent('pageprogress')
                    currentMedia.currentTime = 0
                    pausePlay = 'play'
                    break
          }
          playBack.checkPlayPause()
     }
}
PlaybackView.prototype.checkPlayPause = function() {
     switch (pausePlay) {
          case 'play':
               if (tweenTimeline) {
                    tweenTimeline.play()
               }
               currentMedia.play();
               mediaBtn.removeClass('f_play').removeClass('f_replay').addClass('f_pause')
               break
          case 'pause':
               if (typeof tweenTimeline !== 'undefined') {
                    tweenTimeline.pause()
               }

               currentMedia.pause()
               mediaBtn.removeClass('f_pause').addClass('f_play')
               break
     }
}

PlaybackView.prototype.scrubberDown = function(e) {
     var _x = 0
     var parentX = parseInt(scrubber.parent().offset().left)
     var childMargin = scrubber.css('margin-left')
     var childX = parseInt(childMargin.substr(0, childMargin.length - 2))
     var currentX = parentX + childX

     dragStatus = pausePlay

     if (e.originalEvent.touches) {
          touch = e.originalEvent.touches[0]
          playBack.updateProgressbar(touch.pageX)
          touchPageX = touch.pageX
          $(document).off('touchmove').on('touchmove', playBack.scrubberMousemove)
          $(document).off('touchend').on('touchend', playBack.scrubberUp)
          _x = Math.round(touchPageX - currentX)
     } else {
          playBack.updateProgressbar(e.pageX)
          $(document).mousemove(playBack.scrubberMousemove)
          $(document).off('mouseup').on('mouseup', playBack.scrubberUp)
          _x = Math.round(e.pageX - currentX)
     }
     currentMedia.pause()
     currentMedia.currentTime = (_x / scrubberWidth) * currentMedia.duration

     if (currentMedia.currentTime >= currentMedia.duration) {} else {
          if (pausePlay == 'replay') {
               playBack.dispatchCustomEvent('pageprogress')
               if (dragStatus == 'play') {
                    pausePlay = 'play'
                    mediaBtn.removeClass('f_play').removeClass('f_replay').addClass('f_pause')
               } else {
                    pausePlay = 'pause'
                    mediaBtn.removeClass('f_pause').removeClass('f_replay').addClass('f_play')
               }
          }
     }

     playBack.ccTextView()
}

PlaybackView.prototype.scrubberUp = function(e) {
     e.stopPropagation()
     var _x = 0
     var parentX = parseInt(scrubber.parent().offset().left)
     var childMargin = scrubber.css('margin-left')
     var childX = parseInt(childMargin.substr(0, childMargin.length - 2))
     var currentX = parentX + childX

     if (e.originalEvent.touches) {
          touch = e.originalEvent.touches[0]
          $(document).off('touchmove', playBack.scrubberMousemove)
          $(document).off('touchend', playBack.scrubberUp)
          _x = Math.round(touchPageX - currentX)
     } else {
          $(document).off('mousemove', playBack.scrubberMousemove)
          $(document).off('mouseup', playBack.scrubberUp)
          _x = Math.round(e.pageX - currentX)
     }
     currentMedia.currentTime = (_x / scrubberWidth) * currentMedia.duration

     playBack.checkPlayPause()
}

PlaybackView.prototype.scrubberMousemove = function(e) {
     var _x = 0
     var parentX = parseInt(scrubber.parent().offset().left)
     var childMargin = scrubber.css('margin-left')
     var childX = parseInt(childMargin.substr(0, childMargin.length - 2))
     var currentX = parentX + childX

     if (e.originalEvent.touches) {
          touch = e.originalEvent.touches[0]
          playBack.updateProgressbar(touch.pageX)
          touchPageX = touch.pageX
          _x = Math.round(touchPageX - currentX)
     } else {
          playBack.updateProgressbar(e.pageX)
          _x = Math.round(e.pageX - currentX)
     }

     currentMedia.currentTime = (_x / scrubberWidth) * currentMedia.duration

     if (currentMedia.currentTime >= currentMedia.duration) {} else {
          if (pausePlay == 'replay') {
               playBack.dispatchCustomEvent('pageprogress')
               if (dragStatus == 'play') {
                    pausePlay = 'play'
                    mediaBtn.removeClass('f_play').removeClass('f_replay').addClass('f_pause')
               } else {
                    pausePlay = 'pause'
                    mediaBtn.removeClass('f_pause').removeClass('f_replay').addClass('f_play')
               }
          }
     }

     playBack.ccTextView()
}

function slidertimer(ct, dt){

	var time = currentMedia.currentTime;
	var minutes = Math.floor(time / 60);
	var seconds = Math.floor(time % 60);
		minutes = String(minutes).length ==1?"0"+minutes:minutes;
		seconds = String(seconds).length ==1?"0"+seconds:seconds;
	var finalTime = minutes+':'+seconds+' / ';
	//var finalTime = String(time.toFixed(2))+' / ';;

	minutes = Math.floor(dt / 60);
	 seconds = Math.floor(dt % 60);
	 minutes = String(minutes).length ==1?"0"+minutes:minutes;
	seconds = String(seconds).length ==1?"0"+seconds:seconds;
	 finalTime += minutes+':'+seconds;
	return finalTime;
}

PlaybackView.prototype.updateProgressbar = function(_x) {
     var parentX = parseInt(scrubber.parent().offset().left)
     var childMargin = scrubber.css('margin-left')
     var childX = parseInt(childMargin.substr(0, childMargin.length - 2))
     var currentX = parentX + childX

     var _width = Math.round(_x - currentX)

     if (_width <= 0) {
          _width = 0
     }

     if (scrubberWidth <= _width) {
          _width = scrubberWidth
     }
     playbackProgress.css({
          width: _width
     })
     playBack.ccTextView()
}

PlaybackView.prototype.updatePlaybackTime = function() {

	var finalTime = slidertimer(currentMedia.currentTime, currentMedia.duration);
	$('.slidertimer').text(finalTime);

     var progressWidth = Math.round((currentMedia.currentTime / currentMedia.duration) * scrubberWidth)
     playbackProgress.css({
          width: progressWidth
     })
     playBack.ccTextView()

     // update seekbar from tweenMax
     if (playBack.audioSync)
          updateCurrentTime(currentMedia.currentTime)
}

PlaybackView.prototype.mediaEnded = function() {
	console.log("MediaEnded");
     if (!strictNavigation) {
		console.log("MediaEnded 2");
          playBack.dispatchCustomEvent('pagecompleted')
     }

     pausePlay = 'replay'
     mediaBtn.removeClass('f_play').removeClass('f_pause').addClass('f_replay')
}

PlaybackView.prototype.ccTextView = function() {
     for (var i = 0; i < ccObj.length; i++) {
          var startTime = ccObj[i].startTime
          var endTime = ccObj[i].endTime
          if (startTime <= currentMedia.currentTime && endTime >= currentMedia.currentTime) {
               $('#f_ccContainer').find('p').html(ccObj[i].text)
          }
     }
}

PlaybackView.prototype.showCCText = function() {
     if (ccObj != null) {
          $('#f_ccContainer').css({
               'display': 'block'
          })
     }
}
PlaybackView.prototype.hideCCText = function() {
     $('#f_ccContainer').css({
          'display': 'none'
     })
}

PlaybackView.prototype.addCustomEvent = function(evet, callback) {
     this.events_Obj.push({
          'eventName': evet,
          'funcCallBack': callback
     })
}

PlaybackView.prototype.dispatchCustomEvent = function(arg) {
     for (var i = 0; i < this.events_Obj.length; i++) {
          if (this.events_Obj[i].eventName == arg) {
               this.events_Obj[i].funcCallBack()
               break
          }
     }
}

function enableNextForKC(){
    if (!strictNavigation) {
        playBack.dispatchCustomEvent('pagecompleted')
    }

}
