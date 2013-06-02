from social_auth.db.django_models import UserSocialAuth
from tastypie.resources import Resource, ModelResource
from tastypie.authentication import SessionAuthentication
from tastypie import fields, utils

from django.contrib.auth import get_user_model
from django.conf.urls import url

User = get_user_model()


class UsersResource(ModelResource):
    name = fields.CharField(attribute='first_name')
    id = fields.CharField(attribute='id')
    email = fields.CharField(attribute='email')

    class Meta:
        queryset = User.objects.filter(social_auth__isnull=False)
        resource_name = 'users'
        fields = [
                'name',
                'id',
                'email',
                'github_id',
        ]
        list_allowed_methods = ['get',]
        detail_allowed_methods = ['get', ]
        authentication = SessionAuthentication()

    def prepend_urls(self):
        return [
            url(r"^(?P<resource_name>user)/$",
                self.wrap_view('get_me'),
                name="api_get_me"),
            ]

    def get_me(self, request, **kwargs):
        return self.get_detail(request, id=request.user.id)

    def dehydrate(self, bundle):
        user = bundle.request.user
        github_auths= user.social_auth.filter(provider='github')
        bundle.data['github_id'] = [gha.uid for gha in github_auths]
        return bundle

    def determine_format(self, request):
        return 'application/json'


class GithubUserResource(ModelResource):
    user = fields.ToOneField(UsersResource, 'user')
    uid = fields.CharField(attribute='uid')

    class Meta:
        queryset = UserSocialAuth.objects.all()
        fields = [
                'user',
                'uid',
        ]
        list_allowed_methods = ['get',]
        detail_allowed_methods = ['get', ]
        authentication = SessionAuthentication()

    def determine_format(self, request):
        return 'application/json'

    def apply_authorization_limits(self, request, object_list):
        return object_list.filter(user=request.user,
                                  provider='github')
