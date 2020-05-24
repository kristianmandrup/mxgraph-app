import { Palettes } from "./palette";
import mx from "@mxgraph-app/mx";
const { mxResources } = mx;

const items = [
  "Earth_globe",
  "Empty_Folder",
  "Full_Folder",
  "Gear",
  "Lock",
  "Software",
  "Virus",
  "Email",
  "Database",
  "Router_Icon",
  "iPad",
  "iMac",
  "Laptop",
  "MacBook",
  "Monitor_Tower",
  "Printer",
  "Server_Tower",
  "Workstation",
  "Firewall_02",
  "Wireless_Router_N",
  "Credit_Card",
  "Piggy_Bank",
  "Graph",
  "Safe",
  "Shopping_Cart",
  "Suit1",
  "Suit2",
  "Suit3",
  "Pilot1",
  "Worker1",
  "Soldier1",
  "Doctor1",
  "Tech1",
  "Security1",
  "Telesales1",
];

export class ImagePaletteAdder {
  palettes: Palettes;
  dir: string = "/";
  items = items;

  constructor(palettes: Palettes, opts: any = {}) {
    this.palettes = palettes;
    this.dir = opts.dir;
  }

  add() {
    const { dir, palettes, items } = this;
    const id = "clipart";
    const title = mxResources.get("clipart");
    const prefix = dir + "/clipart/";
    const postfix = "_128x128.png";
    const titles = null;
    const tags = {
      Wireless_Router_N: "wireless router switch wap wifi access point wlan",
      Router_Icon: "router switch",
    };

    palettes.addImagePalette(id, title, prefix, postfix, items, titles, tags);
  }
}
