/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

/* global document, Office, Word */

class Node {
  constructor(tag, text, id, parents = [], children = []) {
    this.tag = tag;
    this.text = text;
    this.id = id;
    this.parents = parents;
    this.children = children;
  }
}

class Relation {
  constructor(a, b, relation) {
    this.a = a;
    this.b = b;
    this.relation = relation;
  }
}

let selection = "";
let inputTag = "";
let inputRelation = "";
let nodes = [];
let relations = [];
let selectedID = 0;
let relationPopUp;

Office.onReady((info) => {
  if (info.host === Office.HostType.Word) {
    document.getElementById("sideload-msg").style.display = "none";
    document.getElementById("app-body").style.display = "block";
    //! document.getElementById("run").onclick = test;
    //! document.getElementById("test").onclick = test;
    document.getElementById("add-node-button").onclick = addNode;
    document.getElementById("new-tag-input").onchange = updateInputTag;
    document.getElementById("new-relation-input").onchange = updateInputRelation;

    //? eslint-disable-next-line no-undef
    //? setInterval(test2, 500);

    //? Selection Hook
    Office.context.document.addHandlerAsync("documentSelectionChanged", onSelection, function () {});
  }
});

export async function run() {
  return Word.run(async (context) => {
    /**
     * Insert your Word code here
     */

    // insert a paragraph at the end of the document.
    // const paragraph = context.document.body.insertParagraph("Berat Çimen", Word.InsertLocation.end);
    const paragraph = context.document.body.insertParagraph(inputTag, Word.InsertLocation.end);

    // change the paragraph color to blue.
    paragraph.font.color = "red";

    await context.sync();
  });
}

export async function test() {
  return Word.run(async (context) => {
    /**
     * Insert your Word code here
     */

    // insert a paragraph at the end of the document.

    var currentdate = new Date();
    var datetime =
      "Deneme: " +
      currentdate.getDate() +
      "/" +
      (currentdate.getMonth() + 1) +
      "/" +
      currentdate.getFullYear() +
      " @ " +
      currentdate.getHours() +
      ":" +
      currentdate.getMinutes() +
      ":" +
      currentdate.getSeconds();

    const paragraph = context.document.body.insertParagraph(datetime, Word.InsertLocation.end);

    // change the paragraph color to blue.
    paragraph.font.color = "red";

    await context.sync();
  });
}

async function onSelection() {
  Office.context.document.getSelectedDataAsync(Office.CoercionType.Text, function (asyncResult) {
    if (asyncResult.status == Office.AsyncResultStatus.Failed) {
      document.getElementById("output-text").innerHTML = "Action failed. Error: " + asyncResult.error.message;
    } else {
      selection = asyncResult.value.trim();
      // inputTag = document.getElementById("new-tag-input").value;
      document.getElementById("output-text").innerHTML = "" + selection;
    }
  });

  await Office.context.sync();
}

function updateInputTag() {
  inputTag = document.getElementById("new-tag-input").value;
}

function updateInputRelation() {
  inputRelation = document.getElementById("new-relation-input").value;
}

function addNode() {
  const min = 100000;
  const max = 999999;
  const randomInt = Math.floor(Math.random() * (max - min)) + min;

  nodes.push(new Node(inputTag, selection, randomInt));

  const nodeParent = document.getElementById("nodes");
  nodeParent.innerHTML = "";

  nodes.forEach((element) => {
    // const newInner = element.tag + " " + element.text + "<br>";
    // const classes = "flex flex-col h-fit bg-red-500 px-3 py-2 rounded-md";
    // const newInner = `<div class="${classes}">` + `<p>${element.tag}</p>` + `<p>${element.text}</p>` + "</div>";
    // nodeParent.innerHTML = nodeParent.innerHTML + newInner;

    const parentElement = document.createElement("div");
    parentElement.classList.add(
      "flex",
      "flex-col",
      "h-fit",
      "bg-gray-800",
      "px-1",
      "py-1",
      "rounded-md",
      "text-white",
      "text-sm",
      "cursor-pointer",
      "hover:bg-gray-600",
      "hover:shadow-md",
      "transition-all",
      "duration-300"
    );
    const tagElement = document.createElement("p");
    tagElement.classList.add("font-semibold", "border-b", "border-white", "italic");
    tagElement.innerHTML = element.tag;
    const textElement = document.createElement("p");
    textElement.innerHTML = element.text;
    parentElement.appendChild(tagElement);
    parentElement.appendChild(textElement);

    parentElement.onclick = function () {
      if (selectedID === 0) {
        selectedID = element.id;
      } else {
        //? The part where new relation is created
        element.parents.push(selectedID);
        nodes.find((node) => node.id === selectedID).children.push(element.id);
        relations.push(new Relation(selectedID, element.id, inputRelation));
        selectedID = 0;
      }

      //? Add Relation Pop-up
      if (selectedID === 0) {
        // console.log("popup should be hidden");
        nodeParent.removeChild(relationPopUp);
      } else {
        // console.log("popup should be visible");
        relationPopUp = document.createElement("div");
        relationPopUp.classList.add(
          "absolute",
          "bottom-2",
          "left-8",
          "bg-green-500",
          "p-2",
          "text-base",
          "text-white",
          "rounded-lg"
        );
        relationPopUp.innerHTML = "Select another node to create a relation!";
        nodeParent.appendChild(relationPopUp);
      }

      // console.log(relations);
    };

    nodeParent.appendChild(parentElement);
  });

  // console.log(nodes);
}

// export async function test2() {
//   return Word.run(async (context) => {
//     context.document.getSelectedDataAsync(Office.CoercionType.Text, function (asyncResult) {
//       if (asyncResult.status == Office.AsyncResultStatus.Failed) {
//         document.getElementById("output-text").innerHTML = "Action failed. Error: " + asyncResult.error.message;
//         // write("Action failed. Error: " + asyncResult.error.message);
//       } else {
//         // write("Selected data: " + asyncResult.value);
//         document.getElementById("output-text").innerHTML = "Selected data: " + asyncResult.value;
//       }
//     });

//     await context.sync();
//   });
// }

// async function test2() {
//   Office.context.document.getSelectedDataAsync(Office.CoercionType.Text, function (asyncResult) {
//     if (asyncResult.status == Office.AsyncResultStatus.Failed) {
//       document.getElementById("output-text").innerHTML = "Action failed. Error: " + asyncResult.error.message;
//     } else {
//       document.getElementById("output-text").innerHTML = "Selected text: " + asyncResult.value;
//     }
//   });

//   await Office.context.sync();
// }
