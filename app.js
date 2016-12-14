
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
	self.bracket;
	
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
		var teamList = self.appService.teams.map(function(team){return team.name});
		self.bracket = new TournamentBracket(teamList);
		self.bracket.appendTo("myDiagramDiv");
		self.bracket.onMatchEnded(self.endMatchAnimation);
		console.log('Tournament Bracket Loaded');
	};
	self.endMatchAnimation = function(winTeam, loseTeam){
		var body = document.getElementsByTagName('body')[0];
		
		var animationContainer = document.createElement('div');
		animationContainer.classList.add('win-animation-container');
		
		var winTeamNode = document.createElement('span');
		winTeamNode.classList.add('team-name');
		winTeamNode.classList.add('elegantshadow');
		winTeamNode.innerHTML = winTeam;
		
		var gratsNode = document.createElement('span');
		gratsNode.classList.add('grats-text');
		gratsNode.innerHTML = " gewinnt gegen ";
		
		var loseTeamNode = document.createElement('span');
		loseTeamNode.classList.add('team-name');
		loseTeamNode.classList.add('elegantshadow');
		//loseTeamNode.classList.add('deepshadow');
		loseTeamNode.innerHTML = loseTeam;
		
		animationContainer.appendChild(winTeamNode);
		animationContainer.appendChild(gratsNode);
		animationContainer.appendChild(loseTeamNode);
		
		body.appendChild(animationContainer);
		
		window.setTimeout(function(){
			body.removeChild(animationContainer);
		},3000);
		
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
	
	this.eliminated = false;
	for(var i=1;i<=membersAmount;i++){
		this.members.push(new TeamMember('Player'+i));
	}
}
function TeamMember(name){
	this.name = name;
}