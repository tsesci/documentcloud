// Project Model

dc.model.Project = dc.Model.extend({

  resource : 'projects',

  viewClass : 'Project',

  documentCount : function() {
    return this.get('document_ids').length;
  },

  addDocuments : function(documents) {
    var ids = _.pluck(documents, 'id');
    var newIds = _.uniq(this.get('document_ids').concat(ids));
    Projects.update(this, {document_ids : newIds});
  },

  // Return the title of this project as a search parameter.
  toSearchParam : function() {
    var titlePart = this.get('title');
    if (titlePart.match(/\s/)) titlePart = '"' + titlePart + '"';
    return 'project: ' + titlePart;
  }

});


// Project Set

dc.model.ProjectSet = dc.model.RESTfulSet.extend({

  resource : 'projects',

  comparator : function(m) {
    return m.get('title').toLowerCase();
  },

  // Find a project by title.
  find : function(title) {
    return _.detect(this.models(), function(m){ return m.get('title').toLowerCase() == title.toLowerCase(); });
  },

  // Find all projects starting with a given prefix, for autocompletion.
  startingWith : function(prefix) {
    var matcher = new RegExp('^' + prefix);
    return _.select(this.models(), function(m){ return !!m.get('title').match(matcher); });
  }

});

dc.model.ProjectSet.implement(dc.model.SortedSet);
window.Projects = new dc.model.ProjectSet();
