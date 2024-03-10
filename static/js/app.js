// Variable to store the loaded data
var jsonData;

// Fetch JSON data
d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then(function(data) {
  jsonData = data;
  console.log(data);

  // Populate dropdown menu with sample IDs
  var dropdown = d3.select("#selDataset");
  data.names.forEach(function(name) {
    dropdown.append("option").text(name).property("value", name);
  });

  // Display the bar chart and metadata for the first sample on page load
  var firstSample = data.names[0];
  updateCharts(firstSample);

  // Event listener for dropdown selection change
  dropdown.on("change", function() {
    var selectedSample = d3.select(this).property("value");
    updateCharts(selectedSample);
  });
}).catch(function(error) {
  console.log("Error loading data:", error);
});

// Function to create the bar chart
function createBarChart(sampleId) {
  var sample = jsonData.samples.find(sample => sample.id === sampleId);
  var otuIds = sample.otu_ids.slice(0, 10).reverse();
  var sampleValues = sample.sample_values.slice(0, 10).reverse();
  var otuLabels = sample.otu_labels.slice(0, 10).reverse();

  var trace = {
    x: sampleValues,
    y: otuIds.map(otuId => `OTU ${otuId}`),
    text: otuLabels,
    type: "bar",
    orientation: "h"
  };

  var layout = {
    title: `Top 10 OTUs for Sample ${sampleId}`,
    xaxis: { title: "Sample Values" },
    yaxis: { title: "OTU IDs" }
  };

  Plotly.newPlot("bar", [trace], layout);
}

// Function to display the sample metadata
function displayMetadata(sampleId) {
  var metadata = jsonData.metadata;
  var resultArray = metadata.filter(sampleObj => sampleObj.id == sampleId);
  var result = resultArray[0];

  var panel = d3.select("#sample-metadata");
  panel.html("");

  // Display each key-value pair
  Object.entries(result).forEach(([key, value]) => {
    panel.append("div").text(`${key}: ${value}`);
  });
}

// Function to update the charts and metadata
function updateCharts(sampleId) {
  createBarChart(sampleId);
  displayMetadata(sampleId);
}