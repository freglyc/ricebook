# ricebook

A simple social media web application. Users may create posts, follow others, and update personal information. 

View a live development version [here](https://www.cfregly.com/ricebook).

### Technical Information
#### Frontend
Written in React and deployed through github pages.

```$xslt
cd frontend
npm run deploy
```
#### Backend
Server written in Express and deployed on Heroku. Utilized Redis for session storage and MongoDB for information storage. 
```$xslt
cd backend
git push heroku master
```