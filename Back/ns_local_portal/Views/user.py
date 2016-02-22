from pyramid.security import NO_PERMISSION_REQUIRED
from pyramid.view import view_config
from sqlalchemy import select,func
from ..Models import DBSession, User,dbConfig, Authorisation, UserDepartement
from email.mime.text import MIMEText
from email import message
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import smtplib
from email.header import Header
from email.utils import formataddr
import transaction

@view_config(
    route_name='core/user',
    permission=NO_PERMISSION_REQUIRED,
    renderer='json'
)
def users(request):
    """Return the list of all the users with their ids.
    """
    query = select([
        User.id.label('PK_id'),
        User.Login.label('fullname')
    ]).where(User.HasAccess == True).order_by(User.Lastname, User.Firstname)
    print(request)

    

    return [dict(row) for row in DBSession.execute(query).fetchall()]
    
@view_config(
    route_name='core/currentUser',
    renderer='json'
)
def current_user(request):
    """Return the list of all the users with their ids.
    """
    query = select([
        User.id.label('PK_id'),
        User.Login.label('fullname'),
        User.Firstname.label('firstname'),
        User.Lastname.label('lastname')
    ]).where(User.id == request.authenticated_userid)
    return dict(DBSession.execute(query).fetchone())


@view_config(route_name='core/account',renderer='json', request_method='GET', permission= NO_PERMISSION_REQUIRED)
def createAccount(request):
    data = request.params.mixed()
    print(data)
    newUser = User(
        Lastname = data['name'],
        Firstname = data['firstName'],
        CreationDate = func.now(),
        Login = data['mail'],
        Password = data['password'],
        Language = 'fr',
        ModificationDate = func.now(),
        HasAccess = 0,
        Photos = None,
        IsObserver = 0,
        Organisation = data['organisation']
        )
    DBSession.add(newUser)
    DBSession.flush()

    to_add = []
    instance_IDs = [45,46,47]

    for id_inst in instance_IDs:
        curAuthorisation = Authorisation(FK_User = newUser.id,Instance = id_inst, Role = 3) 
        to_add.append(curAuthorisation)

    to_add.append(UserDepartement(FK_User = newUser.id,Fk_Departement = 47))

    DBSession.add_all(to_add)
    sendMail(newUser.Login,newUser.id)
    return 'success'

def sendMail (email_adress,id_) :
        smtpServer = smtplib.SMTP('smtp.gmail.com',587)
        smtpServer.ehlo()
        smtpServer.starttls()
        smtpServer.login(dbConfig['mail'],dbConfig['pwd'])
        recipients = email_adress

        body = ''' Welcome on ecoReleve !\n
        Please visit this link to activate your account: \n
        http://92.222.217.165/nslocalportal/#activation/{0}

        You can also contact us:
        http://www.natural-solutions.eu/contacts/

        Regards,


        ecoReleve Team'''.format(id_)
        text =MIMEText(body)

        outer = MIMEMultipart()
        outer['Subject'] =  'Activation ecoReleve'
        outer.attach(text)
        msg = outer.as_string()
        smtpServer.sendmail(dbConfig['mail'],recipients,msg)

@view_config(route_name='core/account/activation',renderer='json', request_method='GET', permission= NO_PERMISSION_REQUIRED)
def activateAccount(request):
    user_id = request.matchdict['id']
    curUser = DBSession.query(User).get(user_id)
    curUser.HasAccess = 1
    transaction.commit()
    return 'success'