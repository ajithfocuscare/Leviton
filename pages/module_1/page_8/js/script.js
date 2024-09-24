/*
Created by: Thirumohan & Team
Date: Jan 2018
*/
// ---------- setting start ---------------
var _preloadData, _pageData
var _pagePreloadArray = { image: -1, audio: -1, video: 1, data: -1 }; // item not availble please assign value 1.
var jsonSRC = 'pages/module_1/page_8/data/data.json?v='
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
    //  $('.ost_container').html('<p>' + _pageData.ost + '</p>')
      if (_pageData.mainost.paraText.length > 0) {
           $('.ost_container').find('.text_container').append('<div class="para_text"></div>')
           for (var i = 0; i < _pageData.mainost.paraText.length; i++) {
                $('.ost_container').find('.para_text').append('<p>' + _pageData.mainost.paraText[i] + '</p>')
           }
      }
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

    //---- center side ----
    if (_pageData.centerContent.paraText.length > 0) {
         $('.f_center_box').find('.text_container').append('<div class="para_text"></div>')
         for (var i = 0; i < _pageData.centerContent.paraText.length; i++) {
              $('.f_center_box').find('.para_text').append('<p>' + _pageData.centerContent.paraText[i] + '</p>')
         }
    }

    if (_pageData.centerContent.list.length > 0) {
         $('.f_center_box').find('.text_container').append('<ul class="list_items"></ul>')
         for (var j = 0; j < _pageData.centerContent.list.length; j++) {
              $('.f_center_box').find('.list_items').append('<li>' + _pageData.centerContent.list[j] + '</li>')
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
    setCSS();
   }

// -------- update CSS ------------
function setCSS() {
    _wrapperWidth = $('#f_wrapper').outerWidth()
    _wrapperHeight = $('#f_wrapper').outerHeight()
    console.log(_pageData.imgCollage)

    // ---- checking device width and height ----
    if (_wrapperWidth > 768) {
         // mediaQuery('desktop')
         for (var i = 0; i < _pageData.imgCollage.desktop.length; i++) {
              $('#f_page_bg').eq(i).css({
                   'background-image': 'url(' + _pageData.imgCollage.desktop[i].imageSRC + ')',
                   'background-size':'100% 100%'
              })
         }
    } else {
         //mediaQuery('portrait')
         for (var j = 0; j < _pageData.imgCollage.portrait.length; j++) {
              $('#f_page_bg').eq(j).css({
                   'background-image': 'url(' + _pageData.imgCollage.portrait[j].imageSRC + ')',
                   'background-size':'100% 100%'
              })
         }
    }
    // --------
}

function mediaQuery(device) {
    switch (device) {
        case 'ipad-landscape':

            break
        case 'ipad-portrait':

            break
    }
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

    if (_pageAudioSync) {
        withAudioSync()
    } else {

    }
}

function withAudioSync() {
       tweenTimeline.pause();

    //tweenTimeline.add(animateIntroBg($('#f_page_bg'), 1, 1).play(), 0.5);
    tweenTimeline.add(animateFromMarginLeft($('.title_text'), 0.5, 0).play(), 0.5)
        tweenTimeline.add(animateFromMarginLeft($('.para_text p'), 0.5, 0).play(), 2)
    tweenTimeline.add(animateChangeWidth($('.f_left_box'), 0.5, '100%').play(), 3)
    var leftParaTiming = [3.5,4,4.5,5,5.5,6,6.5,7];
    for (var i = 0; i < leftParaTiming.length; i++) {
         tweenTimeline.add(animateFromRight($('.f_left_box').find('.list_items li').eq(i), 0.5, 0).play(), leftParaTiming[i])
    }
    tweenTimeline.add(animateChangeWidth($('.f_center_box'), 0.5, '100%').play(), 6)
    var centerParaTiming = [6.5,7,7.5,8];
    for (var j = 0; j < leftParaTiming.length; j++) {
         tweenTimeline.add(animateFromRight($('.f_center_box').find('.list_items li').eq(j), 0.5, 0).play(), centerParaTiming[j])
    }
    tweenTimeline.add(animateChangeWidth($('.f_right_box'), 0.5, '100%').play(), 8.5)

         var rightListTiming = [8.6,9,9.4,9.8, 10.2];
         for (var k = 0; k < rightListTiming.length; k++) {
              tweenTimeline.add(animateFromRight($('.f_right_box').find('.list_items li').eq(k), 0.5, 0).play(), rightListTiming[k])
         }

    //tweenTimeline.add(animateChangeWidth($('.pg-img-container'), 0.6, '100%').play(), 0.5)
    // tweenTimeline.add(animateFadeIn($('.left_side'), 0.5).play(), 0.8)


    //  tweenTimeline.add(animateFromLeft($('.para_text p').eq(0), 0.5, 0).play(), 2.5)
    // tweenTimeline.add(animateFromLeft($('.para_text p').eq(1), 0.5, 0).play(), 16.1)
    //  tweenTimeline.add(animateFromLeft($('.list_items li').eq(0), 0.5, 0).play(), 27.2)
    // tweenTimeline.add(animateFromLeft($('.list_items li').eq(1), 0.5, 0).play(), 31.2)

    /*
    var paraTime = 5
    $('.para_text p').each(function() {
        paraTime = paraTime + 0.3
        tweenTimeline.add(animateFromLeft($(this), 0.5, 0).play(), paraTime)
    })

    var listTime = 6
    $('.list_items li').each(function() {
        listTime = listTime + 0.3
        tweenTimeline.add(animateFromLeft($(this), 0.5, 0).play(), listTime)
    })*/
}

// -------- resize page details ------------
window.onresize = function() {
    setCSS()
}
