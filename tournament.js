// GoJS Tournament Bracket Diagramm
function TournamentBracket(teamList){
	var self = this;
	self.teamList = teamList;
	self.bracket = null;
	
	self.onMatchEnded = function(onMatchEnded){
		self.bracket.model.addChangedListener(function(e) {
			if (e.propertyName !== 'score1' && e.propertyName !== 'score2') return;
			var data = e.object;
			if (isNaN(data.score1) || isNaN(data.score2)) return;

			// TODO: What happens if score1 and score2 are the same number?

			// both score1 and score2 are numbers,
			// set the name of the higher-score'd player in the advancing (parent) node
			// if the data.parentNumber is 0, then we set player1 on the parent
			// if the data.parentNumber is 1, then we set player2
			var parent = self.bracket.findNodeForKey(data.parent);
			
			var score1 = parseInt(data.score1);
			var score2 = parseInt(data.score2);

			var winningTeam = score1 > score2 ? data.player1 : data.player2;
			var loseTeam = score1 > score2 ? data.player2: data.player1;
			if (score1 === score2) winningTeam = "";
			
			if(data.score1 != null&&data.score2 != null){
				var eventData = [{"name" : winningTeam , "score" : 3},
				{"name" : loseTeam , "score" : 3}];
				onMatchEnded(winningTeam, loseTeam);
				if (parent === null){
					
				}else{
					self.bracket.model.setDataProperty
						(parent.data, (data.parentNumber === 0 ? "player1" : "player2"), winningTeam);
				}
			}
			//console.log(JSON.stringify(model));
		});
	};
	
	self.appendTo = function(parentNode){
		self.bracket = initBrackets(parentNode, self.teamList);
	};
}
function initBrackets(parentNode, teamList) {
	var $ = go.GraphObject.make;  // for conciseness in defining templates
	var myDiagram = $(go.Diagram, parentNode,  // create a Diagram for the DIV HTML element
		{
		  initialContentAlignment: go.Spot.Center,  // center the content
		  "textEditingTool.starting": go.TextEditingTool.SingleClick,
		  "textEditingTool.textValidation": isValidScore,
		  layout: $(go.TreeLayout, { angle: 180 }),
		  "undoManager.isEnabled": true
		});

	// define a simple Node template
	myDiagram.nodeTemplate =
	  $(go.Node, "Auto",
		{ selectable: false },
		$(go.Shape, "Rectangle",
		  { fill: '#0062B7', stroke: null },// Shape.fill is bound to Node.data.color
		  new go.Binding("fill", "color")),
		$(go.Panel, "Table",
		  $(go.RowColumnDefinition, { column: 0, separatorStroke: "black" }),
		  $(go.RowColumnDefinition, { column: 1, separatorStroke: "black", background: "#FAFAFA" }),
		  $(go.RowColumnDefinition, { row: 0, separatorStroke: "black" }),
		  $(go.RowColumnDefinition, { row: 1, separatorStroke: "black" }),
		  $(go.TextBlock, "",
			{ row: 0,
			  wrap: go.TextBlock.None, margin: 5, width: 90,
			  isMultiline: false, textAlign: 'left',
			  font: '10pt  Segoe UI,sans-serif', stroke: 'white' },
			new go.Binding("text", "player1").makeTwoWay()),
		  $(go.TextBlock, "",
			{ row: 1,
			  wrap: go.TextBlock.None, margin: 5, width: 90,
			  isMultiline: false, textAlign: 'left',
			  font: '10pt  Segoe UI,sans-serif', stroke: 'white' },
			new go.Binding("text", "player2").makeTwoWay()),
		  $(go.TextBlock, "",
			{ column: 1, row: 0,
			  wrap: go.TextBlock.None, margin: 2, width: 25,
			  isMultiline: false, editable: true, textAlign: 'center',
			  font: '10pt  Segoe UI,sans-serif', stroke: 'black' },
			new go.Binding("text", "score1").makeTwoWay()),
		  $(go.TextBlock, "",
			{ column: 1, row: 1,
			  wrap: go.TextBlock.None, margin: 2, width: 25,
			  isMultiline: false, editable: true, textAlign: 'center',
			  font: '10pt  Segoe UI,sans-serif', stroke: 'black' },
			new go.Binding("text", "score2").makeTwoWay())
		)
	  );

	// define the Link template
	myDiagram.linkTemplate =
	  $(go.Link,
		{ routing: go.Link.Orthogonal,
		  selectable: false },
		$(go.Shape, { strokeWidth: 2, stroke: '#FAFAFA' }));

	myDiagram.model = makeModel(teamList);
	return myDiagram;
} // end init
//Generate TreeModel + ChangeListener
function makeModel(players) {
	var pairs = createPairs(players);
	//console.log(pairs);
	return new go.TreeModel(pairs);
}
// Generates the original graph from an array of player names
function createPairs(players) {
	if (players.length % 2 !== 0) players.push('(empty)');
	var startingGroups = players.length / 2;
	var currentLevel = Math.ceil(Math.log(startingGroups) / Math.log(2));
	var levelGroups = [];
	var currentLevel = Math.ceil(Math.log(startingGroups) / Math.log(2));
	for (var i = 0; i < startingGroups; i++) {
		levelGroups.push(currentLevel + '-' + i);
	}
	var totalGroups = [];
	makeLevel(levelGroups, currentLevel, totalGroups, players);
	return totalGroups;
}
// Generates the levelGroup
function makeLevel(levelGroups, currentLevel, totalGroups, players) {
	currentLevel--;
	var len = levelGroups.length;
	var parentKeys = [];
	var parentNumber = 0;
	var p = '';
	for (var i = 0; i < len; i++) {
		if (parentNumber === 0) {
			p = currentLevel + '-' + parentKeys.length;
			parentKeys.push(p);
		}

		if (players !== null) {
			var p1 = players[i*2];
			var p2 = players[(i*2) + 1];
			totalGroups.push({
				key: levelGroups[i], parent: p, player1: p1, player2: p2, parentNumber: parentNumber
			});
		} else {
			totalGroups.push({ key: levelGroups[i], parent: p, parentNumber: parentNumber });
		}

		parentNumber++;
		if (parentNumber > 1) parentNumber = 0;
	}

	// after the first created level there are no player names
	if (currentLevel >= 0) makeLevel(parentKeys, currentLevel, totalGroups, null)
}
// validation function for editing text
function isValidScore(textblock, oldstr, newstr) {
	if (newstr === "") return true;
	var num = parseInt(newstr, 10);
	return !isNaN(num) && num >= 0 && num < 1000;
}