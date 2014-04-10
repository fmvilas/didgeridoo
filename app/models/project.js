var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var ProjectSchema = new Schema({
	name: { type: String, required: true },
	owner: { type: String, required: true },
	lastModificationDate: { type: Number, default: null },
	team: { type: Array, default: [] },
	repoURL: { type: String, default: null }
});

module.exports = mongoose.model('Project', ProjectSchema);