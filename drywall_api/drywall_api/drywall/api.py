from social_auth.db.django_models import UserSocialAuth
from tastypie.resources import Resource, ModelResource
from tastypie.authentication import SessionAuthentication
from tastypie import fields, utils

from django.contrib.auth import get_user_model

User = get_user_model()


class UsersResource(ModelResource):
    name = fields.CharField(attribute='first_name')
    id = fields.CharField(attribute='id')
    email = fields.CharField(attribute='email')
    github_id = fields.ToManyField('drywall.api.GithubUserResource', 'uid')

    class Meta:
        queryset = User.objects.all()
        resource_name = 'users'
        list_allowed_methods = ['get',]
        detail_allowed_methods = ['get', ]
        authentication = SessionAuthentication()


class UserResource(UsersResource):
    def apply_authorization_limits(self, request, object_list):
        return object_list.filter(user=request.user)

    class Meta(UsersResource.Meta):
        resource_name = 'user'


class GithubUserResource(ModelResource):
    user = fields.ToOneField(UsersResource, 'user')

    class Meta:
        queryset = UserSocialAuth.objects.all()
        list_allowed_methods = ['get',]
        detail_allowed_methods = ['get', ]
        fields = ['uid',]
        authentication = SessionAuthentication()
        resource_name = 'user/github-user/'

    def apply_authorization_limits(self, request, object_list):
        return object_list.filter(user=request.user,
                                  provider='github')
