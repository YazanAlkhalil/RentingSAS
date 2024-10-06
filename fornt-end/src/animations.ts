import {
  trigger,
  transition,
  style,
  animate,
  sequence,
} from "@angular/animations";

export let fadeIn = [
  trigger("fadeIn", [
    transition(":enter", [
      style({ opacity: 0 }),
      animate(1500, style({ opacity: 1 })),
    ]),
  ]),
];

export const sidebaranimation = trigger("sidebaranimation", [
  transition(":enter", [
    style({
      height: "*",
      transform: "translateX(-100%)",
      "box-shadow": "none",
    }),
    sequence([
      animate(
        "0.3s ease",
        style({
          height: "*",
          transform: "translateX(0)",
        })
      ),
      animate("0.3s ease"),
    ]),
  ]),
  transition(":leave", [
    animate(
      "0.3s ease",
      style({
        height: "*",
        transform: "translateX(-100%)",
      })
    ),
  ]),
]);
