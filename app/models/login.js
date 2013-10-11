define(['mongoose', 'app/models/login/github'], function(mongoose, gh) {
  mongoose.model('GithubLogin', gh.schema);
});
