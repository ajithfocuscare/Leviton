/*
Created by: Thirumohan & Team
Date: Jan 2018
*/
// ---------- setting start ---------------
var _preloadData, _pageData
var _pagePreloadArray = { image: -1, audio: -1, video: 1, data: -1 }; // item not availble please assign value 1.
var jsonSRC = 'pages/module_1/page_10/data/data.json?v='
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
    $('.title_text').html('<p>' + _pageData.title + '</p>');
    $('.bottom_text').html('<p>' + _pageData.content_0 + '</p>');

    $('.pra_text').append('<p>' + _pageData.content + '</p>')
    //$('.pra_text').append('<p>' + _pageData.content_0 + '</p>')
    $('.example').append('<p>' + _pageData.example + '</p>')
    $('.example_text').append('<p>' + _pageData.example_text + '</p>')
    $('.note').append('<p>' + _pageData.note + '</p>')
    $('.note_text').append('<p>' + _pageData.note_text + '</p>')
    $('.example_icon').append('<img src = "' + _pageData.example_icon.imageSRC + '" alt="' + _pageData.example_icon.altText + '" title ="' + _pageData.example_icon.altText + '" > ')
    $('.note_icon').append('<img src = "' + _pageData.note_icon.imageSRC + '" alt="' + _pageData.note_icon.altText + '" title ="' + _pageData.note_icon.altText + '" > ')
     setCSS()
}

// -------- update CSS ------------
function setCSS() {
    _wrapperWidth = $('#f_wrapper').outerWidth()
   _wrapperHeight = $('#f_wrapper').outerHeight()
    if (_wrapperWidth > 768) {
     // mediaQuery('desktop')
     for (var i = 0; i < _pageData.imgCollage.desktop.length; i++) {
          $('#f_page_bg').eq(i).css({
               'background-image': 'url(' + _pageData.imgCollage.desktop[i].imageSRC + ')',
               'background-size': '100% 100%'
          })
     }
} else {
     //mediaQuery('portrait')
     for (var j = 0; j < _pageData.imgCollage.portrait.length; j++) {
          $('#f_page_bg').eq(j).css({
               'background-image': 'url(' + _pageData.imgCollage.portrait[j].imageSRC + ')',
               'background-size': '100% 100%'
          })
     }
}
$('.col-img').css({
     'background-size': '100% auto',
     'background-repeat': 'no-repeat'
});
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

    tweenTimeline.add(animateIntroBg($('#f_page_bg'), 1, 1).play(), 0.5);
     tweenTimeline.add(animateFromMarginLeft($('.title_text'), 0.5, 0).play(), 1)
    tweenTimeline.add(animateFromLeft($('.pra_text').eq(0), 0.5, 0).play(),2)
    tweenTimeline.add(animateChangeWidth($('.hr_line'), 0.6, '100%').play(), 2)
    tweenTimeline.add(animateFromLeft($('.example').eq(0), 0.5, 0).play(), 5)
    tweenTimeline.add(animateFromLeft($('.example_text').eq(0), 0.5, 0).play(), 6)
    tweenTimeline.add(animateFromTop($('.example_icon').eq(0), 0.5, 0).play(), 7)
    tweenTimeline.add(animateFromLeft($('.note').eq(0), 0.5, 0).play(), 8)
    tweenTimeline.add(animateFromTop($('.note_icon').eq(0), 0.5, 0).play(), 8.2)
    tweenTimeline.add(animateFromLeft($('.note_text').eq(0), 0.5, 0).play(), 9)
    tweenTimeline.add(animateFromLeft($('.bottom_text').eq(0), 0.5, 0).play(), 9)

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
