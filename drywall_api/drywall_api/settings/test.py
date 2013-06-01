from base import *

########## TEST SETTINGS
TEST_RUNNER = 'django_nose.NoseTestSuiteRunner'
#TEST_DISCOVER_TOP_LEVEL = SITE_ROOT
#TEST_DISCOVER_ROOT = SITE_ROOT
#TEST_DISCOVER_PATTERN = "test_*.py"

INSTALLED_APPS += (
    'django_nose',
)

NOSE_ARGS = [
    '--with-coverage',
    '--nocapture',
]

NOSE_ARGS += [ '--cover-package={}'.format(pack) for pack in LOCAL_APPS]

GITHUB_APP_ID = '0de51057b17b6c698ab8'
GITHUB_API_SECRET = 'ded4e0b2d98b4688b3f226fa9e8578f09c861795'

########## IN-MEMORY TEST DATABASE
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": ":memory:",
    },
}
