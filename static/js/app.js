//create a constant variable for the url
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

//collect the JSON data and console log it
d3.json(url).then(function(data) {
    console.log(data);
});

//initalize the dashboard
function init() {

    //use D3 to select dropdown menu
    let dropdownMenu = d3.select("#selDataset");

    //use D3 to gather sample names and populate dropdown selector
    d3.json(url).then((data) => {

        //set variable for sample names
        let sampleNames = data.names;

        //add samples to dropdown menu
        sampleNames.forEach((id) => {

            //log the id for each loop
            console.log(id);

            dropdownMenu.append("option")
            .text(id)
            .property("value",id);
        });

        //set the first sample from the list
        let sampleOne = sampleNames[0];

        //log sampleOne value
        console.log(sampleOne);

        //create initial plots
        buildMetadata(sampleOne);
        buildBarChart(sampleOne);
        buildBubbleChart(sampleOne);
    });
};

//create function to populate metadata info
function buildMetadata(sample) {

    //use D3 to gather data
    d3.json(url).then((data) => {

        //gather metadata
        let metadata = data.metadata;

        //filter results based on sample value
        let value = metadata.filter(result => result.id == sample);

        //log the array of metadata object after filtering
        console.log(value);

        //gather first index from array
        let valueData = value[0];

        //clear metadata
        d3.select("#sample-metadata").html("");

        //add each key/value pair to panel using Object.entries
        Object.entries(valueData).forEach(([key,value]) => {

            //log the individual key/value pairs as they are appended to metadata panel
            console.log(key,value);

            d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
        });
    });
};

//create function for bar chart
function buildBarChart(sample) {

    //use D3 to retrieve data
    d3.json(url).then((data) => {

        //gather data
        let sampleData = data.samples;

        //filter based on value of sample
        let value = sampleData.filter(result => result.id == sample);

        //retrieve first index from array
        let valueData = value[0];

        //gather otu_ids, labels, and sample values
        let otu_ids = valueData.otu_ids;
        let otu_labels = valueData.otu_labels;
        let sample_values = valueData.sample_values;

        //log the data to console
        console.log(otu_ids, otu_labels, sample_values);

        //select top 10 items to display in descending order
        let yticks = otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse();
        let xticks = sample_values.slice(0,10).reverse();
        let labels = otu_labels.slice(0,10).reverse();

        //setup trace for bar chart
        let trace = {
            x: xticks,
            y: yticks,
            text: labels,
            type: "bar",
            orientation: "h"
        };

        //setup layout
        let layout = {
            title: "Top 10 OTUs Present"
        };

        //use Plotly to plot bar chart
        Plotly.newPlot("bar", [trace], layout)
    });
};

//create function for bubble chart
function buildBubbleChart(sample) {

    //use D3 to retrieve data
    d3.json(url).then((data) => {

        //gather data
        let sampleData = data.samples;

        //filter based on value of sample
        let value = sampleData.filter(result => result.id == sample);

        //retrieve first index from array
        let valueData = value[0];

        //gather otu_ids, labels, and sample values
        let otu_ids = valueData.otu_ids;
        let otu_labels = valueData.otu_labels;
        let sample_values = valueData.sample_values;

        //log the data to console
        console.log(otu_ids, otu_labels, sample_values);

        //setup trace for bubble chart
        let trace1 = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
            }
        };

        //setup layout
        let layout = {
            title: "Bacteria Per Sample",
            hovermode: "closest",
            xaxis: {title: "OTU ID"},
        };

        //use Ploty to plot bubble chart
        Plotly.newPlot("bubble", [trace1], layout)
    });
};

//create function to update dashboard when sample is changed
function optionChanged(value) {

    //console log new value
    console.log(value);

    //call all functions
    buildMetadata(value);
    buildBarChart(value);
    buildBubbleChart(value);
};

//call all functions
init();