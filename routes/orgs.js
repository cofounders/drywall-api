var mongo = require('mongodb'),
  dbName = 'gitdb',
  server = new mongo.Server('localhost', 27017, {auto_reconnect:true}),
  db = new mongo.Db(dbName, server, {safe:true, w:1}),
  BSON = mongo.BSONPure,
  isDBrunning = false;

  
db.open(function(err, db) {
  if(!err) {
    console.log("Connected to " + dbName + " database");
    db.collection('orgs', {strict:true}, function(err, collection) {
      if (err) {
      console.log("The 'orgs' collection doesn't exist. Creating it with sample data...");
        populateOrgsCol();
      }
    });
    db.collection('repos', {strict:true}, function(err, collection) {
      if (err) {
        console.log("The 'repos' collection doesn't exist. Creating it with sample data...");
        populateReposCol();
      }
    });
    isDBrunning = true;
  } else {
    console.error("DB not running");
  }
});

function checkDB() {
  if (!isDBrunning) {
    console.error("DB aint running");
    return;
  }
}

// GET /user/orgs
// List public and private organizations for the authenticated user.
// http://developer.github.com/v3/orgs/
exports.getOrgs = function(req, res) {
  checkDB();
  
  db.collection('orgs', function(err, col) {
    col.find().toArray(function(err, items) {
      res.send(items);
    });
  });
};

//GET /orgs/:org/repos
//List organization repositories
//http://developer.github.com/v3/repos/#list-organization-repositories
exports.getRepos = function(req, res) {
  checkDB();

  var org = req.params.org;
  console.log("Getting repos from " + org)
  db.collection('repos', function(err, col) {
    col.find({'owner.login': org}).toArray(function(err, items) {
      if(items.length > 0) {
        res.send(items);
      } else {
        res.send("No items retrieved for "+ org)
      }
    });
  });
};

/*
* Populate the collections in our DB
* https://api.github.com/orgs/cofounders
* https://api.github.com/orgs/cofounders/repos
*/
var populateOrgsCol = function() {
  var orgs = 
  [
    {
      "login": "cofounders",
      "id": 1776840,
      "url": "https://api.github.com/orgs/cofounders",
      "repos_url": "https://api.github.com/orgs/cofounders/repos",
      "events_url": "https://api.github.com/orgs/cofounders/events",
      "members_url": "https://api.github.com/orgs/cofounders/members{/member}",
      "public_members_url": "https://api.github.com/orgs/cofounders/public_members{/member}",
      "avatar_url": "https://1.gravatar.com/avatar/2ff120dd2b6d5530897ff3297d93225e?d=https%3A%2F%2Fidenticons.github.com%2F8ca578665f7cb3fcf9ba8658e961e9e2.png",
      "name": "Cofounders.sg",
      "company": null,
      "blog": "http://www.cofounders.sg/",
      "location": "Singapore",
      "email": null,
      "public_repos": 2,
      "public_gists": 0,
      "followers": 0,
      "following": 0,
      "html_url": "https://github.com/cofounders",
      "created_at": "2012-05-25T06:16:24Z",
      "updated_at": "2013-10-01T11:51:33Z",
      "type": "Organization"
    }
  ];
  
  db.collection('orgs', function(err, collection) {
     collection.insert(orgs, {safe:true}, function(err, result) {});
  });
};

var populateReposCol = function() {
  var repos = 
  [
  {
    "id": 5520683,
    "name": "api-boilerplate",
    "full_name": "cofounders/api-boilerplate",
    "owner": {
      "login": "cofounders",
      "id": 1776840,
      "avatar_url": "https://2.gravatar.com/avatar/2ff120dd2b6d5530897ff3297d93225e?d=https%3A%2F%2Fidenticons.github.com%2F8ca578665f7cb3fcf9ba8658e961e9e2.png",
      "gravatar_id": "2ff120dd2b6d5530897ff3297d93225e",
      "url": "https://api.github.com/users/cofounders",
      "html_url": "https://github.com/cofounders",
      "followers_url": "https://api.github.com/users/cofounders/followers",
      "following_url": "https://api.github.com/users/cofounders/following{/other_user}",
      "gists_url": "https://api.github.com/users/cofounders/gists{/gist_id}",
      "starred_url": "https://api.github.com/users/cofounders/starred{/owner}{/repo}",
      "subscriptions_url": "https://api.github.com/users/cofounders/subscriptions",
      "organizations_url": "https://api.github.com/users/cofounders/orgs",
      "repos_url": "https://api.github.com/users/cofounders/repos",
      "events_url": "https://api.github.com/users/cofounders/events{/privacy}",
      "received_events_url": "https://api.github.com/users/cofounders/received_events",
      "type": "Organization"
    },
    "private": false,
    "html_url": "https://github.com/cofounders/api-boilerplate",
    "description": "A reasonable starting point for creating RESTful API services in Node.js",
    "fork": false,
    "url": "https://api.github.com/repos/cofounders/api-boilerplate",
    "forks_url": "https://api.github.com/repos/cofounders/api-boilerplate/forks",
    "keys_url": "https://api.github.com/repos/cofounders/api-boilerplate/keys{/key_id}",
    "collaborators_url": "https://api.github.com/repos/cofounders/api-boilerplate/collaborators{/collaborator}",
    "teams_url": "https://api.github.com/repos/cofounders/api-boilerplate/teams",
    "hooks_url": "https://api.github.com/repos/cofounders/api-boilerplate/hooks",
    "issue_events_url": "https://api.github.com/repos/cofounders/api-boilerplate/issues/events{/number}",
    "events_url": "https://api.github.com/repos/cofounders/api-boilerplate/events",
    "assignees_url": "https://api.github.com/repos/cofounders/api-boilerplate/assignees{/user}",
    "branches_url": "https://api.github.com/repos/cofounders/api-boilerplate/branches{/branch}",
    "tags_url": "https://api.github.com/repos/cofounders/api-boilerplate/tags",
    "blobs_url": "https://api.github.com/repos/cofounders/api-boilerplate/git/blobs{/sha}",
    "git_tags_url": "https://api.github.com/repos/cofounders/api-boilerplate/git/tags{/sha}",
    "git_refs_url": "https://api.github.com/repos/cofounders/api-boilerplate/git/refs{/sha}",
    "trees_url": "https://api.github.com/repos/cofounders/api-boilerplate/git/trees{/sha}",
    "statuses_url": "https://api.github.com/repos/cofounders/api-boilerplate/statuses/{sha}",
    "languages_url": "https://api.github.com/repos/cofounders/api-boilerplate/languages",
    "stargazers_url": "https://api.github.com/repos/cofounders/api-boilerplate/stargazers",
    "contributors_url": "https://api.github.com/repos/cofounders/api-boilerplate/contributors",
    "subscribers_url": "https://api.github.com/repos/cofounders/api-boilerplate/subscribers",
    "subscription_url": "https://api.github.com/repos/cofounders/api-boilerplate/subscription",
    "commits_url": "https://api.github.com/repos/cofounders/api-boilerplate/commits{/sha}",
    "git_commits_url": "https://api.github.com/repos/cofounders/api-boilerplate/git/commits{/sha}",
    "comments_url": "https://api.github.com/repos/cofounders/api-boilerplate/comments{/number}",
    "issue_comment_url": "https://api.github.com/repos/cofounders/api-boilerplate/issues/comments/{number}",
    "contents_url": "https://api.github.com/repos/cofounders/api-boilerplate/contents/{+path}",
    "compare_url": "https://api.github.com/repos/cofounders/api-boilerplate/compare/{base}...{head}",
    "merges_url": "https://api.github.com/repos/cofounders/api-boilerplate/merges",
    "archive_url": "https://api.github.com/repos/cofounders/api-boilerplate/{archive_format}{/ref}",
    "downloads_url": "https://api.github.com/repos/cofounders/api-boilerplate/downloads",
    "issues_url": "https://api.github.com/repos/cofounders/api-boilerplate/issues{/number}",
    "pulls_url": "https://api.github.com/repos/cofounders/api-boilerplate/pulls{/number}",
    "milestones_url": "https://api.github.com/repos/cofounders/api-boilerplate/milestones{/number}",
    "notifications_url": "https://api.github.com/repos/cofounders/api-boilerplate/notifications{?since,all,participating}",
    "labels_url": "https://api.github.com/repos/cofounders/api-boilerplate/labels{/name}",
    "created_at": "2012-08-23T07:17:36Z",
    "updated_at": "2013-05-08T20:11:46Z",
    "pushed_at": "2012-08-23T07:19:38Z",
    "git_url": "git://github.com/cofounders/api-boilerplate.git",
    "ssh_url": "git@github.com:cofounders/api-boilerplate.git",
    "clone_url": "https://github.com/cofounders/api-boilerplate.git",
    "svn_url": "https://github.com/cofounders/api-boilerplate",
    "homepage": null,
    "size": 116,
    "watchers_count": 4,
    "language": "JavaScript",
    "has_issues": true,
    "has_downloads": true,
    "has_wiki": true,
    "forks_count": 1,
    "mirror_url": null,
    "open_issues_count": 0,
    "forks": 1,
    "open_issues": 0,
    "watchers": 4,
    "master_branch": "master",
    "default_branch": "master",
    "permissions": {
      "admin": false,
      "push": false,
      "pull": true
    }
  },
  { 
    "id": 9313853,
    "name": "generator-cfsg-www",
    "full_name": "cofounders/generator-cfsg-www",
    "owner": {
      "login": "cofounders",
      "id": 1776840,
      "avatar_url": "https://2.gravatar.com/avatar/2ff120dd2b6d5530897ff3297d93225e?d=https%3A%2F%2Fidenticons.github.com%2F8ca578665f7cb3fcf9ba8658e961e9e2.png",
      "gravatar_id": "2ff120dd2b6d5530897ff3297d93225e",
      "url": "https://api.github.com/users/cofounders",
      "html_url": "https://github.com/cofounders",
      "followers_url": "https://api.github.com/users/cofounders/followers",
      "following_url": "https://api.github.com/users/cofounders/following{/other_user}",
      "gists_url": "https://api.github.com/users/cofounders/gists{/gist_id}",
      "starred_url": "https://api.github.com/users/cofounders/starred{/owner}{/repo}",
      "subscriptions_url": "https://api.github.com/users/cofounders/subscriptions",
      "organizations_url": "https://api.github.com/users/cofounders/orgs",
      "repos_url": "https://api.github.com/users/cofounders/repos",
      "events_url": "https://api.github.com/users/cofounders/events{/privacy}",
      "received_events_url": "https://api.github.com/users/cofounders/received_events",
      "type": "Organization"
    },
    "private": false,
    "html_url": "https://github.com/cofounders/generator-cfsg-www",
    "description": "",
    "fork": false,
    "url": "https://api.github.com/repos/cofounders/generator-cfsg-www",
    "forks_url": "https://api.github.com/repos/cofounders/generator-cfsg-www/forks",
    "keys_url": "https://api.github.com/repos/cofounders/generator-cfsg-www/keys{/key_id}",
    "collaborators_url": "https://api.github.com/repos/cofounders/generator-cfsg-www/collaborators{/collaborator}",
    "teams_url": "https://api.github.com/repos/cofounders/generator-cfsg-www/teams",
    "hooks_url": "https://api.github.com/repos/cofounders/generator-cfsg-www/hooks",
    "issue_events_url": "https://api.github.com/repos/cofounders/generator-cfsg-www/issues/events{/number}",
    "events_url": "https://api.github.com/repos/cofounders/generator-cfsg-www/events",
    "assignees_url": "https://api.github.com/repos/cofounders/generator-cfsg-www/assignees{/user}",
    "branches_url": "https://api.github.com/repos/cofounders/generator-cfsg-www/branches{/branch}",
    "tags_url": "https://api.github.com/repos/cofounders/generator-cfsg-www/tags",
    "blobs_url": "https://api.github.com/repos/cofounders/generator-cfsg-www/git/blobs{/sha}",
    "git_tags_url": "https://api.github.com/repos/cofounders/generator-cfsg-www/git/tags{/sha}",
    "git_refs_url": "https://api.github.com/repos/cofounders/generator-cfsg-www/git/refs{/sha}",
    "trees_url": "https://api.github.com/repos/cofounders/generator-cfsg-www/git/trees{/sha}",
    "statuses_url": "https://api.github.com/repos/cofounders/generator-cfsg-www/statuses/{sha}",
    "languages_url": "https://api.github.com/repos/cofounders/generator-cfsg-www/languages",
    "stargazers_url": "https://api.github.com/repos/cofounders/generator-cfsg-www/stargazers",
    "contributors_url": "https://api.github.com/repos/cofounders/generator-cfsg-www/contributors",
    "subscribers_url": "https://api.github.com/repos/cofounders/generator-cfsg-www/subscribers",
    "subscription_url": "https://api.github.com/repos/cofounders/generator-cfsg-www/subscription",
    "commits_url": "https://api.github.com/repos/cofounders/generator-cfsg-www/commits{/sha}",
    "git_commits_url": "https://api.github.com/repos/cofounders/generator-cfsg-www/git/commits{/sha}",
    "comments_url": "https://api.github.com/repos/cofounders/generator-cfsg-www/comments{/number}",
    "issue_comment_url": "https://api.github.com/repos/cofounders/generator-cfsg-www/issues/comments/{number}",
    "contents_url": "https://api.github.com/repos/cofounders/generator-cfsg-www/contents/{+path}",
    "compare_url": "https://api.github.com/repos/cofounders/generator-cfsg-www/compare/{base}...{head}",
    "merges_url": "https://api.github.com/repos/cofounders/generator-cfsg-www/merges",
    "archive_url": "https://api.github.com/repos/cofounders/generator-cfsg-www/{archive_format}{/ref}",
    "downloads_url": "https://api.github.com/repos/cofounders/generator-cfsg-www/downloads",
    "issues_url": "https://api.github.com/repos/cofounders/generator-cfsg-www/issues{/number}",
    "pulls_url": "https://api.github.com/repos/cofounders/generator-cfsg-www/pulls{/number}",
    "milestones_url": "https://api.github.com/repos/cofounders/generator-cfsg-www/milestones{/number}",
    "notifications_url": "https://api.github.com/repos/cofounders/generator-cfsg-www/notifications{?since,all,participating}",
    "labels_url": "https://api.github.com/repos/cofounders/generator-cfsg-www/labels{/name}",
    "created_at": "2013-04-09T05:29:38Z",
    "updated_at": "2013-04-09T13:20:19Z",
    "pushed_at": "2013-04-09T05:30:54Z",
    "git_url": "git://github.com/cofounders/generator-cfsg-www.git",
    "ssh_url": "git@github.com:cofounders/generator-cfsg-www.git",
    "clone_url": "https://github.com/cofounders/generator-cfsg-www.git",
    "svn_url": "https://github.com/cofounders/generator-cfsg-www",
    "homepage": null,
    "size": 112,
    "watchers_count": 0,
    "language": "JavaScript",
    "has_issues": true,
    "has_downloads": true,
    "has_wiki": true,
    "forks_count": 0,
    "mirror_url": null,
    "open_issues_count": 0,
    "forks": 0,
    "open_issues": 0,
    "watchers": 0,
    "master_branch": "master",
    "default_branch": "master",
    "permissions": {
      "admin": false,
      "push": false,
      "pull": true
    }
  },
  {
    "id": 13274286,
    "name": "void",
    "full_name": "alyssaquek/void",
    "owner": {
      "login": "alyssaquek",
      "id": 5425301,
      "avatar_url": "https://identicons.github.com/b773cc516de4c20d75cadf0e4488ef79.png",
      "gravatar_id": null,
      "url": "https://api.github.com/users/alyssaquek",
      "html_url": "https://github.com/alyssaquek",
      "followers_url": "https://api.github.com/users/alyssaquek/followers",
      "following_url": "https://api.github.com/users/alyssaquek/following{/other_user}",
      "gists_url": "https://api.github.com/users/alyssaquek/gists{/gist_id}",
      "starred_url": "https://api.github.com/users/alyssaquek/starred{/owner}{/repo}",
      "subscriptions_url": "https://api.github.com/users/alyssaquek/subscriptions",
      "organizations_url": "https://api.github.com/users/alyssaquek/orgs",
      "repos_url": "https://api.github.com/users/alyssaquek/repos",
      "events_url": "https://api.github.com/users/alyssaquek/events{/privacy}",
      "received_events_url": "https://api.github.com/users/alyssaquek/received_events",
      "type": "Organization"
    },
    "private": false,
    "html_url": "https://github.com/alyssaquek/void",
    "description": "Void master",
    "fork": false,
    "url": "https://api.github.com/repos/alyssaquek/void",
    "forks_url": "https://api.github.com/repos/alyssaquek/void/forks",
    "keys_url": "https://api.github.com/repos/alyssaquek/void/keys{/key_id}",
    "collaborators_url": "https://api.github.com/repos/alyssaquek/void/collaborators{/collaborator}",
    "teams_url": "https://api.github.com/repos/alyssaquek/void/teams",
    "hooks_url": "https://api.github.com/repos/alyssaquek/void/hooks",
    "issue_events_url": "https://api.github.com/repos/alyssaquek/void/issues/events{/number}",
    "events_url": "https://api.github.com/repos/alyssaquek/void/events",
    "assignees_url": "https://api.github.com/repos/alyssaquek/void/assignees{/user}",
    "branches_url": "https://api.github.com/repos/alyssaquek/void/branches{/branch}",
    "tags_url": "https://api.github.com/repos/alyssaquek/void/tags",
    "blobs_url": "https://api.github.com/repos/alyssaquek/void/git/blobs{/sha}",
    "git_tags_url": "https://api.github.com/repos/alyssaquek/void/git/tags{/sha}",
    "git_refs_url": "https://api.github.com/repos/alyssaquek/void/git/refs{/sha}",
    "trees_url": "https://api.github.com/repos/alyssaquek/void/git/trees{/sha}",
    "statuses_url": "https://api.github.com/repos/alyssaquek/void/statuses/{sha}",
    "languages_url": "https://api.github.com/repos/alyssaquek/void/languages",
    "stargazers_url": "https://api.github.com/repos/alyssaquek/void/stargazers",
    "contributors_url": "https://api.github.com/repos/alyssaquek/void/contributors",
    "subscribers_url": "https://api.github.com/repos/alyssaquek/void/subscribers",
    "subscription_url": "https://api.github.com/repos/alyssaquek/void/subscription",
    "commits_url": "https://api.github.com/repos/alyssaquek/void/commits{/sha}",
    "git_commits_url": "https://api.github.com/repos/alyssaquek/void/git/commits{/sha}",
    "comments_url": "https://api.github.com/repos/alyssaquek/void/comments{/number}",
    "issue_comment_url": "https://api.github.com/repos/alyssaquek/void/issues/comments/{number}",
    "contents_url": "https://api.github.com/repos/alyssaquek/void/contents/{+path}",
    "compare_url": "https://api.github.com/repos/alyssaquek/void/compare/{base}...{head}",
    "merges_url": "https://api.github.com/repos/alyssaquek/void/merges",
    "archive_url": "https://api.github.com/repos/alyssaquek/void/{archive_format}{/ref}",
    "downloads_url": "https://api.github.com/repos/alyssaquek/void/downloads",
    "issues_url": "https://api.github.com/repos/alyssaquek/void/issues{/number}",
    "pulls_url": "https://api.github.com/repos/alyssaquek/void/pulls{/number}",
    "milestones_url": "https://api.github.com/repos/alyssaquek/void/milestones{/number}",
    "notifications_url": "https://api.github.com/repos/alyssaquek/void/notifications{?since,all,participating}",
    "labels_url": "https://api.github.com/repos/alyssaquek/void/labels{/name}",
    "created_at": "2013-10-02T15:08:57Z",
    "updated_at": "2013-10-02T15:08:57Z",
    "pushed_at": "2013-10-02T15:08:57Z",
    "git_url": "git://github.com/alyssaquek/void.git",
    "ssh_url": "git@github.com:alyssaquek/void.git",
    "clone_url": "https://github.com/alyssaquek/void.git",
    "svn_url": "https://github.com/alyssaquek/void",
    "homepage": null,
    "size": 0,
    "watchers_count": 0,
    "language": null,
    "has_issues": true,
    "has_downloads": true,
    "has_wiki": true,
    "forks_count": 0,
    "mirror_url": null,
    "open_issues_count": 0,
    "forks": 0,
    "open_issues": 0,
    "watchers": 0,
    "master_branch": "master",
    "default_branch": "master",
    "permissions": {
      "admin": false,
      "push": false,
      "pull": true
    }
  }

]
  
  db.collection('repos', function(err, collection) {
     collection.insert(repos, {safe:true}, function(err, result) {});
  });
};