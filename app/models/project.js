var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var ProjectSchema = new Schema({
	owner: { type: String, required: true },
	lastModificationDate: { type: Number, default: null },
	team: { type: Array, default: [] },
	repoURL: { type: String, default: null }
});

module.exports = mongoose.model('Project', ProjectSchema);