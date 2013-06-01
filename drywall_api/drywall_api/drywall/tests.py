"""
This file demonstrates writing tests using the unittest module. These will pass
when you run "manage.py test".

Replace this with more appropriate tests for your application.
"""
import urlparse

from django.test import TestCase
from django.core.urlresolvers import reverse
from django.utils import timezone
from django.conf import settings
from django.contrib.auth import get_user_model

from helpers import GithubClient

from factories import UserFactory

class SetupUsers(TestCase):
    __test__ = False

    user = {
        "login": "octocat",
        "access_token": 'dummy',
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

    def set_up(self):
        self.client = GithubClient()
        self.user1 = UserFactory.create()
        self.user2 = UserFacotry.create()


class ViewsAuthorize(SetupUsers):
    __test__ = True
    view = "socialauth_begin"

    def test_github_client(self):
        self.client = GithubClient()
        self.client.login(user=self.user, backend='github')
        User = get_user_model()
        user = User.objects.get(pk=1)

    def test_authorize_redirect(self):
        url = reverse(self.view,
                      kwargs={'backend':'github'})
        resp = self.client.post(reverse(self.view,
                                       kwargs={'backend':'github'}))
        self.assertRedirects(resp, reverse('socialauth_complete',
                                           kwargs={'backend':'github'}))
