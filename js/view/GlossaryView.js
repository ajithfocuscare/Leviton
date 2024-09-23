/*
Created by: Thirumohan & Team
Date: Jan 2018
*/
var _glossaryData;
var _glossaryView;
var _glossarySelectedLetter = 0;
var _glossarySelectedWord = 0

var GlossaryView = function() {
    this.data = {};
    _glossaryView = this;
}

GlossaryView.prototype.createGlossary = function(_data) {
    _glossaryData = _data;
    $('#f_glossaryCol1').append('<ul></ul>')

    // Alphabets generation
    for (var i = 0; i < _glossaryData.length; i++) {
        $('#f_glossaryCol1').find('ul').append('<li><button type="button" id="alphabet_' + i + '" class="f_glossaryLetter">' + _glossaryData[i].letter + '</button></li>')

        if (_glossaryData[i].keywords.length > 0) {
            $('#f_glossaryCol1').find('ul').find('li').eq(i).find('button').addClass('glossaryEnabled')
        }
    }

    $('.glossaryEnabled').off('click').on('click', showGlossaryWords);
    this.createGlossaryWords();
}

GlossaryView.prototype.createGlossaryWords = function(moduleNo) {
    $('.glossaryEnabled').removeClass('selected').css({ 'cursor': 'pointer' }).off('click').on('click', showGlossaryWords)

    $('#f_glossaryCol1').find('ul').find('li').eq(_glossarySelectedLetter).find('button').addClass('selected').off('click').css({ 'cursor': 'default' })

    $('#f_glossaryCol2 ul').remove()
    $('#f_glossaryCol2').append('<ul></ul>')

    for (var i = 0; i < _glossaryData[_glossarySelectedLetter].keywords.length; i++) {
        $('#f_glossaryCol2').find('ul').append('<li><button type="button" class="f_glossaryWord" id="word_' + i + '">' + _glossaryData[_glossarySelectedLetter].keywords[i].word + '</button></li>')
    }

    $('#word_' + _glossarySelectedWord).addClass('selected')
    $('.f_glossaryWord').off('click').on('click', clickGlossaryWord)
    this.showGlossaryDescription()
}

GlossaryView.prototype.showGlossaryDescription = function(moduleNo) {
    $('.f_glossaryWord').removeClass('selected').css({ 'cursor': 'pointer' }).off('click').on('click', clickGlossaryWord)
    $('#word_' + _glossarySelectedWord).addClass('selected').css({ 'cursor': 'default' }).off('click')

    $('#f_g_heading').html('<p>' + _glossaryData[_glossarySelectedLetter].keywords[_glossarySelectedWord].word + '</p>')
    $('#f_g_description').html('<p>' + _glossaryData[_glossarySelectedLetter].keywords[_glossarySelectedWord].description + '</p>')
}

function showGlossaryWords() {
    _glossarySelectedLetter = parseInt($(this).attr('id').split('_')[1])
    _glossarySelectedWord = 0
    _glossaryView.createGlossaryWords();
}

function clickGlossaryWord() {
    _glossarySelectedWord = parseInt($(this).attr('id').split('_')[1]);
    _glossaryView.showGlossaryDescription();
}
