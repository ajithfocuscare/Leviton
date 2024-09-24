/*
Created by: Thirumohan & Team
Date: Jan 2018
*/
// ---------- setting start ---------------
var _preloadData, _pageData
var _pagePreloadArray = { image: -1, audio: -1, video: 1, data: -1 }; // item not availble please assign value 1.
var jsonSRC = 'pages/module_1/page_12/data/data.json?v='
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

    //----- left side ----
    if (_pageData.leftContent.paraText.length > 0) {
         $('.left_container').find('.text_container').append('<div class="para_text"></div>')
         for (var i = 0; i < _pageData.leftContent.paraText.length; i++) {
              $('.left_container').find('.para_text').append('<p>' + _pageData.leftContent.paraText[i] + '</p>')
         }
    }

    if (_pageData.leftContent.list.length > 0) {
         $('.left_container').find('.text_container').append('<ul class="list_items"></ul>')
         for (var j = 0; j < _pageData.leftContent.list.length; j++) {
              $('.left_container').find('.list_items').append('<li>' + _pageData.leftContent.list[j] + '</li>')
         }
    }




    setCSS()
    $('.icon_block_big').append('<img src = "' + _pageData.iconimgbig.imageSRC + '" alt="' + _pageData.iconimgbig.altText + '" title ="' + _pageData.iconimgbig.altText + '" > ')
    setCSS()

}

// -------- update CSS ------------
/* -------- update CSS ------------
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
}*/function setCSS() {
   var getBound = $('#f_wrapper')[0].getBoundingClientRect()
     _wrapperWidth = $('#f_wrapper').outerWidth()

     _wrapperHeight = $('#f_wrapper').outerHeight()
     // ---- checking device width and height ----

     if (_wrapperWidth > 768) {
     for (var i = 0; i < _pageData.imgCollage.desktop.length; i++) {
          $('#f_page_bg').eq(i).css({
               'background-image': 'url(' + _pageData.imgCollage.desktop[i].imageSRC + ')',
               'background-size': 'cover'
          })
     }
     } else {
        console.log(_wrapperWidth>_wrapperHeight)
        	if(window.innerHeight < window.innerWidth){
            console.log("land")
            for (var i = 0; i < _pageData.imgCollage.desktop.length; i++) {
                 $('#f_page_bg').eq(i).css({
                      'background-image': 'url(' + _pageData.imgCollage.desktop[i].imageSRC + ')',
                      'background-size': 'cover'
                 })
            }
          }else{
console.log("prot")
            for (var j = 0; j < _pageData.imgCollage.portrait.length; j++) {
                 $('#f_page_bg').eq(j).css({
                      'background-image': 'url(' + _pageData.imgCollage.portrait[j].imageSRC + ')',
                      'background-size': 'cover'
                 })
            }
          }
     }
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
tweenTimeline.add(animateIntroBg($('.left_container'), 1, 1).play(), 0.5);
tweenTimeline.add(animateFromMarginLeft($('.title_text'), 0.5, 0).play(), 0.5)

//tweenTimeline.add(fnScaleTo($('.buble-containar2').eq(0), 1).play(), 2.5)
//tweenTimeline.add(animateFadeInDisplayBlock($('.icon_block_big'), 1).play(), 2.8)
//tweenTimeline.add(fnScaleTo($('.buble-containar').eq(0), 1).play(), 3)
//tweenTimeline.add(animateFadeInDisplayBlock($('.icon_block_small'), 1).play(), 3.3)
var leftParaTiming = [2.5];
for (var i = 0; i < leftParaTiming.length; i++) {
     tweenTimeline.add(animateFromRight($('.left_container').find('.para_text p').eq(i), 0.5, 0).play(), leftParaTiming[i])
}
var leftParaTiming = [14,24,34,51,55,62,80];
for (var i = 0; i < leftParaTiming.length; i++) {
     tweenTimeline.add(animateFromRight($('.left_container').find('.list_items li').eq(i), 0.5, 0).play(), leftParaTiming[i])
}

/*var leftListTiming = [4.5,5.5,6.5,7.7,8.5,9.5];
for (var j = 0; j < leftListTiming.length; j++) {
     tweenTimeline.add(animateFromRight($('.left_container').find('.list_items li').eq(j), 0.5, 0).play(), leftListTiming[j])
}*/




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
