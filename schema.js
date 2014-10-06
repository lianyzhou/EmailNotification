var schema = {
	type : "object",
	properties : {
		emails : {
			required : true,
			type : 'array',
			minItems : 1,
			items : {
				type : "object",
				properties : {
					name : {
						required : true,
						type : "string"
					},
					email : {
						required : true,
						type : "string"
					}
				}
			}
		},
		dates : {
			required : true,
			type : 'array',
			minItems : 1,
			items : {
				type : "object",
				properties : {
					date : {
						required : true,
						type : "string",
						pattern : "(\\d{4}\\-)?\\d{2}\\-\\d{2}"
					},
					person : {
						required : true,
						type : "string"
					}
				}
			}
		},
		username : {
			required : true,
			type : "string"
		},
		password : {
			required : true,
			type : "string"
		},
		smtp : {
			required : true,
			type : "string"
		},
		crontab : {
			required : true,	
			type : "string"	
		},
		hours : {
			required : true,	
			type : "array",
			minItems : 1,
			items : {
				type : "number",
				minimum:0,
				maximum:23
			}	
		},
		port : {
			required : true,	
			type : "number",
			minimum:1
		},
		emailtitle : {
			required : true,	
			type : "string"
		},
		emailcontent : {
			required : true,	
			type : "string"	
		}
	}
};
module.exports = schema;