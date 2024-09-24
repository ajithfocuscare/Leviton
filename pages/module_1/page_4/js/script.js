/*
Created by: Thirumohan & Team
Date: Jan 2018
*/
// ---------- setting start ---------------
var _preloadData, _pageData
var _pagePreloadArray = { image: -1, audio: -1, video: 1, data: -1 }; // item not availble please assign value 1.
var jsonSRC = 'pages/module_1/page_4/data/data.json?v='
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

    //----- mainOst ----------------------------------------------------------------------
    if (_pageData.mainOst.paraText.length > 0) {
         $('.ost_containar').append('<div class="para_text"></div>')
         for (var i = 0; i < _pageData.mainOst.paraText.length; i++) {
              $('.ost_containar').find('.para_text').append('<p>' + _pageData.mainOst.paraText[i] + '</p>')
         }
    }
    //----- left side ----------------------------------------------------------------------
    if (_pageData.leftContent.paraText.length > 0) {
         $('.f_left_box').find('.text_container').append('<div class="para_text"></div>')
         for (var i = 0; i < _pageData.leftContent.paraText.length; i++) {
              $('.f_left_box').find('.para_text').append('<p>' + _pageData.leftContent.paraText[i] + '</p>')
         }
    }
    if (_pageData.rightContent.list.length > 0) {
         $('.f_right_box').find('.text_container').append('<ul class="list_items"></ul>')
         for (var j = 0; j < _pageData.rightContent.list.length; j++) {
              $('.f_right_box').find('.list_items').append('<li>' + _pageData.rightContent.list[j] + '</li>')
         }
    }

    $('.arrow-img').append('<img src = "' + _pageData.arrowimg.imageSRC + '" alt="' + _pageData.arrowimg.altText + '" title ="' + _pageData.arrowimg.altText + '" > ')
    setCSS()
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

    tweenTimeline.add(animateFromLeft($('.title_text'), 0.5, 0).play(), 0.5)
      tweenTimeline.add(animateIntroBg($('.f_right_box'), 1, 1).play(), 0.5);
    var ostParaTiming = [2];
    for (var i = 0; i < ostParaTiming.length; i++) {
         tweenTimeline.add(animateFromRight($('.ost_containar').find('.para_text p').eq(i), 0.5, 0).play(), ostParaTiming[i])
    }
    tweenTimeline.add(fnScaleTo($('.boxanimat').eq(0), 1).play(), 2)
//-------left text--------------------------------------------------------------------------
    var leftParaTiming = [1];
    for (var i = 0; i < leftParaTiming.length; i++) {
         tweenTimeline.add(animateFromRight($('.f_left_box').find('.para_text p').eq(i), 0.5, 0).play(), leftParaTiming[i])
    }
    tweenTimeline.add(animateFromLeft($('.arrow-img').eq(0), 0.9, 0).play(), 2.3)
//-------right text--------------------------------------------------------------------------
    var rightListTiming = [2.5, 3.5, 4.5, 5.5, 6.5, 7.5,8.5,9.5];
    for (var k = 0; k < rightListTiming.length; k++) {
         tweenTimeline.add(animateFromRight($('.f_right_box').find('.list_items li').eq(k), 0.5, 0).play(), rightListTiming[k])
    }

}

// -------- resize page details ------------
window.onresize = function() {
    setCSS()
}
