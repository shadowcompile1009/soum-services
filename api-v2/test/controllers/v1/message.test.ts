import request from "supertest";
import app from "../../../src/app";
import { Message } from "../../../src/models/Message";

const baseURL = "/rest/api/v1";
let messageId: string;

beforeAll(async () => {
  const msg = new Message({
    client_type: 'mobile_web',
    message: [JSON.parse("{\"WELCOME\":{\"en\":\"abc\",\"ar\":\"ABC\"}}")]
  });
  const newMsg = await msg.save();
  messageId = newMsg._id;
})

afterAll(async () => {
  await Message.findByIdAndDelete(messageId).exec();
})

describe("GET /rest/api/v1/message?key=WELCOME", () => {
  test("should return 200 OK", async () => {
    const response = await request(app).get(baseURL + "/message?key=WELCOME")
      .set("client-type", "mobile_web")
      .set("language", "ar");

    expect(response.statusCode).toBe(200);
  });

  test("should return 400 missing required fields", async () => {
    const response = await request(app).get(baseURL + "/message?key=welcome")
      .set("client-type", "mobile_web")
      .set("language", "ar");
    expect(response.statusCode).toBe(400);
  });
});

describe("PUT /rest/api/v1/message", () => {
  test("should return 200 OK", async () => {
    const response = await request(app).put(baseURL + "/message")
      .set("client-type", "mobile_web")
      .set("language", "ar")
      .send({
        "key": "WELCOME",
        "value": "Welcome to SOUM, a new experience for shopping"
      });
    expect(response.statusCode).toBe(200);
  });

  test("should return 400 invalid key", async () => {
    const response = await request(app).post(baseURL + "/message")
      .set("client-type", "mobile_web")
      .set("language", "ar")
      .send({
        "key": "123",
        "value": "Welcome to SOUM, a new experience for shopping"
      });
    expect(response.statusCode).toBe(400);
  });
});

// describe("POST /rest/api/v1/message", () => {
//   it("should return 200 OK", (done) => {
//     request(app).post(baseURL + "/message")
//       .set("client-type", "mobile_web")
//       .field("value", "{\"ANNOTATION\":{\"en\":\"abc\",\"ar\":\"ABC\"}}")
//       .expect(200)
//       .end(function () {
//         done();
//       });
//   });
// });