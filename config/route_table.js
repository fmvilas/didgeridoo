module.exports = {
    ide: '/',
    user: {
    	login: '/login',
    	logout: '/logout',
    	show: '/u/:id'
    },
    project: {
    	info: '/p/:id',
        files: '/p/:id/f',
        file: '/p/:id/f/*'
    }
};