var passport = require('passport');
var _ = require('underscore');
var User = require('../models/User');
var Contractor = require('../models/Contractor');
var edge = require('edge');



/*
* Currently doing significant work on this file. Attempting to utilize edge plugin to dynamically create excel sheets
* using a template sheet.
*
* Eventually I would like to create a native Node.js plugin to do this without relying on edge.
*
*/


var dotNetFunction = edge.func(function (){/*
	//#r "E:\Microsoft Visual Studio 12.0\Visual Studio Tools for Office\PIA\Office15\Microsoft.Office.Interop.Excel.dll"

	using System;
	using System.Collections.Generic;
	using System.Linq;
	using System.Text;
	using System.Threading.Tasks;
	using System.IO;
	using Excel = Microsoft.Office.Interop.Excel;

	 public class Startup
    {
        public async Task<object> Invoke(object input)
        {
            Excel.Application oApp;
            Excel.Worksheet oSheet;
            Excel.Workbook oBook;
            IDictionary<string, object> payload = (IDictionary<string, object>)input;
            IDictionary<string, object> address = (IDictionary<string, object>)payload["address"];
            IDictionary<string, object> waLic = (IDictionary<string, object>)payload["waLic"];
            IDictionary<string, object> safetyOff = (IDictionary<string, object>)payload["safetyOff"];

            string fileOpen = "E:\\Downloads\\ExcelBackup\\Form.xlsx";
            string fileSave = "E:\\Downloads\\ExcelBackup\\test.xlsx";
            oApp = new Excel.Application();
            oBook = oApp.Workbooks.Open("E:\\Downloads\\ExcelBackup\\Form.xlsx");
            oSheet = (Excel.Worksheet)oBook.Worksheets.get_Item(2);
            string aString = (string)payload["companyName"]; // Company Name
            oSheet.Cells[5, 2] = aString;
            oSheet.Cells[5, 9] = (string)payload["naicsVal"]; // NAICS
            oSheet.Cells[6, 2] = (string)address["street"]; // address
            oSheet.Cells[8, 3] = (string)waLic["licNum"]; // WA contractor License
            oSheet.Cells[8, 9] = (string)waLic["licLim"]; // License Limit
            oSheet.Cells[9, 3] = (string)safetyOff["name"]; // Safety Officer Name
            //oSheet.Cells[9, 9] = (string)safetyOff["telNum"]; // Telephone
            oSheet.Cells[10, 3] = (string)safetyOff["email"]; // Safety Officer Email
            //oSheet.Cells[11, 5] = (string)payload["companyName"]; // Number of Full Time Employees
            //oSheet.Cells[11, 10] = (string)payload["companyName"]; // Number of Part Time Employees
            oBook.SaveCopyAs(fileSave);
            oBook.Close(false);
            oApp.Quit();
            return null;
        }

    }

*/});



exports.getDisplay = function(req, res){
	var displaytype = req.params.displayType;
	Contractor.find({}).lean().exec(function (err, docs){
		//console.log(docs);
		res.render('display', {list : JSON.stringify(docs, null, 5), data: docs});
	});
  	//res.render('display', { title: 'Express' });
};

exports.getDisplay2 = function(req, res){
	var displaytype = req.params.displayType;
	Contractor.find({}).lean().exec(function (err, docs){
		console.log(err);
		var data = docs;
		console.log(data);
		dotNetFunction(docs[0], function(error, result){
			if (error) throw error;
			console.log(err);
			//console.log(result);
			//console.log(docs);
			var file = "E:\\Downloads\\ExcelBackup\\test.xlsx";
			res.download(file);
			//res.render('display', {list : JSON.stringify(docs, null, 5), data: docs});
		});
		
	});
}