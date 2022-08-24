import app from './app';

// settings
app.set('port', process.env.PORT || 5000);
app.set('json spaces', 2);

// starting the server
app.listen(app.get('port'), () => {
    console.log(`server on port ${app.get('port')}`);
})