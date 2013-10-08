from django.contrib.auth.models import AbstractUser
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver

from social_auth.models import UserSocialAuth
from pygithub3 import Github

# Create your models here.

class OrgManager(models.Manager):
    def create_orgs(self, orgs):
        """
        Get a list of a user's orgs from github and populate/update
        the internal db's list of them
        :param user: user to update the list of orgs for
        """
        try:
            org_names = [org.name for org in orgs]
            orgs_dict = {org.name: org for org in orgs}
        except TypeError:
            org_names = [orgs.name,]
            orgs_dict = {orgs.name: orgs}
        qs_names = self.filter(name__in=org_names).values_list(name, flat=True)
        missing = set(org_names) - set(qs_names)
        for new_org_name in missing:
            org = orgs_dict[new_org_name]
            self.create(
                name=org.name,
                login=org.login,
                html_url=org.html_url,
                email=org.email,
                uid=org.id)
        return self.filter(name__in=org_names)


class DWUser(AbstractUser):
    @property
    def github_api(self):
        if hasattr(self, '_github_api'):
            return self._github_api
        else:
            self._github_api = Github(
                username=self.username,
                token=self.social_auth.get().tokens['access_token'])
            return self._github_api

    def github_data(self):
        return self.github_api.users.get()._attrs

    def github_orgs(self):
        return self.github_api.orgs.list(user=self.username)


class Org(models.Model):
    """Hold information for an (github) organization"""
    name = models.CharField(max_length=50)
    login = models.CharField(max_length=50)
    url = models.URLField()
    html_url = models.URLField()
    email = models.EmailField()
    uid = models.PositiveIntegerField()

    objects = OrgManager()

    def github_data(self, auth_user):
        """
        Get the github data for this org,

        :param auth_user: user that has been authenticated
        """
        orgs = auth_user.github_api.orgs.get(self.name)
        self.objects.create_orgs(orgs)
        return orgs


@receiver(post_save, sender=UserSocialAuth)
def create_related_orgs(sender, created, instance, **kwargs):
    if created:
        user = instance.user
        orgs = user.github_orgs()
        Org.objects.create_orgs(orgs)
