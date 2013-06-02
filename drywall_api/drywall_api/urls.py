from django.conf.urls import patterns, include, url
from django.views.generic import TemplateView
from tastypie.api import Api
from drywall.api import UsersResource, UserResource, GithubUserResource

v1_api = Api(api_name='v1')
v1_api.register(UsersResource())
v1_api.register(UserResource())
v1_api.register(GithubUserResource())

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    url(r'^$', TemplateView.as_view(template_name='base.html')),

    url(r'api/', include('social_auth.urls')),
    url(r'api/', include(v1_api.urls)),

    # Uncomment the next line to enable the admin:
    url(r'^admin/', include(admin.site.urls)),
)
