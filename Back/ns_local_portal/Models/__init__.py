from zope.sqlalchemy import ZopeTransactionExtension
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import scoped_session, sessionmaker
import configparser


AppConfig = configparser.ConfigParser()
AppConfig.read('././development.ini')
### Create a database session : one for the whole application
DBSession = scoped_session(sessionmaker(extension=ZopeTransactionExtension()))
Base = declarative_base()
dbConfig = {
    'dialect': 'mssql',
    'sensor_schema': 'ecoReleve_Sensor.dbo'
}


from .User import User
from .Site import Site
from .Authorisation import Authorisation
from .UseDepartement import UserDepartement
