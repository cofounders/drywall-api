import factory
from django.conf import settings
from django.contrib.auth.hashers import make_password


class UserFactory(factory.Factory):
    FACTORY_FOR = settings.AUTH_USER_MODEL

    username = factory.Sequence(lambda n:'user{}@example.com'.format(n))
    password = make_password('password')
