var http = require("http");
global.https = require("https");
const fs = require('fs');
var ZebraSavanna = require("./AllCode.js");
    //ZebraSavanna.setApiKey("I1sUUtRw8aLqzxwW7RwGTkpJxCN06INb");
const yargs = require("yargs");

const helpDocs = 
    "UPCLookup:\n" +
    "\t -i --input : Value to search for \n" +
    "CreateBarcode: \n" +
    "\t -i --input : Value to encode with <symbology> \n" +
    "\t -s --symbology : Symbology type to use for result PNG"
    "\t -r --rotation : "
    ;

/*
 yargs.command("", "Use one of the following commands to access ZebraSavanna APIs")
    .usage("$0 CreateBardcode\n" +
        "$0 UPCLookup\n" +
        "$0 DrugLookup\n" +
        "$0 DrugUPC \n" +
        "$0 FoodUPC \n" +
        "$0 DeviceLookup \n"
    )
    //.help()
    .argv
*/

yargs.command("UPCLookup", "Find product details from UPC", {
    value: {
        demandOption: true,
        type: "string",
        describe: "UPC to lookup",
        alias: "i"
    },
    api: {
        demandOption: true,
        type: "string",
        describe: "API key to authenticate with Zebra Savanna servers",
        alias: "a"
    }
}, (argv) => {
    CallUPCLookup(argv.value, argv.api);
})
//.usage(helpDocs)
//.help()
.argv

yargs.command("CreateBarcode", "Returns a PNG of <input> of the requested <symbology>", {
    api: {
        demandOption: true,
        type: "string",
        describe: "API key to authenticate with Zebra Savanna servers",
        alias: "a"
    },
    symbology: {
        demandOption: true,
        type: "string",
        describe: "The type of barcode you would like returned",
        alias: "s"
    },
    input: {
        demandOption: true,
        type: "string",
        describe: "The value to be encoded",
        alias: "i",
    },
    rotation: {
        demandOption: false,
        type: "string",
        describe: "Rotation of the barcode: N = Normal, R = Clockwise, I = Inverted, L = Counter-Clockwise",
        default: "N",
        alias: "r"
    },
    size: {
        demandOption: false,
        type: "number",
        describe: "Sets the scale of returned barcode",
        default: "1",
        alias: "sz"
    },
    text: {
        demandOption: false,
        type: "bool",
        describe: "Toggle <input> from showing",
        default: true,
        alias: "t"
    }
}, (argv) => {
    CallCreateBarcode(argv.input, argv.symbology, argv.api);
})
//.help()
.argv


yargs.command("DrugUPC", "See if a drug is recalled by UPC", {
    api: {
        demandOption: true,
        type: "string",
        describe: "API key to authenticate with Zebra Savanna servers",
        alias: "a"
    },
    input: {
        demandOption: true,
        type: "string",
        describe: "Check if the FDA has recalled a drug by UPC",
        alias: "i"
    },
    count: {
        demandOption: false,
        type: "number",
        describe: "How many results to return starting with the most recent",
        alias: "c",
        default: 1
    }
}, (argv) =>{
    CallDrugUpc(argv.input, argv.count, argv.api)
})
//.help()
.argv

yargs.command("DrugSearch", "Search recalls of drugs matching <search>", {
    api: {
        demandOption: true,
        type: "string",
        describe: "API key to authenticate with Zebra Savanna servers",
        alias: "a"
    },
    search:{
        demandOption: true,
        type:"string",
        describe: "String to search for",
        alias: ["s","i"]
    },
    count: {
        demandOption: false,
        type: "number",
        describe: "How many results to return starting with the most recent",
        alias: "c",
        default: 1
    }
}, (argv) =>{
    CallDrugSearch(argv.search, argv.count, argv.api)
})
//.help()
.argv

yargs.command("FoodUPC", "Check for FDA recalls of food matching <search>", {
    api: {
        demandOption: true,
        type: "string",
        describe: "API key to authenticate with Zebra Savanna servers",
        alias: "a"
    },
    search: {
        demandOption: true,
        type: "string",
        describe: "String to search for",
        alias: ["s", "i"],
    },
    count: {
        demandOption: false,
        type: "number",
        describe: "How many results to return starting with the most recent",
        alias: "c",
        default: 1
    }
}, (argv) => {
    CallFoodUpc(argv.search, argv.count, argv.api);
})
//.help()
.argv

yargs.command("DeviceSearch", "Find FDA Recalls for devices matching <search>", {
    api: {
        demandOption: true,
        type: "string",
        describe: "API key to authenticate with Zebra Savanna servers",
        alias: "a"
    },
    search: {
        demandOption: true,
        type: "string",
        describe: "String to search for",
        alias: ["s", "i"],
    },
    count: {
        demandOption: false,
        type: "number",
        describe: "How many results to return starting with the most recent",
        alias: "c",
        default: 1
    }
}, (argv) => {
    CallDeviceSearch(argv.search, argv.count, argv.api);
})
.help()
.argv

/*
connect().use(serveStatic(__dirname)).listen(8080, function(){
    console.log("Server running on 8080");
    //ZebraSavanna.setApiKey("I1sUUtRw8aLqzxwW7RwGTkpJxCN06INb");

    //Create Barcode
    //CallCreateBarcode();

    //UPC Lookup
    //CallUPCLookup();    

    //FDA Stuff
    var drugUpc = "1650004019";
    //CallDrugUpc("1650004019");
    //CallDrugUpc("826766417759");
    //CallDrugUpc("016500041085");
    //CallDrugSearch("Alka");
    //CallFoodUpc("2676641776");
    //CallFoodUpc("826766417759");
    //CallDeviceSearch();
        
});
*/

function showHelpInfo(){
    console.log("Fill this out with help info");
}


function CallCreateBarcode(upc, symbology, apiKey){

        ZebraSavanna.BarcodeCreate(symbology, upc, 1, "N", true, apiKey)
            .then(data => {
                console.log("Create Barcode writing to disk");
                var newData = data;
                    //.toString().replace("/^data:image\/\w+;base64", '');
                fs.writeFile(upc+".png", newData, "binary", (err) => { if(err){ console.log("Error: " + err); throw err; } } )
            })
            .catch(error => {
                console.log("Create Barcode failed");
                console.log(error);
            });
}

function CallUPCLookup(upcValue, apiKey){

        ZebraSavanna.UpcLookup(upcValue, apiKey)//"047701002292")
        .then(data => { 
                //console.log("Returned Data: " + data);
                var myNewData = JSON.parse(data);
                console.log(myNewData);
        })
        .catch(error => {
            console.log("UPC Lookup Failed");
            console.log(error);
        });
}

function CallDeviceSearch(search, count, apiKey){

        ZebraSavanna.DeviceSearch(search, count)
            .then(data => {
                console.log("Device Search Info");
                //console.log("Returned Data: " + data);
                var myNewData = JSON.parse(data);
                console.log(myNewData);
            })
            .catch(error => {
                console.log("Device Search Failed");
                console.log(error);
            });

}

function CallFoodUpc(upc, count, apiKey){

        ZebraSavanna.FoodUpc(upc, count, apiKey)
            .then(data =>{
                console.log("Food UPC Info");
                //console.log("Returned Data: " + data);
                var myNewData = JSON.parse(data);
                console.log(myNewData);
            })
            .catch(error => {
                console.log("Food UPC Failed");
                console.log(error);
            });
        
}

function CallDrugSearch(drugUPC, count, apiKey){

        ZebraSavanna.DrugSearch(drugUPC, count, apiKey)
            .then(data =>{
                console.log("Drug Search");
                //console.log("Returned Data: " + data);
                var myNewData = JSON.parse(data);
                console.log(myNewData);
            })
            .catch(error => {
                console.log("Drug Search Failed");
                console.log(error);
            });

}

function CallDrugUpc(drugUPC, count, apiKey){

        ZebraSavanna.DrugUpc(drugUPC, count, apiKey)
            .then(data =>{
                console.log("Drug UPC Info")
                //console.log("Returned Data: " + data);
                var myNewData = JSON.parse(data);
                console.log(myNewData);
            })
            .catch(error => {
                console.log("Drug UPC Failed");
                console.log(error);
            });
           
}
