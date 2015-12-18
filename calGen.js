Polymer({
		is:'bt-cal',
		properties:{
			calData: {
				type: Object,
				value: {
					"2015-06-15T16:00:00.000Z": {details:"My B-Day"},
					"2015-06-17T16:00:00.000Z": {details:"hello world morsadf asdf asd ffds sd fe and more jibber jabber!"},
				}
			},
			hideWeekends: {
				type: Boolean,
				value: false
			},
			mondayFirst: {
				type: Boolean,
				value: false,
			},
			date: {
				type: Date,
				value: new Date(),
				observer: '_buildCalendar',
				notify: true
			},			
		},
		ready: function(){
			
		},
		handleClick: function(e){
			this.fire('date-clicked',{id: e.target.id})
		},
		nextMonth: function(){
			if (this.date.getMonth() == 11) {
			    this.date = new Date(this.date.getFullYear() + 1, 0, 1);
			} else {
			    this.date = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 1);
			}
		},
		previousMonth: function(){
			if (this.date.getMonth() == 0) {
			    this.date = new Date(this.date.getFullYear() - 1, 11, 1);
			} else {
			    this.date = new Date(this.date.getFullYear(), this.date.getMonth() - 1, 1);
			}
		},
		_buildCalendar: function(){
			this.month = this._calMonth(this.date);
			this.year = this.date.getFullYear();
			this.daysOfWeek = ["Sun","Mon","Tues","Wed","Thurs","Fri","Sat"];
			if(this.mondayFirst){
				this.daysOfWeek = ["Mon","Tues","Wed","Thurs","Fri","Sat","Sun"];
			}
			if(this.hideWeekends){
				this.daysOfWeek = ["Mon","Tues","Wed","Thurs","Fri"];
			}
			this.daysInWeek = this.daysOfWeek.length;
			this.calendar = this._recurseWeeks(this._getFirstSunday(this.date), this._lastDayInMonth(this.date))
			//Get the array of dates.
			
		},
		_mergeData: function(calendar, calData){
			for(var week=0; week < calendar.length; week++){
				for(var day=0; day < 7; day++){
					if(calData[calendar[week][day].time]){
						calendar[week][day].data = calData[calendar[week][day].time];
					}
				}
			}
			return calendar;
		},
		_calMonth: function(date){
			var months = ["January","February","March","April","May","June","July","August","September","October","November", "December"];
			return months[date.getMonth()];
		},
	
		//Recursive function that builds the month array week by week by passing each Sunday.
	 	_recurseWeeks: function(thisSun, monthEnd, monthArr){
			var monthArr = monthArr || new Array;
			for(var i=0; i<6; i++){
				monthArr.push(this._getWeekArray(thisSun,monthEnd));
				//this._recurseWeeks(new Date(thisSun.getTime()+604800000), monthEnd, monthArr);
				thisSun = new Date(thisSun.getTime()+604800000)
			}
			return monthArr;
		},

		// Builds an array for any week week starting on the Sunday and recurse through each day.
		_getWeekArray: function(dayOfWeek, monthEnd){
			var weekArr = new Array;
			if(this.mondayFirst || this.hideWeekends){
				dayOfWeek = new Date(dayOfWeek.getTime()+86400000);
			}
			for (var i=0; i<this.daysInWeek; i++){
			 	weekArr.push({date:dayOfWeek.toJSON(), day:dayOfWeek.getDate(), time:dayOfWeek.getTime()});
			 	if(this.calData[weekArr[i].date]){
						weekArr[i].data = this.calData[weekArr[i].date];
					}
				dayOfWeek = new Date(dayOfWeek.getTime()+86400000);

			}
			return weekArr;
		},

		//helper function to find the day of the week to start the month
		_getFirstSunday: function(date){
			var dateOfFirst = new Date(date.getFullYear(), date.getMonth(), 1);
			if(dateOfFirst.getDay()==0){
				return new Date (dateOfFirst.getTime() - 604800000);
			}
			else{
				return new Date (dateOfFirst.getTime() - (dateOfFirst.getDay())*86400000);
			}
		},

		//helper function that returns the last day of the given month by first finding the number of "days" in the given month.
		_lastDayInMonth: function(date) {
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
		}
	});