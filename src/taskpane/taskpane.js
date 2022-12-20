/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

/* global document, Office, Word */

Office.onReady((info) => {
  if (info.host === Office.HostType.Word) {
    document.getElementById("sideload-msg").style.display = "none";
    document.getElementById("app-body").style.display = "block";
    //! document.getElementById("run").onclick = test;
    //! document.getElementById("test").onclick = test;

    //? eslint-disable-next-line no-undef
    //? setInterval(test2, 500);

    //? Selection Hook
    Office.context.document.addHandlerAsync("documentSelectionChanged", test3, function (result) {});
  }
});

export async function run() {
  return Word.run(async (context) => {
    /**
     * Insert your Word code here
     */

    // insert a paragraph at the end of the document.
    const paragraph = context.document.body.insertParagraph("Berat Çimen", Word.InsertLocation.end);

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

async function test3() {
  Office.context.document.getSelectedDataAsync(Office.CoercionType.Text, function (asyncResult) {
    if (asyncResult.status == Office.AsyncResultStatus.Failed) {
      document.getElementById("output-text").innerHTML = "Action failed. Error: " + asyncResult.error.message;
    } else {
      document.getElementById("output-text").innerHTML = "Selected text: " + asyncResult.value;
    }
  });

  await Office.context.sync();
}
