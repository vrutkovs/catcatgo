import os
import sys

from flask import Flask
from flask_restful import Resource, Api
from flask_restful.utils import cors

from db import Mongo

app = Flask(__name__)
api = Api(app)
api.decorators = [cors.crossdomain(
    origin="*", headers=['accept', 'Content-Type'],
    methods=['HEAD', 'OPTIONS', 'GET', 'PUT', 'POST', 'DELETE'])]

class CatCatGoBackend(Resource):

    def __init__(self):
        if 'DATABASE_SERVICE_HOST' in os.environ:
            self.db = Mongo(os.getenv('MONGODB_USER'), \
                os.getenv('MONGODB_PASSWORD'), \
                os.getenv('DATABASE_SERVICE_HOST'), \
                os.getenv('DATABASE_SERVICE_PORT'),
                os.getenv('MONGODB_DATABASE'))
        else:
            self.db = Mongo('user', 'password', 'localhost', '27017', 'catcatgo_db')

    def get(self, tag):
        items = []
        try:
            for obj in self.db.get(tag):
                items.append({'id': str(obj['_id']), 'url': obj['url'], 'title': obj['title']})
        except Exception as e:
            print(e, file=sys.stderr)
        return items


api.add_resource(CatCatGoBackend, '/api/v1.0/search/<string:tag>')

if __name__ == '__main__':
    app.run(debug=os.getenv('CATCATGO_DEBUG')=='True')
