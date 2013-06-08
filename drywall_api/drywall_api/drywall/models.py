from django.contrib.auth.models import AbstractUser
from django.db import models
from pygithub3 import Github

# Create your models here.

class DWUser(AbstractUser):
    def __init__(self, *args, **kwargs):
        super(DWUser, self).__init__(*args, **kwargs)

    @property
    def github_api():
        if hasattr(self, '_github_api'):
            return self._github_api
        else:
            self._github_client = GitHub(
                username=self.login,
                token=self.social_auth.get().tokens['access_token'])
            return self._github_api


class Org(models.Model):
    """Hold information for an (github) organization"""
    name = models.CharField(max_length=50)
    login = models.CharField(max_length=50)
    url = models.URLField()
    html_url = models.URLField()
    email = models.EmailField()
    uid = models.PositiveIntegerField()
