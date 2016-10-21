
var app = angular.module("myapp", []);

app.factory('teams',function(){
	var teamService ={};
	teamService.list = new Array();
	
	teamService.addNew = function(){
		var number = teamService.list.length+1;
		var team = new Team(number,'TeamName'+number);
		teamService.list.push(team);
		console.log('New Team '+number+' added');
	};
	
	return teamService;
});

app.controller("BracketController", function($scope,teams) {
	var self = this;
	self.empty = true;
	
	self.load = function(){
		var data = {
			teams: new Array(),
			results: new Array()
		}
		var teamList = teams.list;
		
		teamList.forEach(function(team, index){
			if(index%2 == 1){
				var team1 = teamList[index-1].name;
				var team2 = teamList[index].name;
				data.teams.push([team1 ,team2]);
			}else{
				console.log(team.name);
				team.members.forEach(function(member,index2){
					console.log(member.name);
				});
			}
		});
		
		$(".brackets-container").bracket({
			init: data
		});
		self.empty = false;
	};
});

app.controller("TeamlistController", function($scope, teams) {
	var self = this;
	self.teams = teams.list;
	
	self.addNew =function(){
		teams.addNew();
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