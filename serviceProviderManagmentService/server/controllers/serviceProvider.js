import ServiceProvider from '../models/serviceProvider';

function load(req, res, next, id) {
  ServiceProvider.findById(id)
    .exec()
    .then((serviceProvider) => {
      req.dbServiceProvider = serviceProvider;
      return next();
    }, (e) => next(e));
}

function get(req, res) {
  return res.json(req.dbUser);
}

function create(req, res, next) {
  ServiceProvider.create({
      username: req.body.username,
      password: req.body.password
    })
    .then((savedServiceProvider) => {
      return res.json(savedServiceProvider);
    }, (e) => next(e));
}

function update(req, res, next) {
  const serviceProvider = req.dbServiceProvider;
  Object.assign(serviceProvider, req.body);

  serviceProvider.save()
    .then((savedServiceProvider) => res.sendStatus(204),
      (e) => next(e));
}

function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  ServiceProvider.find()
    .skip(skip)
    .limit(limit)
    .exec()
    .then((ServiceProviders) => res.json(ServiceProviders),
      (e) => next(e));
}

function remove(req, res, next) {
  const serviceProvider = req.dbServiceProvider;
  serviceProvider.remove()
    .then(() => res.sendStatus(204),
      (e) => next(e));
}

export default { load, get, create, update, list, remove };