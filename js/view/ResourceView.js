
/*
Created by: Thirumohan & Team
Date: Jan 2018
*/
var _resourceData;
var _resourceView;
var _resourceSelectedLetter = 0;
var _resourceSelectedWord = 0

var ResourcesView = function() {
    this.data = {};
    _resourceView = this;
}

ResourcesView.prototype.createResources = function(_data) {
    _resourceData = _data;
    $('#f_resourceContent').find('div').remove();

    if (_resourceData.length > 0) {
        for (var i = 0; i < _resourceData.length; i++) {
            $('#f_resourceContent').append('<div class="f_resourceRow"><div class="f_resourceColumn1"><p>' + _resourceData[i].col1 + '</p></div><div class="f_resourceColumn2"><p>' + _resourceData[i].col2 + '</p></div></div>')
        }
    }
}
