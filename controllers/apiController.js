const Item = require('../models/Item')
const Treasure = require('../models/Activity')
const Traveler = require('../models/Booking')
const Category = require('../models/Category')
const Bank = require('../models/Bank')
const Member = require('../models/Member')
const Booking = require('../models/Booking')

module.exports = {
  landingPage: async (req, res) => {
    try {
      const travelers = await Traveler.find()
      const treasures = await Treasure.find()
      const cities = await Item.find()

      const mostPicked = await Item.find()
        .select('_id title price city country imageId unit')
        .limit(5)
        .populate({ path: 'imageId', select: '_id imageUrl' })

      const categories = await Category.find()
        .select('_id name')
        .limit(3)
        .populate({
          path: 'itemId',
          select: '_id sumBooking title isPopular city country imageId',
          perDocumentLimit: 4,
          options: { sort: { sumBooking: -1 } },
          populate: {
            path: 'imageId',
            select: 'imageUrl',
            perDocumentLimit: 1,
          },
        })

      for (let i = 0; i < categories.length; i++) {
        for (let x = 0; x < categories[i].itemId.length; x++) {
          const item = await Item.findOne({ _id: categories[i].itemId[x]._id })
          item.isPopular = false
          await item.save()
          if (categories[i].itemId[0] === categories[i].itemId[x]) {
            categories[i].itemId[0].isPopular = true
            await item.save()
          }
        }
      }

      const testimonial = {
        _id: 'asd1293uasdads1',
        imageUrl: '/images/testimonial-landingpages.jpg',
        name: 'Happy Family',
        rate: 4.55,
        content:
          'What a great trip with my family and I should try again next time soon ...',
        familyName: 'Angga',
        familyOccupation: 'Product Designer',
      }

      res.status(200).json({
        hero: {
          travelers: travelers.length,
          treasures: treasures.length,
          cities: cities.length,
        },
        mostPicked,
        categories,
        testimonial,
      })
    } catch (error) {
      res.status(500).json({
        message: 'Internal server error',
      })
    }
  },

  detailPage: async (req, res) => {
    const { id } = req.params
    try {
      const item = await Item.findOne({ _id: id })
        .populate({ path: 'imageId', select: '_id imageUrl' })
        .populate({ path: 'featureId', select: '_id name qty imageUrl' })
        .populate({ path: 'activityId', select: '_id name type imageUrl' })

      const bank = await Bank.find()

      const testimonial = {
        _id: 'asd1293uasdads1',
        imageUrl: '/images/testimonial-detailspage.jpg',
        name: 'Happy Family',
        rate: 4.55,
        content:
          'What a great trip with my family and I should try again next time soon ...',
        familyName: 'Angga',
        familyOccupation: 'Product Designer',
      }

      res.status(200).json({
        ...item._doc,
        bank,
        testimonial,
      })
    } catch (error) {
      res.status(500).json({
        message: 'Internal server error',
      })
    }
  },

  bookingPage: async (req, res) => {
    try {
      const {
        itemId,
        duration,
        bookingStartDate,
        bookingEndDate,
        firstName,
        lastName,
        email,
        phoneNumber,
        accountHolder,
        bankFrom,
      } = req.body

      if (!req.file) {
        res.status(404).json({
          message: 'Image Not Found',
        })
      }

      if (
        !duration ||
        !bookingStartDate ||
        !bookingEndDate ||
        !firstName ||
        !lastName ||
        !email ||
        !phoneNumber ||
        !accountHolder ||
        !bankFrom
      ) {
        res.status(404).json({
          message: 'Please input all field!',
        })
      }

      const item = await Item.findOne({ _id: itemId })

      if (!item) {
        res.status(404).json({
          message: 'Item not Found',
        })
      }

      item.sumBooking += 1

      await item.save()

      let total = item.price * duration
      let tax = total * 0.1

      const invoice = Math.floor(1000000 + Math.random() * 9000000)

      const member = await Member.create({
        firstName,
        lastName,
        email,
        phoneNumber,
      })

      const newBooking = {
        invoice,
        bookingStartDate,
        bookingEndDate,
        total: (total += tax),
        itemId: {
          _id: item.id,
          title: item.title,
          price: item.price,
          duration,
        },
        memberId: member.id,
        payments: {
          proofPayment: `images/${req.file.filename}`,
          bankFrom,
          accountHolder,
        },
      }

      const booking = await Booking.create(newBooking)

      res.status(201).json({
        message: 'Booking Success',
        booking,
      })
    } catch (error) {
      res.status(500).json({
        message: error.message,
      })
    }
  },
}
