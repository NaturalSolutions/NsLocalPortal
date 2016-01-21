from pyramid.security import NO_PERMISSION_REQUIRED
from pyramid.view import view_config
from sqlalchemy import select
from ..Models import DBSession, User
from email.mime.text import MIMEText
from email import message
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import smtplib
from email.header import Header
from email.utils import formataddr


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
        User.Login.label('fullname')
    ]).where(User.id == request.authenticated_userid)
    return dict(DBSession.execute(query).fetchone())


@view_config(route_name='core/account',renderer='json', request_method='GET', permission= NO_PERMISSION_REQUIRED)
def createAccount(request):
    # data = request.params

    # newUser = User(
    #     Lastname = 
    #     Firstname = 
    #     CreationDate = 
    #     Login = 
    #     Password = 
    #     Language = 
    #     ModificationDate = 
    #     HasAccess = 
    #     Photos = 
    #     IsObserver = 
    #     )

    # DBSession.add(newUser)

    # DBSession.flush()

    sendMail('romain_fabbro@natural-solutions.eu',1)



def sendMail (email_adress,id_) :
        smtpServer = smtplib.SMTP('smtp.gmail.com',587)
        smtpServer.ehlo()
        smtpServer.starttls()
        print('try to login')
        smtpServer.login('romain_fabbro@natural-solutions.eu','coco&&1802')
        recipients = email_adress
        
        body = ''' Welcome on ecoReleve !\n
        Please visit this link to activate your account: \n
        http://92.222.217.165/ecoReleve/#account/{0}/activation
        
        \n\n

        Regards,

        ecoReleve team
        '''.format(id_)
        text =MIMEText(body)

        outer = MIMEMultipart()
        outer['Subject'] =  'Activation ecoReleve'
        outer.attach(text)
        msg = outer.as_string()
        smtpServer.sendmail('romain_fabbro@natural-solutions.eu',recipients,msg)
