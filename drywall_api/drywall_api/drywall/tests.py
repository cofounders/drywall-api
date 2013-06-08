"""
This file demonstrates writing tests using the unittest module. These will pass
when you run "manage.py test".

Replace this with more appropriate tests for your application.
"""
import urlparse
import urllib
import json as simplejson

from django.test import TestCase
from django.core.urlresolvers import reverse
from django.utils import timezone
from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AnonymousUser
from django.test.client import RequestFactory, Client
from django.utils.importlib import import_module

from factories import UserFactory, OrgFactory

from mock import patch
from social_auth.views import complete
from tastypie.test import TestApiClient, ResourceTestCase
from tastypie.serializers import Serializer

User = get_user_model()

class DumbResponse(object):
    """
    Response from a call to, urllib2.urlopen()
    """

    def __init__(self, data_str, url=None):
        self.data_str = data_str
        self.url = url

    def read(self):
        return self.data_str

class GithubClient(Client):
    """
    .. py:class:: GithubClient

    Social client to test against Github
    """

    @patch('social_auth.utils.urlopen')
    def login(self, mock_urlopen, user, backend='github'):
        """
        .. py:method:: login(user, mock_urlopen[ backend='github'])

        Login or register a github user.

        If the user has never logged in then they get registered and logged in.
        If the user has already registered, then they are logged in.

        :param user: user to login/register
        :type user: dict
        :param mock_urlopen: mock object for social_auth.utils.urlopen
        :param backend: backend to use, defaults to github

        example github user Response::

            {
            "login": "octocat",
            "id": 1,
            "avatar_url": "https://github.com/images/error/octocat_happy.gif",
            "gravatar_id": "somehexcode",
            "url": "https://api.github.com/users/octocat",
            "name": "monalisa octocat",
            "company": "GitHub",
            "blog": "https://github.com/blog",
            "location": "San Francisco",
            "email": "octocat@github.com",
            "hireable": false,
            "bio": "There once was...",
            "public_repos": 2,
            "public_gists": 1,
            "followers": 20,
            "following": 0,
            "html_url": "https://github.com/octocat",
            "created_at": "2008-01-14T04:33:35Z",
            "type": "User"
            }
        """
        token = 'dummyToken'
        gh_user = user.copy()
        gh_user['access_token'] = token
        backends = {
            'github': (
                simplejson.dumps(user),
                urllib.urlencode({
                    'acess_token': token,
                    'token_type': 'bearer',
                }),
                simplejson.dumps(user),
            ),
        }

        if backend not in backends:
            raise NoBackendError("%s is not supported" % backend)

        """
        mock out urlopen
        """
        mock_urlopen.side_effect = [
            DumbResponse(r) for r in backends[backend]
        ]

        factory = RequestFactory()
        request = factory.post('', {'code': 'dummy',
            'redirect_state': 'dummy'})

        engine = import_module(settings.SESSION_ENGINE)
        if self.session:
            request.session = self.session
        else:
            request.session = engine.SessionStore()

        request.user = AnonymousUser()
        request.session['github_state'] = 'dummy'

        # make it happen.
        redirect = complete(request, backend)

        request.session.save()

        # Set the cookie for this session.
        session_cookie = settings.SESSION_COOKIE_NAME
        self.cookies[session_cookie] = request.session.session_key
        cookie_data = {
            'max-age': None,
            'path': '/',
            'domain': settings.SESSION_COOKIE_DOMAIN,
            'secure': settings.SESSION_COOKIE_SECURE or None,
            'expires': None,
        }
        self.cookies[session_cookie].update(cookie_data)

        return True

class PrettyJSONSerializer(Serializer):
    json_indent = 2

    def to_json(self, data, options=None):
        option = options or {}
        data = self.to_simple(data, option)
        return simplejson.dumps(data, cls=json.DjangoJSONEncoder,
                                sort_keys=True, ensure_ascii=False,
                                indent=self.json_indent)


class GithubResourceTestClient(GithubClient, TestApiClient):
    def __init__(self, *args, **kwargs):
        super(GithubResourceTestClient, self).__init__(*args, **kwargs)
        self.client = GithubClient()
        self.serializer = PrettyJSONSerializer()


class GithubResourceTestCase(ResourceTestCase):
    def setUp(self):
        super(ResourceTestCase, self).setUp()
        self.api_client = GithubResourceTestClient()


class SetDefaults(GithubResourceTestCase):
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

    def get_credentials(self, user):
        return self.api_client.login(user=self.make_user_dict(user),
                                       backend='github')

    def make_user_dict(self, user):
        """Passed a user, update the dict to use its particulars"""
        user_dict = self.user.copy()
        user_dict.update(
                {'login':user.username,
                 'email':user.email,
                 'id':user.social_auth.get().uid,
                 'name':user.first_name,})
        return user_dict

    def make_org_dict(self, org):
        org_dict = dict(
            name=org.name,
            url=org.url,
            html_url=org.html_url,
            id=org.uid,
            avatar_url=org.avatar_url,
            email=org.email,)
        return org_dict

    def setUp(self):
        super(SetDefaults, self).setUp()
        self.serializer = PrettyJSONSerializer()


class SetupUsers(SetDefaults):
    __test__ = True

    def setUp(self):
        super(SetupUsers, self).setUp()
        self.user1 = UserFactory.create()
        self.user2 = UserFactory.create()


class TestViewsAuthorize(SetDefaults):
    __test__ = True
    view = "socialauth_begin"

    def test_github_client(self):
        self.api_client.login(user=self.user, backend='github')
        user = User.objects.get(pk=1)
        self.assertEqual(user.username, 'octocat')

    def test_github_login_existing(self):
        """Make sure a user created with a factory can log in using the
        mocked call"""
        user = UserFactory.create()
        user_dict = self.make_user_dict(user)
        self.api_client.login(user=user_dict, backend='github')
        self.assertEquals(User.objects.all().count(), 1)


class TestUserAPI(SetupUsers):
    def test_get_all_users(self):
        resp = self.api_client.get('/api/v1/users/',
                                   authentication=self.get_credentials(self.user1))
        self.assertValidJSONResponse(resp)
        user1_resp = {
            u'id': unicode(self.user1.id),
            u'github_id': [unicode(self.user1.social_auth.get().uid),],
            u'name': unicode(self.user1.first_name),
            u'email': unicode(self.user1.email),}
        self.assertEqual(len(self.deserialize(resp)['objects']), 2)
        deserialzed_resp = self.deserialize(resp)['objects'][0]
        for key in user1_resp:
            self.assertEqual(deserialzed_resp.pop(key), user1_resp[key])

    def test_get_authed_user(self):
        """Make sure user/ endpoint doesn't work on an unauth`d user
        and that it does work for an auth`d one"""
        resp = self.api_client.get('/api/v1/user/', format='json')
        self.assertHttpNotFound(resp)
        user1_dict = self.make_user_dict(self.user1)
        resp = self.api_client.get('/api/v1/user/',
                                   format='json',
                                   authentication=self.get_credentials(self.user1))
        self.assertHttpOK(resp)
        user1_resp = {
            u'id': unicode(self.user1.id),
            u'github_id': [unicode(self.user1.social_auth.get().uid),],
            u'name': unicode(self.user1.first_name),
            u'email': unicode(self.user1.email),}
        self.assertValidJSONResponse(resp)
        deserialzed_resp = self.deserialize(resp)
        for key in user1_resp:
            self.assertEqual(deserialzed_resp.pop(key), user1_resp[key])


class TestOrganization(SetupUsers):
    def setUp(self):
        super(TestOrganization, self).setUp()
        self.org1 = OrgFactory.create()
        self.org1.save()

    def test_get_users_orgs(self):
        self.org1.users.add(self.user1)
        resp = self.api_client.get(
            '/api/v1/users/{}/orgs/'.format(self.user1.pk),
            authentication=self.get_credentials(self.user1))
        self.assertValidJSONResponse(resp)
        expected = [self.make_org_dict(org),]
        self.assertEqual(len(self.deserialize(resp)['objects']), len(expected))
        deserialzed_resp = self.deserialize(resp)['objects'][0]
        for key in expected:
            self.assertEqual(deserialzed_resp.pop(key), expected[key])

    def test_get_my_orgs(self):
        self.org1.users.add(self.user1)
        resp = self.api_client.get('/api/v1/user/orgs/',
                                   authentication=self.get_credentials(self.user1))
        self.assertValidJSONResponse(resp)
        expected = [self.make_org_dict(org),]
        self.assertEqual(len(self.deserialize(resp)['objects']), len(expected))
        deserialzed_resp = self.deserialize(resp)['objects'][0]
        for key in expected:
            self.assertEqual(deserialzed_resp.pop(key), expected[key])

    def test_get_orgs(self):
        resp = self.api_client.get('/api/v1/orgs/',
                                   authentication=self.get_credentials(self.user1))
        self.assertValidJSONResponse(resp)
        expected = [self.make_org_dict(org),]
        self.assertEqual(len(self.deserialize(resp)['objects']), len(expected))
        deserialzed_resp = self.deserialize(resp)['objects'][0]
        for key in expected:
            self.assertEqual(deserialzed_resp.pop(key), expected[key])

    def test_get_one_org(self):
        resp = self.api_client.get('/api/v1/orgs/{}'.format(self.org1.pk),
                                   authentication=self.get_credentials(self.user1))
        self.assertValidJSONResponse(resp)
        expected = [self.make_org_dict(org),]
        self.assertEqual(len(self.deserialize(resp)['objects']), len(expected))
        deserialzed_resp = self.deserialize(resp)['objects'][0]
        for key in expected:
            self.assertEqual(deserialzed_resp.pop(key), expected[key])
