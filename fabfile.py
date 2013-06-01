from os.path import basename
import boto
from boto import ec2
from fabric.api import *
from fabric.contrib import files
from project_settings import repository_name, project_name, sites


def get_production_servers():
    ACCESS_KEY_ID = ''
    SECRET_ACCESS_KEY = ''

    elb_region = boto.regioninfo.RegionInfo(
        name='ap-southeast-1',
        endpoint='elasticloadbalancing.ap-southeast-1.amazonaws.com')

    elb_connection = boto.connect_elb(
        aws_access_key_id=ACCESS_KEY_ID,
        aws_secret_access_key=SECRET_ACCESS_KEY,
        region=elb_region)

    ec2_region = ec2.get_region(aws_access_key_id=ACCESS_KEY_ID,
                                aws_secret_access_key=SECRET_ACCESS_KEY,
                                region_name='ap-southeast-1')

    ec2_connection = boto.ec2.connection.EC2Connection(
        aws_access_key_id=ACCESS_KEY_ID,
        aws_secret_access_key=SECRET_ACCESS_KEY,
        region=ec2_region)

    load_balancer = elb_connection.get_all_load_balancers(load_balancer_names=['MediaPopClients'])[0]
    instance_ids = [ instance.id for instance in load_balancer.instances ]
    # If there's no instances in the load balancer, instance_ids will be an
    # empty list, which will cause get_all_instances to get ALL EC2 instances
    # which we definitely don't want.
    if not instance_ids: return []
    reservations = ec2_connection.get_all_instances(instance_ids)
    return [ i.public_dns_name for r in reservations for i in r.instances ]

env.roledefs.update({
    'production': get_production_servers(),
    'staging': [
        '',
    ],
})

env.user = 'deploy'

def up(branch='master'):
    with cd('/home/deploy/{0}'.format(repository_name)):
        run('ps -ef | grep {0}'.format(repository_name))
        with settings(shell='bash -i -c'):
            env_name = run('echo $MP_ENV')
            with prefix('workon {0}'.format(repository_name)):
                # update code and dependencies
                run('git fetch')
                run('git checkout %s' % branch)
                run('git pull origin %s' % branch)
                run('pip install -r requirements.txt')
                run('python setup.py develop')
                with settings(warn_only=True):
                    # Will raise an error if there's no .pyc files.
                    run('find -name *.pyc | xargs rm')
                run('clients/manage.py collectstatic -v0 --noinput '
                    '--settings=clients.settings_{0}'.format(env_name))

    restart()

def start():
    run('ps -ef | grep {0}'.format(repository_name))
    run('supervisorctl start {0}'.format(repository_name))
    run('ps -ef | grep {0}'.format(repository_name))


def stop():
    run('ps -ef | grep {0}'.format(repository_name))
    run('supervisorctl stop {0}'.format(repository_name))
    run('ps -ef | grep {0}'.format(repository_name))


def restart():
    """This is not the same as running stop() and then start() which tells
    supervisord to restart the process. Instead it sends a HUP signal to the
    process which restarts it."""
    run('ps -ef | grep {0}'.format(repository_name))
    run('supervisorctl restart {0}'.format(repository_name))
    run('ps -ef | grep {0}'.format(repository_name))


def infra(user):
    """You need to use a user that can root itself, deploy cannot without a
    password."""
    with settings(shell='bash -i -c'):
        env_name = run('echo $MP_ENV')
    with settings(user=user):
        with open('conf.d/etc/supervisord.conf') as supervisord_template_file:
            supervisord_template = supervisord_template_file.read()
            supervisord_config = supervisord_template.format(
                repository_name=repository_name,
                project_name=project_name,
                environment=env_name
            )
            current_config = run('cat /etc/supervisord.conf')
            if repository_name not in current_config:
                files.append('/etc/supervisord.conf',
                             supervisord_config,
                             use_sudo=True)
                run('supervisorctl reload')
            run('cat /etc/supervisord.conf')

        for config in sites:
            filename = basename(config)
            put(config, '/etc/nginx/sites-available/{0}'.format(filename),
                use_sudo=True)
            if not files.exists('/etc/nginx/sites-enabled/{0}'.format(filename)):
                sudo('ln -s /etc/nginx/sites-available/{0} '.format(filename),
                     '/etc/nginx/sites-enabled/{0}'.format(filename))
            sudo('nginx -s reload')
