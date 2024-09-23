var model
var _menuView
var _glossaryView
var _resourceView
var _controller
var ccTextToggle = false
var _pagePreloadFlag = true
var _hasAudio = ''
var _hasVideo = ''
var _preloadData = {}
var _ccOpenFlag = false
var _ccTxt = ''
var _transTxt = ''
var _navigation = '';
var settingInfo = {};
var _videoTagReplaced = false;
var _menuOpenFirstTime = false;
var _isKnowledgeCheck = false;
var _transcriptOpened = false;
var quizTime = null;
var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
var preloadImgs = [{
     src: 'preload1'
}, {
     src: 'preload2'
}, {
     src: 'preload3'
}, {
     src: 'preload4'
}, {
     src: 'preload5'
}, {
     src: 'preload6'
}, {
     src: 'preload7'
}, {
     src: 'preload8'
}, {
     src: 'preload9'
}, {
     src: 'preload10'
}, {
     src: 'preload11'
}, {
     src: 'preload12'
}, {
     src: 'preload13'
}, {
     src: 'preload14'
}, {
     src: 'preload15'
}, {
     src: 'preload16'
}, {
     src: 'preload17'
}, {
     src: 'preload18'
}, {
     src: 'preload19'
}, {
     src: 'preload20'
}, {
     src: 'preload21'
}, {
     src: 'preload22'
}, {
     src: 'preload23'
}]

var Controller = function() {
     _controller = this
     this.preLoadImgFlg = false
     this.jsonLoadFlg = false

     model = new Model()
     model.loadJson()
     model.addCustomEvent('ready', this.readyToPageLoad)

     menuBtn = this.assignControls($('#f_menuBtn'))
     menuBtn = this.assignControls($('#f_menuBtn_bottom'))
     gadgetBtn = this.assignControls($('#f_gadgetBtn'))
     menuClose = this.assignControls($('#f_menuClose'))
     transBtn = this.assignControls($('#f_transcriptBtn'))
     transBtn = this.assignControls($('#f_transcriptBtn_bottom'))
     transClose = this.assignControls($('#f_transClose'))
     pageContiner = this.assignControls($('#f_pageLoader'))
     backBtn = this.assignControls($('#f_backBtn'))
     nextBtn = this.assignControls($('#f_nextBtn'))
     homeBtn = this.assignControls($('#f_homeBtn'))
    f_homeBtn_bottom = this.assignControls($('#f_homeBtn_bottom'))

     helpBtn = this.assignControls($('#f_helpBtn'))
     helpBtn = this.assignControls($('#f_helpBtn_bottom'))
     helpClose = this.assignControls($('#f_helpClose'))

     ccBtn = this.assignControls($('#f_ccBtn'))

     glossBtn = this.assignControls($('#f_glossaryBtn'))
     glossClose = this.assignControls($('#f_glossaryClose'))

     resourBtn = this.assignControls($('#f_resourceBtn'))
     resourClose = this.assignControls($('#f_resourceClose'))

     restartButton = this.assignControls($('#restart_button'))
	 resumeButton = this.assignControls($('#resume_button'))

     courseTitle = $('#f_courseTitle').find('p')
     pageTitle = $('#f_pageTitle').find('p')
     pageCounter = $('#f_pageCounter').find('p')
     transText = $('#f_transText')

     this.totalPages = -1
     this.pageCnt = 0

     transHeader = $('#f_transcriptContainer')
     transHeader.draggable({
          containment: 'parent'
     })


     preLoadImage()
}

function preLoadImage() {
     var loadCnt = 0
     for (var i = 0; i < preloadImgs.length; i++) {
          preloadImgs[i].img = new Image()
          preloadImgs[i].img.src = $('#' + preloadImgs[i].src + '').attr('src')

          preloadImgs[i].img.onload = function() {
               loadCnt++
               if (loadCnt == preloadImgs.length) {
                    _controller.preLoadImgFlg = true
                    _controller.checkPreLoaderHide()
               }
          }
     }
}

Controller.prototype.checkPreLoaderHide = function() {
     if (this.preLoadImgFlg && this.jsonLoadFlg) {
          _menuView = new MenuView()
          _menuView.createMenu(model.menuData)
          _menuView.addCustomEvent('MenuClicked', _controller.menuClicked)

          this.totalPages = _menuView.totalPages - 1;

          var pageDetail = _menuView.getPageDetails(this.pageCnt)
          var _courseTitle = pageDetail.courseTitle
          var _pageTitle = pageDetail.heading
          courseTitle.html(_courseTitle)
          pageTitle.html(_pageTitle)
          pageCounter.html((this.pageCnt + 1) + ' / ' + (this.totalPages + 1))


          _glossaryView = new GlossaryView()
          _glossaryView.createGlossary(model.glossaryData)

          _resourceView = new ResourcesView()
          _resourceView.createResources(model.resourceData)

          _playbackView = new PlaybackView()
          _playbackView.addCustomEvent('ready', this.mediaStartPlay)
          _playbackView.addCustomEvent('pagecompleted', this.pageCompleted)
          _playbackView.addCustomEvent('pageprogress', this.pageInProgress)
          _menuView.hideMenuContainer()
          _menuView.hideMenuTab()
          $('#f_menuPopup').hide()
          $('#f_menuContainer').hide()
          $('#f_menuPopup').css({
               'z-index': 9960
          });

          settingInfo = model.settingData;

          _navigation = settingInfo.strictNavigation;
          if (isTab || isChrome) {
               $('#f_preloader').hide()
               $('#f_pagePreloader').hide()

               $('#f_ipadPlayBtnHolder').show()
               $('#f_ipadPlayBtn').off('click mouseenter mouseleave').on('click mouseenter mouseleave', function(e) {
                    switch (e.type) {
                         case "click":
                              var _currentAudioMedia = document.getElementById(
                                   'courseAudio')
                              _currentAudioMedia.src = 'js/utils/initAudio.mp3'
                              _currentAudioMedia.load()
                              _currentAudioMedia.addEventListener(
                                   'loadeddata',
                                   function() {
                                        _currentAudioMedia.play()
                                   })


                            var _currentVideoMedia = document.getElementById(
                                   'courseVideo')
                                   //_currentVideoMedia.src = 'js/utils/initVideo.mp4'
                              _currentVideoMedia.load()

                              _currentVideoMedia.addEventListener(
                                   'loadeddata',
                                   function() {
                                        _currentVideoMedia.play();
                                   })

                              _currentVideoMedia.addEventListener("ended",
                                   function() {
                                        //$("#courseVideo").remove();
                                        // _currentVideoMedia = null;
                                   })

                              $('#f_ipadPlayBtnHolder').hide()
							  if (isScorm) {
								initCourseStatus();
								if (pageCntSCO != 0) {
									showResumeButton();
								} else {
									_controller.updateViewNow();
								}
							  }else{
								_controller.updateViewNow();
							  }
                              break;
                         case "mouseenter":
                              break;
                         case "mouseleave":
                              break;
                    }
               })
          } else {
               $('#f_ipadPlayBtnHolder').hide()
                if (isScorm) {
					initCourseStatus();
					if (pageCntSCO != 0) {
						showResumeButton();
					} else {
						_controller.updateViewNow();
					}
				}else{
					_controller.updateViewNow();
				}
          }
     }
}

Controller.prototype.readyToPageLoad = function() {
     _controller.jsonLoadFlg = true
     _preloadData = model.preloadData
     preLoadAllData()
     _controller.checkPreLoaderHide()
}


function showResumeButton() {
    $("#resumeBlock").show();
    $("#resume_button").off('click').on('click', resumePage);
    $("#restart_button").off('click').on('click', restartPage);
}

function preLoadAllData() {
     // images preload
     for (var i = 0; i < _preloadData.images.length; i++) {
          var img = new Image()
          img.src = _preloadData.images[i].src
          img.onload = function() {}
     }

     // audio preload
     for (var j = 0; j < _preloadData.audios.length; j++) {
          var audio = new Audio()
          audio.src = _preloadData.audios[j].src
          audio.load()
          audio.addEventListener('loadeddata', preLoadmediaLoaded)
     }

     // video preload
     for (var k = 0; k < _preloadData.videos.length; k++) {
          var video = document.createElement('video')
          video.src = _preloadData.videos[k].src
          video.load()
          video.addEventListener('loadeddata', preLoadmediaLoaded)
     }
}

function preLoadmediaLoaded() {}

Controller.prototype.menuClicked = function() {
     _controller.pageCnt = _menuView.currentPage
     _controller.updateViewNow()

     $('#f_menuContainer').hide(400, function() {
          $('#f_menuPopup').hide()
     })
}

Controller.prototype.assignControls = function(_btn) {
     _btn.on('click mouseenter mouseleave', this.fnClick)
     return _btn
}

Controller.prototype.fnClick = function(e) {
     e.stopPropagation();
     var id = e.currentTarget.id;
     switch (id) {
          case 'f_gadgetBtn':
               gadgetNavOver(e.type, id);
               if (e.type == "click") {
                    var gadgetToggle = $('#f_gadgetPopup').is(':visible');
                    if (gadgetToggle) {
                         hideGadget();
                    } else {
                         showGadget();
                    }
               }
               break

          case 'f_menuBtn':
               gadgetNavOver(e.type, id);
               if (e.type == "click") {
                    $('#f_menuPopup').show();
                    _menuView.updateCompletedStatus();
                    $('#f_menuContainer').show(400);





                    hideGadget();
                    if (_hasAudio == 'true') {
                         _playbackView.pauseMedia();
                    }
                        $('#f_transContent').scrollTop(0);
               }
               break
               case 'f_menuBtn_bottom':
                    gadgetNavOver(e.type, id);
                    if (e.type == "click") {
                         $('#f_menuPopup').show();
                         _menuView.updateCompletedStatus();


                         $('#f_menuContainer').show(400);




                         hideGadget();
                         if (_hasAudio == 'true') {
                              _playbackView.pauseMedia();
                         }
                    }
                    break

          case 'f_menuClose':
               gadgetNavOver(e.type, id);
               if (e.type == "click") {
                 $('#f_menuContent').scrollTop(0);
                    $('#f_menuContainer').hide(400, function() {
                         _menuView.hideMenuTab();
                         $('#f_menuPopup').hide();
                    })
                    if (_hasAudio == 'true') {
                         _playbackView.checkPlayPause();
                    }
               }
               break

          case 'f_transcriptBtn':
               gadgetNavOver(e.type, id);
               if (e.type == "click") {

                _transcriptOpened = true;
                    $('#f_transcriptContainer').show(200);
                    var gadgetToggle = $('#f_gadgetPopup').is(':visible');


                    if (gadgetToggle) {
                         hideGadget();
                    }
                    $('#f_transContent').scrollTop(0);
               }
               break

                         case 'f_transcriptBtn_bottom':
                              gadgetNavOver(e.type, id);
                              if (e.type == "click") {
                               _transcriptOpened = true;
                                   $('#f_transcriptContainer').show(200);


                                   var gadgetToggle = $('#f_gadgetPopup').is(':visible');
                                   if (gadgetToggle) {
                                        hideGadget();
                                   }
                              }
                              break

          case 'f_transClose':
               gadgetNavOver(e.type, id);
               if (e.type == "click") {
                _transcriptOpened = false;
                    $('#f_transcriptContainer').hide(200);
               }
               break

          case 'f_glossaryBtn':
               gadgetNavOver(e.type, id);
               if (e.type == "click") {
                    $('#f_glossaryPopup').show();
                    $('#f_glossaryContainer').show(400);
                    hideGadget()
                    if (_hasAudio == 'true') {
                         _playbackView.pauseMedia();
                    }
               }
               break

          case 'f_glossaryClose':
               gadgetNavOver(e.type, id);
               if (e.type == "click") {
                    $('#f_glossaryContainer').hide(400, function() {
                         $('#f_glossaryPopup').hide();
                    })
                    if (_hasAudio == 'true') {
                         _playbackView.checkPlayPause();
                    }
               }
               break

          case 'f_resourceBtn':
               gadgetNavOver(e.type, id);
               if (e.type == "click") {
                    $('#f_resourcePopup').show();
                    $('#f_resourceContainer').show(400);
                    hideGadget();
                    if (_hasAudio == 'true') {
                         _playbackView.pauseMedia();
                    }
               }
               break

          case 'f_resourceClose':
               gadgetNavOver(e.type, id);
               if (e.type == "click") {
                    $('#f_resourceContainer').hide(400, function() {
                         $('#f_resourcePopup').hide();
                    })
                    if (_hasAudio == 'true') {
                         _playbackView.checkPlayPause();
                    }
               }
               break

           case 'f_helpBtn':
                gadgetNavOver(e.type, id);
                if (e.type == "click") {
                     $('#f_helpPopup').show();
                     $('#f_helpContainer').show(400);
                     hideGadget();
                     if (_hasAudio == 'true') {
                          _playbackView.pauseMedia();
                     }
                }
                break

           case 'f_helpClose':
                gadgetNavOver(e.type, id);
                if (e.type == "click") {
                     $('#f_helpContainer').hide(400, function() {
                          $('#f_helpPopup').hide();
                     })
                     if (_hasAudio == 'true') {
                          _playbackView.checkPlayPause();
                     }
                }
                break
                case 'f_helpBtn_bottom':
                     gadgetNavOver(e.type, id);
                     if (e.type == "click") {
                          $('#f_helpPopup').show();
                          $('#f_helpContainer').show(400);
                          hideGadget();
                          if (_hasAudio == 'true') {
                               _playbackView.pauseMedia();
                          }
                     }
                     break


          case 'f_backBtn':
               navOver(e.type, id)
               if (e.type == "click") {
                    _controller.pageCnt--;
                    _controller.updateViewNow();
                    $ (".transHandle").css({'top':'0px'});
                    $ ("#f_transText").css({'margin-top': '0px'});
                    $('#f_transcriptContainer').hide();

               }
               break
          case 'f_nextBtn':
               navOver(e.type, id)
               if (e.type == "click") {
                    _controller.pageCnt++;
                    _controller.updateViewNow();
                    $ (".transHandle").css({'top':'0px'});
                  $ ("#f_transText").css({'margin-top': '0px'});
                    $('#f_transcriptContainer').hide();
               }
               break

          case 'f_homeBtn':
               gadgetNavOver(e.type, id)
               if (e.type == "click") {
                    _controller.pageCnt = 0;
                    _controller.updateViewNow();
               }
               break
               case 'f_homeBtn_bottom':
                    gadgetNavOver(e.type, id)
                    if (e.type == "click") {
                         _controller.pageCnt = 0;
                         _controller.updateViewNow();
                    }
                    break

          case 'f_ccBtn':
               gadgetNavOver(e.type, id)
               if (e.type == "click") {
                    if (ccTextToggle) {
                         _playbackView.hideCCText();
                         ccTextToggle = false;
                    } else {
                         ccTextToggle = true;
                         _playbackView.showCCText();
                    }
                    var gadgetToggle = $('#f_gadgetPopup').is(':visible');
                    if (gadgetToggle) {
                         hideGadget();
                    }
               }
               break

          case 'restart_button':
			   if (e.type == "click") {
				restartPage();
			   }
               break

          case 'resume_button':
			   if (e.type == "click") {
				resumePage();
			   }
          default:
               // alert("not a button")
               break
     }
}

function navOver(_type, _id) {
     switch (_type) {
          case "click":
               $("#" + _id).removeClass("navOverOne");
               break;
          case "mouseenter":
               $("#" + _id).removeClass("navOverOne").addClass("navOverOne");
               break;
          case "mouseleave":
               $("#" + _id).removeClass("navOverOne");
               break;

     }
}

function gadgetNavOver(_type, _id) {
     switch (_type) {
          case "click":
               $("#" + _id).removeClass("blueColor");
               break;
          case "mouseenter":
               $("#" + _id).removeClass("blueColor").addClass("blueColor");
               break;
          case "mouseleave":
               $("#" + _id).removeClass("blueColor");
               break;

     }
}

function hideGadget() {
     $('#f_gadgetPopup').stop().animate({
          'height': 0
     }, 300, function() {
          $('#f_gadgetPatch').stop().animate({
               'height': 0
          }, 0, function() {
               $('#f_gadgetPopup').hide()
          })
     })
}

function showGadget() {
     $('#f_gadgetPopup').show()
     $('#f_gadgetPatch').stop().animate({
          'height': 7
     }, 50, function() {
          $('#f_gadgetPopup').stop().animate({
               'height': 143
          }, 300)
     })
}

Controller.prototype.updateViewNow = function() {
  if(quizTime != null){
clearInterval(quizTime);
quizTime = null;
}
    _isKnowledgeCheck = false;
	$('.slidertimer').hide();
     Controller.prototype.pageInProgress();
     if (typeof tweenTimeline != 'undefined') {
          if (tweenTimeline) {
               tweenTimeline.kill()
          }
     }

     if (!_pagePreloadFlag) {
          imageLoader('startAnimation("f_pageLoaderImage")')
          $('#f_pagePreloader').show()
     }

     var pageDetail = _menuView.getPageDetails(this.pageCnt)
	 pageCntSCO = this.pageCnt;
	 checkCompletionStatus();
     var url = pageDetail.URL
     var _courseTitle = pageDetail.courseTitle
     var _pageTitle = pageDetail.heading
     _hasAudio = pageDetail.hasAudio
     var hasVideo = pageDetail.hasVideo
     var _pageType = pageDetail.pageType

     var _moduleNo = url.split('/')[1];
     _moduleNo = _moduleNo.split('_')[1];

     $('#path').html(url)


     //swap video tag

     if (_videoTagReplaced) {
          _videoTagReplaced = false;
          $(".dummyDiv").replaceWith($('#courseVideo'));
          $("#f_dummyVideoHolder").append("<div class='dummyDiv'></div>");
     }

     pageContiner.find('div').remove()
     pageContiner.html('')
     if (this.pageCnt == 0) {
          this.backDisable()
     } else {
          this.backEnable()
     }

     if (this.pageCnt == this.totalPages) {
			this.nextDisable()
     } else {
			this.nextDisable()
     }

     if (_navigation) {
          _menuView.removeButtonNavigation(this.pageCnt);
          if (visitedArr[this.pageCnt] == 1) {
               this.nextEnable();
               this.nextDisable();
          } else {

          }
     }

     ccBtn.off('click mouseenter mouseleave')
     ccBtn.css({
          'opacity': 0.5,
          'cursor': 'default'
     })
     _playbackView.hideCCText()
     _playbackView.assessmentFlag = false;

     if (_pageType != undefined) {
          this.nextDisable();
          this.backDisable();
     }
     _playbackView.removePlayBackListener()

     courseTitle.html(_courseTitle)
    // pageTitle.html('Module ' + _moduleNo + ' > ' + _pageTitle);
     pageTitle.html(_pageTitle);

     pageCounter.html((this.pageCnt + 1) + ' / ' + (this.totalPages + 1))
     pageContiner.load(url, function() {})
}

function disableNavigation() {
     _controller.nextDisable();
     _controller.backDisable();
     _playbackView.removePlayBackListener()
}

function pagePreLoad() {
     if (_pagePreloadFlag) {
          _pagePreloadFlag = false
          stopAnimation()
          $('#f_preloader').hide()
          $('#f_pagePreloader').hide()
     } else {
          stopAnimation()
          $('#f_pagePreloader').hide()
           $('#f_transcriptContainer').hide();
     }

}


function loadMedia(_src, ccObj, _audioSync, _restriction, _transcriptObj,
     _videoId) {
     _playbackView.startPlayback(_src, ccObj, _audioSync, _restriction, _videoId)
     _ccTxt = ccObj
     _transTxt = '';
     _transTxt = _transcriptObj;
     _controller.updateTranscriptView();

     if(_src == null && _videoId == null){
        $('#f_transcriptBtn').off('click mouseenter mouseleave').css({'opacity': '0.5', 'cursor': 'default'});
        $('#f_transcriptBtn_bottom').off('click mouseenter mouseleave').css({'opacity': '0.5', 'cursor': 'default'});
        $('#f_transcriptContainer').hide();
     }else{
        $('#f_transcriptBtn').css({'opacity': '1', 'cursor': 'pointer'});
        transBtn = _controller.assignControls($('#f_transcriptBtn'));
        $('#f_transcriptBtn_bottom').css({'opacity': '1', 'cursor': 'pointer'});
        transBtn = _controller.assignControls($('#f_transcriptBtn_bottom'));

        if(_transcriptOpened){
            $('#f_transcriptContainer').show();


        }else{
            $('#f_transcriptContainer').hide();
        }
     }
}

Controller.prototype.updateTranscriptView = function() {
     transText.empty();
     var txt = ' ';
     var _typeof = '';
     for (var i = 0; i < _transTxt.length; i++) {
          _typeof = typeof _transTxt[i];

          if (_typeof == 'string') {
               transText.append('<p>' + _transTxt[i] + '</p>')
          } else {
               transText.append('<ul></ul>')
               for (var j = 0; j < _transTxt[i].length; j++) {
                    transText.find('ul').append('<li>' + _transTxt[i][j] +
                         '</li>')
               }
          }
     }
     console.log("hi");
}

Controller.prototype.mediaStartPlay = function() {
     if (_ccTxt != null) {
          ccBtn.on('click mouseenter mouseleave', _controller.fnClick)
          ccBtn.css({
               'opacity': 1,
               'cursor': 'pointer'
          })
     } else {
          ccBtn.off('click mouseenter mouseleave')
          ccBtn.css({
               'opacity': 0.5,
               'cursor': 'default'
          })
     }

     if (ccTextToggle) {
          _playbackView.showCCText()
     } else {
          _playbackView.hideCCText()
     }
}
Controller.prototype.pageCompleted = function() {
     pageVisited()
}

Controller.prototype.pageInProgress = function() {
     if (indicator != null) {
          indicator.kill()
          $('#f_nextIndicator').hide()
     }
}

function pageVisited() {
     _menuView.updateVisitedStatus(_controller.pageCnt)

     if (_controller.pageCnt == _controller.totalPages) {
          _controller.nextDisable()
     } else {
		indicatorAnimation();
		$('#f_nextIndicator').show();
         _controller.nextEnable()
     }
}


function resumePage() {
    $("#resumeBlock").hide();
    getAllData();
}

function restartPage() {
    $("#resumeBlock").hide();
    var _menuData = model.menuData;
	visitedArr = [];
	_controller.pageCnt = 0;
	for (var i = 0; i < _menuData.length; i++) {
        if (_menuData[i].module.URL != '#') {
            visitedArr.push(0);
        } else {
            for (var j = 0; j < _menuData[i].module.page.length; j++) {
                if (_menuData[i].module.page[j].URL != '#') {
                    visitedArr.push(0);
                } else {
                    for (var k = 0; k < _menuData[i].module.page[j].subpage.length; k++) {
                        visitedArr.push(0);
                    }
                }
            }
        }
    }
    _controller.updateViewNow();
}

function getAllData() {
    _controller.pageCnt = pageCntSCO;
	visitedArr = bookMarkArray;
	_controller.updateViewNow();
}

Controller.prototype.backDisable = function() {
     backBtn.off('click mouseenter mouseleave', this.fnClick)
     backBtn.css({
          'cursor': 'default',
          opacity: 0.5
     })

     homeBtn.off('click mouseenter mouseleave', this.fnClick)
     homeBtn.css({
          'cursor': 'default',
          opacity: 0.5
     })
     f_homeBtn_bottom.off('click mouseenter mouseleave', this.fnClick)
     f_homeBtn_bottom.css({
          'cursor': 'default',
          opacity: 0.5
     })
}

Controller.prototype.backEnable = function() {
     backBtn.off('click mouseenter mouseleave').on(
          'click mouseenter mouseleave', this.fnClick)
     backBtn.css({
          'cursor': 'pointer',
          opacity: 1
     })

     homeBtn.off('click mouseenter mouseleave').on(
          'click mouseenter mouseleave', this.fnClick)
     homeBtn.css({
          'cursor': 'pointer',
          opacity: 1
     })
     f_homeBtn_bottom.off('click mouseenter mouseleave').on(
          'click mouseenter mouseleave', this.fnClick)
     f_homeBtn_bottom.css({
          'cursor': 'pointer',
          opacity: 1
     })
}

Controller.prototype.nextDisable = function() {
     nextBtn.off('click mouseenter mouseleave', this.fnClick)
     nextBtn.css({
          'cursor': 'default',
          opacity: 0.5
     })
}

Controller.prototype.nextEnable = function() {
     nextBtn.off('click mouseenter mouseleave').on(
          'click mouseenter mouseleave', this.fnClick)
     nextBtn.css({
          'cursor': 'pointer',
          opacity: 1
     })
}


// ---------- dummy input box -------------
$('#dummyInput').on("keypress", function(e) {
     if (e.keyCode == 13) {
          var tmpPNo = parseInt($(this).val())
          _controller.pageCnt = tmpPNo - 1;
          _controller.updateViewNow()
          return false; // prevent the button click from happening
     }
});
