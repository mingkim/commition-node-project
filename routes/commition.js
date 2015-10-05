var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var moment = require('moment');

var Commition = require('../models/commition');

String.prototype.toObjectId = function() {
  var ObjectId = (require('mongoose').Types.ObjectId);
  return new ObjectId(this.toString());
};

router.get('/:id', function(req, res, next) {
	var paramId = req.params.id;
	Commition
		.findById(paramId.toObjectId())
		.populate('user')
		.exec(function (err, commition) {
			if (err) return handleError(err);

			var isFan;
			if(commition.fans.indexOf(req.user._id) > -1){
				// login User is already fan
				isFan = true;
			} else {
				isFan = false;
			}
			var options = {
				commition : commition,
				user : commition.user,
				loginUser : req.user,
				isFan : isFan,
				helpers: {
	            	isSingle: function (array) { 
	            		if (array.length === 1){
							return 'single-target'; 
	            		}else {
	            			return 'slider-target'; 
	            		}
	            		
	            	},
	            	endTime: function(){
	            		if(commition.end_time){
	            			return moment(commition.end_time).format('YYYY-DD-MM');
	            		} else {
	            			return "-"
	            		}
	            		
	            	},
	            	inputText : function(string){
	            		if(!string){
	            			return "-"
	            		} else {
							return string
	            		}
	            	}
	       		}
			};
			res.render('detail', options);
		});
});

module.exports = router;
