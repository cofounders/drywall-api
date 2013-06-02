"""
This file demonstrates writing tests using the unittest module. These will pass
when you run "manage.py test".

Replace this with more appropriate tests for your application.
"""
import urlparse

from django.test import TestCase
from django.test.client import RequestFactory
from django.core.urlresolvers import reverse
from django.utils import timezone
from django.conf import settings
from django.contrib.auth import get_user_model

from helpers import GithubClient

from factories import UserFactory

User = get_user_model()

class SetDefaults(TestCase):
    __test__ = False

    user = {
        "login": "octocat",
        "access_token": 'dummy',
        "token_type": "bearer",
        "id": 1,
        "avatar_url": "https://github.com/images/error/octocat_happy.gif",
        "gravatar_id": "somehexcode",
        "url": "https://api.github.com/users/octocat",
        "name": "monalisa octocat",
        "company": "GitHub",
        "blog": "https://github.com/blog",
        "location": "San Francisco",
        "email": "octocat@github.com",
        "hireable": False,
        "bio": "There once was...",
        "public_repos": 2,
        "public_gists": 1,
        "followers": 20,
        "following": 0,
        "html_url": "https://github.com/octocat",
        "created_at": "2008-01-14T04:33:35Z",
        "type": "User"
    }

    def make_user_dict(self, user):
        """Passed a user, update the dict to use its particulars"""
        user_dict = self.user.copy()
        user_dict.update(
                {'login':user.username,
                 'email':user.email,
                 'id':user.social_auth.get().uid,
                 'name':user.first_name,})
        return user_dict

    def setUp(self):
        self.client = GithubClient()


class SetupUsers(SetDefaults):
    __test__ = True

    def setUp(self):
        super(SetupUsers, self).setUp()
        self.user1 = UserFactory.create()
        self.user2 = UserFactory.create()


class TestViewsAuthorize(SetDefaults):
    __test__ = True
    view = "socialauth_begin"

    client = GithubClient()

    def test_github_client(self):
        self.client.login(user=self.user, backend='github')
        user = User.objects.get(pk=1)
        self.assertEqual(user.username, 'octocat')

    def test_github_login_existing(self):
        """Make sure a user created with a factory can log in using the
        mocked call"""
        user = UserFactory.create()
        user_dict = self.make_user_dict(user)
        self.client.login(user=user_dict, backend='github')
        self.assertEquals(User.objects.all().count(), 1)


class TestAPIIssues(SetupUsers):
    __test__ = True

    def test_get_issue_list(self):
        self.client = GithubClient()
