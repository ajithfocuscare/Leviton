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
var jsonSRC = 'pages/module_1/page_11/data/data.json?v='
var _pageAudioSync = true;
var _forceNavigation = false;
var _audioIndex = 0;
var _videoId = null;
var tweenTimeline;
var selectedAnswer = 0
var noOfAttempted = 0
var numOfQues = [-1,-1];
// ---------- setting end ---------------

// ------------------ common function start ------------------------------------------------------------------------
$(document).ready(function () {
    _preloadData = new PagePreload()
    _preloadData.initObj(_pagePreloadArray, jsonSRC)
    _preloadData.addCustomEvent('ready', _pageLoaded)
})

function _pageLoaded() {
    _isKnowledgeCheck = true;
    _pageData = _preloadData.jsonData
    addSlideData()
    assignAudio(null, _audioIndex, _pageAudioSync, _forceNavigation, _videoId)
    pagePreLoad()
    initPageAnimations()
    questionTimer()
}

// -------- Assign audio for play ------------
function assignAudio(_audioSRC, _ccIndx, _audioSync, _restriction, videoId) {
    var ccObj = _pageData.ccText[_ccIndx]
    var transcriptObj = _pageData.transcriptText[_ccIndx]
    loadMedia(_audioSRC, ccObj, _audioSync, _restriction, transcriptObj, videoId)
}
// ------------------ common function end ------------------------------------------------------------------------

// -------- adding slide data ------------

// -------- update CSS ------------
function setCSS() {
    _wrapperWidth = $('#f_wrapper').outerWidth()
    _wrapperHeight = $('#f_wrapper').outerHeight()
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
$("#f_mc_rightSide_2").hide();

function withAudioSync() {
    tweenTimeline.play();
    tweenTimeline.add(animateIntroBg($('#f_page_bg'), 1, 1).play(), 0.5);
    //  tweenTimeline.add(animateFadeIn($("#f_mc_leftSide"), 1).play(), 0.8);
    //tweenTimeline.add(animateFadeIn($("#f_mc_rightSide"), 1).play(), 0.8);
    //  tweenTimeline.add(animatePaddingBottom($("#f_mc_questionText"), 0.3, 20).play(), 4.8);
    //tweenTimeline.add(animateFadeIn($("#f_mc_instruction"), 1).play(), 1);
    tweenTimeline.add(animateFromLeft($("#optionBtn_0"), 0.5, 0).play(), 1);
    tweenTimeline.add(animateFromLeft($("#optionBtn_1"), 0.5, 0).play(), 1.5);
    //  tweenTimeline.add(animatePaddingBottom($("#f_mc_questionText1"), 0.3, 20).play(), 4.8);
    tweenTimeline.add(animateFromLeft($("#optionBtn_1_0"), 0.5, 0).play(), 2);
    tweenTimeline.add(animateFromLeft($("#optionBtn_1_1"), 0.5, 0).play(), 2.5);

    //tweenTimeline.add(animateFadeIn(submitButton, 1).play(), 25.4);

    //tweenTimeline.add(animateOutDisplayNone("#f_mc_rightSide"),0.5,0).play(), 26);

    // --- left animation ---
    //tweenTimeline.add(animateChangeWidth($('.heading_bg'), 0.5, '100%').play(), 0.5)
    //   tweenTimeline.add(animateFromMarginLeft($('.title_text'), 0.5, 0).play(), 2)

}

// -------- adding slide data ------------

var optionButton, submitButton

function addSlideData() {
    $('#f_mc_questionText').html(_pageData.questionText)
    //$('#f_mc_instruction').find('.f_mc_ins').html(_pageData.instructionText[0])
    //$('#f_mc_instruction').find('.f_mc_insText').html(_pageData.instructionText[1])

    for (var i = 0; i < _pageData.optionText.length; i++) {
        $('#f_mc_optionContainer').append('<button type="button" class="f_mc_optionBtn" qno="1"  id="optionBtn_' + i + '"><span class = "f_mc_mark"></span><span class = "f_mc_optionType radio"><span class = "f_mc_innerBox"></span></span><span class = "f_mc_optionText">' + _pageData.optionText[i] + '</span></button>')
    }

    //$('#f_mc_optionContainer').append('<button type="button" id="f_mc_submitBtn" class="f_mc_submitBtn">' + _pageData.submitText[0] + '</button>')

    $('#f_mc_questionText1').html(_pageData.questionText1);
    //$('#f_mc_instruction1').find('.f_mc_ins').html(_pageData.instructionText[0]);
    //$('#f_mc_instruction1').find('.f_mc_insText').html(_pageData.instructionText[1]);

    for (var i = 0; i < _pageData.optionText.length; i++) {
        $('#f_mc_optionContainer1').append('<button type="button" class="f_mc_optionBtn" qno="2"  id="optionBtn_1_' + i + '"><span class = "f_mc_mark"></span><span class = "f_mc_optionType radio"><span class = "f_mc_innerBox"></span></span><span class = "f_mc_optionText">' + _pageData.optionText[i] + '</span></button>')

    }

    //$('#f_mc_optionContainer').append('<button type="button" id="f_mc_submitBtn_1" class="f_mc_submitBtn">' + _pageData.submitText[0] + '</button>')

    optionButton = $('.f_mc_optionBtn')
    //submitButton = $('.f_mc_submitBtn')

    // submitButton.hide();

    optionButton.off('click mouseenter mouseleave').on('click mouseenter mouseleave', selectOption)
    setCSS()
}

// -------- update CSS ------------
function setCSS() {
    _wrapperWidth = $('#f_wrapper').outerWidth()
    _wrapperHeight = $('#f_wrapper').outerHeight()
    //submitButton.css({ 'opacity': 0.3, 'cursor': 'default' })

    // ---- checking device width and height ----
    if (_wrapperWidth >= 1024) {
        mediaQuery('ipad-landscape')
    } else if (_wrapperWidth >= 768 && _wrapperWidth < 1024) {
        mediaQuery('ipad-portrait')
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

// --------- select option function ---------
var selectedAnswerQuestion = 0;

function selectOption(e) {
    var type = e.type
    var num = $(this).index();
    selectedAnswerQuestion = 0;
    switch (type) {
        case 'click':
            console.log('*****SelectOptions:', $(this).find('.f_mc_innerBox').parent().find('.f_mc_innerBox').length);

            $(this).find('.f_mc_innerBox').closest('.f_mc_opc_options').find('.f_mc_innerBox').removeClass('f_mc_selected');

            console.log('***selectOption:', num);
            //resetActivity()
            //$(this).addClass('f_mc_optionOver').off('click mouseenter').css({ 'cursor': 'default' });

            $(this).find('.f_mc_innerBox').addClass('f_mc_selected');

            //submitButton.off('click mouseenter mouseleave').on('click mouseenter mouseleave', enableSubmitBtn).css({ 'opacity': 1, 'cursor': 'pointer' })
            selectedAnswer = num;
            selectedAnswerQuestion = $(this).attr('qno');
            //submitButton.trigger('click');
            validate_Answer();
            break

        case 'mouseenter':
            optionButton.removeClass('f_mc_optionOver')
            $(this).addClass('f_mc_optionOver')
            break

        case 'mouseleave':
            optionButton.removeClass('f_mc_optionOver')
            break
    }
}

function validate_Answer() {
    try {
        $('#f_mc_feedbackText').html('');
        $('.f_mc_mark').removeClass('tick cross');
        var feedTxt = '';
        totalQuestionCount = $(".f_mc_opc_options").length;
        $(".f_mc_opc_options").each(function (qno) {
            var _qno = qno;
            var _optquest = $(this);
            _optquest.find('.f_mc_optionBtn').each(function (opt_ind) {
                var optind = opt_ind;
                var _optob = $(this);
                if (_optob.find('.f_mc_innerBox').hasClass('f_mc_selected')) {
                    var correctAnswer = _pageData.correctAnswer[qno];
                    if (correctAnswer == optind) {
                       numOfQues[_qno] = 1;
                        feedTxt = _pageData["feedbackText" + (qno+1)].correct;
                         $('#f_mc_feedbackText').html(" <p><b>Correct answer!</b></p>");
                        _optob.find('.f_mc_mark').removeClass('tick cross').addClass('tick').show();
                        _optquest.find('.f_mc_optionBtn').off('click mouseenter mouseleave').css({
                            'cursor': 'default'
                        })
                        //_optob
                    } else {
                       numOfQues[_qno] = -1;
                        feedTxt = _pageData["feedbackText" + (qno+1)].firstIncorrect;
                        $('#f_mc_feedbackText').html('<p>' + feedTxt + '</p>');
                        _optob.find('.f_mc_mark').removeClass('tick cross').addClass('cross').show()
                    }
                }
            });
        });
        var correctAnsCount = 0;
        for(var i=0;i<numOfQues.length;i++){
          if(numOfQues[i]== 1){
            correctAnsCount++;
          }
        }
        var count = parseInt($('.qestiontimer').html());
        if(correctAnsCount == numOfQues.length && count == 0){
            enableNextForKC();
        }
        $('#f_mc_feedbackBox').show(200);
        $('#f_mc_feedbackClose').off('click mouseenter mouseleave').on('click mouseenter mouseleave', closeFeedbackBox);
    } catch (e) {

    }
        $(".disableContainer").hide();
}

////Rajadurai start
/*function validate_Answer1() {
    console.log("validate_Answer1")
    try {
        $('#f_mc_feedbackText').html('');

        $('.f_mc_mark').removeClass('tick cross');
        var feedTxt = '';
        var correctAnsCount = 0,
            totalQuestionCount = $(".f_mc_opc_options").length;
        var feedflag = 0;
        $(".f_mc_opc_options").each(function (qno) {
            var _qno = qno;
            var _optquest = $(this);
            var ansflag = 0;
            console.log('f_mc_opc_options:', qno);
            _optquest.find('.f_mc_optionBtn').each(function (opt_ind) {
                var optind = opt_ind;
                var _optob = $(this);
                console.log('f_mc_optionBtn:', opt_ind, ':', ansflag);
                if (_optob.find('.f_mc_innerBox').hasClass('f_mc_selected')) {
                    var correctAnswer = _pageData.correctAnswer - 1;
                    if (_qno > 0) correctAnswer = _pageData["correctAnswer" + qno] - 1;

                    if (correctAnswer == optind) {
                        ansflag = 1;
                        console.log('CorrectAnswer');
                        correctAnsCount = correctAnsCount + 1;
                        feedTxt = _pageData.feedbackText.correct;
                        if (_qno > 0) {
                            feedTxt = _pageData["feedbackText" + qno].correct;
                        }
                        _optob.find('.f_mc_mark').removeClass('tick cross').addClass('tick').show();
                        _optquest.find('.f_mc_optionBtn').off('click mouseenter mouseleave').css({
                            'cursor': 'default'
                        });
                        //_optob
                    } else {
                        console.log('WrongAnswer');
                        feedTxt = _pageData.feedbackText.firstIncorrect;
                        if (_qno > 0) {
                            feedTxt = _pageData["feedbackText" + qno].firstIncorrect;
                        }
                        _optob.find('.f_mc_mark').removeClass('tick cross').addClass('cross').show();
                    }
                }//if (_optob.find
                if (ansflag == 0) {
                    var correctAnswer = _pageData.correctAnswer - 1;
                    if (qno > 0) correctAnswer = _pageData["correctAnswer" + qno] - 1;
                    console.log('****f_mc_optionBtn:', correctAnswer, ':', optind, ':', _pageData["correctAnswer" + qno], ':', qno);
                    if (correctAnswer == optind) {
                        console.log('*****CorrectAnswer-if');
                        feedflag = 1;
                        feedTxt = _pageData.feedbackText.correct;
                        if (_qno > 0) {
                            feedTxt = _pageData["feedbackText" + qno].correct;
                        }
                        //_optob.find('.f_mc_mark').removeClass('tick cross').addClass('tick').show();
                        //$('#f_mc_feedbackText').html('<p>' + feedTxt + '</p>');
                        $('#f_mc_feedbackText').html(" <p>You have reached the time limit set for the quiz.</p>");
                        $('#f_mc_feedbackBox').show(200);
                        //$('#f_mc_feedbackText').html(" <p><b>Correct answer!</b></p><br><p>If your workplace conduct demonstrates hostility toward a person not because of a legal protected characteristic, is it still considered harassment?</p>");
                        _optquest.find('.f_mc_optionBtn').off('click mouseenter mouseleave').css({
                            'cursor': 'default'
                        });
                        //_optob
                    }
                }
            });

        });

        if (feedflag == 0) {
            if (totalQuestionCount > 0 && totalQuestionCount == correctAnsCount) {
            //  clearInterval(quizTime);
              //  console.log(quizTime)
              //  quizTime = null;
                enableNextForKC();
                $('#f_mc_feedbackText').html(" <p><b>Correct answer!</b></p><br><p>If your workplace conduct demonstrates hostility toward a person not because of a legal protected characteristic, is it still considered harassment?</p>");
            } else {
                $('#f_mc_feedbackText').html('<p>' + feedTxt + '</p>');
            }
        }

        $('#f_mc_feedbackBox').hide();
        $('#f_mc_feedbackClose').off('click mouseenter mouseleave').on('click mouseenter mouseleave', closeFeedbackBox);

    } catch (e) {

    }
    $(".disableContainer").hide();
}*/

/// end rajadurai ...
// --------- Submit button function ---------
function enableSubmitBtn(e) {
    var type = e.type

    switch (type) {
        case 'click':
            optionButton.removeClass('f_mc_optionOver')
            if ($(this).text() == _pageData.submitText[0]) {

                validateAnswer();
            } else {

                resetActivity();
            }
            break

        case 'mouseenter':
            $(this).addClass('f_mc_submitOver')
            break

        case 'mouseleave':
            $(this).removeClass('f_mc_submitOver')
            break
    }
}

// --------- Validation function ---------
function validateAnswer() {
    $('#f_mc_feedbackText1').html('');

    var feedTxt = ''
    var correctAnswer = _pageData.correctAnswer - 1;

    if (correctAnswer == selectedAnswer) {
        feedTxt = _pageData.feedbackText.correct

        $('.f_mc_mark').removeClass('tick cross')
        $('#f_mc_optionContainer').find('.f_mc_optionBtn').eq(correctAnswer).find('.f_mc_mark').removeClass('tick cross').addClass('tick').show()
    } else {
        noOfAttempted++
        if (noOfAttempted < _pageData.noOfAttempts) {
            feedTxt = _pageData.feedbackText.firstIncorrect

            $('#f_mc_optionContainer').find('.f_mc_optionBtn').eq(selectedAnswer).find('.f_mc_mark').removeClass('tick cross').addClass('cross').show()
        } else {
            feedTxt = _pageData.feedbackText.incorrect

            $('#f_mc_optionContainer').find('.f_mc_optionBtn').eq(selectedAnswer).find('.f_mc_mark').removeClass('tick cross').addClass('cross').show()
            setTimeout(function () {
                $('.f_mc_mark').removeClass('tick cross').addClass('cross')
                $('#f_mc_optionContainer').find('.f_mc_optionBtn').eq(correctAnswer).find('.f_mc_mark').removeClass('tick cross').addClass('tick')
                $('.f_mc_mark').show()
            }, 2000)
        }
    }

    console.log($('#f_mc_feedbackText'))
    $('#f_mc_feedbackText').html('<p>' + feedTxt + '</p>')
    //  $('#f_mc_feedbackText').html(feedTxt);
    $('#f_mc_feedbackBox').show(200)
    $('#f_mc_feedbackClose').off('click mouseenter mouseleave').on('click mouseenter mouseleave', closeFeedbackBox)
}

// --------- close feedback function ---------
function closeFeedbackBox(e) {
    var type = e.type

    switch (type) {
        case 'click':
            $('#f_mc_feedbackBox').hide(200)
            break

        case 'mouseenter':

            break

        case 'mouseleave':

            break
    }
}

// --------- reset function ---------
function resetActivity() {
    console.log('reset')
    optionButton.off('click mouseenter mouseleave').on('click mouseenter mouseleave', selectOption).css({
        'cursor': 'pointer'
    })
    optionButton.find('.f_mc_innerBox').removeClass('f_mc_selected')
    $('.f_mc_mark').removeClass('tick cross')
    $('#f_mc_feedbackBox').hide(200)
    optionButton.removeClass('f_mc_optionOver')
}

function enableScrollBar() {
    $('#f_mc_feedbackText').enscroll({
        verticalTrackClass: 'ssScrollTrack',
        verticalHandleClass: 'ssScrollHandle'
    })
}
// -------- resize page details ------------
window.onresize = function () {
    setCSS()
}


//timmer--------------------------------------------

$(document).ready(function () {

    QuestionTimer();
});

function questionTimer() {
    quizTime = setInterval(function () {
    var count = parseInt($('.qestiontimer').html());
    if (count !== 0) {
    $('.qestiontimer').html(count - 1);
    } else {
    clearInterval(quizTime);
    var cnt = 0;
    for(var i=0;i<numOfQues.length;i++){
      if(numOfQues[i]== 1){
        cnt++;
      }
    }
    if(cnt ==numOfQues.length ){
        enableNextForKC();
    }
    }
    }, 1000);
}
//timmer--------------------------------------------end
