
var app = angular.module("myapp", []);

app.factory('TeamService',function(){
	var teamService ={};
	teamService.list = new Array();
	
	teamService.addNew = function(){
		var number = teamService.list.length+1;
		var team = new Team(number,'TeamName'+number);
		teamService.list.push(team);
		console.log('New Team '+number+' Added');
	};
	
	return teamService;
});

app.controller("BracketController", function($scope,TeamService) {
	var self = this;
	self.empty = true;
	self.teamService = TeamService;
	
	self.unable = function(){
		return self.teamService.list.length == 0||self.teamService.list.length%4!=0
	};
	self.load = function(){
		console.log('Tournament Bracket Loading');
		self.empty = false;
		var teamList = self.teamService.list.map(function(team){return team.name});;
		initBrackets(teamList);
		console.log('Tournament Bracket Loaded');
	};
});

app.controller("TeamlistController", function($scope, TeamService) {
	var self = this;
	self.teamService = TeamService;
	
	self.addNew =function(){
		self.teamService.addNew();
	};
});

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