# Mailing Service Project
## What it is:
This project is intended to showcase my ability to use my programming skills by creating a replica of a mailing service website. The project contains the following elements:
-  A single-page email service website using APIs, Python (Django), HTML Javascript, AJAX, CSS.
-  Contains typical features of an email service website, such as the inbox, compose, sent, archive, login/logout and options to delete and reply.
-  Bootstrap and CSS styling elements.

**Demonstration Link:** https://www.youtube.com/watch?v=TAbmJJjO-Gc

##  The Requirements that Were Fulfilled:
1.  **Send Mail:** 
    * When a user submits the email composition form, add JavaScript code to actually send the email.
    * POST requests must be made to /emails, passing in values for recipients, subject, and body.
    * Once the email has been sent, load the user’s sent mailbox.

2.  **Mailbox:**
    * When a user visits their Inbox, Sent mailbox, or Archive, load the appropriate mailbox.
    * GET requests must be made to /emails/<mailbox> to request the emails for a particular mailbox.
    * When a mailbox is visited, the application should first query the API for the latest emails in that mailbox.
    * When a mailbox is visited, the name of the mailbox should appear at the top of the page.
    * Each email should be rendered in its own box (e.g. as a <div> with a border) and displays who the email is from, what the subject line is, and the timestamp of the email.
    * If the email is unread, it should appear with a white background. 
    * If the email has been read, it should appear with a gray background.

3.  **View Email:**
    * When a user clicks on an email, the user should be taken to a view where they see the content of that email.
    * GET requests must be made to /emails/<email_id> to request the email.
    * Your application should show the email’s sender, recipients, subject, timestamp, and body.
    * You’ll likely want to add an additional div to inbox.html (in addition to emails-view and compose-view) for displaying the email. 
    * Once the email has been clicked on, you should mark the email as read. 
    * Archive and Unarchive: Allow users to archive and unarchive emails that they have received.
    * When viewing an Inbox email, the user should be presented with a button that lets them archive the email.
    * When viewing an Archive email, the user should be presented with a button that lets them unarchive the email. This requirement does not apply to emails in the Sent mailbox.
    * Once an email has been archived or unarchived, load the user’s inbox.

4.  **Reply:**
    * Allow users to reply to an email.
    * When viewing an email, the user should be presented with a “Reply” button that lets them reply to the email.
    * When the user clicks the “Reply” button, they should be taken to the email composition form.
    * Pre-fill the composition form with the recipient field set to whoever sent the original email.
    * Pre-fill the subject line. If the original email had a subject line of foo, the new subject line should be Re: foo. (If the subject line already begins with Re: , no need to add it again.)
    * Pre-fill the body of the email with a line like "On Jan 1 2020, 12:00 AM foo@example.com wrote:" followed by the original text of the email.
