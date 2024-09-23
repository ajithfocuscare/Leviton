// JavaScript Document
var Fscroll = function() {
     _fscroll = this;
     this.fscrollContainer = '';
     this.textContainer = '';
     this.sliderbar = '';
     this.textH = '';
     this.containerH = '';
     this.heightDiff = '';
     this.knobHeight = '';
     this.speed = 5;
     this.posotionYcnt = 0;
     this.knobBar = '';
     this.knobBottom = 0;
     this.setIntervals = null;
     this.animteCnt = 0;
     this.direction = 1;
     this.oldY = 0;
     this.mouseUpFlg = false;
}

Fscroll.prototype.resetScroll = function(){
  if(this.knobBar &&  this.textContainer){
  this.knobBar.style.marginTop = '0px';
  this.textContainer.style.marginTop = '0px';
}
}

Fscroll.prototype.initFscroll = function(_container) {
     var fscrollContainer = document.getElementById(_container);
     this.fscrollContainer = fscrollContainer;
     this.textContainer = fscrollContainer.querySelector('.textContainer');
     this.containerH = fscrollContainer.clientHeight;
     this.textH = this.textContainer.clientHeight;
     this.heightDiff = this.textH - this.containerH;
     this.createSlider();
}

Fscroll.prototype.createSlider = function() {
     var _sliderbar = document.createElement('div');
     _sliderbar.className = 'sliderBar';
     this.fscrollContainer.appendChild(_sliderbar);

     this.sliderbar = _sliderbar;

     var _scrollTrack = document.createElement('div');
     _scrollTrack.className = 'scrollTrack';
     _sliderbar.appendChild(_scrollTrack);

     var _knobBar = document.createElement('div');
     _knobBar.className = 'knobBar';
     _sliderbar.appendChild(_knobBar);

     this.knobHeight = Math.round((this.containerH / this.heightDiff) * 50);
     _knobBar.style.height = this.knobHeight + 'px';

     this.knobBar = _knobBar;
     this.knobBottom = this.containerH - this.knobHeight;

     console.log('hi--', this.textH, this.containerH)

     if (this.textH <= this.containerH) {
          _sliderbar.style.display = 'none';
     } else {
          _sliderbar.style.display = 'block';
          this.addFscrollEventListener();
     }
}

Fscroll.prototype.addFscrollEventListener = function() {
     this.fscrollContainer.addEventListener("wheel", this.fscrollWheel);
     this.fscrollContainer.addEventListener("touchstart", this.fscrollMouseDown);
     this.fscrollContainer.addEventListener("touchend", this.fscrollTouchEnd);
     this.fscrollContainer.addEventListener("mouseup", this.fscrollMouseUp);

     document.addEventListener("mouseup", this.fscrollMouseUp);

     this.sliderbar.addEventListener("mousedown", this.fscrollSliderMouseDown);
     this.sliderbar.addEventListener("touchstart", this.fscrollSliderTouchDown);
}

Fscroll.prototype.fscrollWheel = function(evt) {
     var whheelY = Number(evt.deltaY);
     if (whheelY >= 1) {
          _fscroll.direction = 1;
          _fscroll.posotionYcnt = _fscroll.posotionYcnt + _fscroll.speed;
     } else {
          _fscroll.direction = -1;
          _fscroll.posotionYcnt = _fscroll.posotionYcnt - _fscroll.speed;
     }

     if (_fscroll.posotionYcnt <= 0) {
          _fscroll.posotionYcnt = 0;

     }

     if (_fscroll.posotionYcnt >= _fscroll.knobBottom) {
          _fscroll.posotionYcnt = _fscroll.knobBottom;
     }
     clearInterval(_fscroll.setIntervals);
     _fscroll.setIntervals = null;
     _fscroll.animteCnt = 0;
     _fscroll.setIntervals = setInterval(_fscroll.animate, 30)
}

Fscroll.prototype.fscrollMouseUp = function(evt) {
     if (_fscroll.mouseUpFlg) {
          _fscroll.mouseUpFlg = false;
          _fscroll.textContainer.classList.remove("unselectable");
          _fscroll.fscrollContainer.removeEventListener("mousemove", _fscroll.fscrollMouseMove);
          clearInterval(_fscroll.setIntervals);
          _fscroll.setIntervals = null;
          _fscroll.animteCnt = 0;
          _fscroll.setIntervals = setInterval(_fscroll.animate, 30);
     }
}

Fscroll.prototype.animate = function() {
     _fscroll.animteCnt++;
     if (_fscroll.animteCnt == 10) {
          _fscroll.animteCnt = 0;
          clearInterval(_fscroll.setIntervals);
     }
     if (_fscroll.direction == 1) {
          _fscroll.posotionYcnt = _fscroll.posotionYcnt + 1;
     } else {
          _fscroll.posotionYcnt = _fscroll.posotionYcnt - 1;
     }
     _fscroll.changeContent(_fscroll.posotionYcnt);
}

Fscroll.prototype.fscrollMouseDown = function(evt) {
     _fscroll.mouseUpFlg = false;
     _fscroll.fscrollContainer.addEventListener("mousemove", _fscroll.fscrollMouseMove);
     _fscroll.fscrollContainer.addEventListener("touchmove", _fscroll.fscrollTouchMouseMove);
}

Fscroll.prototype.fscrollTouchEnd = function(evt) {
     _fscroll.fscrollContainer.removeEventListener("touchmove", _fscroll.fscrollTouchMouseMove);
     clearInterval(_fscroll.setIntervals);
     _fscroll.setIntervals = null;
     _fscroll.animteCnt = 0;
     _fscroll.setIntervals = setInterval(_fscroll.animate, 30)
}

Fscroll.prototype.fscrollTouchMouseMove = function(evt) {
     var rect = _fscroll.fscrollContainer.getBoundingClientRect();
     var touch = event.touches[0];
     var _y = touch.clientY - rect.top;

     if (_y <= 0) {
          _y = 0;
     }

     var mousePos = Math.round(_fscroll.knobHeight / 2);
     var _click = Math.round((_y / _fscroll.containerH) * _fscroll.containerH) - mousePos;

     var wheelNo = Math.round(_click / 5);
     _fscroll.posotionYcnt = wheelNo * 5;

     var directionY = 0;
     if (_fscroll.oldY < touch.pageY) {
          _fscroll.direction = 1;
     } else {
          _fscroll.direction = -1;
     }

     if (_fscroll.posotionYcnt <= 0) {
          _fscroll.posotionYcnt = 0;
     }

     if (_fscroll.posotionYcnt >= _fscroll.knobBottom) {
          _fscroll.posotionYcnt = _fscroll.knobBottom;
     }

     _fscroll.changeContent(_fscroll.posotionYcnt);
     _fscroll.oldY = touch.pageY;
}

Fscroll.prototype.fscrollMouseMove = function(evt) {
     var directionY = 0;
     if (_fscroll.oldY < evt.pageY) {
          directionY = -1;
     } else {
          directionY = 1;
     }

     _fscroll.oldY = evt.pageY;

     var rect = _fscroll.fscrollContainer.getBoundingClientRect();
     var _y = evt.clientY - rect.top;

     var mousePos = Math.round(_fscroll.knobHeight / 2);

     var _click = Math.round((_y / _fscroll.containerH) * _fscroll.containerH) - mousePos;
     var wheelNo = Math.round(_click / 5);
     _fscroll.posotionYcnt = wheelNo * 5;

     if (directionY >= 1) {
          _fscroll.direction = -1;
     } else {
          _fscroll.direction = 1;
     }

     if (_fscroll.posotionYcnt <= 0) {
          _fscroll.posotionYcnt = 0;
     }

     if (_fscroll.posotionYcnt >= _fscroll.knobBottom) {
          _fscroll.posotionYcnt = _fscroll.knobBottom;
     }
     _fscroll.changeContent(_fscroll.posotionYcnt);
}

Fscroll.prototype.fscrollSliderTouchDown = function(evt) {
     var rect = _fscroll.fscrollContainer.getBoundingClientRect();

     var touch = evt.touches[0];
     var _y = touch.clientY - rect.top;

     var mousePos = Math.round(_fscroll.knobHeight / 2);
     var _click = Math.round((_y / _fscroll.containerH) * _fscroll.containerH) - mousePos;

     var wheelNo = Math.round(_click / 5);
     _fscroll.posotionYcnt = wheelNo * 5;

     if (_fscroll.posotionYcnt <= 0) {
          _fscroll.posotionYcnt = 0;
     }

     if (_fscroll.posotionYcnt >= _fscroll.knobBottom) {
          _fscroll.posotionYcnt = _fscroll.knobBottom;
     }
     _fscroll.changeContent(_fscroll.posotionYcnt);
}


Fscroll.prototype.fscrollSliderMouseDown = function(evt) {
     _fscroll.textContainer.classList.add("unselectable");
     _fscroll.mouseUpFlg = true;

     var rect = _fscroll.fscrollContainer.getBoundingClientRect();
     var _y = event.clientY - rect.top;

     var mousePos = Math.round(_fscroll.knobHeight / 2);

     var _click = Math.round((_y / _fscroll.containerH) * _fscroll.containerH) - mousePos;

     var wheelNo = Math.round(_click / 5);
     _fscroll.posotionYcnt = wheelNo * 5;

     if (_fscroll.posotionYcnt <= 0) {
          _fscroll.posotionYcnt = 0;
     }

     if (_fscroll.posotionYcnt >= _fscroll.knobBottom) {
          _fscroll.posotionYcnt = _fscroll.knobBottom;
     }
     _fscroll.changeContent(_fscroll.posotionYcnt);

     _fscroll.fscrollContainer.addEventListener("mousemove", _fscroll.fscrollMouseMove);
     _fscroll.fscrollContainer.addEventListener("touchmove", _fscroll.fscrollTouchMouseMove);
}

Fscroll.prototype.changeContent = function(y) {
     var _y = y;
     if (_y <= 0) {
          _y = 0;
     }

     if (_y >= this.knobBottom) {
          _y = this.knobBottom;
     }
     var contentY = ((this.heightDiff * _y / this.knobBottom) + 2) * -1;
     this.knobBar.style.marginTop = _y + 'px';
     this.textContainer.style.marginTop = contentY + 'px';
}
