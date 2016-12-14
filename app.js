
var app = angular.module("myapp", []);

app.factory('AppService',function(){
	var appService ={};
	appService.teams = new Array();
	
	appService.addNew = function(){
		var number = this.teams.length+1;
		var team = new Team(number,'TeamName'+number);
		this.teams.push(team);
		console.log('New Team '+number+' Added');
	};
	
	appService.browserWidth =  function() {
		if (self.innerWidth) {
			return self.innerWidth;
		}

		if (document.documentElement && document.documentElement.clientWidth) {
			return document.documentElement.clientWidth;
		}

		if (document.body) {
			return document.body.clientWidth;
		}
	};

	appService.browserHeight = function() {
		if (self.innerHeight) {
			return self.innerHeight;
		}

		if (document.documentElement && document.documentElement.clientHeight) {
			return document.documentElement.clientHeight;
		}

		if (document.body) {
			return document.body.clientHeight;	
		}
	};
	return appService;
});

app.controller("BracketController", ['$scope','AppService',function($scope,AppService) {
	var self = this;
	self.empty = true;
	self.appService = AppService;
	
	self.unable = function(){
		return self.appService.teams.length == 0||self.appService.teams.length%4!=0
	};
	
	self.canvasWidth = function(){
		
		return "'"+(self.appService.browserWidth()-250)+"px'";
	};
	self.canvasHeight = function(){
		
		return "'"+self.appService.browserHeight()+"px'";
	};
	
	self.load = function(){
		console.log('Tournament Bracket Loading');
		self.empty = false;
		var teamList = self.appService.teams.map(function(team){return team.name});;
		initBrackets(teamList);
		console.log('Tournament Bracket Loaded');
	};
}]);

app.controller("TeamlistController", ['$scope','AppService',function($scope, AppService) {
	var self = this;
	self.appService = AppService;
	
	self.addNew =function(){
		self.appService.addNew();
	};
}]);

function Team(number, name, membersAmount = 2){
	this.number = number;
	this.name = name;
	this.members = [];
	for(var i=1;i<=membersAmount;i++){
		this.members.push(new TeamMember('Player'+i));
	}
}
function TeamMember(name){
	this.name = name;
}