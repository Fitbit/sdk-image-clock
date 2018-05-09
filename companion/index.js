import { outbox } from "file-transfer";
import { Image } from "image";
import * as messaging from "messaging";
import { device } from "peer";
import { settingsStorage } from "settings";

messaging.peerSocket.onmessage = function(evt) {
  if (evt.data.command === "newBackground") {
    getImage();
  }
};

function getImage() {
  fetch(
    `https://source.unsplash.com/random/${device.screen.width}x${device.screen.height}`,
    {
      redirect: "follow"
    }
  )
    .then(response => response.arrayBuffer())
    .then(buffer => Image.from(buffer, "image/jpeg"))
    .then(image =>
      image.export("image/jpeg", {
        background: "#FFFFFF",
        quality: 40
      })
    )
    .then(buffer => outbox.enqueue(`${Date.now()}.jpg`, buffer))
    .then(fileTransfer => {
      console.log(`Enqueued ${fileTransfer.name}`);
    });
}
