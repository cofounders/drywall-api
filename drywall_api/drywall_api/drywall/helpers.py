import urllib
from django.conf import settings
from django.contrib.auth.models import AnonymousUser
from django.test.client import Client, RequestFactory
from django.utils import simplejson
from django.utils.importlib import import_module
from mock import patch
from social_auth.views import complete
import pytz

sg_tz = pytz.timezone("Asia/Singapore")
sg_tz = sg_tz.localize(pytz.datetime.datetime.now()).tzinfo

default_start = lambda: tz_now(sg_tz)
default_start_formated = lambda: default_start().strftime("%Y-%m-%d")

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
