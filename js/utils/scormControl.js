var bookMarkArray = [];
var completionStatus = "false";
var firstTimeCourseOpen = "false";
var pageCntSCO = 0;
var totalPagesSCO = 0;

$(document).ready(function (e) {
	
});

window.onunload = function(){
	if(isScorm){
		pipwerks.SCORM.quit();
	}
}

function initCourseStatus(){

	if(pipwerks.SCORM.get("cmi.suspend_data") == ""){
		pageCntSCO = 0;
		bookMarkArray = [];
	}else{
		var bookmarkData = pipwerks.SCORM.get("cmi.suspend_data");
		pageCntSCO = Number(bookmarkData.split("~||~")[0]);
		bookMarkArray = bookmarkData.split("~||~")[1].split(",");
		completionStatus = bookmarkData.split("~||~")[2];
	}
}

function setCourseDetailToLMS(){
	var bookmarkAsString = pageCntSCO+"~||~"+bookMarkArray+"~||~"+completionStatus;
	pipwerks.SCORM.set("cmi.suspend_data", bookmarkAsString);
}

function checkCompletionStatus(){
	setCourseDetailToLMS();
	var courseCount = 0;
	for(var i=0;i<totalPagesSCO;i++){
		if(visitedArr[i] == 1){
			courseCount++;
		}
	}
	
	if(courseCount == totalPagesSCO){
		pipwerks.SCORM.set("cmi.core.lesson_status", "completed");
		if(completionStatus == "false"){
			var bookmarkAsString = "0~||~"+visitedArr+"~||~true";
			pipwerks.SCORM.set("cmi.suspend_data", bookmarkAsString);
		}
	}else{
		pipwerks.SCORM.set("cmi.core.lesson_status", "incomplete");
	}
}

function setScore(score){
	pipwerks.SCORM.set("cmi.core.score.raw", score);
}