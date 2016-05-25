def add_cors_headers_response_callback(event):
    def cors_headers(request, response):
        response.headers.update({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST,GET,DELETE,PUT,OPTIONS',
        'Access-Control-Allow-Headers': 'Origin, Content-Type, Accept, Authorization',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Max-Age': '1728000',
        })
    event.request.add_response_callback(cors_headers)


### test if the match url is integer
def integers(*segment_names):
    def predicate(info, request):
        match = info['match']
        for segment_name in segment_names:
            try:
                #print (segment_names)
                match[segment_name] = int(match[segment_name])
                if int(match[segment_name]) == 0 :
                    print(' ****** ACTIONS FORMS ******')
                    return False
            except (TypeError, ValueError):
                return False
        return True
    return predicate

def add_routes(config):
    ##### Security routes #####
    config.add_route('security/login', 'portal-core/security/login')
    config.add_route('security/logout', 'portal-core/security/logout')
    config.add_route('security/has_access', 'portal-core/security/has_access')

    ##### User #####
    config.add_route('core/user', 'portal-core/user')
    config.add_route('core/currentUser', 'portal-core/currentUser')


    ##### Site #####
    config.add_route('core/site', 'portal-core/site')
    config.add_route('core/instance', 'portal-core/instance')

    ### Account ##### 
    config.add_route('core/account', 'portal-core/account')
    config.add_route('core/account/activation', 'portal-core/account/{id}/activation')
    config.add_route('core/account/newpassword', 'portal-core/account/newpassword')
    config.add_route('core/account/updatepassword', 'portal-core/account/updatepassword')
    # config.add_route('core/user', 'portal-core/user/')







