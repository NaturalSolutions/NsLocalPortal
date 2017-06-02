from datetime import datetime
from decimal import Decimal
import transaction
from urllib.parse import quote_plus

from sqlalchemy import engine_from_config

from pyramid.config import Configurator
from pyramid.request import Request, Response
from pyramid.renderers import JSON
from pyramid.authentication import AuthTktAuthenticationPolicy
from pyramid.authorization import ACLAuthorizationPolicy
from pyramid.security import remember, forget, NO_PERMISSION_REQUIRED
from .controllers.security import SecurityRoot, role_loader,myJWTAuthenticationPolicy
from .Models import (
    DBSession,
    Base,
    dbConfig,
    )
from .Views import add_routes, add_cors_headers_response_callback
from pyramid.events import NewRequest
# from .pyramid_jwtauth import (
#     JWTAuthenticationPolicy,
#     includeme
#     )
import base64

def datetime_adapter(obj, request):
    """Json adapter for datetime objects.
    """
    return str(obj)
    
def decimal_adapter(obj, request):
    """Json adapter for Decimal objects.
    """
    return float(obj)

def bytes_adapter(obj, request):
    return base64.b64encode(obj).decode()

def includeme(config):
    authz_policy = ACLAuthorizationPolicy()
    config.set_authorization_policy(authz_policy)

    settings = config.get_settings()
    authn_policy = myJWTAuthenticationPolicy.from_settings(settings)
    config.set_authentication_policy(authn_policy)


def main(global_config, **settings):
    """ This function returns a Pyramid WSGI application.
    """
    if 'mssql' in settings['cn.dialect']:
        settings['sqlalchemy.url'] = settings['cn.dialect'] + quote_plus(settings['sqlalchemy.url'])

    engine = engine_from_config(settings, 'sqlalchemy.')
    dbConfig['url'] = settings['sqlalchemy.url']
    dbConfig['siteName'] = settings['siteName']
    DBSession.configure(bind=engine)
    Base.metadata.bind = engine
    Base.metadata.create_all(engine)
    Base.metadata.reflect(views=True, extend_existing=False)

    config = Configurator(settings=settings)
    # Add renderer for datetime objects
    json_renderer = JSON()
    json_renderer.add_adapter(datetime, datetime_adapter)
    json_renderer.add_adapter(Decimal, decimal_adapter)
    json_renderer.add_adapter(bytes, bytes_adapter)
    config.add_renderer('json', json_renderer)

    # Set up authentication and authorization
    includeme(config)
    config.set_root_factory(SecurityRoot)
    # config.add_subscriber(add_cors_headers_response_callback, NewRequest)

    # Set the default permission level to 'read'
    config.set_default_permission('read')
    config.include('pyramid_tm')
    add_routes(config)
    config.scan()
    return config.make_wsgi_app()
