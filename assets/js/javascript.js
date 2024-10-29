

	var barChartId = document.getElementById("barChart");
if(barChartId){
var ctxB = document.getElementById("barChart").getContext('2d');
var myBarChart = new Chart(ctxB, {
type: 'bar',
data: {
labels: ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"],
datasets: [{
label: '# of Votes',
data: [12, 19, 3, 5, 20, 3, 5, 12, 19, 3, 5, 2],
backgroundColor: [
'rgba(255, 99, 132, 0.2)',
'rgba(54, 162, 235, 0.2)',
'rgba(255, 206, 86, 0.2)',
'rgba(75, 192, 192, 0.2)',
'rgba(153, 102, 255, 0.2)',
'rgba(255, 159, 64, 0.2)',
'rgba(245, 86, 82, 0.2)',
'rgba(255, 99, 132, 0.2)',
'rgba(54, 162, 235, 0.2)',
'rgba(255, 206, 86, 0.2)',
'rgba(75, 192, 192, 0.2)',
'rgba(153, 102, 255, 0.2)'
],
borderColor: [
'rgba(255,99,132,1)',
'rgba(54, 162, 235, 1)',
'rgba(255, 206, 86, 1)',
'rgba(75, 192, 192, 1)',
'rgba(153, 102, 255, 1)',
'rgba(255, 159, 64, 1)',
'rgba(245, 86, 82, 1)',
'rgba(255,99,132,1)',
'rgba(54, 162, 235, 1)',
'rgba(255, 206, 86, 1)',
'rgba(75, 192, 192, 1)',
'rgba(153, 102, 255, 1)',
'rgba(255, 159, 64, 1)'
],
borderWidth: 1
}]
},
options: {
scales: {
yAxes: [{
ticks: {
beginAtZero: true
}
}]
}
}
});
}


// var pieChartId = document.getElementById("pieChart");

// if(pieChartId){
// 	var ctxP = document.getElementById("pieChart").getContext('2d');
	
//     var myPieChart = new Chart(ctxP, {
//       type: 'pie',
//       data: {
//         labels: ["Rural Mapping", "Urban Mapping"],
//         datasets: [{
//           data: [300, 50],
//           backgroundColor: ["#228fd4", "#eb5437"],
//           hoverBackgroundColor: ["#5ab3ec", "#ce2a0b"]
//         }]
//       },
//       options: {
//         responsive: true
//       }
//     });
// }
	