module.exports = {
  // Enforce model schema in the case of schemaless databases
  schema: true,

  attributes: {
    // The name of the GitHub user or organization that owns the site's repository
    owner: {
      type:'string',
      required: true
    },
    // The name of the repository for the site on GitHub
    repository: {
      type:'string',
      required: true
    },
    engine: {
      type: 'string',
      defaultsTo: 'static',
      enum: ['jekyll', 'hugo', 'static']
    },
    defaultBranch: {
      type: 'string',
      defaultsTo: 'master'
    },
    // A collection of Federalist users who should have access to this site
    users: {
      collection: 'user',
      via: 'sites'
    },
    builds: {
      collection: 'build',
      via: 'site'
    },
    domain: {
      type: 'string'
    },
    config: {
      type: 'string'
    },
    publicPreview: {
      type: 'boolean',
      defaultsTo: false
    },
    toJSON: function() {
      const s3Config = sails.config.s3
      let obj = this.toObject()

      obj.siteRoot = `http://${s3Config.bucket}.s3-website-${s3Config.region}.amazonaws.com`
      obj.viewLink = obj.domain || [obj.siteRoot, 'site', obj.owner, obj.repository].join('/')

      return obj
    }
  },

  beforeCreate: function(values, done) {
    this.registerSite(values, done);
  },

  afterCreate: function(model, done) {
    this.startInitialBuild(model, done)
  },

  afterUpdate: function() {
    Site.afterCreate.apply(this, _.toArray(arguments));
  },

  registerSite: function(values, done) {
    async.parallel({
      // Set up GitHub webhook
      hook: GitHub.setWebhook.bind(this, values, values.users[0])
    }, function(err, res) {
      // Ignore error if hook already exists; otherwise, return error
      if (err) {
        var ghErr,
            hookMessage = 'Hook already exists on this repository',
            noAccessMessage = 'Not Found';
        try { ghErr = JSON.parse(err.message).errors[0].message; } catch(e) {}
        if (ghErr === hookMessage) return done();
        try { ghErr = JSON.parse(err.message).message; } catch(e) {}
        if (ghErr === noAccessMessage) return done('You do not have admin access to this repository');
        if (err.message) return done(err.message);
        return done(err);
      }
      done();
    });
  },

  startInitialBuild: function(model, done) {
    Site.findOne({id: model.id }).populate('users')
        .exec(function(err, site) {
          if (err) return done(err);
          if (!site.users[0]) return done();
          var build = {
              user: site.users[0].id,
              site: model.id,
              branch: model.defaultBranch
          };
          Build.create(build, done);
        });
  }
};
