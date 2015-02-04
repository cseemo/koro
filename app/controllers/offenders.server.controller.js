'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	// errorHandler = require('./errors'),
	Offender = mongoose.model('Offender'),
	_ = require('lodash');

	var Authorize = require('auth-net-types'),
	   _AuthorizeCIM = require('auth-net-cim'),
	  	AuthorizeCIM = new _AuthorizeCIM({
	    // api: '78HDftF7Gs',
	    // key: '83H8U65tX3ekuFrD', //Chads TEst API
	    api: '5hB56Vus',
	    key: '37HmG92v4J2yDsMp', //Budget Actual API
	    sandbox: false //true // false
	  });

//Delete Card Info
var delCardInfo = function(off){
	console.log('Deleting', off);
    off.cardNumber = 'XXXXXXXX'+off.last4;
    off.cardExp = '';
    off.cardCVV = '';
    off.save();
    console.log('Done.');
    console.log(off);

};

exports.deletePaymentProfile2 = function(req, res){

// customerProfileId: req.offender.merchantCustomerId,
// 						  customerPaymentProfileId: req.offender.paymentProfileId,

	//Delete Payment Profile
	AuthorizeCIM.deleteCustomerPaymentProfile({
		customerProfileId: req.offender.merchantCustomerId,
		customerPaymentProfileId: req.offender.paymentProfileId
	}, function(err, response){
		if(err) {
			console.log('Error Deleting Profile', err);
		}else{
			res.status(405).send(err);
		res.status(200).send(response);
	}
	});
	

};


var createPaymentProfile2 = function(customerId, cus, cardData, cb){
	// console.log('What is cus?', cus);
	console.log('Creating Payment Profile - Line 57');
	console.log('Merchange ID: ', customerId);
	console.log('Card Data: ', cardData);
	cus.merchantCustomerId = customerId;
	// var cardExp = cus.expYear+'-'+cus.expMonth;
	// console.log('Card Expirations: ', cardExp);
var options = {
  customerType: 'individual',
  billTo: {
  		firstName: cardData.firstName,
  		lastName: cardData.lastName,
  		address: cardData.cardAddress,
  		city: cardData.cardCity,
  		state: cardData.cardState,
  		zip: cardData.cardZip,
  		phoneNumber: cardData.mainPhone
  },
  payment: {
    creditCard: new Authorize.CreditCard({
      cardNumber: cardData.cardNumber,
      expirationDate: cardData.cardExp,
      cardCode: cardData.cardCVV
    })
  }
};
console.log('Options for New Payment Profile: ', options);
AuthorizeCIM.createCustomerPaymentProfile({
  customerProfileId: customerId,
  paymentProfile: options
}, function(err, response) {
	if(err) {
		console.log('Error Line 62 - OffenderServer Controller', err);
		cb(err, null);
	}else{
		console.log('Response from Payment Profile, ', response);
		cus.cardNumber = 'XXXXXXXX'+cus.last4;;
		cus.cardExp = '';
		cus.cardCVV = '';
		console.log('Here is payment infO: ', response.customerPaymentProfileId);
		cus.paymentProfileId = response.customerPaymentProfileId;
		console.log('???', cus.paymentProfileId );
		cus.save(function(err) {
			if(err) console.log('Error Saving Customer', err);
			console.log('Customer: ', cus);
			// cb(null, 'Payment Profile ID: '+response.customerPaymentProfileId);
				AuthorizeCIM.validateCustomerPaymentProfile({
						  customerProfileId: cus.merchantCustomerId,
						  customerPaymentProfileId: cus.paymentProfileId ,
						  validationMode: 'liveMode' // liveMode
						}, function(err, response) {
							if(err){
							console.log('ERROR Validating Card', err);
							// res.status(409).send('Error: '+err);
							cb('Payment Profile Created - but card not validated '+err, null);
							cb(err,null);
						}else{
							console.log('Card Validated ', response);
							// res.status(200).send('Card Information Updated & Validated');
							cb(null, response);
						}
				});


	});

	}

});
	
};

//Create Customer Profile on Authorize.net
var createAuthProfile2 = function(off, cb) {
		console.log('Running Authorization for Auth.net');
	 	console.log('Do we have Offender: ', off);
	 	 var customerID2 = off._id.toString();
		  var customerID = customerID2.substring(3, 23);
		  console.log('Customer ID: ', customerID);
		 var profile = {
  		merchantCustomerId: customerID,
 		 description: off.firstName+' '+off.lastName,
  		email: off.offenderEmail,
  
  // customerProfileId: 349494
}



	AuthorizeCIM.createCustomerProfile({customerProfile: profile}, function(err, response){
		if(err) {


			console.log('ERROR from Auth.net!', err);
			cb(err, null);

		}else {
			console.log('Response from Auth.net', response);
			
				console.log('Customer Profile ID: ', response.customerProfileId);
				off.merchantCustomerId = response.customerProfileId;
				
				// if(off.cardNumber && off.cardNumber.length>3){
				// 	createPaymentProfile(response.customerProfileId, off, function(err, data){
				// 	if(err){
				// 		console.log('Error Line 118', err);
				// 		off.save(function(err) {
				// 		if(err) console.log('Error Saving Customer', err);
				// 		});
				// 		cb(err, null);
				// 	}else {
				// 	console.log('Line 120 - response From createPaymentProfile', data);

				// 		cb(null, data);
				// 	}
				// });

				// }else{
					off.save(function(err) {
						if(err) {
							console.log('Error Saving Customer', err);
							cb(err, null);
						}else{
							console.log('Saving customer without creating payment profile');
							cb(null, {'customerProfile': response.customerProfileId});
						}

						});

				}

			
		
		
	


	});





};


//Authorize.net Functions
	var createAuthProfile = function(args, cb){
		//Take in the Customer Information and then add a new Customer Profile
		console.log('Creating a New Authorization Profile');
		var off = args.offender;
	 	console.log('Do we have Offender: ', off);
	 	var customerID2 = off._id.toString();
		var customerID = customerID2.substring(3, 23);
		console.log('Customer ID: ', customerID);
		var profile = {
	  		merchantCustomerId: customerID,
	 		description: off.firstName+' '+off.lastName,
	  		email: off.offenderEmail,
		}

		AuthorizeCIM.createCustomerProfile({customerProfile: profile}, function(err, response){
			if(err) {
				console.log('ERROR from Auth.net!', err);
				cb(err, null);

			}else {
				console.log('Response from Auth.net', response);
				console.log('Customer Profile ID: ', response.customerProfileId);
				cb(null, response.customerProfileId);
			}
		});
	};

	var createPaymentProfile = function(args, cb){
			console.log('Creating Payment Profile');
			// console.log('Args: ', args);
			var cardData = args.cardData;
			var cus = args.offender;
			var customerId = args.offender.merchantCustomerId;

		var options = {
		  customerType: 'individual',
		  billTo: {
		  		firstName: cardData.fName,
		  		lastName: cardData.lName,
		  		address: cardData.cardAddress,
		  		city: cardData.cardCity,
		  		state: cardData.cardState,
		  		zip: cardData.cardZip,
		  		phoneNumber: cardData.mainPhone
		  },
		  payment: {
		    creditCard: new Authorize.CreditCard({
		      cardNumber: cardData.cardNumber,
		      expirationDate: cardData.cardExp,
		      cardCode: cardData.cardCVV
		    })
		  }
		}
		console.log('Options to Create Payment Profile ', options);
		AuthorizeCIM.createCustomerPaymentProfile({
		  customerProfileId: customerId,
		  paymentProfile: options
		}, function(err, response) {
			if(err) {
				console.log('Error Line 262 - OffenderServer Controller', err);
				cb(err, null);
			}else{
				// console.log('Response from Payment Profile, ', response);
				cb(null, response);
			}
		});

	};

	var deletePaymentProfile = function(args, cb){
	//Delete Payment Profile
	console.log('Deleting PRofile');
	console.log('Deleting customerProfileId', args.customerProfileId);
	console.log('Deleting customerPaymentProfileId', args.paymentProfileId.customerPaymentProfileId);
	
		AuthorizeCIM.deleteCustomerPaymentProfile({
			customerProfileId: args.customerProfileId,
			customerPaymentProfileId: args.paymentProfileId.customerPaymentProfileId
		}, function(err, response){
			if(err) {
				console.log('Error Deleting Profile', err);
				cb(err,null);
			}else{
				console.log('That bitch has been deleted');
				cb(null, response);
		}
		});
		

	};

	var validatePaymentProfile2 = function(args, cb){
		console.log('Validating Profile', args);
		console.log('  -------------------------------');
		console.log('customerProfileId: ', args.customerProfileId);
		console.log('customerPaymentProfileId: ', args.paymentProfileId.customerPaymentProfileId);
		console.log('Card Code: ', args.cardData.cardCVV);
		AuthorizeCIM.validateCustomerPaymentProfile({
						  customerProfileId: args.customerProfileId,
						  customerPaymentProfileId: args.paymentProfileId.customerPaymentProfileId,
						  cardCode: args.cardData.cardCVV,
						  validationMode: 'liveMode' // liveMode testMode
						}, function(err, response) {
							if(err){
							console.log('ERROR Validating Card Line 299', err);
							// res.status(409).send('Error: '+err);
							cb('Payment Profile Created - but card not validated '+err, null);
							// cb(err,null);
						}else{
							console.log('Card Validated ');
							// res.status(200).send('Card Information Updated & Validated');
							cb(null, response);
						}
				});



	};


		//Create Transaction for $1.00 inauhtorize ONLY
		var validatePaymentProfile = function(args, cb){
		console.log('Validating Profile', args);
		console.log('customerProfileId: ', args.customerProfileId);
		console.log('customerPaymentProfileId: ', args.paymentProfileId.customerPaymentProfileId);

								var transaction = {
						  amount: '0.01',
						  // tax: {
						  //   amount: '0.00',
						  //   name: 'State Tax',
						  //   description: 'None'
						  // },
						  // shipping: {
						  //   amount: 5.00,
						  //   name: 'FedEx Ground',
						  //   description: 'No Free Shipping Option'
						  // }, 
						  payment: {
							    creditCard: {
							      cardNumber: args.cardData.cardNumber,
							      expirationDate: args.cardData.cardExp,
							      cardCode: args.cardData.cardCVV
							    }
							  },
							customerProfileId: args.customerProfileId,
							  customerPaymentProfileId:  args.paymentProfileId.customerPaymentProfileId,
						  order: {
						    invoiceNumber: 'VER'+Date.now(),
						    description: 'Card Verification Only...transaction will be voided'
						  },
						  billTo: {
						  	firstName: args.cardData.fName,
						  	lastName: args.cardData.lName,
						  	address: args.cardData.address
						  },
						  cardCode: args.cardData.cardCVV
						};
								/* AuthCapture AuthOnly, CaptureOnly, PriorAuthCapture */
							AuthorizeCIM.createCustomerProfileTransaction('AuthOnly', transaction, function(err, response) {
							if(err){
								console.log('Error Validating Card via $.01 charge', err);
								return cb('Error Validating Card '+err, null);
							}
							if(response){
								console.log('Card has been Validated!!', response);
								console.log('RESPONSE DATA :::::');
								console.log('AVS Response', response.directResponse[5]);
								console.log('Transaction ID: ', response.directResponse[6]);
								console.log('Authorization Code',response.directResponse[4]);
								console.log('Card Code Response',response.directResponse[39]);
								console.log('Card Type',response.directResponse[51]);
								console.log('Cardholder Verification',response.directResponse[39]);
								
								


								return cb(null, 'Card Has Been Validated '+response);
							}
						});


							//Response
							// directResponse: '1,1,1,
							// [3] - This transaction has been approved.,
							// 183441,Y,6846707383,1421544948047,Validation made from portal...,
							// 0.01,CC,auth_only,b070d8bd32032d1407c4,Chad,Seymour,,15428 N 170th Ln,
							// Surprise,AZ,85388,,,,cseemo@gmail.com,,,,,,,,,0.00,,,,,
							// EABF2B39AB6EB26686A58028DADB5429,M,,,,,,,,,,,,XXXX1253,MasterCard,,,,,,,,,,,,,,,,' }


		// AuthorizeCIM.validateCustomerPaymentProfile({
		// 				  customerProfileId: args.customerProfileId,
		// 				  customerPaymentProfileId: args.paymentProfileId.customerPaymentProfileId,
		// 				  validationMode: 'liveMode' // liveMode
		// 				}, function(err, response) {
		// 					if(err){
		// 					console.log('ERROR Validating Card Line 299', err.message);
		// 					// res.status(409).send('Error: '+err);
		// 					cb('Payment Profile Created - but card not validated '+err, null);
		// 					// cb(err,null);
		// 				}else{
		// 					console.log('Card Validated ');
		// 					// res.status(200).send('Card Information Updated & Validated');
		// 					cb(null, response);
		// 				}
		// 		});



	};

	var updatePaymentProfile = function(args, cb){
		console.log('Updating Payment PRofile');
		console.log('New Card Info: '+args.cardData.cardNumber+' '+args.cardData.cardExp+' '+args.cardData.cardCVV);
		console.log('Profile ID: ');
		console.log('Bill To:');
		var options = {
				  customerType: 'individual',
				  customerPaymentProfileId: args.paymentProfileId.customerPaymentProfileId,
				  payment: {
				    creditCard: new Authorize.CreditCard({
				      cardNumber: args.cardData.cardNumber,
				        expirationDate:  args.cardData.cardExp,
				        cardCode: args.cardData.cardCVV
				    })
				  }, 
				  billTo: {
				  	firstName: args.paymentProfileId.billTo.firstName,
			        lastName: args.paymentProfileId.billTo.lastName,
			        address: args.paymentProfileId.billTo.address,
			        city: args.paymentProfileId.billTo.city,
			        state: args.paymentProfileId.billTo.state,
			        zip: args.paymentProfileId.billTo.zip,
			        phoneNumber: args.paymentProfileId.billTo.phoneNumber},
				  };


				

				AuthorizeCIM.updateCustomerPaymentProfile({
				  customerProfileId: args.customerProfileId,
				  paymentProfile: options
				  
				}, function(err, response) {

			if(err){
				console.log('Err Line 329', err);
				cb(err, null);
			}else{
				console.log('Updated Payment PRofile/352');
				cb(null, response);

			}
		});



	};



//Update Credit Card Info
exports.updateCCInfo = function (req, res) {
	console.log('Updating the CC Info');
	// console.log('Credit Info: ', req.body);
	// console.log('Offender: ', req.offender);
	// console.log('Card Data: ',req.body.cardData );
	if(req.body.cardData){
		var cardData = req.body.cardData;
		// console.log('Card Data: ', cardData);
		// cardData.mainPhone = req.offender.mainPhone;
		// cardData.cardAddress = cardData.address || req.offender.billingAddress;
		// cardData.cardCity = cardData.city || req.offender.billingCity;
		// cardData.cardState = cardData.state || req.offender.billingState;
		// cardData.cardZip = cardData.cardZip || req.offender.billingZipcode;

		// console.log('Card Data after Check for UNDEFINED', cardData);

	}

	  //If customer already has Merchant ID and Payment Profile ID 
	  //Update or Delete or Create New 
	  if(req.body.type==='new' && req.offender.merchantCustomerId){
		  	//Create a New Payment Profile ID
		  	console.log('Existing Authorize.net Profile --- Adding New Credit Card on File Line 458');
		  	var args = {
		  		offender: req.offender,
		  		cardData: cardData,
		  	};
		  	
		  	console.log('Args Sending to Create New Profile: ', args);
	  		createPaymentProfile(args, function(err, data){
					if(err){
						console.log('Error Line 244', err);
						res.status(409).send({'message': err, 'error': err});
					}else {
					console.log('Line 342 - response From createPaymentProfile', data);
						// res.status(203).send({'message': 'Payment Profile Created '+data});
						console.log('Payment Profile ID: ', data.customerPaymentProfileId);
						req.offender.paymentProfileId = data.customerPaymentProfileId;
						req.offender.save(function(err){
		  				if(err){
		  					console.log('Error Saving Offender: ', err);
		  				}});

						var args2 = {
					  		offender: req.offender,
					  		cardData: cardData,
					  		paymentProfileId: {
					  			customerPaymentProfileId: data.customerPaymentProfileId
					  		},
					  		customerProfileId: req.offender.merchantCustomerId,
					  	};
					  	console.log('Args Sending to Validate: ', args2);
					  	console.log('Do we have Card Code: ', args2.cardData.cardCVV);
						validatePaymentProfile(args2, function(err, response){
		  				if(err){
		  					console.log('Error Validating Profile');
		  					res.status(400).send({'message': err, 'error': err});
		  				}else{
		  					console.log('Response from Validate PRofile', response);
		  					res.status(200).send({'message': 'This payment method has been validated and saved', 'data': response});
		  				}	
		  				

		  			});
					}
				});

	  }else if(req.body.type==='new' && !req.offender.merchantCustomerId){
	  	console.log('No Authorize.net Profile - Creating a New One Now -- Line 498');
	  	var argsV = {
		  		offender: req.offender,
		  		cardData: cardData,
		  	};

		  	createAuthProfile(argsV, function(err, data){
		  		if(err){
		  			console.log('Error: Line 503 ', err);
		  			res.status(400).send({'message': 'Error Creating Payment Profile'+err, 'error': err});
		  		}else{
		  			//Time to Create a Payment Profile
		  			console.log('rsopnse From create Auth Profile', data);
		  			req.offender.merchantCustomerId = data;
		  			req.offender.save(function(err){
		  				if(err){
		  					console.log('Error Saving Offender: ', err);
		  				}else{


		  			
		  			console.log('Creating New Payment Profile');
				  	var argsC = {
				  		offender: req.offender,
				  		cardData: cardData,
				  	};
		  	
				  	console.log('Args Sending to Create New Profile: ', argsC);
			  		createPaymentProfile(argsC, function(err, data){
							if(err){
								console.log('Error Line 244', err);
								res.status(409).send({'message': 'Error Creating Payment Profile', 'error': err});
							}else {
							console.log('Line 531 - response From createPaymentProfile', data);
								// res.status(203).send({'message': 'Payment Profile Created '+data});
								console.log('Payment Profile ID: ', data.customerPaymentProfileId);
								// var args3 = {
							 //  		offender: req.offender,
							 //  		cardData: cardData,
							 //  		paymentProfileId: {
							 //  		customerPaymentProfileId: data.customerPaymentProfileId
							 //  		},
							 //  		customerProfileId: req.offender.merchantCustomerId,
							 //  	};
							 
								// console.log('Response from Create Payment Profile', data);
								// console.log('Payment Profile ID: ',  data.customerPaymentProfileId);
								req.offender.paymentProfileId = data.customerPaymentProfileId;
								req.offender.save(function(err){
				  				if(err){
				  					console.log('Error Saving Offender: ', err);
				  				}});

					  				var argsM = {
								  		offender: req.offender,
								  		cardData: cardData,
								  	 	paymentProfileId: {
								  	 		customerPaymentProfileId: data.customerPaymentProfileId,
								  	 	},
								  	 	customerProfileId: req.offender.merchantCustomerId,
								  		
								  	};
								  	console.log('Args to Validate Profile:  Line 554:', argsM);

					  			validatePaymentProfile(argsM, function(err, response){
					  				if(err){
					  					console.log('Error Validating Profile - line 510');
					  					res.status(400).send({'message': 'Error Validating Payment - Please Verify', 'error': err});
					  				}else{
					  					console.log('Response from Validate PRofile', response);
					  					res.status(200).send({'message': 'This payment method has been validated and saved', 'data': response});
					  				}	
					  				

					  			});

					  		}
		  		

		  	});

	}
	 });

	}


		  			});
	  }else 

	  if(req.body.type==='update' ){
	  	console.log('Updating Payment Profile');
	  		var args = {
		  		offender: req.offender,
		  		cardData: cardData,
		  		paymentProfileId: req.body.paymentProfileId,
		  		customerProfileId: req.body.customerProfileId,
		  	};

		  	updatePaymentProfile(args, function(err, data){
		  		if(err){
		  			console.log('Error: Line 401 ', err);
		  			res.status(400).send({'message': 'Error Updating Payment Profile', 'error': err});
		  		}else{
		  			console.log('Response from Update Paymetn Profile');
		  			// res.status(200).send(data);
		  			validatePaymentProfile(args, function(err, response){
		  				if(err){
		  					console.log('Error Validating Profile');
		  					res.status(400).send({'message': 'Error Validating Payment - Please Verify', 'error': err});
		  				}else{
		  					console.log('Response from Validate PRofile', response);
		  					res.status(200).send({'message': 'This payment method has been validated and saved', 'data': response});
		  				}	
		  				

		  			});

		  		}
		  		

		  	});

	  } else if(req.body.type==='delete' ){
	  	console.log('Delete Payment Profile', req.body);
	  		var args = {
		  		offender: req.offender,
		  		paymentProfileId: req.body.paymentProfileId,
		  		customerProfileId: req.body.customerProfileId,
		  	};

		  	deletePaymentProfile(args, function(err, data){
		  		if(err){
		  			console.log('Error: Line 448 ', err);
		  			res.status(400).send({'message': 'Error Deleting Payment Profile', 'error': err});
		  		}else{
		  			console.log('Response from Deleting Paymetn Profile');
		  			// res.status(200).send(data);
		  			
		  					console.log('Response from Validate PRofile', data);
		  					res.status(200).send({'message': 'This payment method has been deleted', 'data': data});
		  				}
		  				

		  			});

		  		}else{
		  			console.log('Luke weve got a problem...line 585');
		  		}

		  	

		  	};

	



	//   else if(req.offender.paymentProfileId && req.offender.merchantCustomerId){
	//   	//Customer already has at least one card on File - Check to see which one we are updating
	//   	console.log('Customer has Payment ID and Merchant ID - NOT CREATING NEW -- ready to update');
	//   	var paymentProfileId = req.offender.paymentProfileId;
	//   	console.log('We are supposed to update: ', paymentProfileId);
	//   	console.log('Line 215 Offender: ', req.offender);
	//   		  var options = {
	// 			  customerType: 'individual',
	// 			   customerPaymentProfileId: req.offender.paymentProfileId,
	// 			  payment: {
	// 			    creditCard: new Authorize.CreditCard({
	// 			      cardNumber: req.body.cardNumber,
	// 			        expirationDate: req.body.expDate,
	// 			        cardCode: req.body.CVV
	// 			    })
	// 			  }
	// 			}

	// 			AuthorizeCIM.updateCustomerPaymentProfile({
	// 			  customerProfileId: req.offender.merchantCustomerId,
	// 			  paymentProfile: options
				  
	// 			}, function(err, response) {
	// 				if(err) {
	// 					console.log('Errror updating Customer Payment Profile: ', err);
	// 					res.status(409).send('Error: '+err);
	// 				} 
	// 				if(response) {

	// 					console.log('Response from Update: ', response);
	// 					// res.status(200).send('Card Information Updated');

							
	// 					AuthorizeCIM.validateCustomerPaymentProfile({
	// 					  customerProfileId: req.offender.merchantCustomerId,
	// 					  customerPaymentProfileId: req.offender.paymentProfileId,
	// 					  validationMode: 'testMode' // liveMode
	// 					}, function(err, response) {
	// 						if(err){
	// 						console.log('ERROR Validating Card', err);
	// 						res.status(409).send('Error: Line 250'+err);
	// 					}else{
	// 						console.log('Card Validated ', response);
	// 						res.status(200).send('Card Information Updated & Validated');
	// 					}
	// 			});

	// 				}
	// });
	//   }else {
	//   	//If customer doesnt have Payment Profile ID and Merchant ID
	//   	//Check if it has the Merchant ID
	//   	if(req.offender.merchantCustomerId){
	//   		//Customer has Merchant ID
	//   		console.log('Line 264 -- Has merchant ID but no profile ID', req.offender.merchantCustomerId);
	//   		console.log('Offender: ', req.offender);
	//   		console.log('Card Exp: ', req.body.expDate);
	//   		req.offender.cardNumber = req.body.cardNumber;
	//   		req.offender.cardCVV = req.body.cardCVV;
	//   		console.log('271::::::: ', req.offender);
	//   		console.log('Chard Number: ',req.body.cardNumber );
	//   		createPaymentProfile(req.offender.merchantCustomerId, req.offender, cardData, function(err, data){
	// 				if(err){
	// 					console.log('Error Line 118', err);
	// 					req.offender.save(function(err) {
	// 					if(err) console.log('Error Saving Customer', err);
	// 					});
	// 					res.status(409).send('Error Line 272: '+err);
	// 				}else {
	// 				console.log('Line 120 - response From createPaymentProfile', data);

	// 					res.status(409).send('Error: Line 276'+err);
	// 				}
	// 			});
	//   }else{
	//   	//Customer doesnot have Any Profile Create customer Profile 
	//   	console.log('Line 281 -- Got No Credit Card Info on this guy...Offender: ', req.offender);
	//   	var authNetResult;
	//   	createAuthProfile(req.offender, function(err, data){
	// 				if(err){
	// 					console.log('Error creatingAuthProfile', err);
	// 					// res.jsonp({ 'authNet': 'Error', 'authNetErr': err});
	// 					res.status(409).send(err);
	// 				}else{
	// 					console.log('Created Auth Profile - Need to Create Payment PRofile', data);
	// 					if(data.customerProfile){
	// 						console.log('We only did customer profile - going for Payment Profile Now');
	// 						createPaymentProfile(data.customerProfile, req.offender, cardData, function(err, data){
	// 						if(err){
	// 							console.log('Error Line 118', err);
	// 							req.offender.save(function(err) {
	// 							if(err) console.log('Error Saving Customer', err);
	// 							});
	// 							res.status(409).send('Error Line 272: '+err);
	// 						}else {
	// 						console.log('Line 357 - response From createPaymentProfile', data);
	// 							consoe.log('Should be a good Validation');
	// 							res.status(202).send(data);
	// 						}
	// 					});




	// 					}else{
	// 						console.log('No Customer PRofile...');
	// 						res.status(342).send('Problem - Line 353 Offender Server Controller');

	// 						// authNetResult = 'Success';
	// 						// res.jsonp({'authNet': authNetResult, 'authNetData': data});
	// 						// res.status(200).send('Line 297  == Card Information Updated & Validated');

	//   }
	//   }
	
	// });
	//   }
	// }
// };


/**
 * Create a Offender
 */
exports.create = function(req, res) {
	// console.log('Reqeust Body', req.body);
	var offender = new Offender(req.body);
	offender.user = req.user;
	console.log('Offender Info: ', offender);
	offender.displayName = offender.firstName+' '+offender.lastName;
	offender.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: err //errorHandler.getErrorMessage(err)
			});
		} else {
				// var authNetResult;
				// createAuthProfile(offender, function(err, data){
				// 	if(err){
				// 		console.log('Error creatingAuthProfile', err);
				// 		res.jsonp({'offender': offender, 'authNet': 'Error', 'authNetErr': err});
				// 	}else{
				// 		console.log('Tried to do Auth.net stuff', data);
				// 		if(data.paymentProfile){
				// 			console.log('We only did payment profile');
				// 			authNetResult = 'ProfileOnly';
				// 		}else{
				// 			authNetResult = 'Success';
				// 		}
						// res.jsonp({'offender': offender, 'authNet': authNetResult, 'authNetData': data});
						res.jsonp(offender);
					}
					
					
				});
	
		
};

/**
 * Show the current Offender
 */
exports.read = function(req, res) {
	res.jsonp(req.offender);
};

/**
 * Update a Offender
 */
exports.update = function(req, res) {
	var offender = req.offender;
	// if(offender.cardNumber && offender.cardNumber > 11){
	// offender.cardNumber = 'XXXXXXXX'+offender.last4;
	// offender.cardExp = '';
	// offender.cardCVV = '';
	// }
	

	offender = _.extend(offender , req.body);

	offender.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: err //errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(offender);
		}
	});
};

/**
 * Delete an Offender
 */
exports.delete = function(req, res) {
	var offender = req.offender ;

	offender.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: err //errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(offender);
		}
	});
};

/**
 * List of Offenders
 */
exports.list = function(req, res) { Offender.find(req.query).sort('-created').populate('user', 'displayName').exec(function(err, offenders) {
		if (err) {
			return res.status(400).send({
				message: err //errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(offenders);
		}
	});
};

exports.pending = function(req, res) { 
	console.log('Getting Pending ORders', req.user);
	if(req.user.shop){
		console.log('This user has an assigned Shop', req.user.shop);
	}else{
		console.log('This user doesnt have an assigned shop');
	}
	var shop = req.user.shop;
	Offender.find().where({assignedShop: req.user.shop}).sort('-created').exec(function(err, offenders) {
		if (err) {
			return res.status(400).send({
				message: err //errorHandler.getErrorMessage(err)
			});
		} else {
			console.log('Got some offenders!!');
			console.log(offenders.length);
			res.jsonp(offenders);
		}
	});
};

exports.offenderByDl = function(req, res) { 
		console.log('Looking for by DL Number:', req.body.dl);
		Offender.find().where({driverNumber: req.body.dl}).populate('user', 'displayName').exec(function(err, offender) {
		if (err) {
			return res.status(400).send({
				message: err //errorHandler.getErrorMessage(err)
			});
		}

		if (! offender) return 'Failed to load Offender by Driver License Number ' + req.body.dl;
		
		
		console.log(offender);
		console.log('Offender Length: ', offender.length)
		if(offender.length > -1){
			console.log('Looks like an actual offender');
			res.jsonp(offender);
		}else{
			res.status(303).send('Sorry no offender to be found');
		}
		
	
		// console.log(offender);
		// console.log('Offender Length: ', offender.length)
		// if(offender.length > -1){
		// 	console.log('Looks like an actual offender');
		// 	res.status(200).send(offender);
		// }else{
		// 	res.status(303).send('Sorry no offender to be found');
		// }
		
	});
};

/**
 * Offender middleware
 */
exports.offenderByID = function(req, res, next, id) { Offender.findById(id).populate('user', 'displayName').exec(function(err, offender) {
		if (err) return next(err);
		if (! offender) return next(new Error('Failed to load Offender ' + id));
		req.offender = offender ;
		next();
	});
};

/**
 * Offender authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	console.log('Has Authorization is not authorizing...308');
	// if (req.offender.user.id !== req.user.id) {
	// 	return res.status(403).send('User is not authorized');
	// }
	next();
};