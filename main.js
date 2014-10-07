var fs = require("fs");
var amanda = require('amanda');
var jsonSchemaValidator = amanda("json");
var schema = require("./schema");
var Q = require("q");
var later = require("later");
var moment = require("moment");
var email   = require("emailjs");
var config ;  

function validateSchema() {
	var deferred = Q.defer();
	var formatErrTxt = 'JSON.parse config.json error , please check , for reference , see config.json.example';
	var fileContent = fs.readFileSync("config.json" , "utf8");
	var json = null;
	try {
		json = JSON.parse(fileContent);
	} catch(e){
		deferred.reject(formatErrTxt);
		return deferred.promise;
	}
	jsonSchemaValidator.validate(json , schema , function(error) {
		if(error) {
			var errArr = [formatErrTxt];
			for(var i = 0 , len = error.length ; i < len ; i++) {
				errArr.push(error[i].message);
			}
			deferred.reject(errArr.join('\n'));
		} else {
			deferred.resolve(json);
		}

	});
	return deferred.promise;
}

function parseConfig(json) {
	config = {
		emails : {},
		dates  : {}
	};
	json.emails.forEach(function(item) {
		config.emails[item.name] = item.email;
	});
	json.dates.forEach(function(item) {
		config.dates[item.date] = item.person;
	});
	for(var key in json) {
		if(!/emails|dates/.test(key)) {
			config[key] = json[key];
		}
	}
}

function getPerson() {
	var ret = null;
	var d1 = moment().format('YYYY-MM-DD');
	var d2 = moment().format('MM-DD');
	var person = config.dates[d1] || config.dates[d2];
	if(person) {
		if(config.emails[person]) {
			ret = {
				person : person,
				email : config.emails[person]	
			};
		}
	}
	return ret;
}

function sendMail() {
	var HH = parseInt(moment().format('HH') , 10);
	if(config.hours.indexOf(HH) < 0) {
		return;
	};
	
	var personInfo = getPerson();
	if(!personInfo) {
		return;
	}
	var server  = email.server.connect({
	   user:    config.username, 
	   password:config.password, 
	   host:    config.smtp, 
	   ssl:     true,
	   port : config.port
	});
	var replacement = {
		time : moment().format("HH:mm:ss"),
		person : personInfo.person
	};
	function getText(str) {
		return str.replace(/\{([^}]+)\}/gi , function($0,$1) {
			return replacement[$1] || '';
		});
	}
	server.send({
	   text:    getText(config.emailcontent), 
	   from:    config.username, 
	   to:      personInfo.email,
	   cc :     "zhoulianyi@antrol.com",
	   subject: getText(config.emailtitle)
	}, function(err, message) {
		var logDate = moment().format("YYYY-MM-DD HH:mm:ss");
		if(err) {
			console.error(logDate +  " 发送邮件给 "  + JSON.stringify(personInfo) + " 失败");
		} else {
			console.log(logDate +  " 发送邮件给 "  + JSON.stringify(personInfo) + " 成功");
		}
	});
}

function scheduleJob() {
	var cron = later.parse.cron(config.crontab);
	later.setInterval(function() {
		sendMail();
	} , cron);
}
process.title = "ApEmailer";
validateSchema().then(function(json) {
	parseConfig(json);
	scheduleJob();
} , function(err) {
	console.error(err);
});
