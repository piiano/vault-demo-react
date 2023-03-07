from django.db import models

class Customer(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    ssn = models.CharField(max_length=11)

    def __str__(self):
        return self.name
