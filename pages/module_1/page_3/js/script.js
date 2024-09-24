/*
Created by: Thirumohan & Team
Date: Jan 2018
*/
// ---------- setting start ---------------
var _preloadData, _pageData
var _pagePreloadArray = {
     image: -1,
     audio: -1,
     video: 1,
     data: -1
}; // item not availble please assign value 1.
var jsonSRC = 'pages/module_1/page_3/data/data.json?v='
var _pageAudioSync = true;
var _forceNavigation = false;
var _audioIndex = 0;
var _videoId = null;
// ---------- setting end ---------------

// ------------------ common function start ------------------------------------------------------------------------
$(document).ready(function() {
     _preloadData = new PagePreload()
     _preloadData.initObj(_pagePreloadArray, jsonSRC)
     _preloadData.addCustomEvent('ready', _pageLoaded)
})

function _pageLoaded() {
     _pageData = _preloadData.jsonData
     addSlideData()
     assignAudio(_pageData.audioSRC, _audioIndex, _pageAudioSync, _forceNavigation, _videoId)
     pagePreLoad()
     initPageAnimations()

}

// -------- Assign audio for play ------------
function assignAudio(_audioSRC, _ccIndx, _audioSync, _restriction, videoId) {
     var ccObj = _pageData.ccText[_ccIndx]
     var transcriptObj = _pageData.transcriptText[_ccIndx]
     loadMedia(_audioSRC, ccObj, _audioSync, _restriction, transcriptObj, videoId)
}
// ------------------ common function end ------------------------------------------------------------------------
var tweenTimeline
// -------- adding slide data ------------
function addSlideData() {
     $('.title_text').html('<p>' + _pageData.title + '</p>')

     for (var i = 0; i < _pageData.content.length; i++) {
          $('.para_text').append('<p>' + _pageData.content[i] + '</p>')
     }

     for (var j = 0; j < _pageData.boxContent.length; j++) {
          $('.f_box_container').append('<div class="f_step_box"><p>' + _pageData.boxContent[j] + '</p></div>')
     }

     setCSS()
}



// -------- update CSS ------------
function setCSS() {
     _wrapperWidth = $('#f_wrapper').outerWidth()
     _wrapperHeight = $('#f_wrapper').outerHeight()
     console.log(_pageData.imgCollage)

     // ---- checking device width and height ----
     if (_wrapperWidth > 768) {
          for (var i = 0; i < _pageData.imgCollage.desktop.length; i++) {
               $('#f_page_bg').eq(i).css({
                    'background-image': 'url(' + _pageData.imgCollage.desktop[i].imageSRC + ')',
                    'background-size': '100% 100%'
               })
          }
     } else {
          for (var j = 0; j < _pageData.imgCollage.portrait.length; j++) {
               $('#f_page_bg').eq(j).css({
                    'background-image': 'url(' + _pageData.imgCollage.portrait[j].imageSRC + ')',
                    'background-size': '100% 100%'
               })
          }
     }
     // --------
}

// -------- animations ------------
function updateCurrentTime(_currTime) {
     tweenTimeline.seek(_currTime)
}

function initPageAnimations() {
     if (tweenTimeline) {
          tweenTimeline.kill()
     }
     tweenTimeline = new TimelineLite()
       tweenTimeline.pause();
     //tweenTimeline.add(animateIntroBg($('#f_page_bg'), 1, 1).play(), 0.5);
     tweenTimeline.add(animateFromLeft($('.title_text'), 0.5, 0).play(), 0.5)
     tweenTimeline.add(animateFromLeft($('.para_text p').eq(0), 0.5, 0).play(), 0.5)
     tweenTimeline.add(animateFromLeft($('.para_text p').eq(1), 0.5, 0).play(), 11)

     var boxTiming = [15, 17, 18, 19, 20, 21]
     for (var j = 0; j < _pageData.boxContent.length; j++) {
          tweenTimeline.add(animateFromLeft($('.f_step_box').eq(j), 0.5, 0).play(), boxTiming[j])
     }
}

// -------- resize page details ------------
window.onresize = function() {
     setCSS()
}
