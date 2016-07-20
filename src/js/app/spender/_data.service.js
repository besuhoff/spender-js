function DataService(Restangular, entityPluralKey) {
  var _entities = [],
    that = this,
    _entitiesPromise = false,
    _listChangedAt = new Date();

  this.afterLoad = function(entity) {
    return entity;
  };

  this.afterAdd = function(entity) {
    return entity;
  };

  this.getUpdateData = function(entity) {
    return angular.copy(entity);
  };

  this.loadAll = function(reload) {
    if (!_entitiesPromise || reload) {
      _entitiesPromise = Restangular.all(entityPluralKey).getList().then(function(entities) {
        _entities = entities.map(function(entity) {
          return that.afterLoad(entity);
        });

        return _entities;
      });
    }

    return _entitiesPromise;
  };

  this.getAll = function() {
    return _entities;
  };

  this.getOne = function(id) {
    return _entities.filter(function(entity) { return entity.id === id; })[0];
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
    return Restangular.all(entityPluralKey).post(data).then(function(entity) {
      _entities.push(entity);
      that.recordListChange();

      return that.afterAdd(that.afterLoad(entity));
    });
  };

  this.update = function (entity) {
    return Restangular.one(entityPluralKey, entity.id).patch(this.getUpdateData(entity)).then(function() {
      that.recordListChange();

      return entity;
    });
  };

  this.delete = function (entity) {
    return Restangular.one(entityPluralKey, entity.id).remove().then(function() {
      _entities.splice(_entities.indexOf(entity), 1);
      that.recordListChange();

      return entity;
    });
  };
}