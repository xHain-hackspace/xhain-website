
// Returns the ISO week of the date.
Date.prototype.getWeek = function() {
  var date = new Date(this.getTime());
  date.setHours(0, 0, 0, 0);
  // Thursday in current week decides the year.
  date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
  // January 4 is always in week 1.
  var week1 = new Date(date.getFullYear(), 0, 4);
  // Adjust to Thursday in week 1 and count number of weeks from date to week1.
  return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000
                        - 3 + (week1.getDay() + 6) % 7) / 7);
}

var sunrises = [];
sunrises[1118] = [06,54];
sunrises[1119] = [06,56];
sunrises[1120] = [06,58];
sunrises[1121] = [06,59];
sunrises[1122] = [07,01];
sunrises[1123] = [07,02];
sunrises[1124] = [07,04];
sunrises[1125] = [07,05];
sunrises[1126] = [07,07];
sunrises[1127] = [07,08];
sunrises[1128] = [07,10];
sunrises[1129] = [07,11];
sunrises[1130] = [07,12];
sunrises[1201] = [07,14];
sunrises[1202] = [07,15];
sunrises[1203] = [07,16];
sunrises[1204] = [07,17];
sunrises[1205] = [07,19];
sunrises[1206] = [07,20];
sunrises[1207] = [07,21];
sunrises[1208] = [07,22];
sunrises[1209] = [07,23];
sunrises[1210] = [07,24];
sunrises[1211] = [07,25];
sunrises[1212] = [07,26];
sunrises[1213] = [07,27];
sunrises[1214] = [07,28];
sunrises[1215] = [07,29];
sunrises[1216] = [07,30];
sunrises[1217] = [07,30];
sunrises[1218] = [07,31];
sunrises[1219] = [07,32];
sunrises[1220] = [07,32];
sunrises[1221] = [07,33];
sunrises[1222] = [07,33];
sunrises[1223] = [07,34];
sunrises[1224] = [07,34];
sunrises[1225] = [07,35];
sunrises[1226] = [07,35];
sunrises[1227] = [07,35];
sunrises[1228] = [07,35];
sunrises[1229] = [07,35];
sunrises[1230] = [07,36];
sunrises[1231] = [07,36];
sunrises[101] = [07,36];
sunrises[102] =	[07,35];
sunrises[103] =	[07,35];
sunrises[104] =	[07,35];
sunrises[105] =	[07,35];
sunrises[106] =	[07,35];
sunrises[107] =	[07,34];
sunrises[108] =	[07,34];
sunrises[109] =	[07,33];
sunrises[110] =	[07,33];
sunrises[111] =	[07,32];
sunrises[112] =	[07,32];
sunrises[113] =	[07,31];
sunrises[114] =	[07,31];
sunrises[115] =	[07,30];
sunrises[116] =	[07,29];
sunrises[117] =	[07,28];
sunrises[118] =	[07,27];
sunrises[119] =	[07,26];
sunrises[120] =	[07,25];
sunrises[121] =	[07,24];
sunrises[122] =	[07,23];
sunrises[123] =	[07,22];
sunrises[124] =	[07,21];
sunrises[125] =	[07,20];
sunrises[126] =	[07,19];
sunrises[127] =	[07,18];
sunrises[128] =	[07,16];
sunrises[129] =	[07,15];
sunrises[130] =	[07,14];
sunrises[131] =	[07,12];
sunrises[201] = [07,11];
sunrises[202] =	[07,09];
sunrises[203] =	[07,08];
sunrises[204] =	[07,06];
sunrises[205] =	[07,05];
sunrises[206] =	[07,03];
sunrises[207] =	[07,01];
sunrises[208] =	[07,00];
sunrises[209] =	[06,58];
sunrises[210] =	[06,56];
sunrises[211] =	[06,54];
sunrises[212] =	[06,53];
sunrises[213] =	[06,51];
sunrises[214] =	[06,49];
sunrises[215] =	[06,47];
sunrises[216] =	[06,45];
sunrises[217] =	[06,43];
sunrises[218] =	[06,41];
sunrises[219] =	[06,39];
sunrises[220] =	[06,37];
sunrises[221] =	[06,35];
sunrises[222] =	[06,33];
sunrises[223] =	[06,31];
sunrises[224] =	[06,29];
sunrises[225] =	[06,27];
sunrises[226] =	[06,25];
sunrises[227] =	[06,23];
sunrises[228] =	[06,21];
sunrises[301] = [06,18];
sunrises[302] = [06,16];
sunrises[303] = [06,14];
sunrises[304] = [06,12];
sunrises[305] = [06,10];
sunrises[306] = [06,07];
sunrises[307] = [06,05];
sunrises[308] = [06,03];
sunrises[309] = [06,01];
sunrises[310] = [05,58];
sunrises[311] = [05,56];
sunrises[312] = [05,54];
sunrises[313] = [05,51];
sunrises[314] = [05,49];
sunrises[315] = [05,47];
sunrises[316] = [05,44];
sunrises[317] = [05,42];
sunrises[318] = [05,40];
sunrises[319] = [05,37];
sunrises[320] = [05,35];
sunrises[321] = [05,33];
sunrises[322] = [05,30];
sunrises[323] = [05,28];
sunrises[324] = [05,25];
sunrises[325] = [05,23];
sunrises[326] = [05,21];



var month;
var day;
var weekday;
var week_nr;
var hour;
var minutes;

var wota = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

var rule_sets = [];
var cur_rule = 0;
// 1 - no mask mandate
rule_sets[1] = '<div class="curr_signs"><div class="no_mask"></div></div>';
// 2 - with mask mandate
rule_sets[2] = '<div class="curr_signs"><div class="with_mask"></div></div>';

// get the weekday rules from html, no comment!
var weekday_rules = [];
jQuery('.week_day').each(function(e) {
  weekday_rules[jQuery(this).attr('data-wd')] = this.innerHTML;
});
weekday_rules[7] = jQuery('#w_col_1').html(); // Mo no mask mandate
weekday_rules[8] = jQuery('#w_col_2').html(); // Mo with mask mandate


// los geht's
check_again();
var interval_id = setInterval(check_again, 60*1000);



// helpers

function mask_monday() {
  if (week_nr % 2 == 0) {
    return true;
  } else {
    return false;
  }
}


function check_again() { // get time

  var date = new Date();
  month = date.getMonth()+1;
  day = date.getDate();
  weekday =date.getDay();
  week_nr = date.getWeek();
  hour = date.getHours();
  minutes = date.getMinutes();
  var the_minutes = minutes;
  if (minutes < 10) {
    the_minutes = '0'+minutes;
  }
  var the_hours = hour;
  if (hour < 10) {
    the_hours = '0'+hour;
  }
  console.log(wota[weekday]+' '+day+'.'+month+'. '+hour+':'+the_minutes+' (week: '+week_nr+')');

  if (month == 3 && day >= 21 || month > 3 && month < 11) {
    // sunset clause
    jQuery('#main_wrap').html('<div style="text-align:center;margin-top:32px;">There is no mask mandate in place.</div>');

  } else {

    jQuery('#the_time').html('NOW <span></span> '+the_hours+':'+the_minutes);
    jQuery('#the_day').html('TODAY - '+wota[weekday]);

    if (mask_monday()) {
      jQuery('#w_col_1 .mon_checker').html('- next week -');
      jQuery('#w_col_2 .mon_checker').html('- this week -');
    } else {
      jQuery('#w_col_1 .mon_checker').html('- this week -');
      jQuery('#w_col_2 .mon_checker').html('- next week -');
    }

    var sunrise_time = sunrises[month+''+day][0]+(sunrises[month+''+day][1]/60);
    var cur_time = hour+(minutes/60);

    // check the rules
    // Mo
    if (weekday == 1) {
      if (mask_monday()) {
        if (cur_time < 13) {
          cur_rule = 1;
        } else {
          cur_rule = 2;
          do_ventilation();
        }
      } else {
        cur_rule = 1;
      }
    }

    // Di
    if (weekday == 2) {
      if (cur_time < sunrise_time) {
        if (mask_monday()) {
          cur_rule = 2;
        } else {
          cur_rule = 1;
        }
      } else if (cur_time < 13) {
        cur_rule = 1;
      } else {
        cur_rule = 2;
        do_ventilation();
      }
    }

    // Mi
    if (weekday == 3) {
      if (cur_time < sunrise_time) {
        cur_rule = 2;
      } else {
        cur_rule = 1;
      }
    }

    // Do
    if (weekday == 4) {
      if (cur_time < sunrise_time) {
        cur_rule = 1;
      } else if (cur_time < 13) {
        cur_rule = 1;
      } else {
        cur_rule = 2;
        do_ventilation();
      }
    }

    // Fr
    if (weekday == 5) {
      if (cur_time < sunrise_time) {
        cur_rule = 2;
      } else {
        cur_rule = 1;
      }
    }

    // Sa
    if (weekday == 6) {
      if (cur_time < sunrise_time) {
        cur_rule = 1;
      } else {
        cur_rule = 2;
      }
    }

    // So
    if (weekday == 0) {
      if (cur_time < sunrise_time) {
        cur_rule = 2;
      } else {
        cur_rule = 1;
      }
    }

    // OUTPUT RULE
    jQuery('#cur_html').html(rule_sets[cur_rule]);
    // OUTPUT RULE
    jQuery('.week_day[data-wd='+weekday+']').addClass('current');
    if (weekday != 1) {
      jQuery('#today_html').html(weekday_rules[weekday]);
    } else { // Montag
      if (mask_monday()) {
        jQuery('#today_html').html(weekday_rules[8]);
        jQuery('#w_col_2').addClass('c_current');
      } else {
        jQuery('#today_html').html(weekday_rules[7]);
        jQuery('#w_col_1').addClass('c_current');
      }
    }

  }

}


function switch_view() {
  if (jQuery('body').hasClass('show_calendar')) {
    jQuery('body').removeClass('show_calendar');
    jQuery('#view_switch button').html('show calendar');
  } else {
    jQuery('body').addClass('show_calendar');
    jQuery('#view_switch button').html('hide calendar');
  }
}


function do_ventilation() {
  if (hour == 13) {
    jQuery('body').addClass('show_vent');
  } else {
    jQuery('body').removeClass('show_vent');
  }
}
