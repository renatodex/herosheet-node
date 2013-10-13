var express = require('express'),
		app = express(),
		request = require('request');

app.set('view engine', 'ejs');
app.set('views', __dirname + '/templates');
app.use(express.bodyParser());

app.get('/', function(req, res){
	request('http://herosheet-backend:3000/api/list_team_heroes?team_id=1', 'GET', function(err, response, body) {
		var json = JSON.parse(body)
		res.render('index.ejs', {team: json['team']['nome'], herois: json['team']['herois']});
	});
});

var server = app.listen(1337),
	io = require('socket.io').listen(server)

io.sockets.on('connection', function (socket) {
	console.log(socket.id);
	socket.on("updateSheet", function(){
		socket.broadcast.emit("clientUpdateSheet", function(){
			console.log("RESPOSTA!!");
		});
		console.log("UPDATE!!!");
	});
	socket.on("updateHeroSheet", function(obj){

		var str = "hero_id="+ obj.hero_id + 
						"&name=" + obj['name'] +
						"&total_hit_points=" + obj.total_hit_points +
						"&actual_hit_points=" + obj.actual_hit_points +
						"&total_healing_surges=" + obj.total_healing_surges +
						"&actual_healing_surges=" + obj.actual_healing_surges +
						"&action_points=" + obj.action_points;

		request({
			url: 'http://herosheet-backend:3000/api/update_hero_sheet',
			body: str,
			method: "POST"
			},

			function(err, response, body) {
				socket.broadcast.emit("clientUpdateSheet", function(){
					console.log("SHEET UPDATADA!!");
				});
				socket.emit("clientUpdateSheet", function(){
					console.log("SHEET UPDATADA!!");
				});
			}
		);
	});
});

console.log("CONECTOU NA BAGAÇA!!!")