module.exports = {
	port: process.env.PORT || 4001,
	DB:'mongodb://dongbk:dongbk1998@ds131676.mlab.com:31676/jsonwebtoken',
	secret: 'supersecret',
	localDB:'mongodb://localhost:27017/config',
	saltRounds :10,
    regex:/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])([a-zA-Z0-9]{8,12})$/

}