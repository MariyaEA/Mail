#! /usr/bin/env python
# -*- coding: utf-8 -*-
"""This file contains all the relevant models used in views.py"""


from django.contrib.auth.models import AbstractUser
from django.db import models

# User Class
class User(AbstractUser):
    """Abstract user model to be used for the different user accounts."""
    pass

# Email Class
class Email(models.Model):
    """Contains the different elements involved in the email."""
    user = models.ForeignKey("User",
                             on_delete=models.CASCADE,
                             related_name="emails")
    sender = models.ForeignKey("User",
                               on_delete=models.PROTECT,
                               related_name="emails_sent")
    recipients = models.ManyToManyField("User",
                                        related_name="emails_received")
    subject = models.CharField(max_length=255)
    body = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    read = models.BooleanField(default=False)
    archived = models.BooleanField(default=False)

    def serialize(self):
        return {
            "id": self.id,
            "sender": self.sender.email,
            "recipients": [user.email for user in self.recipients.all()],
            "subject": self.subject,
            "body": self.body,
            "timestamp": self.timestamp.strftime("%b %#d %Y, %#I:%M %p"),
            "read": self.read,
            "archived": self.archived
        }
