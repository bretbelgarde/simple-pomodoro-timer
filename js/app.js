var timerID;
var pomoLength = null;
var breakLength = null;
var alarmPlayed = false;

var tick = new Audio('http://pinebox.ddns.net/other/tick.mp3');
var alarm = new Audio('http://pinebox.ddns.net/other/alarm.mp3');

var timerStart = function(){
  if(timerID) return;
  timerID = setInterval(updateTimer, 1000);
  // disable timer controls
  $("#pomo-up, #pomo-down, #break-up, #break-down").addClass("disabled");
  updateTimer();
}

var timerStop = function(){
  clearInterval(timerID);
  timerID = null;
  pomoLength = null;
  breakLength = null;
  alarmPlayed = false;

  //enable timer controls
  $("#pomo-up, #pomo-down, #break-up, #break-down").removeClass("disabled");
  // reset current timer to the current setting
  var pomoTime = parseInt($(".pomo-time .time").text());
  $(".current-timer").text(formatTimer(pomoTime*60));
  $(".outer-knob").val(pomoTime*60).trigger('change');
  $(".inner-knob").val(pomoTime*60).trigger('change');
}

var updateTimer = function(){

  if(pomoLength === null) {
    pomoLength = parseInt($(".pomo-time .time").text()) * 60;
  }

  if(breakLength === null) {
    breakLength = parseInt($(".break-time .time").text()) * 60;
  }

  //update timer clock
  if (pomoLength > 0) {
    $(".outer-knob").val(pomoLength).trigger('change');
    $(".current-timer").text(formatTimer(pomoLength));
    pomoLength--;
  }

  if (pomoLength <= 0 && breakLength > 0) {
    $(".inner-knob").val(breakLength).trigger('change');
    $(".current-timer").text(formatTimer(breakLength));
    breakLength--;
  }

  tick.play();

  if (pomoLength === 0 && !alarmPlayed) {
    alarm.play();
    alarmPlayed = true;
  }

  if(pomoLength <= 0 && breakLength <= 0) {
    alarm.play();
    timerStop();
  }
}

var formatTimer = function(time) {
  // returns seconds in mm:ss formated string
  var mins = Math.floor(time/60);
  var seconds = time - (mins * 60);
  var timeLeft = (mins < 10 ? '0' + mins : mins) + ":" + (seconds < 10 ? '0' + seconds : seconds);
  return timeLeft;
}

var resetTimer = function() {
  var pomoDefault = 25;
  var breakDefault = 5;
  var alarmPlayed = false;

  $(".outer-knob").trigger('configure', {"max":pomoDefault*60});
  $(".outer-knob").val(pomoDefault*60).trigger('change');
  $(".inner-knob").trigger('configure', {"max":breakDefault*60});
  $(".inner-knob").val(breakDefault*60).trigger('change');

  $(".current-timer").text(formatTimer(pomoDefault*60));
  $(".pomo-time .time").text(pomoDefault);
  $(".break-time .time").text(breakDefault);

}

$(document).ready(function(){
  // Setup Initial timer
  $(".outer-knob").knob({
    'min':0,
    'max':25*60,
    'readOnly':true,
    'thickness':.05,
    'width': 400,
    'height': 400,
    'fgColor':'#007700',
    'bgColor':'#223322'
  });
  $(".inner-knob").knob({
    'min':0,
    'max':5*60,
    'readOnly':true,
    'thickness':.05,
    'width': 374,
    'height': 374,
    'fgColor':'#00ff00',
    'bgColor':'#223322'
  });
  $(".current-timer").text("25:00");
  resetTimer();
  // Hide Tips
  $(".tips div").hide();
  //Setup click handlers for the various buttons
  $("#pomo-up").click(function(){
    if ($(this).hasClass("disabled")) return false;
    var pomoTime = parseInt($(".pomo-time .time").text());
    pomoTime++;
    $(".outer-knob").trigger('configure', {"max":pomoTime*60});
    $(".outer-knob").val(pomoTime*60).trigger('change');
    $(".current-timer").text(formatTimer(pomoTime*60));
    $(".pomo-time .time").text(pomoTime);
    return false;
  });

  $("#pomo-down").click(function(){
    if ($(this).hasClass("disabled")) return false;
    var pomoTime = parseInt($(".pomo-time .time").text());
    pomoTime--;
    if (pomoTime <= 0) return;
    $('.outer-knob').trigger('configure', {"max":pomoTime*60});
    $(".outer-knob").val(pomoTime*60).trigger('change');
    $(".current-timer").text(formatTimer(pomoTime*60));
    $(".pomo-time .time").text(pomoTime);
    return false;
  });

  $("#break-up").click(function(){
    if ($(this).hasClass("disabled")) return false;
    var breakTime = parseInt($('.break-time .time').text());
    breakTime++;
    $('.inner-knob').trigger('configure', {"max":breakTime*60});
    $(".inner-knob").val(breakTime*60).trigger('change');
    $(".break-time .time").text(breakTime);
    return false;
  });

  $("#break-down").click(function(){
    if ($(this).hasClass("disabled")) return false;
    var breakTime = parseInt($('.break-time .time').text());
    breakTime--;
    if (breakTime <= 0) return;
    $('.inner-knob').trigger('configure', {"max":(breakTime)*60});
    $(".inner-knob").val(breakTime*60).trigger('change');
    $(".break-time .time").text(breakTime);
    return false;
  });

  $("#go").click(timerStart);
  $("#stop").click(timerStop);
  $("#reset").click(resetTimer);

  // Setup hovers for the tips
  $(".pomo-time").hover(function(){
    $("#pomo-tip").toggle();
  });

  $(".break-time").hover(function(){
    $("#break-tip").toggle();
  });

  $("#go").hover(function(){
    $("#go-tip").toggle();
  });

  $("#stop").hover(function(){
    $("#stop-tip").toggle();
  });

  $("#reset").hover(function(){
    $("#reset-tip").toggle();
  });

});
