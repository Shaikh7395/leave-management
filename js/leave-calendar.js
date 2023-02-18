var UKBankHolidays;
(function (UKBankHolidays) {
    var endDay = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    var calculatedHolidays; //Stores the results of a previous lookup
    var calculatedYear; //The year of the previously calculated holidays
    function bankHolDates(year) {
        if (year == null) {
            var todaysDate = new Date();
            var thisYear = todaysDate.getFullYear();
            year = thisYear;
        }
        if (calculatedYear == year) {
            return calculatedHolidays;
        }
        calculatedYear = year;
        calculatedHolidays = [
            christmas_bankhol(year - 1),
            boxing_bankhol(year - 1),
            newYearBankHol(year),
            goodFriday(year),
            easterMonday(year),
            may_bankhol(year),
            spring_bankhol(year),
            august_bankhol(year),
            christmas_bankhol(year),
            boxing_bankhol(year),
            newYearBankHol(year + 1)
        ];
        return calculatedHolidays;
    }
    /**
    * Returns the day of the week for the 1st Jan with Sunday = 1, Monday = 2 etc.
    * @param year
    */
    function isBankHol(date) {
        var bankhol = false;
        var calcDate = date;
        var mY = calcDate.getFullYear();
        var mM = (calcDate.getMonth() + 1); // getMonth() is zero-based
        var mD = calcDate.getDate();
        var calDay = mD + mM * 100 + mY * 10000; // convert date to the same format
        if (bankHolDates(mY).indexOf(calDay) > -1) {
            return true;
        }
        else {
            return false;
        }
    }
    UKBankHolidays.isBankHol = isBankHol;
    function GetMondayDate() {
        var mondaysdate = new Date();
        // Always start on a Monday.
        while (mondaysdate.getDay() != 1) {
            mondaysdate.setDate(mondaysdate.getDate() - 1);
        }
        return mondaysdate;
    }
    // ===================================
    // Bank holiday calculations
    // ===================================
    function start_day_in_month(year, month) {
        var startDay, day, daynum, numDays, monthNum;
        startDay = start_day_in_year(year);
        endDay[1] = (year % 4) ? 28 : 29;
        if (month == 1) {
            daynum = startDay;
        }
        else {
            numDays = startDay;
            for (monthNum = 2; monthNum < month + 1; monthNum++) {
                numDays = numDays + endDay[monthNum - 2];
            }
            daynum = numDays % 7;
        }
        daynum = (!daynum) ? 7 : daynum;
        return (daynum);
    }
    /**
    * Returns the day of the week for the 1st Jan with Sunday = 1, Monday = 2 etc.
    * @param year
    */
    function start_day_in_year(year) {
        var y, m, d;
        var n;
        y = year - 1;
        m = 13;
        d = 1;
        n = d + 2 * m + (Math.floor((0.6 + (m + 1))) + y);
        n = n + Math.floor(((y / 4) - Math.floor((y / 100)) + Math.floor((y / 400)))) + 2;
        n = Math.floor(((n / 7 - Math.floor((n / 7))) * 7 + 0.5));
        return (n + 1);
    }
    /**
    * Returns the day of the week (1..7, sun...sat) for the passed in month day.
    * @param year
    */
    function day_number_week(monthDay) {
        var day;
        var month, calmon, ndays, daynum;
        var year;
        year = Math.floor(monthDay / 10000);
        monthDay = monthDay - (year * 10000);
        month = Math.floor(monthDay / 100);
        monthDay = monthDay - month * 100;
        day = monthDay;
        endDay[1] = (year % 4) ? 28 : 29;
        ndays = start_day_in_year(year) - 1;
        for (calmon = 1; calmon < month; calmon++) {
            ndays = ndays + endDay[calmon - 1];
        }
        daynum = (ndays + day) % 7;
        daynum = (daynum === 0) ? 7 : daynum;
        return (daynum);
    }
    /**
    * Returns the New Years Day bank holiday for the passed in year. The date returned is serialized as a number in the format YYYYMMDD
    * @param year
    */
    function newYearBankHol(year) {
        var sun = 1, sat = 7;
        var daynum;
        var day = 1, month = 1, date;
        date = day + month * 100 + year * 10000;
        daynum = day_number_week(date);
        if (daynum > sun && daynum < sat) {
            return (date);
        }
        day = (daynum == 7) ? 3 : 2;
        date = day + month * 100 + year * 10000;
        return (date);
    }
    /*
    function newYearDay(year) {
    
        var date, day = 1, month = 1;
    
        date = day + month * 100 + year * 10000;
    
        return (date);
    }
    */
    /**
    * Returns the Good Friday bank holiday for the passed in year. The date returned is serialized as a number in the format YYYYMMDD
    * @param year
    */
    function goodFriday(year) {
        var day, month, date;
        date = easterSunday(year);
        year = Math.floor(date / 10000);
        date = date - year * 10000;
        month = Math.floor(date / 100);
        day = date - month * 100;
        if (day - 2 < 1) {
            month = month - 1;
            if (month < 1) {
                month = 12;
                year = year - 1;
            }
            day = endDay[month - 1] + (day - 2);
        }
        else {
            day = day - 2;
        }
        date = day + month * 100 + year * 10000;
        return (date);
    }
    /**
    * Returns the Easter Sunday for the passed in year. The date returned is serialized as a number in the format YYYYMMDD
    * @param year
    */
    function easterSunday(year) {
        var Y = parseInt(year, 10);
        var C = Math.floor(Y / 100);
        var N = Y - 19 * Math.floor(Y / 19);
        var K = Math.floor((C - 17) / 25);
        var I = C - Math.floor(C / 4) - Math.floor((C - K) / 3) + 19 * N + 15;
        I = I - 30 * Math.floor((I / 30));
        I = I - Math.floor(I / 28) * (1 - Math.floor(I / 28) * Math.floor(29 / (I + 1)) * Math.floor((21 - N) / 11));
        var J = Y + Math.floor(Y / 4) + I + 2 - C + Math.floor(C / 4);
        J = J - 7 * Math.floor(J / 7);
        var L = I - J;
        var M = 3 + Math.floor((L + 40) / 44);
        var D = L + 28 - 31 * Math.floor(M / 4);
        var easter_day = D + M * 100 + Y * 10000;
        return (easter_day);
    }
    /**
    * Returns the Easter Monday bank holiday for the passed in year. The date returned is serialized as a number in the format YYYYMMDD
    * @param year
    */
    function easterMonday(year) {
        var day, month, date;
        date = easterSunday(year);
        year = Math.floor(date / 10000);
        date = date - year * 10000;
        month = Math.floor(date / 100);
        day = date - month * 100;
        if (day + 1 > endDay[month - 1]) {
            month++;
            if (month > 12) {
                month = 1;
                year++;
            }
            day = 1;
        }
        else {
            day = day + 1;
        }
        date = day + month * 100 + year * 10000;
        return (date);
    }
    /**
    * Returns the May Day bank holiday for the passed in year. The date returned is serialized as a number in the format YYYYMMDD
    * @param year
    */
    function may_bankhol(year) {
        var daynum;
        var month = 5, date;
        var monday = new Array(0, 2, 1, 7, 6, 5, 4, 3);
        // Set date for 1st May in current year
        date = 1 + month * 100 + year * 10000;
        // Get daynum (1..7, sun...sat) for 1st May
        daynum = day_number_week(date);
        // Set date for May Bank Holiday which is first Monday in May
        date = monday[daynum] + month * 100 + year * 10000;
        return (date);
    }
    /**
    * Returns the Spring bank holiday for the passed in year. The date returned is serialized as a number in the format YYYYMMDD
    * @param year
    */
    function spring_bankhol(year) {
        var daynum;
        var month = 5, date;
        var monday = new Array(0, 25, 31, 30, 29, 28, 27, 26);
        // Set date for last day (31st) of May in current year
        date = endDay[month - 1] + month * 100 + year * 10000;
        // Get daynum (1..7, sun...sat) for last day (31st) of May
        daynum = day_number_week(date);
        // Set date for Spring Bank Holiday which is last Monday in May
        date = monday[daynum] + month * 100 + year * 10000;
        return (date);
    }
    /**
    * Returns the August bank holiday for the passed in year. The date returned is serialized as a number in the format YYYYMMDD
    * @param year
    */
    function august_bankhol(year) {
        var daynum;
        var month = 8, date;
        var monday = new Array(0, 25, 31, 30, 29, 28, 27, 26);
        // Set date for last day (31st) of August in current year
        date = endDay[month - 1] + month * 100 + year * 10000;
        // Get daynum (1..7, sun...sat) for last day (31st) of August
        daynum = day_number_week(date);
        // Set date for August Bank Holiday which is last Monday in August
        date = monday[daynum] + month * 100 + year * 10000;
        return (date);
    }
    /*
    function christmas_day(year) {
        var date, day = 25, month = 12;
    
        date = day + month * 100 + year * 10000;
    
        return (date);
    }
    */
    /**
    * Returns the Christmas Day bank holiday for the passed in year. The date returned is serialized as a number in the format YYYYMMDD
    * @param year
    */
    function christmas_bankhol(year) {
        var sun = 1, sat = 7;
        var daynum;
        var day = 25, month = 12, date;
        date = day + month * 100 + year * 10000;
        daynum = day_number_week(date);
        if (daynum > sun && daynum < sat) {
            return (date);
        }
        day = 27; // If Christmas Day Bank Holiday it always falls on the 27th
        date = day + month * 100 + year * 10000;
        return (date);
    }
    /*
    function boxing_day(year) {
        var date, day = 26, month = 12;
    
        date = day + month * 100 + year * 10000;
    
        return (date);
    }
    */
    /**
    * Returns the Boxing Day bank holiday for the passed in year. The date returned is serialized as a number in the format YYYYMMDD
    * @param year
    */
    function boxing_bankhol(year) {
        var sun = 1, sat = 7;
        var daynum;
        var day = 26, month = 12, date;
        date = day + month * 100 + year * 10000;
        daynum = day_number_week(date);
        if (daynum > sun && daynum < sat) {
            return (date);
        }
        day = 28; // If Boxing Day Bank Holiday it always falls on the 28th
        date = day + month * 100 + year * 10000;
        return (date);
    }
})(UKBankHolidays || (UKBankHolidays = {}));

var MyCal = (function () {
    function MyCal(containerId, month, year) {
        this.events = [{ date: '2016-03-16', name: 'Craig off work' }, { date: '2016-03-17', name: 'Craig off work' }, { date: '2016-03-17', name: 'Wayne off work' }
        ];
        // these are labels for the days of the week
        this.dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        // these are human-readable month name labels, in order
        this.monthLabels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        // these are the total days for each month (leap year adjusted for later)
        this.daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        // get todays date
        this.cal_current_date = new Date();
        this.container = document.getElementById(containerId);
        if (this.container == null) {
            //abort construction
            return null;
        }
        //this.cal_current_date =new Date();
        this.calMonth = (isNaN(month) || month == null) ? this.cal_current_date.getMonth() : month;
        this.calYear = (isNaN(year) || year == null) ? this.cal_current_date.getFullYear() : year;
        this.constructHTML();
        this.drawCal();
    }
    ;
    MyCal.prototype.constructHTML = function () {
        this.timerStart = Date.now();
        this.calHtml = '';
        var firstDay = new Date(this.calYear, this.calMonth, 1);
        var startingDay = firstDay.getDay();
        //Determine if year is a leap year
        if (this.calMonth == 1 || this.calMonth == 2) {
            if ((this.calYear % 4 == 0 && this.calYear % 100 != 0) || this.calYear % 400 == 0) {
                this.daysInMonth[1] = 29;
            }
            else {
                this.daysInMonth[1] = 28;
            }
        }
        var monthLength = this.daysInMonth[this.calMonth];
        var lastDay = new Date(this.calYear, this.calMonth, monthLength).getDay();
        var monthName = this.monthLabels[this.calMonth];
        var html = '<table class="myCal-table">';
        html += '<tr><th colspan="7"  class="myCal-header">';
        html += monthName + "&nbsp;" + this.calYear;
        html += '</th></tr>';
        html += '<tr>';
        for (var i = 0; i <= 6; i++) {
            html += '<td class="myCal-header-day">';
            html += this.dayLabels[i];
            html += '</td>';
        }
        html += '</tr>';
        var day = 1;
        html += '<tr class="week">';
        // this loop is for is weeks (rows)
        for (var i = 0; i < 9; i++) {
            // this loop is for weekdays (cells)
            for (var j = 0; j <= 6; j++) {
                html += '<td class="myCal-day"><div class=\"dayContent hidden\">';
                if (day <= monthLength && (i > 0 || j >= startingDay)) {
                    //convert this day into a date object
                    var thisDate = new Date(this.calYear, this.calMonth, day);
                    html += this.addEvents(thisDate, false);
                    day++;
                }
                else {
                    //This is an overlapping day.
                    var overlapDay = 0;
                    var overlapMonth = this.calMonth;
                    var overlapYear = this.calYear;
                    //Work out if this is the overlap of previous or next month
                    if (day <= 1) {
                        //Set variables for previous month
                        overlapMonth--;
                        if (overlapMonth < 0) {
                            overlapMonth = 11;
                            overlapYear--;
                        }
                        var lastMonthDays = this.daysInMonth[overlapMonth];
                        overlapDay = lastMonthDays - startingDay + j + 1;
                    }
                    else {
                        //Set variables for next month
                        overlapMonth++;
                        if (overlapMonth > 11) {
                            overlapMonth = 0;
                            overlapYear++;
                        }
                        overlapDay = j - lastDay;
                    }
                    //convert this day into a date object
                    var thisDate = new Date(overlapYear, overlapMonth, overlapDay);
                    html += this.addEvents(thisDate, true);
                }
                html += '</div></td>';
            }
            // stop making rows if we've run out of days
            if (day > monthLength) {
                break;
            }
            else {
                html += '</tr><tr class="week">';
            }
        }
        html += '</tr></table>';
        this.calHtml = html;
    };
    MyCal.prototype.addEvents = function (date, isOverlap) {
        var content = '';
        var headerClass = isOverlap ? 'dayHeader dayOverlap' : 'dayHeader';
        var dayHeader = '<div class=\"' + headerClass + '\">';
        dayHeader += date.getDate();
        //Check for Bank holidays
        var isHol = UKBankHolidays.isBankHol(date);
        if (isHol) {
            dayHeader += " bank holiday ";
        }
        dayHeader += '</div>';
        content += dayHeader;
        //Check for other holidays
        var dayEvents = this.getDayEvents(date);
        for (var n = 0; n < dayEvents.length; n++) {
            content += dayEvents[n];
        }
        return content;
    };
    MyCal.prototype.getDayEvents = function (date) {
        //return an array od event details
        var result = [];
        for (var i = 0; i < this.events.length; i++) {
            if (new Date(this.events[i].date).toString() === date.toString()) {
                result.push("<div class=\"dayEvent\">" + this.events[i].name + "</div>");
            }
        }
        return result;
    };
    MyCal.prototype.addControls = function () {
        var _self = this;
        var html;
        //Container element for claendar controls
        var eControls = document.createElement("label");
        //Previous button element
        var ePrev = document.createElement("button");
        ePrev.innerHTML = "Prev";
        ePrev.addEventListener("click", function () {
            _self.changeMonth(true);
        });
        //Next button element
        var eNext = document.createElement("button");
        eNext.innerHTML = "Next";
        eNext.addEventListener("click", function () {
            _self.changeMonth(false);
        });
        //Add button elements to control div
        eControls.appendChild(ePrev);
        eControls.appendChild(eNext);
        //Append controls to calendar container
        this.container.appendChild(eControls);
    };
    /**
     * Writes the calendar HTML to the associated control.
     */
    MyCal.prototype.drawCal = function () {
        this.container.innerHTML = this.calHtml;
        this.addControls();
      
        fixCells();

        //debug info
        //alert('paused...')
        var timerStop = Date.now();
        var result = (timerStop - this.timerStart).toString();
        if (result === '0') {
            result = " < 1";
        }
        var debugInfo = 'Created in ' + result.toString() + ' ms';
        var debugEl = document.createElement("span");
        debugEl.innerHTML = debugInfo;
        this.container.appendChild(debugEl);
    };
  
    function fixCells(){
              //In the absense of a pure CSS solution, we need to fix the height of the tr elemetns as a style, after the table has been drawn and the heights calculated. 
        //This is so we can show the dayContent elements in the td without affecting the td height.
        //determine the row height
        var el = document.getElementsByClassName("myCal-day")[0];
        var rowheight = el.offsetHeight;
        var weeks = document.getElementsByClassName("week");
        for (var i = 0; i < weeks.length; i++) {
            weeks[i].style.height = rowheight + 'px';
        }
        var days = document.getElementsByClassName("dayContent");
        for (var i = 0; i < days.length; i++) {
            days[i].classList.remove("hidden");
        }
      
    }
  
  
    /**
     * Changes the calendar by one month.
     * @param moveBack when true moves the calendar back one month. Default is false
     */
    MyCal.prototype.changeMonth = function (moveBack) {
        if (moveBack === void 0) { moveBack = false; }
        if (moveBack) {
            this.calMonth--;
        }
        else {
            this.calMonth++;
        }
        //Check if we are at end of year
        if (this.calMonth >= this.monthLabels.length - 1) {
            this.calMonth = 0;
            this.calYear++;
        }
        //Check if we are at beginning of year
        if (this.calMonth < 0) {
            this.calMonth = this.monthLabels.length - 1;
            this.calYear--;
        }
        this.constructHTML();
        this.drawCal();
    };
    return MyCal;
})();
var myCal = new MyCal('divCal');

