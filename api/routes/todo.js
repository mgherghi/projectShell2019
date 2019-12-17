import { Router } from 'express';
import { getRepository, getManager } from 'typeorm';
import isAuthenticated from '../middleware/isAuthenticated';
import ToDo from '../entities/todo';
import Category from '../entities/category';

const router = Router();
router.route('/todos')
  .all(isAuthenticated)
  .get((req, res) => {
    getRepository(ToDo).find({ where: { user: req.user.id }, relations: ['category'] }).then((todos) => {
      res.send(todos);
    });
  })
  .post((req, res) => {
    const { done, title, category } = req.body;
    getRepository(Category).findOneOrFail(
      { where: { user: req.user.id, id: category } },
    ).then((_foundCategory) => {
      const manager = getManager();
      const todo = manager.create(ToDo, { done, title });
      todo.category = _foundCategory;
      todo.user = req.user;
      manager.save(todo).then((savedTodo) => {
        res.send(savedTodo);
      });
    }, () => {
      res.send(404);
    });
  });
router.route('/todos/:id')
  .all(isAuthenticated)
  .all((req, res, next) => {
    getRepository(ToDo).findOneOrFail(
      { where: { user: req.user.id, id: req.params.id }, relations: ['category'] },
    ).then((_foundTodo) => {
      req.todo = _foundTodo;
      next();
    }, () => {
      res.send(404);
    });
  })
  .put((req, res) => {
    const foundTodo = req.todo;
    const { title, done, category } = req.body;
    foundTodo.title = title;
    foundTodo.done = done;
    getRepository(Category).findOneOrFail(
      { where: { user: req.user.id, id: category.id } },
    ).then((_foundCategory) => {
      foundTodo.category = _foundCategory;
    }, () => {
      res.send(404);
    });

    getManager().save(foundTodo).then((updatedTodo) => {
      res.send(updatedTodo);
    });
  })
  .get((req, res) => {
    res.send(req.todo);
  })
  .delete((req, res) => {
    getManager().delete(ToDo, req.todo.id).then(() => {
      res.send(200);
    });
  });

export default router;
