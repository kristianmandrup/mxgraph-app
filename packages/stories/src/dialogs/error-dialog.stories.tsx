import { storiesOf } from "@storybook/react";
import * as React from "react";
import { ErrorDialog } from "@mxgraph-app/dialogs";
import { editorUi } from "./mocks";

const title = "x";
const message = "x";
const buttonText = "x";

storiesOf("@mxgraph-app/dialogs/1. Error Dialog", module).add(
  "error dialog",
  () => {
    const errorDialog = new ErrorDialog(editorUi, title, message, buttonText);
    return <div>Nothing here</div>;
  }
);
