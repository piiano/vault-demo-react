from django.db import models

class User(models.Model):
    name = models.CharField(max_length=250)
    email = models.EmailField()
    role = models.CharField(max_length=10)
    avatar = models.URLField()


class Customer(models.Model):
    name = models.CharField(max_length=250)
    email = models.EmailField()
    ssn = models.CharField(max_length=250)
    owner = models.ForeignKey(User, on_delete=models.CASCADE,)

    def __str__(self):
        return self.name
