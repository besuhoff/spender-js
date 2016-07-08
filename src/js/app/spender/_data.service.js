function DataService(Restangular, entityPluralKey) {
  var _entities = [],
    _entitiesPromise = false,
    _listChangedAt = new Date();

  this.loadAll = function(reload) {
    var service = this;

    if (!_entitiesPromise || reload) {
      _entitiesPromise = Restangular.all(entityPluralKey).getList().then(function(entities) {
        _entities = entities;
        service.recordListChange();
        return _entities;
      });
    }

    return _entitiesPromise;
  };

  this.getAll = function() {
    return _entities;
  };

  this.getListChangedAt = function() {
    return _listChangedAt;
  };

  this.recordListChange = function() {
    _listChangedAt = new Date();
  };

  this.resetAll = function() {
    _entities = [];
    _entitiesPromise = false;
  };

  this.add = function (data) {
    var service = this;

    return Restangular.all(entityPluralKey).post(data).then(function(entity) {
      _entities.push(entity);
      service.recordListChange();

      return entity;
    });
  };

  this.update = function (entity) {
    var service = this;

    return entity.patch(entity).then(function() {
      service.recordListChange();

      return entity;
    });
  };

  this.delete = function (entity) {
    var service = this;

    return entity.remove().then(function() {
      _entities.splice(_entities.indexOf(entity), 1);
      service.recordListChange();

      return entity;
    });
  };
}