const express = require("express");
const cluster = require('cluster');
const os = require('os');
const net = require('net');
const farmhash = require('farmhash');

// for intialising mongo db connection
const mongo = require('./db/mongodbDao');

// job
const job = require('./job/addTopStories');
//initialize API
const api = require('./api')
// custom modules
const cfg = require('./config');

const NUM_OF_PROCESSES = os.cpus().length;

if (cluster.isMaster) {
  // This stores our workers. We need to keep them to be able to reference
	// them based on source IP address. It's also useful for auto-restart,
	// for example.
	let workers = [];
  console.log(`Forking for ${NUM_OF_PROCESSES} CPUs`);
	// Helper function for spawning worker at index 'i'.
	let spawn = (i) => {
		workers[i] = cluster.fork();

		// Optional: Restart worker on exit
		workers[i].on('exit', (code, signal) => {
			console.log('respawning worker', i);
			spawn(i);
		});
  };

    // Spawn workers.
	for (let i = 0; i < NUM_OF_PROCESSES; i++) {
		spawn(i);
	}

	// Helper function for getting a worker index based on IP address.
	// This is a hot path so it should be really fast. The way it works
	// is by converting the IP address to a number by removing non numeric
  // characters, then compressing it to the number of slots we have.
	//
	// Compared against "real" hashing (from the sticky-session code) and
	// "real" IP number conversion, this function is on par in terms of
	// worker index distribution only much faster.
	let worker_index = (ip, len) => {
		return farmhash.fingerprint32(ip) % len; // Farmhash is the fastest and works with IPv6, too
	};

	// Create the outside facing server listening on our port.
	let server = net.createServer({ pauseOnConnect: true }, (connection) => {
		// We received a connection and need to pass it to the appropriate
		// worker. Get the worker for this connection's source IP and pass
		// it the connection.
		let worker = workers[worker_index(connection.remoteAddress, NUM_OF_PROCESSES)];
		worker.send('sticky-session:connection', connection);
	}).listen(cfg.PORT, () => {
    console.log("Server is running at port: " + cfg.PORT, process.pid);
  });

} else {
	mongo.getDBConnection((err, conn) => {
		if(err) {
			throw err;
			process.exit(1);
		}

		if(conn) job.addStories();

		// Note we don't use a port here because the master listens on it for us.
		let app = new express();

		// Here you might use middleware, attach routes, etc.
		app.use('/api', api);
		// Don't expose our internal server to the outside.
		let server = app.listen(0, 'localhost');

		 // Listen to messages sent from the master. Ignore everything else.
		 process.on('message', function(message, connection) {
			 if (message !== 'sticky-session:connection') {
				 return;
			 }

			 // Emulate a connection event on the server by emitting the
			 // event with the connection the master sent us.
			 server.emit('connection', connection);

			 connection.resume();
		 });

		 console.log('Process: ', process.pid);
	});
}
