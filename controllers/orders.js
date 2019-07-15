const Order = require('../models/orders');
const Service = require('../models/services');
const Shedule = require('../models/shedule');
const { to } = require('../utils/help-func');

const { timeTable } = require('../config/constants');

module.exports = {
	createOrder: async (req, res) => {
		const {
			doctor, time, comment, date, spec
		} = req.body;

		const [e, service] = await to(Service.findById({ _id: spec }));
		if (e) return res.status(404).send({ message: e.message });

		const i = timeTable.findIndex(el => el === time);
		if (i === -1) return res.status(404).send({ message: 'Incorrect time field' });

		const lastI = timeTable[i + service.duration - 1];
		if (!lastI) return res.status(404).send({ message: 'Not Work Time' });

		const [err, shedule] = await to(Shedule.findOne({ doctor, data: date }));
		if (err) return res.status(404).send({ message: err.message });
		if (!shedule) return res.status(404).send({ message: 'Not Found Shedule' });

		if (shedule[time] === false) return res.status(404).send({ message: 'Time not free' });

		const workTime = timeTable.slice(i, i + service.duration);

		workTime.forEach((el) => {
			shedule[el] = false;
		});

		await shedule.save();

		const order = await new Order({
			doctor, time, comment, date, spec
		}).save();

		return res.status(200).send({ order });
	}
};
