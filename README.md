
#### Summary: We need to do a straightforward tool for managing med patients' results from some interventions. 
####=> Authentication + authorization + file management + small number of web pages with slim UI
In its very basic form a patient(or an auditor) might login/submit in the tool and then query a result from some interventions:
log in page => result page. 
Designs of those pages will be provided, referring some pages elsewhere. 
Result page would present a few(small number) of fields around the patient data like email and address and a pdf document from the clinic interventions.
Authorization => There will be also super users(admins), who will enter the data(manually)
Number of records on the database are expected to be small, not exceeding 500-1000 records probably.
Users of the tool at this time might be auditors and admins, updating the records if/when needed.

To Clarify: 
=> reference UI pages
=> do users/admins/auditors create the accounts themselves



## Breakdown of the pages:
- sing in
- create account page
- results page
- admin page for entering data
- admin page for querying/updating data
- admin page for listing/managing access to other users - promoting other users to superusers

## Breakdown of roles:
- users - can see only records matching their user/email
- auditor - can see all records.
- admins - can see all records, all users, add/remove admin access, add/remove auditor access, add/update/remove users and users' data

## Tech stack and thoughts:
Will use Mongo DB, ExpressJS, NodeJS with SSR for creating the app
PDF files better not be hosted in the DB but rather on the filesystem of the hosting provider
When considering a hosting provider we should account for a place to store like 500-1000 pdf files, file size is not known.
Plan to use Mongo DB Atlas cloud storage for the DB hosting
Hosting of the Node app on Heroku + file storage on AWS. *hosting env of the Node app will prob be provided by the client.

