// ---------- setting start ---------------
var _preloadData, _pageData
var _pagePreloadArray = { image: -1, audio: -1, video: 1, data: -1 }; // item not availble please assign value 1.
var jsonSRC = 'pages/assessment/data/data.json?v='
var _pageAudioSync = true
var _popupAudioSync = false
var _forceNavigation = true
var _audioIndex = 0
var _videoId = null

// ---------- setting end ---------------

var tweenTimeline
var selectedAnswer = 0
var noOfAttempted = 0
var feedTxt, audioSRC, ccIndx
var questionCnt = 0
var activityType = ''
var answerArr = []
var selectedAns = []
var totalQuestions = 0
var selectedArr = []
var ansCnt = 0
var questionArray = []
var currentQuestion = 0
var retakeFlag = false;

// ------------------ common function start ------------------------------------------------------------------------
$(document).ready(function() {
    _preloadData = new PagePreload()
    _preloadData.initObj(_pagePreloadArray, jsonSRC)
    _preloadData.addCustomEvent('ready', pageLoaded)
})

function pageLoaded() {
    _pageData = _preloadData.jsonData
    assignAudio(_pageData.audioSRC, _audioIndex, _pageAudioSync, _forceNavigation, _videoId)
    createIntroPage()
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

function createIntroPage() {
    totalQuestions = _pageData.questions.length
    for (var i = 0; i < _pageData.introtext.length; i++) {
        $('#f_assetIntroText').append('<p class="f_introText" id="f_intro_' + i + '">' + _pageData.introtext[i] + '</p>')
    }

    $('#f_assetIntroImg1').append('<img src=' + _pageData.bgImgs[1].imageSRC + '>')
    $('#f_assetIntroText').append('<button id = "f_beginAssessmentBtn"></button>')
    $('#f_beginAssessmentBtn').html(_pageData.beginButtontext)
    $('#f_beginIns').html(_pageData.begintxt)

    generateTails()
}

function generateTails() {
    /*
    var CW = $("#f_mc_puzzleContainer").outerWidth() - 10;
    var CH = $("#f_mc_puzzleContainer").outerHeight() - 10;
    var totalTiles = 10;
    var noOfTileinCol = 3;
    var noOfTileinRow = 3;
    var colorCol = ["red", "blue", "green"];
    var colorRow = ["#a94442", "#31708f", "#3c763d", "#8a6d3b", "#8a3d2b"];
    var colHeight = Math.round(CH / noOfTileinCol)

    var noCol = Math.round(totalTiles / noOfTileinRow)
    var reminder = totalTiles % noOfTileinCol;
    var colDim = [];
    var rowCnt = [3, 4, 4]

    console.log(totalTiles / noOfTileinCol)



    for (var j = 0; j < totalTiles; j++) {
        colDim.push([])
        switch (reminder) {
            case 0:
                colDim[j].push(Math.round(CW / noOfTileinRow));
                colDim[j].push(colHeight);
                break;
            case 1:
                if (j < 3 && j > 7) {
                    colDim[j].push(Math.round(CW / noOfTileinRow));
                } else {
                    colDim[j].push(Math.round(CW / (noOfTileinRow + (reminder / 2))));
                }
                colDim[j].push(colHeight);
                break;
            case 2:
                if (j < 3) {
                    colDim[j].push(Math.round(CW / noOfTileinRow));
                } else {
                    colDim[j].push(Math.round(CW / (noOfTileinRow + (reminder / 2))));
                }
                colDim[j].push(colHeight);
                break;
        }
    }

    console.log("colDim", colDim)
    var cnt = 0;
    var tCnt = 0;




    for (var a = 0; a < noOfTileinCol; a++) {
        cnt = 0
        $('#f_mc_puzzleContainer').append('<div class="tileCol"></div>')
        $(".tileCol").eq(a).css({ "float": "left", "background-color": colorCol[a], "width": "100%", "height": colHeight });


        for (var b = 0; b < rowCnt[a]; b++) {
            $('#f_mc_puzzleContainer').find(".tileCol").eq(a).append('<button type="button " class="tile "></button>');
            console.log(colDim[tCnt][0], colDim[tCnt][1]);
            $(".tile").eq(tCnt).css({ "background-color": colorRow[cnt], "width": colDim[tCnt][0], "height": colDim[tCnt][1] });
            cnt++
            tCnt++
        }
    }

*/

    $('#f_mc_puzzleContainer').empty();
    $('#f_mc_puzzleContainer').append('<div id="resultImg"></div>');

    if (retakeFlag) {
        $("#resultImg").show();
    }

    for (var i = 0; i < totalQuestions; i++) {
        questionArray[i] = -1
        if (i % 2) {
            $('#f_mc_puzzleContainer').append('<button type="button" class="tile col1" id="tile_' + i + '"></button>')
        } else {
            $('#f_mc_puzzleContainer').append('<button type="button" class="tile col2" id="tile_' + i + '"></button>')
        }
    }

    $('.tile').off('click').on('click', showNextQuestion)
    $('.tile').off('click').css({ 'cursor': 'default' });
    $('.tile').eq(currentQuestion).off('click').addClass('puzzleSelected');
    questionArray[currentQuestion] = 1
}

function startAssessment() {
    loadQuestions()
    $('#f_beginAssessmentBtn').off('click')
    $('#f_assessmentIntro').hide()
    $('#f_assessmentContainer').show()

    animationChangePos()
    disableNavigation();
}

function showNextQuestion() {
    var selected = parseInt($(this).attr('id').split('_')[1])
    currentQuestion = selected;
    $('.tile').off('click').css({ 'cursor': 'default' })

    $('#tile_' + currentQuestion).off('click').addClass('puzzleSelected').css({ 'cursor': 'default' })
    loadQuestions()
}

function loadQuestions() {
    answerArr = _pageData.questions[currentQuestion].ansId
    $('#f_mc_optionContainer').empty()
    selectedArr = []
    $('#f_mc_questionText').html(_pageData.questions[currentQuestion].question)
    $('#f_mc_ins').html(_pageData.questions[currentQuestion].instruction[0])
    $('#f_mc_insText').html(_pageData.questions[currentQuestion].instruction[1])

    if (_pageData.questions[currentQuestion].ansId.length == 1) {
        activityType = 'single'
        for (var i = 0; i < _pageData.questions[currentQuestion].options.length; i++) {
            selectedArr.push(0)
            $('#f_mc_optionContainer').append('<button type="button" class="f_mc_optionBtn" id="optionBtn_' + i + '"><span class = "f_mc_optionType radio"><span class = "f_mc_innerBox"></span></span><span class = "f_mc_optionText">' + _pageData.questions[currentQuestion].options[i] + '</span></button>')
        }
    } else {
        activityType = 'multiselect'
        for (var j = 0; j < _pageData.questions[currentQuestion].options.length; j++) {
            selectedArr.push(0)
            $('#f_mc_optionContainer').append('<button type="button" class="f_mc_optionBtn" id="optionBtn_' + j + '"><span class = "f_mc_optionType"><span class = "f_mc_innerBox"></span></span><span class = "f_mc_optionText">' + _pageData.questions[currentQuestion].options[j] + '</span></button>')
        }
    }

    $('#f_mc_optionContainer').append('<button id="f_mc_submitBtn" type="button">Submit</button>')
    $('.f_mc_optionBtn').off('click mouseenter mouseleave').on('click mouseenter mouseleave', selectOption)
    disableSubmit()
}

function selectOption(e) {
    var type = e.type
    var num = parseInt($(this).attr('id').split('_')[1])
    switch (type) {
        case 'click':
            if (activityType == 'single') {
                selectedArr[num] = 1
                $('.f_mc_optionBtn').find('.f_mc_innerBox').removeClass('f_mc_selected')
                $(this).find('.f_mc_innerBox').addClass('f_mc_selected')
                $('#f_mc_submitBtn').show()
            } else {
                if (selectedArr[num] == 0) {
                    selectedArr[num] = 1
                    $(this).find('.f_mc_innerBox').addClass('f_mc_selected')
                } else {
                    selectedArr[num] = 0
                    $(this).find('.f_mc_innerBox').removeClass('f_mc_selected')
                }

                $('#f_mc_submitBtn').show()
            }
            break

        case 'mouseenter':
            $('.f_mc_optionBtn').removeClass('f_mc_optionOver')
            $(this).addClass('f_mc_optionOver')
            break

        case 'mouseleave':
            $('.f_mc_optionBtn').removeClass('f_mc_optionOver')
            break
    }

    var submitFlg = false
    for (var i = 0; i < selectedArr.length; i++) {
        if (selectedArr[i] == 1) {
            submitFlg = true
        }
    }

    if (submitFlg) {
        enableSubmit()
    } else {
        disableSubmit()
    }
}

function disableSubmit() {
    $('#f_mc_submitBtn').off('click mouseenter mouseleave')
    $('#f_mc_submitBtn').css({ 'opacity': 0.5, 'cursor': 'default' })
}

function enableSubmit() {
    $('#f_mc_submitBtn').css({ 'opacity': 1, 'cursor': 'pointer' })
    $('#f_mc_submitBtn').off('click mouseenter mouseleave').on('click mouseenter mouseleave', submitClicked)
}

function submitClicked(e) {
    var type = e.type
    switch (type) {
        case 'click':
            $(this).hide()
            answerValidation()
            $('.f_mc_optionBtn').removeClass('f_mc_optionOver').off('click mouseenter mouseleave').css({ 'cursor': 'default' })

            questionCnt++
            if (questionCnt == totalQuestions) {
                $('#f_mc_submitBtn').off('click mouseenter mouseleave')
                    //$('#f_assessmentContainer').hide()
                createResultPage()
                    //$('.f_AssessmentResult').show()
                return
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

function answerValidation() {
    var cnt = 0
    var multiFlg = false

    if (activityType == 'single') {
        if (selectedArr[answerArr[0]] == 1) {
            questionArray[currentQuestion] = 1
            ansCnt++
        } else {
            questionArray[currentQuestion] = 0
        }
    } else {
        if (selectedArr[answerArr[0]] == 1 && selectedArr[answerArr[1]] == 1) {
            multiFlg = true
        }
        for (var i = 0; i < selectedArr.length; i++) {
            if (selectedArr[i] == 1) {
                cnt++
            }
        }

        if (multiFlg && cnt == 2) {
            ansCnt++
            questionArray[currentQuestion] = 1
        } else {
            questionArray[currentQuestion] = 0
        }
    }

    $('.tile').off('click').on('click', showNextQuestion).css({ 'cursor': 'pointer' })

    for (var a = 0; a < questionArray.length; a++) {
        if (questionArray[a] == 0) {
            $('.tile').eq(a).off('click').removeClass('puzzleSelected col1 col2').addClass('puzzleDisabled').css({ 'cursor': 'default' })
        } else if (questionArray[a] == 1) {
            $('.tile').eq(a).off('click').removeClass('puzzleSelected col1 col2').animate({ opacity: 0 }, 200, function() {
                // $(this).hide()
            })
        }
    }
}

function createResultPage() {
    $('#f_mc_quizContainer').empty()
    $('#f_mc_quizContainer').css({ "padding": "20px" });
    $('#f_mc_quizContainer').append("<div id='f_resultbar'><button id = 'f_retakeAssessmentBtn'></button><p id ='f_resultIns'></p></div>");


    var percentage = ((ansCnt / totalQuestions) * 100).toFixed(2);

    if (percentage >= 80) {
        for (var i = 0; i < _pageData.passresults.length; i++) {
            $('#f_mc_quizContainer').append('<p class="f_introText" id="f_result_' + i + '">' + _pageData.passresults[i] + '</p>')

            $('#f_result_' + 0).addClass("certText")
        }
        //$('#f_mc_optionContainer').append("<img id='f_resultBg' src='" + _pageData.passimage.imageSRC + "'/>")
        $('.f_scoreTxt').html(percentage + ' %')
        $('#f_resultbar').hide()
    } else {
        $('#f_resultbar').show()
        for (var i = 0; i < _pageData.failresults.length; i++) {
            $('#f_mc_quizContainer').append('<p class="f_introText" id="f_result_' + i + '">' + _pageData.failresults[i] + '</p>')
        }
        //$('#f_assessmentResultRight').append("<img id='f_resultBg' src='" + _pageData.failretakeimage.imageSRC + "'/>")
        $('#f_retakeAssessmentBtn').html('Retake')
        $('#f_resultIns').html(_pageData.failresulttext)
        $('.f_scoreTxt').html(percentage + ' %')
        $('#f_retakeAssessmentBtn').off('click').on('click', retakeAssessment)
    }
    ansCnt = 0
}

function retakeAssessment(e) {
    questionCnt = 0
    selectedAnswer = 0
    noOfAttempted = 0
    questionCnt = 0
    answerArr = []
    selectedAns = []
    selectedArr = []
    ansCnt = 0
    questionArray = []
    currentQuestion = 0
    retakeFlag = true;
    generateTails();
    $(".tile").css({ "opacity": 1 });
    $('#f_mc_quizContainer').empty();
    $('#f_mc_quizContainer').css({ "padding": "10px 0 0 10px" });
    $('#f_mc_quizContainer').append('<div id="f_mc_question"><p id="f_mc_questionText"></p><div class="clearfix"></div><div id="f_mc_instruction" style="display: block; opacity: 1;"><p id="f_mc_ins"></p><p id="f_mc_insText"></p></div></div><div id="f_mc_optionContainer"></div>');
    loadQuestions()
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

    tweenTimeline.add(animateFadeIn($('#f_assessmentBase'), 1).play(), 0.8)
    tweenTimeline.add(animateFromMarginLeft($('#f_assetIntroText'), 0.5, 30).play(), 1.5)
    tweenTimeline.add(animateFromMarginRight($('#f_assetIntroImg1'), 0.5, 30).play(), 1.5)
    tweenTimeline.add(animateFadeInDisplayBlock('#f_beginAssessmentBtn', 1).play(), 36)
    tweenTimeline.add(animationComplete('#f_beginAssessmentBtn', 1).play(), 36.7)
}

function animationComplete(_el, _duration) {
    TweenLite.set(_el, {
        clearProps: 'all'
    })
    var tl = new TimelineLite({
        paused: true
    }).to(_el, _duration, {
        opacity: 1,
        onComplete: function() {
            setTimeout(function() {
                $('#f_beginAssessmentBtn').off('click').on('click', startAssessment).css({ 'cursor': 'pointer' })
            }, 50)
        }
    })
    return tl
}

function animationChangePos(_el, _duration) {
    TweenMax.to($('#f_mc_puzzleContainer'), 0.5, { alpha: 1 })

    TweenMax.staggerTo($('.tile'), .5, {
        delay: 0.5,
        alpha: 1,
        ease: SlowMo.ease.config(0.3, 0.7),
        onComplete: function() {
            TweenMax.to($('#f_mc_puzzleContainer'), 0.7, {
                delay: 0.5,
                marginLeft: 30,
                marginRight: 0,
                left: "0%",
                onComplete: function() {
                    $('#resultImg').show();
                }
            })
            TweenMax.to($('#f_mc_quizContainer'), 0.8, { delay: 1.2, marginRight: 30, alpha: 1 })
        }
    }, 0.1)


}