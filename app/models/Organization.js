define(['mongoose'],
function (mongoose) {

	var OrganizationSchema = new mongoose.Schema({
		id: { type: String, unique: true },
		name: { type: String, default: '' },
		email: { type: String, default: '' },

		timestamp: { type : Date, default: Date.now },
		last_active: { type : Date, default: Date.now }
	}, { strict: false });




	OrganizationSchema.methods = {
		view: function () {},
		list: function () {},
		update: function () {},
		add: function () {},
		remove: function () {}
	};

	OrganizationSchema.statics = {

	};

	OrganizationSchema.pre('save', function (next) {

		next();
	});



	mongoose.model('Organization', OrganizationSchema);
});
