'use strict';

const url = require('url');
const fs = require('fs');
const http = require('http');
const path = require('path');
const config = require('config');

http.createServer( (req, res) => {
	let pathname = decodeURI(url.parse(req.url).pathname);
	let filename = pathname.slice(1); // /index.html -> index.html


	switch(req.method) {
		case 'GET':
			if (pathname == '/') {
	      	
	    		getQuery(config.get('mainPath') + '/index.html', res);

	    	}else {
		    	let filepath = path.join(config.get('filesRoot'), filename);
		    	getQuery(filepath, res);
		    }
	    break;

	    case 'POST':

    		postQuery(path.join(config.get('filesRoot'), filename), req, res);

    	break;
	}
	
}).listen(3000);

function getQuery(file, res) {

	var	query = fs.ReadStream(file);

	query.pipe(res);

	query.on('error', function(err) {
		res.statusCode = 404;
		res.end('Not found');
	});

	res.on('close', function() {
		query.destroy();
	});
}

function postQuery(file, req, res) {

	var wStream = new fs.WriteStream(file);

	var body = '';

	req.on('data', (chunk) => {

		body += chunk;

		if (body.length > 1e6) {
			res.statusCode = 413;
			res.end('Payload Too Large');
			res.connection.destroy();
		}

		res.end(body.toString('utf-8'));
	});

	req.on('error', function(err) {
		if(err.code === 'ENOENT') {
			res.statusCode = 404;
			res.end('Not found');
		}

		if(err.code === 'EISDIR') {
			res.statusCode = 500;
			res.end('An operation expected a file, but the given pathname was a directory.')
		}
		
	});

	res.on('close', function() {
		wStream.destroy();
	});

}