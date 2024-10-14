import React from "react";
import { render } from "react-dom";
import { renderToString } from "react-dom/server";
import Hello from "./Hello";
import jsPDF from "jspdf";
require("jspdf-autotable");
const WorkEffort = () => (
  <div>
    <h3>Mannir Scope of work, deliverables:</h3>
    <p>
      ABCXYZ program is getting executed in XYZ Agile following Scrum
      Methodology focused on developing <br /> the features of POY Connect
      prioritized by ABN Product Owner.
    </p>
    <p>
      The Scope of work will be prioritized by the POE Product Owner on every
      Release/Sprint basis and Infosys <br /> team will take over in planning
      and executing the sprint to meet the needs of the program
    </p>
  </div>
);
const print = () => {
  const pdf = new jsPDF("p", "mm", "a4");
  pdf.setFont("times");
  pdf.setFontType("bold");
  pdf.text(
    105,
    10,
    "MANNIR ESYSTEMS NIGERIA LIMITED",
    null,
    null,
    "center"
  );
  pdf.text(10, 20, "General Information");
  const generalInfocolumns = [
    "SOW Creation Date",
    "SOW Start Date",
    "Project",
    "Last Updated",
    "SOW End Date"
  ];
  var generalInfoRows = [
    [
      "Dec 13, 2017",
      "Jan 1, 2018",
      "ABC Connect - ABCXYZ",
      "Dec 13, 2017",
      "Dec 31, 2018"
    ]
  ];
  pdf.autoTable(generalInfocolumns, generalInfoRows, {
    startY: 25
  });
  pdf.setFont("times");
  pdf.setFontType("normal");
  pdf.text(
    10,
    50,
    "This is a Time and Materials Statement of Work between ABC Mutual Life \n Insurance Company and RJTech with all general terms and conditions as \n described in the current Master Agreement and its related documents."
  );
  const resourceInfoColumns = [
    "S#",
    "Resource Name",
    "Role",
    "Location",
    "Rate",
    "Start Date",
    "End Date",
    "Approx Effort"
  ];
  var resourceInfoRows = [
    [
      "1",
      "Sanath Jayasurya",
      "Columbo",
      "$1000",
      "Dec 13, 2017",
      "Dec 31, 2018",
      "100 hours"
    ],
    [
      "2",
      "Roger Federer",
      "London",
      "$2000",
      "Dec 13, 2017",
      "Dec 31, 2018",
      "200 hours"
    ]
  ];
  pdf.setFont("times");
  pdf.setFontType("bold");
  pdf.text(10, 80, "Resources");
  pdf.autoTable(resourceInfoColumns, resourceInfoRows, {
    startY: 85
  });
  pdf.setFont("times");
  pdf.setFontType("bold");
  pdf.text(10, 120, "Description of Work Effort:");
  const workEffortString = renderToString(<WorkEffort />);
  pdf.fromHTML(workEffortString, 10, 120);
  pdf.save("pdf");
};

const TestPage = () => (
  <div>
    {/* <Hello name="Mannir React PDF" /> */}
    <h2>Start editing to see some magic happen {"\u2728"}</h2>
    <button onClick={print}>print</button>
  </div>
);

render(<TestPage />, document.getElementById("root"));
