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
let auto_connect = false;
let documentText = "";

Office.onReady((info) => {
  if (info.host === Office.HostType.Word) {
    document.getElementById("sideload-msg").style.display = "none";
    document.getElementById("app-body").style.display = "block";
    //! document.getElementById("run").onclick = test;
    //! document.getElementById("test").onclick = test;
    document.getElementById("add-node-button").onclick = addNode;
    // document.getElementById("new-tag-input").onchange = updateInputTag;
    // document.getElementById("new-relation-input").onchange = updateInputRelation;
    document.getElementById("new-tag-and-relation-input").onchange = updateInputTagAndRelation;

    //? Recommend request
    document.getElementById("recommend-button").onclick = function () {
      try {
        Word.run(function (context) {
          var body = context.document.body;
          body.load("text");
          return context.sync().then(function () {
            documentText = body.text;
          });
        }).then(function () {
          let data = { nodes: nodes, relations: relations, documentText: documentText };

          fetch("http://127.0.0.1:8000/recommendation", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
            mode: "cors",
          })
            .then((response) => response.json())
            .then((data) => {
              document.getElementById("response-text").innerHTML = data.recommendation; //JSON.stringify(data)
            });
        });
      } catch (error) {
        // console.log(error);
      }
    };

    //?  Connect request
    document.getElementById("connect-button").onclick = function () {
      auto_connect = !auto_connect;

      Word.run(function (context) {
        var body = context.document.body;
        body.load("text");
        return context.sync().then(function () {
          documentText = body.text;
        });
      }).then(function () {
        if (auto_connect) {
          document.getElementById("connect-button").innerHTML = "Disconnect";
          document.getElementById("connect-button").classList.remove("bg-orange-500/70");
          document.getElementById("connect-button").classList.add("bg-blue-500/70");

          setInterval(function () {
            if (auto_connect == false) return;
            try {
              let data = { nodes: nodes, relations: relations, documentText: documentText };

              fetch("http://127.0.0.1:8000/connect", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
                mode: "cors",
              });
            } catch (error) {
              // console.log(error);
            }
          }, 2000);
        } else {
          document.getElementById("connect-button").innerHTML = "Connect";
          document.getElementById("connect-button").classList.remove("bg-blue-500/70");
          document.getElementById("connect-button").classList.add("bg-orange-500/70");
        }
      });
    };

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
      // document.getElementById("output-text").innerHTML = "Action failed. Error: " + asyncResult.error.message;
    } else {
      selection = asyncResult.value.trim();
      // inputTag = document.getElementById("new-tag-input").value;
      // document.getElementById("output-text").innerHTML = "" + selection;
    }
  });

  await Office.context.sync();
}

function updateInputTagAndRelation() {
  inputTag = document.getElementById("new-tag-and-relation-input").value;
  inputRelation = document.getElementById("new-tag-and-relation-input").value;
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
    parentElement.id = element.id;
    parentElement.classList.add(
      "flex",
      "flex-col",
      "h-fit",
      "bg-gray-800",
      "px-1",
      "py-1",
      "rounded-md",
      "text-white",
      "text-xs",
      "cursor-pointer",
      "hover:bg-gray-600",
      "hover:shadow-md",
      "transition-all",
      "duration-300"
    );
    const tagElement = document.createElement("p");
    tagElement.classList.add("font-semibold", "border-b", "border-white", "italic", "text-center");
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
        generateRelations();
        selectedID = 0;
      }

      //? Add Relation Pop-up
      const app_body = document.getElementById("app-body");
      if (selectedID === 0) {
        // console.log("popup should be hidden");
        app_body.removeChild(relationPopUp);
      } else {
        // console.log("popup should be visible");
        relationPopUp = document.createElement("div");
        relationPopUp.classList.add(
          "absolute",
          "w-2/3",
          "z-50",
          "bottom-[40%]",
          // "left-0",
          "left-14",
          // "right-1/2",
          "bg-green-500",
          "p-2",
          "text-base",
          "text-white",
          "rounded-lg"
        );
        relationPopUp.innerHTML = "Select another node to create a relation!";
        app_body.appendChild(relationPopUp);
      }

      // console.log(relations);
    };

    nodeParent.appendChild(parentElement);
  });

  document.getElementById("new-tag-and-relation-input").value = "";
}

function getRandomColor() {
  const colors = [
    "bg-red-600",
    "bg-pink-600",
    "bg-purple-600",
    "bg-indigo-600",
    "bg-blue-600",
    "bg-cyan-600",
    "bg-teal-600",
    "bg-green-600",
    "bg-lime-600",
    "bg-yellow-600",
    "bg-orange-600",
    "bg-amber-600",
    "bg-rose-600",
  ];
  const randomInt = Math.floor(Math.random() * colors.length);
  return colors[randomInt];
}

function generateRelations() {
  const relationsParent = document.getElementById("relations-body");
  relationsParent.innerHTML = "";

  for (let i = 0; i < relations.length; i++) {
    const element = relations[i];
    const parent = nodes.find((node) => node.id === element.a);
    const child = nodes.find((node) => node.id === element.b);

    // const parentElement = document.getElementById("node-" + parent.id);
    // const childElement = document.getElementById("node-" + child.id);

    //? Generate Relation Element
    const relationElement = document.createElement("div");
    relationElement.classList.add("grid", "grid-cols-3", "w-full", "justify-between", "relative");

    const close_button = document.createElement("div");
    close_button.classList.add(
      "w-4",
      "h-4",
      "bg-red-700",
      "rounded-full",
      "text-white",
      "text-xs",
      "text-center",
      "cursor-pointer",
      "absolute",
      "-left-1",
      "-top-1",
      "hover:bg-red-500"
    );
    close_button.innerHTML = "X";
    close_button.onclick = function () {
      relations.splice(i, 1);
      parent.children.splice(parent.children.indexOf(child.id), 1);
      child.parents.splice(child.parents.indexOf(parent.id), 1);
      generateRelations();
    };
    relationElement.appendChild(close_button);

    //? Generate Object 1
    const object1 = document.createElement("div");
    const object1_text = document.createElement("p");
    object1.appendChild(object1_text);
    object1.id = parent.id;
    object1.classList.add("px-1", "py-0.5", getRandomColor(), "rounded-lg", "text-white", "text-xs", "flex");
    object1_text.classList.add("my-auto", "text-center", "w-full");
    object1_text.innerHTML = parent.text;
    // object1.innerHTML = parent.text;
    relationElement.appendChild(object1);

    //? Generate Arrow SVG
    const arrowParent = document.createElement("div");
    arrowParent.classList.add("w-full", "border-b-2", "border-black", "my-auto", "relative");
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("width", "24");
    svg.setAttribute("height", "24");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "2");
    svg.setAttribute("fill", "black");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", "M24 22h-24l12-20z");
    svg.appendChild(path);
    svg.classList.add("absolute", "-right-1", "-top-2.5", "rotate-90");
    arrowParent.appendChild(svg);
    relationElement.appendChild(arrowParent);

    //? Generate Text
    const relationText = document.createElement("p");
    relationText.classList.add("absolute", "-top-5", "left-2", "text-sm");
    relationText.innerHTML = element.relation;
    arrowParent.appendChild(relationText);

    //? Generate Object 2
    const object2 = document.createElement("div");
    const object2_text = document.createElement("p");
    object2.appendChild(object2_text);
    object2.id = child.id;
    object2.classList.add("px-1", "py-0.5", getRandomColor(), "rounded-lg", "text-white", "text-xs", "flex");
    object2_text.classList.add("my-auto", "text-center", "w-full");
    object2_text.innerHTML = child.text;
    // object2.innerHTML = child.text;
    relationElement.appendChild(object2);

    relationElement.id = "relation-" + parent.id + "-" + child.id;

    relationsParent.appendChild(relationElement);
  }
}
