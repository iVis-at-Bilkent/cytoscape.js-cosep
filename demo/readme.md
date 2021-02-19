## Demo Files
This folder contains everything regarding the demo and testing scripts
* forTestingCose: This is for using Phase II of CoSEP to CoSE algorithm in order to get performance metrics. Note that CoSE is not aware of ports!
* samples: This contains the json files of sample graphs and their constraints.
* legend: This is for legend JPG's.

In addition, *testFiles* folder in [this](https://github.com/iVis-at-Bilkent/cytoscape.js-cosep/tree/testFiles) branch should also be copied here.

## Testing Script
The script is actually at the end of demoControl.js file and commented out. In order to get the performance metrics right, I had to integrate it to the demo. It takes the specified graphs (found in the script) from the testFiles folder one by one and runs CoSE and CoSEP. The results are stored in 2D arrays as the testing is performed. The downloading code (.csv files) has to be copy pasted into the browser console for it to work.  


To get it running: 
* Uncomment the code.
* Add a button with element id 'testing'.
* Using the 'Adding Random Constraints to Graph' function, specify what percentage of port constraints you want and close the window. The port constraints will be added to each testing graph using these values.
* Push the testing button.
* Download the results as .csv files using the code mentioned above.
