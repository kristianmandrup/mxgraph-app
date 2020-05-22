import { Base } from "./Base";
import { Stepper } from "./Stepper";

export class UnitInput extends Base {
  createStepper(
    input,
    update,
    step,
    height,
    disableFocus?,
    defaultValue?,
    isFloat?,
  ) {
    return this.newStepper().create(
      input,
      update,
      step,
      height,
      disableFocus,
      defaultValue,
      isFloat,
    );
  }

  protected newStepper() {
    const { editorUi, format, container } = this;
    return new Stepper(format, editorUi, container);
  }

  /**
   *
   */
  add(
    container,
    _unit,
    right,
    width,
    update,
    step?,
    marginTop?,
    disableFocus?,
    isFloat?,
  ) {
    marginTop = marginTop != null ? marginTop : 0;

    var input = document.createElement("input");
    input.style.position = "absolute";
    input.style.textAlign = "right";
    input.style.marginTop = "-2px";
    input.style.right = right + 12 + "px";
    input.style.width = width + "px";
    container.appendChild(input);

    var stepper = this.createStepper(
      input,
      update,
      step,
      null,
      disableFocus,
      null,
      isFloat,
    );
    stepper.style.marginTop = marginTop - 2 + "px";
    stepper.style.right = right + "px";
    container.appendChild(stepper);

    return input;
  }
}
