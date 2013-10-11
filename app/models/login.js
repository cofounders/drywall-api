define(['mongoose', 'app/models/login/github'], function(mongoose, gh) {
  return mongoose.model('GithubLogin', gh.schema);
});
