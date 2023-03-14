To run the python-django server
```
cd python-django
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py loaddata init.json
python manage.py runserver
```