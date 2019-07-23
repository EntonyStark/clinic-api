const Order = require('../models/orders');
const Service = require('../models/services');
const Shedule = require('../models/shedule');
const { to } = require('../utils/help-func');

const { timeTable } = require('../config/constants');

module.exports = {
	getOrderList: async (req, res) => {
		const [e, orders] = await to(Order.find({}, { __v: 0 }));
		if (e) return res.status(404).send({ message: e.message });

		return res.status(200).send({ orders });
	},
	createOrder: async (req, res) => {
		const {
			time, comment, spec, shedule, doctor, user
		} = req.body;

		const [e, service] = await to(Service.findById({ _id: spec }));
		if (e) return res.status(404).send({ message: e.message });

		const i = timeTable.findIndex(el => el === time);
		if (i === -1) return res.status(404).send({ message: 'Incorrect time field' });

		const lastI = timeTable[i + service.duration - 1];
		if (!lastI) return res.status(404).send({ message: 'Not Work Time' });

		const [err, currentShedule] = await to(Shedule.findById({ _id: shedule }));
		if (err) return res.status(404).send({ message: err.message });
		if (!currentShedule) return res.status(404).send({ message: 'Not Found Shedule' });

		if (currentShedule[time] === false) return res.status(404).send({ message: 'Time not free' });

		const workTime = timeTable.slice(i, i + service.duration);

		workTime.forEach((el) => {
			currentShedule[el] = false;
		});

		await currentShedule.save();
		const [error, order] = await to(new Order({
			doctor, time, comment, spec, date: currentShedule.data, shedule, user
		}).save());
		if (error) return res.status(404).send({ message: error.message });

		return res.status(200).send({ order });
	},
	updateOrder: async (req, res) => {
		const { comment } = req.body;
		const [e, order] = await to(Order.findById({ _id: req.params.id }));
		if (e) return res.status(404).send({ message: e.message });
		if (!order) return res.status(404).send({ message: 'Order not found' });

		if (comment) order.comment = comment;

		const [error, updatedOrder] = await to(order.save());
		if (error) return res.status(404).send({ message: error.message });

		return res.status(200).send({ order: updatedOrder });
	},
	removeOrder: async (req, res) => {
		const [err, order] = await to(Order.findOneAndRemove(
			{ _id: req.params.id },
			{ useFindAndModify: false }
		));
		if (err) return res.status(400).send({ message: err.message });
		if (!order) return res.status(404).send({ message: 'Order not found' });

		const shedule = await Shedule.findById({ _id: order.shedule });
		const service = await Service.findById({ _id: order.spec });

		const i = timeTable.findIndex(el => el === order.time);
		const workTime = timeTable.slice(i, i + service.duration);
		workTime.forEach((el) => {
			shedule[el] = true;
		});

		await shedule.save();

		return res.status(200).send({ message: 'Order successfully removed' });
	}
};
