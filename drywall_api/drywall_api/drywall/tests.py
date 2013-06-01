"""
This file demonstrates writing tests using the unittest module. These will pass
when you run "manage.py test".

Replace this with more appropriate tests for your application.
"""
import urlparse

from django.test import TestCase
from django.core.urlresolvers import reverse
from django.utils import timezone

from factories import UserFactory

class SetupUsers(TestCase):
    def set_up(self):
        self.user1 = UserFactory.create()
        self.user2 = UserFacotry.create()


class ViewsAuthorize(TestCase):
    view = "socialauth_begin"

    def test_authorize_redirect(self):
        url = reverse(self.view,
                      kwargs={'backend':'github'})
        resp = self.client.post(reverse(self.view,
                                       kwargs={'backend':'github'}))
        import ipdb; ipdb.set_trace() ### XXX BREAKPOINT
        self.assertRedirects(resp, reverse('socialauth_complete',
                                           kwargs={'backend':'github'}))
