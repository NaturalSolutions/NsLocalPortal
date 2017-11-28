from pyramid.httpexceptions import HTTPUnauthorized
from pyramid.security import remember, forget, NO_PERMISSION_REQUIRED
from pyramid.view import view_config
from ..Models import DBSession, User, Authorisation, Base
from pyramid.interfaces import IAuthenticationPolicy
from pyramid.response import Response
from sqlalchemy import func, select, join
import json
import transaction

route_prefix = 'security/'

# @view_config(
# route_name='adminTest',
# permission=NO_PERMISSION_REQUIRED,
# renderer='json'
# )
# def adminTest(request):
# """Return 1 si l'utilisateur courant est un Admin.
# L'ID de l'utilisateur courant doit être passé en paramètres, sinon la fonction retourne 0.
# """
# if len( request.params ) > 0:
# if 'idUser' in request.params.keys() :

# iDUser = "\'"+request.params['iDUser']+"\'"

# query = select([
# Authorisation.Role.label('FK_idRole'),
# ]).where(Authorisation.FK_User == idUser)

##query = text('SELECT A.TAut_FK_TRolID FROM TAutorisations A WHERE '+idDUser+' = A.TAut_FK_TUseID')

# results = DBSession.execute(query).fetchone()
# print(type(results))
# data = [dict(row) for row in results]
# else:
# data = 0
# else:
# data = 0
# return data


@view_config(
    route_name=route_prefix + 'login',
    permission=NO_PERMISSION_REQUIRED,
    request_method='OPTIONS')
def login_options(request):
    response = Response()
    response.headers['Access-Control-Expose-Headers'] = (
        'Content-Type, Date, Content-Length, Authorization, X-Request-ID, X-Requested-With')
    response.headers['Access-Control-Allow-Origin'] = (
        request.headers['Origin'])
    response.headers['Access-Control-Allow-Credentials'] = 'true'
    response.headers['Access-Control-Allow-Headers'] = 'Access-Control-Allow-Origin, Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers'
    response.headers['Access-Control-Allow-Methods'] = (
        'POST,GET,DELETE,PUT,OPTIONS')
    response.headers['Content-Type'] = ('application/json')
    return response


@view_config(
    route_name=route_prefix + 'login',
    permission=NO_PERMISSION_REQUIRED,
    request_method='POST')
def login(request):
    user_id = request.POST.get('userId', '')
    #user_id =  user_id.upper()
    pwd = request.POST.get('password', '')
    user = DBSession.query(User).filter(User.id == user_id).one()

    Tins = Base.metadata.tables['TInstance']
    Tauth = Base.metadata.tables['TAutorisations']
    Trole = Base.metadata.tables['TRoles']
    table = join(Tins, Tauth, Tins.c['tins_pk_id']
                 == Tauth.c['TAut_FK_TInsID'])
    table = join(
        table, Trole, Tauth.c['TAut_FK_TRolID'] == Trole.c['trol_pk_id'])
    query = select([table]).where(Tauth.c['TAut_FK_TUseID']
                                  == user.id)
    roles = DBSession.execute(query).fetchall()

    roles = {row['tins_label']: row['trol_label'] for row in roles}
    if user is not None and user.check_password(pwd):
        claims = {
            "iss": user_id,
            "username": user.Login,
            "userlanguage": user.Language,
            "app_roles": roles}

        # get user role id
        qr = select([
            Authorisation.Role.label('role')
        ]).where(Authorisation.FK_User == user_id)
        usr = dict(DBSession.execute(qr).fetchone())
        userRole = usr['role']

        jwt = make_jwt(request, claims)
        response = Response(body=json.dumps(
            {'token': jwt.decode()}), content_type='text/plain')
        remember(response, jwt)
        transaction.commit()
        return response
    else:
        transaction.commit()
        return HTTPUnauthorized()


def make_jwt(request, claims):
    policy = request.registry.queryUtility(IAuthenticationPolicy)
    return policy.encode_jwt(request, claims)


@view_config(
    route_name=route_prefix + 'logout',
    permission=NO_PERMISSION_REQUIRED,)
def logout(request):
    forget(request)
    return request.response


@view_config(route_name=route_prefix + 'has_access')
def has_access(request):
    transaction.commit()
    return request.response
