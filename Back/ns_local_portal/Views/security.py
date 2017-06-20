from pyramid.httpexceptions import HTTPUnauthorized
from pyramid.security import remember, forget, NO_PERMISSION_REQUIRED
from pyramid.view import view_config
from ..Models import DBSession, User
from pyramid.interfaces import IAuthenticationPolicy
from pyramid.response import Response
from sqlalchemy import func

import transaction

route_prefix = 'security/'

@view_config(
    route_name=route_prefix+'adminTest',
    permission=NO_PERMISSION_REQUIRED,
    renderer='json'
)
def adminTest(request):
    """Return 1 si l'utilisateur courant est un Admin. 
    L'ID de l'utilisateur courant doit être passé en paramètres, sinon la fonction retourne 0.
    """
    if len( request.authenticated_userid ) == 1:

        print(request.authenticated_userid)
        print(request.authenticated_userid['iss'])

        query = select([
        Authorisation.Role.label('FK_idRole'),
        ]).where(Authorisation.FK_User == request.authenticated_userid['iss'])

        #query = text('SELECT A.TAut_FK_TRolID FROM TAutorisations A WHERE '+idDUser+' = A.TAut_FK_TUseID')

        results = DBSession.execute(query).fetchone()

        print(type(results))
        data = [dict(row) for row in results]

    else:
        data = 0
    return data

@view_config(
    route_name=route_prefix+'login',
    permission=NO_PERMISSION_REQUIRED,
    request_method='POST')
def login(request): 
    user_id = request.POST.get('userId', '')
    #user_id =  user_id.upper()
    pwd = request.POST.get('password', '')
    user = DBSession.query(User).filter(User.id== user_id).one()
    

    if user is not None and user.check_password(pwd):
        claims = {
            "iss": user_id,
            "username": user.Login,
            "userlanguage": user.Language
        }
        jwt = make_jwt(request, claims)
        print(jwt)
        print(request)
        response = Response(body='login success', content_type='text/plain')
        remember(response, jwt)
        print(response)
        transaction.commit()
        return response
    else:
        transaction.commit()
        return HTTPUnauthorized()

def make_jwt(request, claims):
    policy = request.registry.queryUtility(IAuthenticationPolicy)
    return policy.encode_jwt(request, claims)

@view_config(
    route_name=route_prefix+'logout', 
    permission=NO_PERMISSION_REQUIRED,)
def logout(request):
    forget(request)
    return request.response
    
@view_config(route_name=route_prefix+'has_access')
def has_access(request):
    transaction.commit()
    return request.response
