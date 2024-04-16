import * as crypto from "crypto";

function getAlgorithm(keyBase64: any) {
  var key = Buffer.from(keyBase64, "base64");
  switch (key.length) {
    case 16:
      return "aes-128-cbc";
    case 32:
      return "aes-256-cbc";
  }
  throw new Error("Invalid key length: " + key.length);
}

const encrypt = (plainText: string, keyBase64: any, ivBase64: any) => {
  const key = Buffer.from(keyBase64, "base64");
  const iv = Buffer.from(ivBase64, "base64");

  const cipher = crypto.createCipheriv(getAlgorithm(keyBase64), key, iv);
  let encrypted = cipher.update(plainText, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
};

export { encrypt };

const decrypt = (messagebase64: any, keyBase64: any, ivBase64: any) => {
  const key = Buffer.from(keyBase64, "base64");
  const iv = Buffer.from(ivBase64, "base64");

  const decipher = crypto.createDecipheriv(getAlgorithm(keyBase64), key, iv);
  let decrypted = decipher.update(messagebase64, "hex");

  // decrypted += decipher.final();
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted;
};

export { decrypt };
