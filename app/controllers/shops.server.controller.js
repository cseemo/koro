'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	// errorHandler = require('./errors'),
	Shop = mongoose.model('Shop'),
	_ = require('lodash');
	var mandrill = require('mandrill-api/mandrill');
	var request = require('request');
	var http = require('http');
	var https = require('https');
	var PDFDocument = require('pdfkit');
	var fs=require('fs');
	var moment = require('moment');
	var PDFDocument = require('pdfkit');
	var fs=require('fs');
	var inspect = require('util').inspect;
	var multer = require('multer');
	var Busboy = require('busboy');
	var path = require('path'),
	Upload = mongoose.model('Upload');
	var os = require('os');



	// console.log('Portal Stuff ', portal);
    var mandrill_client = new mandrill.Mandrill('vAEH6QYGJOu6tuyxRdnKDg');
	


/**
 * Create a Shop
 */
exports.create = function(req, res) {
	console.log('Getting Shop', req.body);
	var shop = new Shop(req.body);
	shop.user = req.user;

	shop.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: err //err //errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(shop);
		}
	});
};

/**
 * Show the current Shop
 */
exports.read = function(req, res) {
	res.jsonp(req.shop);
};

/**
 * Update a Shop
 */
exports.update = function(req, res) {
	var shop = req.shop ;

	shop = _.extend(shop , req.body);

	shop.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: err //errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(shop);
		}
	});
};

/**
 * Delete an Shop
 */
exports.delete = function(req, res) {
	var shop = req.shop ;

	shop.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: err //errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(shop);
		}
	});
};

/**
 * List of Shops
 */
exports.list = function(req, res) { Shop.find().sort('-created').populate('user', 'displayName').exec(function(err, shops) {
		if (err) {
			return res.status(400).send({
				message: err //errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(shops);
		}
	});
};

/**
 * Shop middleware
 */
exports.shopByID = function(req, res, next, id) { Shop.findById(id).populate('user', 'displayName').exec(function(err, shop) {
		if (err) return next(err);
		if (! shop) return next(new Error('Failed to load Shop ' + id));
		req.shop = shop ;
		next();
	});
};

exports.uploadByID = function(req, res, next, id) { Upload.findById(id).populate('user', 'displayName').exec(function(err, upload) {
		if (err) return next(err);
		if (! upload) return next(new Error('Failed to load Upload ' + id));
		req.upload = upload ;
		next();
	});
};



/**
 * Shop authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.shop.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};

exports.getSignedAgreement = function(req, res){
		console.log('got here', req.deal);
		res.download('./Signed_'+req.shop._id+'.pdf', 'Signed_'+req.shop._id+'.pdf', function(err){
			if(err){
				console.log('ERROR!!!');
			} else {
				console.log('No Errors', req.shop._id);
			}
			return;
		});
	};

exports.viewAgreement = function(req, res) {
	if(!req.shop.signer || !req.shop.signertitle){
		console.log('Shop SIgner or Title is missing!');
		res.status(400).send('Missing Authorized Signer');
	}
	console.log('Viewing Agreement Now');

	var ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
	var id = req.shop._id;
	var today = new moment();
	var convertedPretty = moment(today).format("MM/DD/YYYY");
	var fName = req.shop.primarycontactname.split(' ');
	fName = fName[0];
	
	var doc = new PDFDocument();

	//var stream = doc.pipe(blobStream());
	var buffers = [];
	var myfileName = 'TestContract.pdf';
	// doc.pipe( fs.createWriteStream(myfileName) );
	 
	var chunks = [];
	

	//Page 1
	var bg = doc.image('images/page1.png', 0, 0,{width: 600});
	
		//Set Company Name
		doc.y = 220;
		doc.x = 220;
		doc.fontSize(14);
		doc.font('Times-Roman');
		doc.text(req.shop.name);

		//Set Address
		doc.y = 251;
		doc.x = 170;
		doc.fontSize(14);
		doc.font('Times-Roman');
		doc.text(req.shop.address);


		//Set City, State, and Zip
		doc.y = 278;
		doc.x = 170;
		doc.fontSize(14);
		doc.font('Times-Roman');
		doc.text(req.shop.city+', '+req.shop.state+' '+req.shop.zipcode);


		//Set Name
		doc.y = 300;
		doc.x = 170;
		doc.text(req.shop.primarycontactname);

		//Set Telephone Number
		doc.y = 327;
		doc.x = 170;
		doc.text(req.shop.telephone);

		//Set Fax Number
		doc.y = 353;
		doc.x = 170;
		doc.text(req.shop.fax);

		//Set Email Address
		doc.y = 375;
		doc.x = 170;
		doc.text(req.shop.email);

		//Set Date
		doc.y = 426;
		doc.x = 240;
		doc.fontSize(16);
		doc.text(convertedPretty);





		doc.addPage();

		//Page 2 
		var bg = doc.image('images/page2.png', 0, 0,{width: 600});
		doc.addPage();

		//Page 3
		var bg = doc.image('images/page3.png', 0, 0,{width: 600});
		doc.addPage();

		//Page 4
		var bg = doc.image('images/page4.png', 0, 0,{width: 600});
		doc.addPage();

		//Page 5
		var bg = doc.image('images/page5.png', 0, 0,{width: 600});
		doc.addPage();

		//Page 6
		var bg = doc.image('images/page6pending.png', 0, 0,{width: 600});
		
		//Set Printed Names and Date on Page 6
		//Set Date
		doc.y = 517;
		doc.x = 120;
		doc.fontSize(14);
		
		doc.text(convertedPretty);

	

		doc.y = 607;
		doc.x = 360;
		doc.fontSize(16);
		doc.font('Times-Roman');
		doc.text(req.shop.signer);

		doc.y = 630;
		doc.x = 345;
		doc.fontSize(16);
		doc.font('Times-Roman');
		doc.text(req.shop.signertitle);
		

		doc.addPage();

		//Page 7
		var bg = doc.image('images/page7pending.png', 0, 0,{width: 600});

		//Set Printed Names and Date on Page 7
		//Set Date
		doc.y = 460;
		doc.x = 355;
		doc.fontSize(14);
		doc.text(convertedPretty);

	

		doc.y = 412;
		doc.x = 360;
		doc.fontSize(16);
		doc.font('Times-Roman');
		doc.text(req.shop.signer);

		doc.y = 435;
		doc.x = 345;
		doc.fontSize(16);
		doc.font('Times-Roman');
		doc.text(req.shop.signertitle);

		doc.y = 636;
		doc.x = 55;
		doc.fontSize(10);
		doc.font('Times-Roman');
		doc.text(req.shop.address+' '+req.shop.city+', '+req.shop.state+' '+req.shop.zipcode+' Tel:'+req.shop.telephone+' Fax:'+req.shop.fax+' '+req.shop.email);
		


doc.pipe( res );


doc.on('data', function(chunk){
	chunks.push(chunk);
	////////console.log('chunk:', chunk.length);
});
 



doc.end();



return

};

//Update Upload Information 
exports.saveUpload = function(req, res) {
	console.log('saving upload');
	var upload = req.upload;
	var desc = req.body.description;
	console.log('Upload Info: ', desc);
	upload.desc = desc;

	upload.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: err //errorHandler.getErrorMessage(err)
			});
		} else {
			console.log('Post Save: ', upload);
		res.status(200).send('Upload Deleted');
		}
	});
	
	


};
//Delete File
exports.delFile = function(req, res) {
	console.log('Deleting File');
	console.log(req.params);
	console.log(req.query);
	console.log('File Info: ', req.upload);
	var upload = req.upload;
	fs.unlink(req.upload.url, function(err){
		if(err)console.log('ERR!!!!', err);
					console.log('Deleted Item: ', req.upload.url);
		upload.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: err //errorHandler.getErrorMessage(err)
			});
		} else {
			console.log('Upload is done!!');
			res.status(200).send('Deleted');

		}
	});

				});




};


//Display Uploads
exports.getUploads = function(req, res) {
	var results = [];
	console.log('got to uploads', req.shop);
	Upload.find({location: 'public/uploads/files/'+req.shop._id}).populate('user', 'displayName').exec(function(err, upload) {
		if (err) return next(err);
		if (! upload) console.log('FAIL');
		console.log('Got an uplaod', upload.desc);
		console.log('Length: ',upload.length);
		var x=0;
		if(upload.length<1){
			res.status(200).send(results);
		}
		

		var getFileDetails = function(elm, i, arr) {
			console.log('Index: '+i+' Elm: '+elm+' Array: '+arr);
			fs.readFile(elm.url, function(err, content) {
				if(err)console.log('ERROR!! ', err);
				var desc = elm.desc || 'None';
				// console.log(content);
				results.push({'FileName': elm.filename, 'Index': i, 'Path': 'public/uploads/files/'+req.shop._id+'/'+elm.filename, '_id': elm._id, 'created': elm.created, 'desc': desc, 'size': elm.size });
				// console.log('Results; ', results);
				// console.log('Array Length: ',arr.length);
				// console.log('I: ', i);
				x++;
				console.log('X is', x);
				if(x==arr.length){
					console.log('Done', results);
			 res.status(200).send(results);


				}
			});
			
		};
		upload.forEach(getFileDetails);

			console.log('Finisehd');
	// res.status(200).send({message: 'Got the Uploads!', data: upload});
});



};

//Countersign Agreement
exports.counterSign = function(req, res) {
	console.log('CounterSigning Agreement Now', req.shop);

	var ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
	var id = req.shop._id;
	var today = new moment();
	var convertedPretty = moment(req.shop.signDate).format("MM/DD/YYYY");

	
	var fName = req.shop.primarycontactname.split(' ');
	fName = fName[0];
	var countersignperson = 'Dustin Creek';
	var countersigntitle = 'President';
	var countersigndate = moment(today).format("MM/DD/YYYY");

	var doc = new PDFDocument();

	//var stream = doc.pipe(blobStream());
	var buffers = [];
	var myfileName = 'Signed_'+req.shop._id+'.pdf';
	doc.pipe( fs.createWriteStream(myfileName) );
	 
	var chunks = [];
	

	//Page 1
	var bg = doc.image('images/page1.png', 0, 0,{width: 600});
	
		//Set Company Name
		doc.y = 220;
		doc.x = 220;
		doc.fontSize(14);
		doc.font('Times-Roman');
		doc.text(req.shop.name);

		//Set Address
		doc.y = 251;
		doc.x = 170;
		doc.fontSize(14);
		doc.font('Times-Roman');
		doc.text(req.shop.address);


		//Set City, State, and Zip
		doc.y = 278;
		doc.x = 170;
		doc.fontSize(14);
		doc.font('Times-Roman');
		doc.text(req.shop.city+', '+req.shop.state+' '+req.shop.zipcode);


		//Set Name
		doc.y = 300;
		doc.x = 170;
		doc.text(req.shop.primarycontactname);

		//Set Telephone Number
		doc.y = 327;
		doc.x = 170;
		doc.text(req.shop.telephone);

		//Set Fax Number
		doc.y = 353;
		doc.x = 170;
		doc.text(req.shop.fax);

		//Set Email Address
		doc.y = 375;
		doc.x = 170;
		doc.text(req.shop.email);

		//Set Date
		doc.y = 426;
		doc.x = 240;
		doc.fontSize(16);
		doc.text(convertedPretty);





		doc.addPage();

		//Page 2 
		var bg = doc.image('images/page2.png', 0, 0,{width: 600});
		doc.addPage();

		//Page 3
		var bg = doc.image('images/page3.png', 0, 0,{width: 600});
		doc.addPage();

		//Page 4
		var bg = doc.image('images/page4.png', 0, 0,{width: 600});
		doc.addPage();

		//Page 5
		var bg = doc.image('images/page5.png', 0, 0,{width: 600});
		doc.addPage();

		//Page 6
		var bg = doc.image('images/page6.png', 0, 0,{width: 600});
		
		//Set Printed Names and Date on Page 6
		//Set Date
		doc.y = 517;
		doc.x = 120;
		doc.fontSize(14);
		
		doc.text(convertedPretty);

		doc.y = 574;
		doc.x = 340;
		doc.font('SANTO.TTF');
		doc.fontSize(24);
		doc.text(req.shop.signer);

		doc.y = 607;
		doc.x = 360;
		doc.fontSize(16);
		doc.font('Times-Roman');
		doc.text(req.shop.signer);

		doc.y = 630;
		doc.x = 345;
		doc.fontSize(16);
		doc.font('Times-Roman');
		doc.text(req.shop.signertitle);

		doc.y = 574;
		doc.x = 115;
		doc.font('SANTO.TTF');
		doc.fontSize(24);
		doc.text(countersignperson);

		doc.y = 607;
		doc.x = 130;
		doc.fontSize(16);
		doc.font('Times-Roman');
		doc.text(countersignperson);

		doc.y = 630;
		doc.x = 125;
		doc.fontSize(16);
		doc.font('Times-Roman');
		doc.text(countersigntitle);
		

		doc.addPage();

		//Page 7
		var bg = doc.image('images/page7.png', 0, 0,{width: 600});

		//Set Printed Names and Date on Page 7
		//Set Date
		doc.y = 460;
		doc.x = 355;
		doc.fontSize(14);
		doc.text(convertedPretty);

		doc.y = 375;
		doc.x = 330;
		doc.fontSize(26);
		doc.font('SANTO.TTF');
		doc.text(req.shop.signer);

		doc.y = 412;
		doc.x = 360;
		doc.fontSize(16);
		doc.font('Times-Roman');
		doc.text(req.shop.signer);

		doc.y = 435;
		doc.x = 345;
		doc.fontSize(16);
		doc.font('Times-Roman');
		doc.text(req.shop.signertitle);

		doc.y = 375;
		doc.x = 115;
		doc.font('SANTO.TTF');
		doc.fontSize(24);
		doc.text(countersignperson);

		doc.y = 412;
		doc.x = 130;
		doc.fontSize(16);
		doc.font('Times-Roman');
		doc.text(countersignperson);

		doc.y = 435;
		doc.x = 125;
		doc.fontSize(16);
		doc.font('Times-Roman');
		doc.text(countersigntitle);

		doc.y = 460;
		doc.x = 125;
		doc.fontSize(14);
		doc.text(countersigndate);



		


		doc.y = 636;
		doc.x = 55;
		doc.fontSize(10);
		doc.font('Times-Roman');
		doc.text(req.shop.address+' '+req.shop.city+', '+req.shop.state+' '+req.shop.zipcode+' Tel:'+req.shop.telephone+' Fax:'+req.shop.fax+' '+req.shop.email);
		


// doc.pipe( res );


doc.on('data', function(chunk){
	chunks.push(chunk);
	////////console.log('chunk:', chunk.length);
});
 



doc.end();



doc.on('end', function(){
	////////console.log(callback);
// 	////////console.log('DId you get a callback?');
	var mypdf = Buffer.concat(chunks);
	//.concat(buffers);
	var content = mypdf.toString('base64');

	//var content = fs.readFileSync(myfileName, 'base64');

		var message = {
	'subject': 'Counter-Signed Service Center Agreement',
	'from_email': 'Admin@budgetiid.com',
	'from_name': req.shop.user.displayName,
	'to': [{
		'email': req.shop.email,
		'name': req.shop.primarycontactname,
			'type': 'to'
	}],
	'headers': {
		'Reply-To': 'admin@budgetiid.com'
	},
	'merge': true,
	'global_merge_vars': [{
		'name': 'merge1',
		'content': 'merge1 content'
	}],
	'merge_vars': [{
			'rcpt': req.shop.email,
			'vars': [{
					'name': 'fName',
					'content': fName
				},
				{
					'name': 'signip',
					'content': ip
				},
				{
					'name': 'repName',
					'content': req.shop.user.displayName
				},
				{
					'name': 'shopid',
					'content': req.shop._id
				},




				]
	}],
	'important': false,
	'track_opens': null,
	'track_clicks': null,
	'auto_text': null,
	'auto_html': null,
	'inline_css': true,
	'url_strip_qs': null,
	'preserver_recipients': null,
	'view_content_link': null,
	'bcc_address': 'fivecsconsulting@gmail.com',
	'tracking_domain': null,
	'signing_domain': null,
	'return_path_domain': null,
	'attachments': [{
		'type': 'application/pdf; name=Counter-Signed_ServiceCenter_Agreement.pdf',
		'name': 'Counter-Signed_ServiceCenter_Agreement.pdf',
		'content': content
	}]
};



var template_name='countersignedshop';

var async = false;


mandrill_client.messages.sendTemplate({
	'template_name': template_name,
	'template_content': [],
	'message': message, 
	'async': async
}, function(result){

	console.log('Results from Mandrill', result);
	res.status(200).send(mypdf);
},
function(e){
	console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
	res.status(411).send(e);
});


});
		



return;

};



//Download an Uploaded File
exports.dlUpload = function(req, res){
		console.log('got here', req.upload);
		res.download(req.upload.url, req.upload.filename, function(err){
			if(err){
				console.log('ERROR!!!');
			} else {
				console.log('No Errors', req.upload);
			}
			return;
		});
	};
/**
 * Create file upload
 */
exports.uploadFile = function (req, res, next) {
	console.log('Uploading File');
    console.log('Got to post');
	console.log('Request.files', req.files);


    	var rootDir = path.normalize(__dirname + '../../../'),
		publicDir = rootDir + 'public',
		relativeDir = 'public/uploads/files',
		uploadDir = relativeDir+'/'+req.shop._id, 
		uploadURL = '/uploads/' + req.shop._id,
		imageTypes= /\.(gif|jpe?g|png)$/i;
		console.log('Public Dir: ', publicDir);
		var util = require('util');

	if(req.files) {
		console.log('req.files: ', req.files);
		if(req.files.size === 0) {
			return res.send(400, {
				message: 'Empty file'
			});
		}
		// if(req.files.file.extension==='pdf'){
		// uploadDir = relativeDir+'/'+req.shop._id;
		// }else {
		// 	uploadDir = relativeDir+'/'+req.shop._id+'/images';
		// }
		console.log('Upload DIr', uploadDir);
		fs.exists(uploadDir, function(isDir) {
			if(!isDir) {
				console.log('We dont have a director for this shop yet'+uploadDir+' so Im gonna make one: '+ req.files.file.path);
				try{
					fs.mkdir(uploadDir, function(err){
						if(err)console.log('ERROR MOTHERFUCKER!!! ', err);

						console.log('We have made our directory now!');



					});	
				} catch(e) {

					// Ignore the current directory already exists error.
					// As uploading multiple files could flag this error.
					if(e.code !== 'EEXIST') {
						console.log('What the fuck!!', e);
						// throw e;
				}
			}

			}

				


			var findValidFileName = function(file, path, extension, i) {
				console.log('checking file: %s', path + file);
				
				if(fs.existsSync(path + file)) {
					console.log('file exists');
					
					if(!i) i = 0; i++;
					
					var f = file.substr(0, file.lastIndexOf('.')) || file;
					f = f + '-' + i + '.' + extension;
					
					console.log('checking if new filename: %s exists', f);
					if(fs.existsSync(path + f)) {
						return findValidFileName(file, path, extension, i);
					} else {
						return f;
					}
				} else {
					// console.log('file doesnt exist');
					return file;
				}
			};
			

			var fileName = findValidFileName(req.files.file.originalname, uploadDir + '/', req.files.file.extension);
			
			console.log('original name: ', req.files.file.originalname);
			console.log('new name: ', fileName);

		

			fs.rename(req.files.file.path, uploadDir+'/' + fileName, function(err){
				if(err)console.log('ERROR!!!!!!!!', err);
				console.log('Preparing to save our Upload, filename: '+fileName+' | Location: '+relativeDir+'/'+req.shop._id+' | URL: '+uploadDir+'/' + fileName);
				
				//Delete Temp File
				fs.unlink(req.files.file.path, function(err){
					console.log('Deleted Item: ', req.files.file.path);

				});
						
							var finished = function() {
							console.log('Saving our Upload now');
				upload.save(function(err) {
					if(err) {
						res.send(400, {
							message: getErrorMessage(err)
						});
					} else {
						//res.jsonp(upload);
						console.log('Got it!!!');
					res.status(200).send('Uploaded!');
						//exports.uploadBySession(req, res);
					}
				});
			};





						var upload = new Upload({
							session: req.sessionID,
							filename: fileName,
							location: relativeDir+'/'+req.shop._id,
							url: uploadDir+'/' + fileName,
							size: req.files.file.size,


							
						});

						finished();
			});
			
	
	});
}
	
      	
          // console.log('Request Info', req);
          // fs.readFile(req.files.file.path, function(err, data) {
          // 	console.log('Reading File', req.files.file.name);
          // 	var newPath = "/uploads/"+req.shop.name+"/";
          // 	console.log(newPath);
          // 	console.log('Data: ', data);
          // 	var options = {
          // 		encoding: null
          // 	};
          // 	fs.rename(req.files.file.path, '/public/uploads/chad/', function(err) {

          // 		fs.writeFile('/public/uploads/'+req.shop._id+'/test.png', data, options, function(err) {
          // 	// console.log('I hope this works', newFile);
          // 	console.log('Writing File');
          // 	res.send('hi');
          // });



          // 	});
          	

          // });


          // })
          // var newPath = '/public/uploads/'+req.shop.name;
          // var newFile = fs.writeFile('TEST.png', req.files.file, function(err) {
          // 	console.log('I hope this works', newFile);
          // 	// res.status(200).send(newFile);





          // });

   


//     if (req.method === 'POST') {
//     	console.log('Got To POst:');

//     	var rootDir = path.normalize(__dirname + '../../../'),
// 		publicDir = rootDir + 'public',
// 		relativeDir = 'public/uploads/files/',
// 		uploadDir = rootDir + relativeDir,
// 		uploadURL = '/uploads/' + req.shop._id+'/',
// 		imageTypes= /\.(gif|jpe?g|png)$/i;

// 		var util = require('util');

// 	if(req.files) {
// 		console.log('req.files: ', req.files);
// 		if(req.files.size === 0) {
// 			return res.send(400, {
// 				message: 'Empty file'
// 			});
// 		}
// 		console.log('Upload DIr', uploadDir);
// 		fs.exists(uploadDir, function(isDir) {
// 			if(!isDir) {
// 				try{
// 					fs.mkdirSync(uploadDir);	
// 				} catch(e) {

// 					// Ignore the current directory already exists error.
// 					// As uploading multiple files could flag this error.
// 					if(e.code !== 'EEXIST') {
// 						console.log('What the fuck!!', e);
// 						// throw e;
// 				}
// 			}

// 			}

// 			var findValidFileName = function(file, path, extension, i) {
// 				console.log('checking file: %s', path + file);
				
// 				if(fs.existsSync(path + file)) {
// 					console.log('file exists');
					
// 					if(!i) i = 0; i++;
					
// 					var f = file.substr(0, file.lastIndexOf('.')) || file;
// 					f = f + '-' + i + '.' + extension;
					
// 					console.log('checking if new filename: %s exists', f);
// 					if(fs.existsSync(path + f)) {
// 						return findValidFileName(file, path, extension, i);
// 					} else {
// 						return f;
// 					}
// 				} else {
// 					console.log('file doesnt exist');
// 					return file;
// 				}
// 			};

// 			var fileName = findValidFileName(req.files.file.originalname, uploadDir + '/', req.files.file.extension);
// 			console.log('original name: ', req.files.file.originalname);
// 			console.log('new name: ', fileName);

// 			fs.renameSync(rootDir + req.files.file.path, uploadDir + '/' + fileName);

// 			var upload = new Upload({
// 				session: req.sessionID,
// 				filename: fileName,
// 				location: relativeDir,
// 				url: uploadURL + '/' + fileName,
// 				size: req.files.file.size,
// 				versions: {}
// 			});

// 			upload.versions = {};

// 			// var counter = 0;
// 			// Object.keys(imageVersions).forEach(function (version) {

// 			// 	counter++;
// 			// 	fs.exists(uploadDir + '/' + version, function(vDir) {
// 			// 		if(!vDir) {
// 			// 			try{
// 			// 				fs.mkdirSync(uploadDir + '/' + version);
// 			// 			} catch(e) {

// 			// 				// Ignore the current directory already exists error.
// 			// 				// As uploading multiple files could flag this error.
// 			// 				if(e.code !== 'EEXIST') throw e;
// 			// 			}
// 			// 		}

// 			// 	});
// 			// });
// 						var finished = function() {
// 				upload.save(function(err) {
// 					if(err) {
// 						res.send(400, {
// 							message: getErrorMessage(err)
// 						});
// 					} else {
// 						//res.jsonp(upload);
// 						console.log('Got it!!!');
// 						res.jsonp({files: [upload]});
// 						//exports.uploadBySession(req, res);
// 					}
// 				});
// 			};
// 		});

// 	} else {
// 		res.status(400).send({
// 			message: 'Empty file'
// 		});
// 	}
// }


  //   var busboy = new Busboy({ headers: req.headers });
  //   busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
  //     console.log('File [' + fieldname + ']: filename: ' + filename);
  //     file.on('data', function(data) {
  //       console.log('File [' + fieldname + '] got ' + data.length + ' bytes');
  //     });
  //     file.on('end', function() {
  //       console.log('File [' + fieldname + '] Finished');
  //     });
  //   });
  //   busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated) {
  //     console.log('Field [' + fieldname + ']: value: ' + inspect(val));
  //   });
  //   busboy.on('finish', function() {
  //     console.log('Done parsing form!');
  //     res.writeHead(303, { Connection: 'close', Location: '/' });
  //     res.end();
  //   });
  //   console.log('Huh');
  //   req.pipe(busboy);
  // }    

return;




};


exports.signAgreement = function(req, res) {
	console.log('Signing Agreement Now', req.shop);

	var ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
	var id = req.shop._id;
	var today = new moment();
	var convertedPretty = moment(today).format("MM/DD/YYYY");
	var fName = req.shop.primarycontactname.split(' ');
	fName = fName[0];
	
	var doc = new PDFDocument();

	//var stream = doc.pipe(blobStream());
	var buffers = [];
	var myfileName = 'Signed_'+req.shop._id+'.pdf';
	doc.pipe( fs.createWriteStream(myfileName) );
	 
	var chunks = [];
	

	//Page 1
	var bg = doc.image('images/page1.png', 0, 0,{width: 600});
	
		//Set Company Name
		doc.y = 220;
		doc.x = 220;
		doc.fontSize(14);
		doc.font('Times-Roman');
		doc.text(req.shop.name);

		//Set Address
		doc.y = 251;
		doc.x = 170;
		doc.fontSize(14);
		doc.font('Times-Roman');
		doc.text(req.shop.address);


		//Set City, State, and Zip
		doc.y = 278;
		doc.x = 170;
		doc.fontSize(14);
		doc.font('Times-Roman');
		doc.text(req.shop.city+', '+req.shop.state+' '+req.shop.zipcode);


		//Set Name
		doc.y = 300;
		doc.x = 170;
		doc.text(req.shop.primarycontactname);

		//Set Telephone Number
		doc.y = 327;
		doc.x = 170;
		doc.text(req.shop.telephone);

		//Set Fax Number
		doc.y = 353;
		doc.x = 170;
		doc.text(req.shop.fax);

		//Set Email Address
		doc.y = 375;
		doc.x = 170;
		doc.text(req.shop.email);

		//Set Date
		doc.y = 426;
		doc.x = 240;
		doc.fontSize(16);
		doc.text(convertedPretty);





		doc.addPage();

		//Page 2 
		var bg = doc.image('images/page2.png', 0, 0,{width: 600});
		doc.addPage();

		//Page 3
		var bg = doc.image('images/page3.png', 0, 0,{width: 600});
		doc.addPage();

		//Page 4
		var bg = doc.image('images/page4.png', 0, 0,{width: 600});
		doc.addPage();

		//Page 5
		var bg = doc.image('images/page5.png', 0, 0,{width: 600});
		doc.addPage();

		//Page 6
		var bg = doc.image('images/page6.png', 0, 0,{width: 600});
		
		//Set Printed Names and Date on Page 6
		//Set Date
		doc.y = 517;
		doc.x = 120;
		doc.fontSize(14);
		
		doc.text(convertedPretty);

		doc.y = 574;
		doc.x = 340;
		doc.font('SANTO.TTF');
		doc.fontSize(24);
		doc.text(req.shop.signer);

		doc.y = 607;
		doc.x = 360;
		doc.fontSize(16);
		doc.font('Times-Roman');
		doc.text(req.shop.signer);

		doc.y = 630;
		doc.x = 345;
		doc.fontSize(16);
		doc.font('Times-Roman');
		doc.text(req.shop.signertitle);
		

		doc.addPage();

		//Page 7
		var bg = doc.image('images/page7.png', 0, 0,{width: 600});

		//Set Printed Names and Date on Page 7
		//Set Date
		doc.y = 460;
		doc.x = 355;
		doc.fontSize(14);
		doc.text(convertedPretty);

		doc.y = 375;
		doc.x = 330;
		doc.fontSize(26);
		doc.font('SANTO.TTF');
		doc.text(req.shop.signer);

		doc.y = 412;
		doc.x = 360;
		doc.fontSize(16);
		doc.font('Times-Roman');
		doc.text(req.shop.signer);

		doc.y = 435;
		doc.x = 345;
		doc.fontSize(16);
		doc.font('Times-Roman');
		doc.text(req.shop.signertitle);

		doc.y = 636;
		doc.x = 55;
		doc.fontSize(10);
		doc.font('Times-Roman');
		doc.text(req.shop.address+' '+req.shop.city+', '+req.shop.state+' '+req.shop.zipcode+' Tel:'+req.shop.telephone+' Fax:'+req.shop.fax+' '+req.shop.email);
		


// doc.pipe( res );


doc.on('data', function(chunk){
	chunks.push(chunk);
	////////console.log('chunk:', chunk.length);
});
 



doc.end();



doc.on('end', function(){
	////////console.log(callback);
// 	////////console.log('DId you get a callback?');
	var mypdf = Buffer.concat(chunks);
	//.concat(buffers);
	var content = mypdf.toString('base64');

	//var content = fs.readFileSync(myfileName, 'base64');

		var message = {
	'subject': 'Signed Service Center Agreement',
	'from_email': 'Admin@budgetiid.com',
	'from_name': req.shop.user.displayName,
	'to': [{
		'email': req.shop.email,
		'name': req.shop.primarycontactname,
			'type': 'to'
	}],
	'headers': {
		'Reply-To': 'admin@budgetiid.com'
	},
	'merge': true,
	'global_merge_vars': [{
		'name': 'merge1',
		'content': 'merge1 content'
	}],
	'merge_vars': [{
			'rcpt': req.shop.email,
			'vars': [{
					'name': 'fName',
					'content': fName
				},
				{
					'name': 'signip',
					'content': ip
				},
				{
					'name': 'repName',
					'content': req.shop.user.displayName
				},
				{
					'name': 'shopid',
					'content': req.shop._id
				},




				]
	}],
	'important': false,
	'track_opens': null,
	'track_clicks': null,
	'auto_text': null,
	'auto_html': null,
	'inline_css': true,
	'url_strip_qs': null,
	'preserver_recipients': null,
	'view_content_link': null,
	'bcc_address': 'fivecsconsulting@gmail.com',
	'tracking_domain': null,
	'signing_domain': null,
	'return_path_domain': null,
	'attachments': [{
		'type': 'application/pdf; name=Signed_ServiceCenter_Agreement.pdf',
		'name': 'Signed_ServiceCenter_Agreement.pdf',
		'content': content
	}]
};



var template_name='signedupshop';

var async = false;


mandrill_client.messages.sendTemplate({
	'template_name': template_name,
	'template_content': [],
	'message': message, 
	'async': async
}, function(result){

	console.log('Results from Mandrill', result);
	res.status(200).send(mypdf);
},
function(e){
	console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
});


});
		



return;

};

//Send Service Agreement to Shop
exports.sendAgreement = function(req, res) {
	console.log('Sending Agreement Now');
	//Make sure we have a valid email address for the shop
	if(!req.shop.email || req.shop.email==='Email Address'){
		console.log('We have a bad email address!!');
		res.status(400).send({message: 'We need a damn email address!'});
	}else {

		console.log("Shop Email: ", req.shop.email);
	var ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
	var id = req.shop._id;
	var today = new moment();
	var convertedPretty = moment(today).format("MM/DD/YYYY");
	var fName = req.shop.primarycontactname.split(' ');
	fName = fName[0];
	
	var doc = new PDFDocument();

	//var stream = doc.pipe(blobStream());
	var buffers = [];
	var myfileName = 'TestContract.pdf';
	// doc.pipe( fs.createWriteStream(myfileName) );
	 
	var chunks = [];
	

	//Page 1
	var bg = doc.image('images/page1.png', 0, 0,{width: 600});
	
		//Set Company Name
		doc.y = 220;
		doc.x = 220;
		doc.fontSize(14);
		doc.font('Times-Roman');
		doc.text(req.shop.name);

		//Set Address
		doc.y = 251;
		doc.x = 170;
		doc.fontSize(14);
		doc.font('Times-Roman');
		doc.text(req.shop.address);


		//Set City, State, and Zip
		doc.y = 278;
		doc.x = 170;
		doc.fontSize(14);
		doc.font('Times-Roman');
		doc.text(req.shop.city+', '+req.shop.state+' '+req.shop.zipcode);


		//Set Name
		doc.y = 300;
		doc.x = 170;
		doc.text(req.shop.primarycontactname);

		//Set Telephone Number
		doc.y = 327;
		doc.x = 170;
		doc.text(req.shop.telephone);

		//Set Fax Number
		doc.y = 353;
		doc.x = 170;
		doc.text(req.shop.fax);

		//Set Email Address
		doc.y = 375;
		doc.x = 170;
		doc.text(req.shop.email);

		//Set Date
		doc.y = 426;
		doc.x = 240;
		doc.fontSize(16);
		doc.text(convertedPretty);





		doc.addPage();

		//Page 2 
		var bg = doc.image('images/page2.png', 0, 0,{width: 600});
		doc.addPage();

		//Page 3
		var bg = doc.image('images/page3.png', 0, 0,{width: 600});
		doc.addPage();

		//Page 4
		var bg = doc.image('images/page4.png', 0, 0,{width: 600});
		doc.addPage();

		//Page 5
		var bg = doc.image('images/page5.png', 0, 0,{width: 600});
		doc.addPage();

		//Page 6
		var bg = doc.image('images/page6.png', 0, 0,{width: 600});


		doc.addPage();

		//Page 7
		var bg = doc.image('images/page7.png', 0, 0,{width: 600});



// doc.pipe( res );


doc.on('data', function(chunk){
	chunks.push(chunk);
	////////console.log('chunk:', chunk.length);
});
 



doc.end();


doc.on('end', function(){
	////////console.log(callback);
// 	////////console.log('DId you get a callback?');
	var mypdf = Buffer.concat(chunks);
	//.concat(buffers);
	var content = mypdf.toString('base64');

	//var content = fs.readFileSync(myfileName, 'base64');

	var fromemail = 'Budget IID';
	if(req.user.email) {
		console.log('User Email: ', req.user.email);
		fromemail = req.user.email;
	}
	var toname = req.shop.primarycontactname || '';
		var message = {
	'subject': 'Ignition Interlock Service Center Agreement',
	'from_email': fromemail,
	'from_name': req.user.displayName,
	'to': [{
		'email': req.shop.email,
		'name': toname,
			'type': 'to'
	}],
	'headers': {
		'Reply-To': 'admin@budgetiid.com'
	},
	'merge': true,
	'global_merge_vars': [{
		'name': 'merge1',
		'content': 'merge1 content'
	}],
	'merge_vars': [{
			'rcpt': req.shop.email,
			'vars': [{
					'name': 'fName',
					'content': fName
				},
				{
					'name': 'signip',
					'content': ip
				},
				{
					'name': 'repName',
					'content': req.user.displayName
				},
				{
					'name': 'shopid',
					'content': req.shop._id
				},




				]
	}],
	'important': false,
	'track_opens': null,
	'track_clicks': null,
	'auto_text': null,
	'auto_html': null,
	'inline_css': true,
	'url_strip_qs': null,
	'preserver_recipients': null,
	'view_content_link': null,
	'bcc_address': 'fivecsconsulting@gmail.com',
	'tracking_domain': null,
	'signing_domain': null,
	'return_path_domain': null,
	'attachments': [{
		'type': 'application/pdf; name=BudgetIID_ServiceCenter_Agreement.pdf',
		'name': 'BudgetIID_ServiceCenter_Agreement.pdf',
		'content': content
	}]
};



var template_name='budget-newshop';

var async = false;


mandrill_client.messages.sendTemplate({
	'template_name': template_name,
	'template_content': [],
	'message': message, 
	'async': async
}, function(result){

	console.log('Results from Mandrill', result);
	// console.log(result[0].status);
	// var manmess = result[0].status;
	res.status(200).send(mypdf);
},
function(e){
	console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
	res.status(411).send(e.message);
});


});
		

	// res.status(222).send('Still Writing Code!');

return;
}

};