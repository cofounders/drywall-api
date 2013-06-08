PROJECT_NAME='onetransport'
export PATH=$HOME/.virtualenvs/$PROJECT_NAME/bin:/usr/local/bin:/usr/local/sbin:$PATH:/usr/bin:/usr/sbin:/bin:/sbin
BASE=`(cd $(dirname "$0") && cd .. && pwd)`
export MANAGE_DIR="$BASE/$PROJECT_NAME"
export BIN_DIR="$BASE/bin"
export TEST_UPDATED_FILE="/tmp/test-$PROJECT"
export PROJECT_UPDATED_FILE="$BASE/.updated"

# Sets which django settings file to use
settings="$1"
if [ -z $settings ] || [ $settings = ""  ] || [ $settings = "dev" ] ; then
    settings='local'
fi
export DJANGO_SETTINGS_MODULE="onetransport.settings.$settings"

# if RESTART=1 then force a restart of the background process
RESTART=0
shopt -s nocasematch
for arg in "$@" ; do
    if [[ $arg = 'restart' ]] ; then
        RESTART=1
    fi
done
shopt -u nocasematch

function manage {
    $MANAGE_DIR/manage.py $@
}

function manage_noinput {
    manage $@ -v0 --noinput
}

function compile_translations {
    (cd $MANAGE_DIR && manage compilemessages)
}

function ensure_updated {
    /bin/touch -d "10 minutes ago" $TEST_UPDATED_FILE

    if [ ! -f $PROJECT_UPDATED_FILE ] || [ $PROJECT_UPDATED_FILE -ot $TEST_UPDATED_FILE ] ; then
        $BIN_DIR/update
    fi
}

function supervisor_exists {
    [[ -n `supervisorctl status | grep "$1[[:space:]]"` ]] && return 0

    return 1
}

function cf_supervisor {
    command=$1
    supervisor_name=$2

    supervisor_exists $supervisor_name && supervisorctl $command $supervisor_name

    return 0
}
