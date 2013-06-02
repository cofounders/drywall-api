import factory


from django.conf import settings
from django.contrib.auth.hashers import make_password
from django.contrib.auth import get_user_model
from django.utils import timezone, simplejson

from social_auth.db.django_models import UserSocialAuth

from helpers import sg_tz


class SocialAuthFactory(factory.DjangoModelFactory):
    FACTORY_FOR = UserSocialAuth

    provider = 'github'
    uid = factory.Sequence(lambda n: n)

    extra_data = factory.lazy_attribute(lambda a:'{{"access_token": "dummy", "expires": "nil", "id":{uid} }}'.format(uid=a.uid))


class UserFactory(factory.DjangoModelFactory):
    FACTORY_FOR = get_user_model()

    username = factory.Sequence(lambda n:'tester{}'.format(n))
    email = factory.Sequence(lambda n:'tester{}@example.com'.format(n))
    first_name = factory.Sequence(lambda n:'tester {}'.format(n))
    is_active = True
    is_superuser = False
    is_staff = False
    last_login = timezone.datetime(2013,05,15,12,00,tzinfo=sg_tz)
    password = '!'

    social_auth = factory.RelatedFactory(SocialAuthFactory, 'user')
