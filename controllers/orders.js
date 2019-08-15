const Order = require('../models/orders');
const Service = require('../models/services');
const Shedule = require('../models/shedule');
const { to } = require('../utils/help-func');

const { timeTable, orderNumberStart } = require('../config/constants');

const gen = (current, last) => {
	if (!current && !last) return orderNumberStart;

	if (!current && last) return last.orderNumber + 1;

	return current;
};

module.exports = {
	getOrderList: async (req, res) => {
		const [e, orders] = await to(Order.find({}, { __v: 0 }));
		if (e) return res.status(404).send({ message: e.message });

		return res.status(200).send({ orders });
	},
	createOrder: async (req, res) => {
		const {
			time, comment, spec, shedule, doctor, user, orderNumber
		} = req.body;

		try {
			const service = await Service.findById({ _id: spec });

			const i = timeTable.findIndex(el => el === time);
			if (i === -1) throw new Error('Incorrect time field');

			const lastI = timeTable[i + service.duration - 1];
			if (!lastI) throw new Error('Not Work Time');

			const currentShedule = await Shedule.findById({ _id: shedule });
			if (!currentShedule) throw new Error('Not Found Shedule');

			if (currentShedule[time] === false) throw new Error('Time not free');

			const workTime = timeTable.slice(i, i + service.duration);
			workTime.forEach((el) => {
				currentShedule[el] = false;
			});
			await currentShedule.save();

			const lastOrderNumber = await Order.findOne().sort({ orderNumber: -1 });
			const order = await new Order({
				doctor,
				time,
				comment,
				spec,
				date: currentShedule.data,
				shedule,
				user,
				orderNumber: gen(orderNumber, lastOrderNumber)
			}).save();

			return res.status(200).send({ order });
		}
		catch (error) {
			return res.status(404).send({ message: error.message });
		}
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
