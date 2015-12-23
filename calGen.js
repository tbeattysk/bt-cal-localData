var calGen = function (date, initSettings){
	var settings = {
		hideWeekends: true,
		mondayFirst: true,
	};
	var date =  new Date();
	var daysInWeek = 7;
	var month = _buildMonth(date);
	var calData = [];
	function _buildMonth(date){
		if(settings.hideWeekends){
			daysInWeek=5;
		};
		var monthData = {
			date: date,
			year: date.getFullYear(),
			month: _calMonth(date),
			weeks:_recurseWeeks(_getFirstSunday(date), _lastDayInMonth(date)),
			//Get the array of dates.
		}
		return monthData;
	};
	function _recurseWeeks(thisSun, monthEnd, monthArr){
		var monthArr = monthArr || new Array;
		for(var i=0; i<6; i++){
			monthArr = monthArr.concat(_getWeekArray(thisSun,monthEnd));
			//this._recurseWeeks(new Date(thisSun.getTime()+604800000), monthEnd, monthArr);
			thisSun = new Date(thisSun.getTime()+604800000)
		}
		return monthArr;
	};
	function _calMonth(date){
		var months = ["January","February","March","April","May","June","July","August","September","October","November", "December"];
		return months[date.getMonth()];
	};
	function _getWeekArray(dayOfWeek, monthEnd){
		var weekArr = new Array;
		if(settings.mondayFirst || settings.hideWeekends){
			dayOfWeek = new Date(dayOfWeek.getTime()+86400000);
		}
		for (var i=0; i<daysInWeek; i++){
		 	weekArr.push({date:dayOfWeek.toJSON(), 
		 		year:dayOfWeek.getFullYear(), 
		 		month:_calMonth(dayOfWeek), 
		 		day:dayOfWeek.getDate(), 
		 		time:dayOfWeek.getTime()});
		 	/*if(this.calData[weekArr[i].date]){
					weekArr[i].data = calData[weekArr[i].date];
				}*/
			dayOfWeek = new Date(dayOfWeek.getTime()+86400000);
		}
		return weekArr;
	};
	//helper function to find the day of the week to start the month
	function _getFirstSunday(date){
		var dateOfFirst = new Date(date.getFullYear(), date.getMonth(), 1);
		if(dateOfFirst.getDay()==0){
			return new Date (dateOfFirst.getTime() - 604800000);
		}
		else{
			return new Date (dateOfFirst.getTime() - (dateOfFirst.getDay())*86400000);
		}
	};
	//helper function that returns the last day of the given month by first finding the number of "days" in the given month.
	function _lastDayInMonth(date) {
		var days;
		switch(date.getMonth()){
			case 0: days = 31;break; //Jan
			case 1:
				if ( (date.getYear()%100!=0) && (date.getYear()%4==0) || (date.getYear()%400==0)){
				  days = 29;break;
				}else{
				  days = 28;break;
				} //Feb
			case 2: days = 31;break; //March
			case 3: days = 30;break; //April
			case 4: days = 31;break; //May
			case 5: days = 30;break; //June
			case 6: days = 31;break; //July
			case 7: days = 31;break; //Aug
			case 8: days = 30;break; //Sep
			case 9: days = 31;break; //Oct
			case 10: days = 30;break; //Nov
			case 11: days = 31;break; //Dec
		}
		var dateOfFirst = new Date(date.getFullYear(), date.getMonth(), 1);
		return new Date (dateOfFirst.getTime() + (days-1)*1000*60*60*24);
	};


	return {
		getCalData: function(){
			return {
				month: month,
				settings: settings,
			}
		},
		nextMonth: function(){
			if (month.date.getMonth() == 11) {
			    month.date = new Date(month.date.getFullYear() + 1, 0, 1);
			} else {
			    month.date = new Date(month.date.getFullYear(), month.date.getMonth() + 1, 1);
			}
			console.log("Setting to next month "+_calMonth(month.date));
			month = _buildMonth(month.date);
			return this.getCalData();
		},
		prevMonth: function(){
			if (month.date.getMonth() == 0) {
			    month.date = new Date(month.date.getFullYear() - 1, 11, 1);
			} else {
			    month.date = new Date(month.date.getFullYear(), month.date.getMonth() - 1, 1);
			}
			console.log("Setting to previous month "+_calMonth(month.date));
			month = _buildMonth(month.date);
			return this.getCalData();
		},
		setDate: function(newDate){
			month = _buildMonth(newDate);
			console.log("Going to date"+newDate);
			return this.getCalData();
		},
		setSettings: function(newSettings){
			console.log("New Settings")
		},
		createData: function(dataDate, data){

		},
		removeData: function(dataDate, data){

		},
		updateData: function(dataDate, data){

		}
	}
}