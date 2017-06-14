from pyramid.security import NO_PERMISSION_REQUIRED
from pyramid.view import view_config
from sqlalchemy import select,func
from sqlalchemy import update
from ..Models import DBSession, User,dbConfig, Authorisation, UserDepartement
from email.mime.text import MIMEText
from email import message
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import smtplib
from email.header import Header
from email.utils import formataddr
import transaction
from datetime import datetime
from datetime import date
import time
import datetime
import hashlib
from sqlalchemy import text,bindparam,and_
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String
from sqlalchemy import create_engine
import json

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

    

    return [dict(row) for row in DBSession.execute(query).fetchall()]
    
@view_config(
    route_name='core/currentUser',
    renderer='json'
)
def current_user(request):
    """Return the list of all the users with their ids.
    """
    print(request.authenticated_userid)
    query = select([
        User.id.label('PK_id'),
        User.Login.label('fullname'),
        User.Firstname.label('firstname'),
        User.Lastname.label('lastname')
    ]).where(User.id == request.authenticated_userid['iss'])
    return dict(DBSession.execute(query).fetchone())


@view_config(route_name='core/account',renderer='json', request_method='GET', permission= NO_PERMISSION_REQUIRED)
def createAccount(request):
    data = request.params.mixed()
    print('******************data*****************')
    #print(data)
    # check if user exists
    email = data['mail']
    query = select([User.id]).where(User.Login==email)
    user = DBSession.execute(query).fetchone()

    if (user is None):    
        newUser = User(
            Lastname = data['name'],
            Firstname = data['firstName'],
            CreationDate = func.now(),
            Login = data['mail'],
            Password = data['password'],
            #Language = 'fr',
            Language = data['language'],
            ModificationDate = func.now(),
            HasAccess = 0,
            Photos = None,
            IsObserver = 0,
            Organisation = data['organisation'],
            Updatenews = data['updatenews'],
            Teamnews = data['teamnews']
            )
        DBSession.add(newUser)
        DBSession.flush()

        to_add = []
        #instance_IDs = [45,46,47]
        instance_IDs = [45,50,53,55]

        for id_inst in instance_IDs:
            curAuthorisation = Authorisation(FK_User = newUser.id,Instance = id_inst, Role = 3) 
            to_add.append(curAuthorisation)

        #to_add.append(UserDepartement(FK_User = newUser.id,Fk_Departement = 47))

        DBSession.add_all(to_add)
        sendMail(newUser.Login,newUser.id)

        return 'success'

    else: 
        return  'exists'    


def sendMail (email_adress,id_) :
        smtpServer = smtplib.SMTP('smtp.gmail.com',587)
        smtpServer.ehlo()
        smtpServer.starttls()
        smtpServer.login(dbConfig['mail'],dbConfig['pwd'])
        recipients = email_adress

        emailadr = 'http://demo.ecoreleve.com/login/#activation/'+str(id_)
        print('***********************')
        print(emailadr)
        page =''
        content =''

        with open('confirm_v3.html', "r") as f:
            content = f.read().replace("@emailadress",emailadr)

        with open('email_inscription_v3.html', "r") as f:
            page = f.read().replace("@content",content).replace("@currentyear", str(date.today().year))
        
        
        #page.replace("@emailadress",emailadr)
        #page.replace("@currentyear", str(date.today().year))
        # body = ''' Welcome on ecoReleve !\n
        # Please visit this link to activate your account: \n
        # http://92.222.217.165/nslocalportal/#activation/{0}

        # You can also contact us:
        # http://www.natural-solutions.eu/contacts/

        # Regards,


        # ecoReleve Team'''.format(id_)
        text =MIMEText(page,'html')

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


@view_config(route_name='core/account/newpassword',renderer='json', request_method='POST', permission= NO_PERMISSION_REQUIRED)
def getUser(request):
    userLogin = request.POST.get('mail', '')
    query = select([User.id]).where(User.Login==userLogin)
    user = DBSession.execute(query).fetchone()
    userId = user[0]
    sendResetMail(userLogin,userId)

def sendResetMail (email_adress,id_) :
        smtpServer = smtplib.SMTP('smtp.gmail.com',587)
        smtpServer.ehlo()
        smtpServer.starttls()
        smtpServer.login(dbConfig['mail'],dbConfig['pwd'])
        recipients = email_adress
        dt = datetime.datetime.now()
        datenow = int(time.mktime(dt.timetuple()))
        # encrypt 'timestamp_id'
        ids = str(datenow) + '_' + str(id_)
        ids2 = ids.encode("utf8")
        ids3 = hashlib.sha1(ids2).hexdigest()
        #save timestamp & code security    
        try:
            curUser = DBSession.query(User).get(id_)
            curUser.Updatepasswdtime = datenow
            curUser.Updatepasswdsecucode = ids3
            transaction.commit() 
            value = "ok" 
        except AttributeError:
            value = "non exists"
        except:
            value =  "Unknow error"      
          
        # generate email             
        #body = ''' Welcome on ecoReleve !\n
        #<br><br>You told us you forgot your password. If you really did, click here to choose a new one : \n
        #<br><br><a href=http://92.222.217.165/nslocalportal/#newpassword/{0}><button>Choose a new password </button></a>
        #<br><br>

        #Regards,

        #ecoReleve Team'''.format(ids3)
        #text =MIMEText(body)
        #html = '<html> <head></head><body>' + body + '</body></html>'    


        emailadr = 'http://demo.ecoreleve.com/login/#newpassword/'+str(ids3)    
        page =''
        content =''

        with open('password_v3.html', "r") as f:
            content = f.read().replace("@emailadress",emailadr)

        with open('email_inscription_v3.html', "r") as f:
            page = f.read().replace("@content",content).replace("@currentyear", str(date.today().year))    


        text =MIMEText(page,'html')
        outer = MIMEMultipart()
        outer['Subject'] =  'Reset password ecoReleve'
        outer.attach(text)
        msg = outer.as_string()
        smtpServer.sendmail(dbConfig['mail'],recipients,msg)

@view_config(route_name='core/account/updatepassword',renderer='json', request_method='POST', permission= NO_PERMISSION_REQUIRED)
def updatePassword(request):
    
    value = '0'

    try:
        userSecurityCode = request.POST.get('id', '')
        newPassword = request.POST.get('password', '')
        query = select([User.id]).where(User.Updatepasswdsecucode==userSecurityCode)
        user = DBSession.execute(query).fetchone()
        userId = user[0]   

        curUser = DBSession.query(User).get(userId)
        usertimestamp = curUser.Updatepasswdtime
        # get current date in timestam and check if user query date > current date -1 day
        datenow = datetime.datetime.now()
        datenowtimestamp = int(time.mktime(datenow.timetuple()))
        if(usertimestamp > (datenowtimestamp - 86400 )):
                curUser.Password = newPassword
                transaction.commit() 
                value ="ok" 
                print('************ change pass ok************')
        else:
                value="timout"             
    except AttributeError:
        value = "non exists"
    except:
        value =  "Unknow error" 

    return value        

