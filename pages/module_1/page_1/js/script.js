
/*
Created by: Thirumohan & Team
Date: Jan 2018
*/
// ---------- setting start ---------------
var _preloadData, _pageData
var _pagePreloadArray = {
     image: -1,
     audio: 1,
     video: 1,
     data: -1
}; // item not availble please assign value 1.
var jsonSRC = 'pages/module_1/page_1/data/data.json?v='
var _pageAudioSync = true;
var _forceNavigation = false;
var _audioIndex = 0;
var _videoId = null;
var tweenTimeline;
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
     assignAudio(null, _audioIndex, _pageAudioSync, _forceNavigation, _videoId)
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


// -------- adding slide data ------------
function addSlideData() {
     $('.title_text').html('<p>' + _pageData.title + '</p>');
     /*for (var i = 0; i < _pageData.tabButton.length; i++) {
         $('.f_Icon_animation').append('<div  class = "f_iconBtn" id="f_iconBtn_' + i + '" >' + _pageData.tabButton[i] + '</div>')

     }
     for (var i = 0; i < _pageData.tabButtonicon.length; i++) {
         $('.f_bottomIcon').append('<div  class = "f_icon" id="f_icon_' + i + '" >' + _pageData.tabButtonicon[i] + '</div>')

     }*/
     //----- left side ----
     if (_pageData.leftContent.paraText.length > 0) {
          $('.f_left_box').find('.text_container').append('<div class="para_text"></div>')
          for (var i = 0; i < _pageData.leftContent.paraText.length; i++) {
               $('.f_left_box').find('.para_text').append('<p>' + _pageData.leftContent.paraText[i] + '</p>')
          }
     }

     if (_pageData.leftContent.list.length > 0) {
          $('.f_left_box').find('.text_container').append('<ul class="list_items"></ul>')
          for (var j = 0; j < _pageData.leftContent.list.length; j++) {
               $('.f_left_box').find('.list_items').append('<li>' + _pageData.leftContent.list[j] + '</li>')
          }
     }

     //---- right side ----
     if (_pageData.rightContent.paraText.length > 0) {
          $('.f_right_box').find('.text_container').append('<div class="para_text"></div>')
          for (var i = 0; i < _pageData.rightContent.paraText.length; i++) {
               $('.f_right_box').find('.para_text').append('<p>' + _pageData.rightContent.paraText[i] + '</p>')
          }
     }

     if (_pageData.rightContent.list.length > 0) {
          $('.f_right_box').find('.text_container').append('<ul class="list_items"></ul>')
          for (var j = 0; j < _pageData.rightContent.list.length; j++) {
               $('.f_right_box').find('.list_items').append('<li>' + _pageData.rightContent.list[j] + '</li>')
          }
     }

}



// -------- update CSS ------------
/*function setCSS() {
     _wrapperWidth = $('#f_wrapper').outerWidth()
     _wrapperHeight = $('#f_wrapper').outerHeight()
     // ---- checking device width and height ----
     if (_wrapperWidth > 768) {
          for (var i = 0; i < _pageData.imgCollage.desktop.length; i++) {
               $('.bg-img').eq(i).css({
                    'background-image': 'url(' + _pageData.imgCollage.desktop[i].imageSRC + ')',
                    'background-size': '100% 100%'
               })
          }
     } else {
          for (var j = 0; j < _pageData.imgCollage.portrait.length; j++) {
               $('.bg-img').eq(j).css({
                    'background-image': 'url(' + _pageData.imgCollage.portrait[j].imageSRC + ')',
                    'background-size': '100% 100%'
               })
          }
     }
}*/

// -------- animations ------------
function updateCurrentTime(_currTime) {
     tweenTimeline.seek(_currTime)
}

function initPageAnimations() {
     if (tweenTimeline) {
          tweenTimeline.kill()
     }
     tweenTimeline = new TimelineLite()

     if (_pageAudioSync) {
          withAudioSync()
     } else {

     }
}

function withAudioSync() {
     //tweenTimeline.add(animateZoomfromTo($('.bg-img'), 0.5, 1).play(), 0.5)
     //
     tweenTimeline.play();

     // --- left animation ---
     tweenTimeline.add(animateChangeWidth($('.heading_bg'), 0.5, '100%').play(), 0.5)
     tweenTimeline.add(animateFromMarginLeft($('.title_text'), 0.5, 0).play(), 1);

  /*  var leftParaTiming = [2,2.2,2.4,2.6,2.8,3];
     for (var i = 0; i < leftParaTiming.length; i++) {
          tweenTimeline.add(fnScaleTo($('.f_Icon_animation').find('.f_iconBtn').eq(i), 1, 0).play(), leftParaTiming[i]);
     }
     var bottomParaTiming = [2.1,2.3,2.5,2.7,2.9,3.1];
     for (var j = 0; j < leftParaTiming.length; j++) {
          tweenTimeline.add(fnScaleTo($('.f_bottomIcon').find('.f_icon').eq(j), 1, 0).play(), bottomParaTiming[j])
     }*/
}

// -------- resize page details ------------
window.onresize = function() {
  
}
