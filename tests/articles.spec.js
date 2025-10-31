const request = require("supertest");
const { app } = require("../server");
const jwt = require("jsonwebtoken");
const config = require("../config");
const mockingoose = require("mockingoose");
const mongoose = require("mongoose");
const Article = require("../api/articles/articles.schema");

describe("Tester création, modification et suppression d’un article", () => {
  let token;
  const USER_ID = new mongoose.Types.ObjectId();
  const ARTICLE_ID = new mongoose.Types.ObjectId();

  const MOCK_ARTICLE_CREATED = {
    _id: ARTICLE_ID,
    title: "Nouveau Article",
    content: "Ceci est un nouvel article",
    user: USER_ID,
    status: "draft",
  };

  beforeEach(() => {
    // token JWT avec le role admin
    token = jwt.sign({ userId: USER_ID, role: "admin" }, config.secretJwtToken);

    mockingoose(Article).toReturn(MOCK_ARTICLE_CREATED, "save");
    mockingoose(Article).toReturn(MOCK_ARTICLE_CREATED, "findOneAndUpdate");
    mockingoose(Article).toReturn({ acknowledged: true, deletedCount: 1 }, "deleteOne");
  });

  test("[Articles] Create Article", async () => {
    const res = await request(app)
      .post("/api/articles")
      .send(MOCK_ARTICLE_CREATED)
      .set("x-access-token", token);

    expect(res.status).toBe(201);
    expect(res.body.title).toBe(MOCK_ARTICLE_CREATED.title);
  });

  test("[Articles] Update Article", async () => {
    const res = await request(app)
      .put(`/api/articles/${ARTICLE_ID}`)
      .send({ title: "Article modifié" })
      .set("x-access-token", token);

    expect(res.status).toBe(200);
  });

  test("[Articles] Delete Article", async () => {
    const res = await request(app)
      .delete(`/api/articles/${ARTICLE_ID}`)
      .set("x-access-token", token);

    expect(res.status).toBe(204);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
});
