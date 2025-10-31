const NotFoundError = require("../../errors/not-found");
const UnauthorizedError = require("../../errors/unauthorized");
const jwt = require("jsonwebtoken");
const config = require("../../config");
const articleService = require("./articles.service");

class ArticleController {
  async getAll(req, res, next) {
    try {
      const articles = await articleService.getAll();
      res.json(articles);
    } catch (err) {
      next(err);
    }
  }
  async getById(req, res, next) {
    try {
      const id = req.params.id;
      const articles = await articleService.get(id);
      if (!articles) {
        throw new NotFoundError();
      }
      res.json(articles);
    } catch (err) {
      next(err);
    }
  }

  async create(req, res, next) {
    try {

      const data = {
            ...req.body,
            user: req.user._id, 
        };
      const article = await articleService.create(data);
      req.io.emit("article:create", article);
      res.status(201).json(article);
    } catch (err) {
      console.log(err);
      
      next(err);
    }
  }
  async update(req, res, next) {
  try {
    if (req.user.role !== "admin") {
      throw new UnauthorizedError("Accès refusé : administrateur requis");
    }

    const id = req.params.id;
    const data = req.body;
    const articleModified = await articleService.update(id, data);

    if (!articleModified) {
      throw new NotFoundError("Article introuvable");
    }

    req.io.emit("article:update", articleModified);
    res.json(articleModified);
  } catch (err) {
    console.log(err);
    
    next(err);
  }
}

async delete(req, res, next) {
  try {
    if (req.user.role !== "admin") {
      throw new UnauthorizedError("Accès refusé : administrateur requis");
    }

    const id = req.params.id;
    const result = await articleService.delete(id);



    req.io.emit("article:delete", { id });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
  
}

module.exports = new ArticleController();
