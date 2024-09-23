/*
Created by: Thirumohan & Team
Date: Jan 2018
*/

var isTab = false;
var isMobile = false;
var isIpad = false;
var isLandscapeRequired = true;

var windowDim = {
     w: 0,
     h: 0
}
var mobileLandscape = false;


$(document).ready(function() {
     init()
})

var controller

function init() {
     if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {
          isTab = true
     }

     if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
          isMobile = true
     }

     imageLoader('startAnimation("f_loaderImage")')

     controller = new Controller()
     initEnscroll()
     stopMainScroll()
     winResize();

     $(window).on("wheel mousewheel", function(e) {
          e.preventDefault();
     });
       $("#f_gadgetPopup").removeClass('gadget_top gadget_bottom');

         $("#f_gadgetPatch").removeClass('gadget_patch_top gadget_patch_bottom');
         setTimeout(function() {
             if (isMobile && !isIpad) {
                 $("#f_gadgetPopup").addClass('gadget_bottom');
             } else {
                 $("#f_gadgetPopup").addClass('gadget_top');
             }
         }, 50)
}

window.addEventListener('resize', winResize);

function winResize() {

     setTimeout(function() {
          //  alert(window.innerWidth)
          windowDim.w = window.innerWidth;
          windowDim.h = window.innerHeight;
          updateCSS();
     }, 50)
}

function updateCSS() {
     if (isTab) {
          $('#f_wrapper').css({
               'height': windowDim.h
          });

          if (window.innerHeight > window.innerWidth) {
               mobileLandscape = false;
          } else {
               mobileLandscape = true;
          }
     }

     if (!isLandscapeRequired) {
          if (mobileLandscape && isMobile) {
               $("#f_orientationInfo").show();
               if (_hasAudio == 'true') {
                    _playbackView.pauseMedia();
               }
          } else {
               $("#f_orientationInfo").hide();
               if (_hasAudio == 'true') {
                    _playbackView.checkPlayPause();
               }
          }
     }
}

function initEnscroll() {

     $('#f_transContent').enscroll({
          verticalTrackClass: 'transTrack',
          verticalHandleClass: 'transHandle'

     })

     $('#f_resourceContent').enscroll({
          verticalTrackClass: 'resourceTrack',
          verticalHandleClass: 'resourceHandle'
     })

     $('#f_glossaryCol1').enscroll({
          verticalTrackClass: 'glossaryTrack',
          verticalHandleClass: 'glossaryHandle'
     })
     $('#f_glossaryCol2').enscroll({
          verticalTrackClass: 'glossaryTrack',
          verticalHandleClass: 'glossaryHandle'
     })
     $('#f_glossaryCol3').enscroll({
          verticalTrackClass: 'glossaryTrack',
          verticalHandleClass: 'glossaryHandle'
     })

     $('#f_menuContent').enscroll({
          verticalTrackClass: 'menuTrack',
          verticalHandleClass: 'menuHandle'
     })

     $('#f_menuContent').css({
          'width': '700px',
          'height': '361px',
          'padding-right': '0px'
     })

     $('#f_transContent').css({
         'width': '334px',
         'padding-right': '0px'
     })

     $('#f_glossaryCol1').css({
          'width': '40px',
          'height': '361px',
          'padding-right': '0px'
     })
     $('#f_glossaryCol2').css({
          'width': '220px',
          'height': '361px',
          'padding-right': '0px'
     })
     $('#f_glossaryCol3').css({
          'width': '440px',
          'height': '361px',
          'padding-right': '0px'
     })
}

function stopMainScroll() {
     $(document).off('mouseup').on('mouseup', function(e) {
          $(document).focus()
     })

     $(document).off('touchend').on('touchend', function(e) {
          $(document).focus()
     })

     $(document).off('mousemove').on('mousemove', function(e) {
          // event.preventDefault()
     })

     $(document).off('touchmove').on('touchmove', function(e) {
          // event.preventDefault()
     })
}
