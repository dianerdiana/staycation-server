const Category = require('../models/Category')
const Bank = require('../models/Bank')
const Item = require('../models/Item')
const Image = require('../models/Image')
const Feature = require('../models/Feature')
const Activity = require('../models/Activity')
const Users = require('../models/Users')
const Booking = require('../models/Booking')
const Member = require('../models/Member')
const fs = require('fs-extra')
const path = require('path')
const bcrypt = require('bcryptjs')

module.exports = {
  viewSignin: async (req, res) => {
    try {
      const alertMessage = req.flash('alertMessage')
      const alertStatus = req.flash('alertStatus')
      const alert = { message: alertMessage, status: alertStatus }
      if (req.session.user == null || req.session.user == undefined) {
        req.flash('alertMessage', 'Please Login!')
        res.render('index', {
          alert,
          title: 'Staycation | Login',
        })
      } else {
        res.redirect('/admin/dashboard')
      }
    } catch (error) {
      res.redirect('/admin/signin')
    }
  },

  actionSignin: async (req, res) => {
    try {
      const { username, password } = req.body
      const user = await Users.findOne({ username })

      if (!user) {
        req.flash('alertMessage', 'User is not found')
        req.flash('alertStatus', 'danger')
        res.redirect('/admin/signin')
      }

      const isPasswordMatch = await bcrypt.compare(password, user.password)

      if (!isPasswordMatch) {
        req.flash('alertMessage', 'Username and password not match')
        req.flash('alertStatus', 'danger')
        res.redirect('/admin/signin')
      }

      req.session.user = {
        id: user.id,
        username: user.username,
      }

      res.redirect('/admin/dashboard')
    } catch (error) {
      req.flash('alertMessage', 'Username and password not match')
      req.flash('alertStatus', 'danger')
      res.redirect('/admin/signin')
    }
  },

  actionLogout: (req, res) => {
    req.session.destroy()
    res.redirect('/admin/logout')
  },

  viewDashboard: async (req, res) => {
    try {
      const member = await Member.find()
      const booking = await Booking.find()
      const item = await Item.find()
      res.render('admin/dashboard/view_dashboard', {
        title: 'Staycation | Dashboard',
        user: req.session.user,
        member,
        booking,
        item,
      })
    } catch (error) {
      res.redirect('/admin/dashboard')
    }
  },

  viewCategory: async (req, res) => {
    try {
      const category = await Category.find()
      const alertMessage = req.flash('alertMessage')
      const alertStatus = req.flash('alertStatus')
      const alert = { message: alertMessage, status: alertStatus }
      res.render('admin/category/view_category', {
        category,
        alert,
        title: 'Staycation | Category',
        user: req.session.user,
      })
    } catch (error) {
      res.redirect('/admin/category')
    }
  },

  addCategory: async (req, res) => {
    try {
      const { name } = req.body
      await Category.create({ name })
      req.flash('alertMessage', 'Success Add Category')
      req.flash('alertStatus', 'success')
      res.redirect('/admin/category')
    } catch (error) {
      req.flash('alertMessage', `${error.message}`)
      req.flash('alertStatus', 'danger')
      res.redirect('/admin/category')
    }
  },

  editCategory: async (req, res) => {
    try {
      const { id, name } = req.body
      const category = await Category.findOne({ _id: id })
      category.name = name
      await category.save()
      req.flash('alertMessage', 'Success Update Category')
      req.flash('alertStatus', 'success')
      res.redirect('/admin/category')
    } catch (error) {
      req.flash('alertMessage', `${error.message}`)
      req.flash('alertStatus', 'danger')
      res.redirect('/admin/category')
    }
  },

  deleteCategory: async (req, res) => {
    try {
      const { id } = req.params
      const category = await Category.findOne({ _id: id })
      await category.remove()
      req.flash('alertMessage', 'Success Delete Category')
      req.flash('alertStatus', 'success')
      res.redirect('/admin/category')
    } catch (error) {
      req.flash('alertMessage', `${error.message}`)
      req.flash('alertStatus', 'danger')
      res.redirect('/admin/category')
    }
  },

  viewBank: async (req, res) => {
    try {
      const bank = await Bank.find()
      const alertMessage = req.flash('alertMessage')
      const alertStatus = req.flash('alertStatus')
      const alert = { message: alertMessage, status: alertStatus }
      res.render('admin/bank/view_bank', {
        title: 'Staycation | Bank',
        alert,
        bank,
        user: req.session.user,
      })
    } catch (error) {
      res.redirect('/admin/bank')
    }
  },

  addBank: async (req, res) => {
    try {
      const { name, nameBank, nomorRekening } = req.body
      await Bank.create({
        name,
        nameBank,
        nomorRekening,
        imageUrl: `images/${req.file.filename}`,
      })
      req.flash('alertMessage', 'Success Add Bank')
      req.flash('alertStatus', 'success')
      res.redirect('/admin/bank')
    } catch (error) {
      req.flash('alertMessage', `${error.message}`)
      req.flash('alertStatus', 'danger')
      res.redirect('/admin/bank')
    }
  },

  editBank: async (req, res) => {
    try {
      const { id, name, nameBank, nomorRekening } = req.body
      const bank = await Bank.findOne({ _id: id })
      if (req.file === undefined) {
        bank.name = name
        bank.nameBank = nameBank
        bank.nomorRekening = nomorRekening
        bank.save()
        req.flash('alertMessage', 'Success Update Bank')
        req.flash('alertStatus', 'success')
        res.redirect('/admin/bank')
      } else {
        await fs.unlink(path.join(`public/${bank.imageUrl}`))
        bank.name = name
        bank.nameBank = nameBank
        bank.nomorRekening = nomorRekening
        bank.imageUrl = `images/${req.file.filename}`
        bank.save()
        req.flash('alertMessage', 'Success Update Bank')
        req.flash('alertStatus', 'success')
        res.redirect('/admin/bank')
      }
    } catch (error) {
      req.flash('alertMessage', `${error.message}`)
      req.flash('alertStatus', 'danger')
      res.redirect('/admin/bank')
    }
  },

  deleteBank: async (req, res) => {
    try {
      const { id } = req.params
      const bank = await Bank.findOne({ _id: id })
      await fs.unlink(path.join(`public/${bank.imageUrl}`))
      bank.remove()
      req.flash('alertMessage', 'Success Delete Bank')
      req.flash('alertStatus', 'success')
      res.redirect('/admin/bank')
    } catch (error) {
      req.flash('alertMessage', `${error.message}`)
      req.flash('alertStatus', 'danger')
      res.redirect('/admin/bank')
    }
  },

  viewItem: async (req, res) => {
    try {
      const item = await Item.find()
        .populate({ path: 'imageId', select: 'id imageUrl' })
        .populate({ path: 'categoryId', select: 'id name' })

      const category = await Category.find()
      const alertMessage = req.flash('alertMessage')
      const alertStatus = req.flash('alertStatus')
      const alert = { message: alertMessage, status: alertStatus }
      res.render('admin/item/view_item', {
        title: 'Staycation | Item',
        category,
        alert,
        item,
        action: 'view',
        user: req.session.user,
      })
    } catch (error) {
      req.flash('alertMessage', `${error.message}`)
      req.flash('alertStatus', 'danger')
      res.redirect('/admin/item')
    }
  },

  addItem: async (req, res) => {
    try {
      const { title, price, city, categoryId, description } = req.body
      if (req.files.length > 0) {
        const category = await Category.findOne({ _id: categoryId })
        const newItem = {
          title,
          price,
          city,
          description,
          categoryId: category._id,
        }
        const item = await Item.create(newItem)
        category.itemId.push({ _id: item.id })
        await category.save()

        for (let i = 0; i < req.files.length; i++) {
          const imageSave = await Image.create({
            imageUrl: `images/${req.files[i].filename}`,
          })
          item.imageId.push({ _id: imageSave._id })
          await item.save()
        }
      }
      req.flash('alertMessage', 'Success Add Item')
      req.flash('alertStatus', 'success')
      res.redirect('/admin/item')
    } catch (error) {
      req.flash('alertMessage', `${error.message}`)
      req.flash('alertStatus', 'danger')
      res.redirect('/admin/item')
    }
  },

  showImageItem: async (req, res) => {
    try {
      const { id } = req.params
      const item = await Item.findOne({ _id: id }).populate({
        path: 'imageId',
        select: 'id imageUrl',
      })
      const alertMessage = req.flash('alertMessage')
      const alertStatus = req.flash('alertStatus')
      const alert = { message: alertMessage, status: alertStatus }
      res.render('admin/item/view_item', {
        title: 'Staycation | Show Image Item',
        item,
        alert,
        action: 'image item',
        user: req.session.user,
      })
    } catch (error) {
      req.flash('alertMessage', `${error.message}`)
      req.flash('alertStatus', 'danger')
      res.redirect('/admin/item')
    }
  },

  showEditItem: async (req, res) => {
    try {
      const { id } = req.params
      const item = await Item.findOne({ _id: id })
        .populate({ path: 'imageId', select: 'id imageUrl' })
        .populate({ path: 'categoryId', select: 'id name' })
      const category = await Category.find()
      const alertMessage = req.flash('alertMessage')
      const alertStatus = req.flash('alertStatus')
      const alert = { message: alertMessage, status: alertStatus }
      res.render('admin/item/view_item', {
        title: 'Staycation | Edit Item',
        category,
        item,
        alert,
        action: 'edit',
      })
    } catch (error) {
      req.flash('alertMessage', `${error.message}`)
      req.flash('alertStatus', 'danger')
      res.redirect('/admin/item')
    }
  },

  editItem: async (req, res) => {
    try {
      const { id } = req.params
      const { title, price, city, categoryId, description } = req.body
      const item = await Item.findOne({ _id: id })
      if (req.files.length > 0) {
        for (let i = 0; i < item.imageId.length; i++) {
          const imageUpdate = await Image.findOne({ _id: item.imageId[i]._id })
          await fs.unlink(path.join(`public/${imageUpdate.imageUrl}`))
          imageUpdate.imageUrl = `images/${req.files[i].filename}`
          await imageUpdate.save()
        }
        item.title = title
        item.price = price
        item.city = city
        item.categoryId = categoryId
        item.description = description
        await item.save()
        req.flash('alertMessage', 'Success Update Item')
        req.flash('alertStatus', 'success')
        res.redirect('/admin/item')
      } else {
        item.title = title
        item.price = price
        item.city = city
        item.categoryId = categoryId
        item.description = description
        await item.save()
        req.flash('alertMessage', 'Success Update Item')
        req.flash('alertStatus', 'success')
        res.redirect('/admin/item')
      }
    } catch (error) {
      req.flash('alertMessage', `${error.message}`)
      req.flash('alertStatus', 'danger')
      res.redirect('/admin/item')
    }
  },

  deleteItem: async (req, res) => {
    try {
      const { id } = req.params
      const item = await Item.findOne({ _id: id }).populate('imageId')
      console.log(item)
      for (let i = 0; i < item.imageId.length; i++) {
        Image.findOne({ _id: item.imageId[i]._id })
          .then((image) => {
            fs.unlink(path.join(`public/${image.imageUrl}`))
            image.remove()
          })
          .catch((error) => {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/admin/item')
          })
      }

      // if (item.featureId.length > 0) {
      //   for (let i = 0; item.featureId.length; i++) {
      //     const feature = await Feature.findOne({
      //       _id: item.featureId[i]._id,
      //     })
      //     await feature.remove()
      //   }
      // }

      // if (item.activityId.length > 0) {
      //   for (let i = 0; item.activityId.length; i++) {
      //     Activity.findOne({ _id: item.activityId[i]._id })
      //       .then((activity) => {
      //         activity.remove()
      //       })
      //       .catch((error) => {
      //         req.flash('alertMessage', `${error.message}`)
      //         req.flash('alertStatus', 'danger')
      //         res.redirect('/admin/item')
      //       })
      //   }
      // }

      await item.remove()
      req.flash('alertMessage', 'Success Delete Item')
      req.flash('alertStatus', 'success')
      res.redirect('/admin/item')
    } catch (error) {
      req.flash('alertMessage', `${error.message}`)
      req.flash('alertStatus', 'danger')
      res.redirect('/admin/item')
    }
  },

  viewDetailItem: async (req, res) => {
    const { itemId } = req.params
    try {
      const alertMessage = req.flash('alertMessage')
      const alertStatus = req.flash('alertStatus')
      const alert = { message: alertMessage, status: alertStatus }

      const feature = await Feature.find({ itemId })
      const activity = await Activity.find({ itemId })

      res.render('admin/item/detail-item/view_detail_item', {
        title: 'Staycation | Detail Item',
        alert,
        itemId,
        feature,
        activity,
        user: req.session.user,
      })
    } catch (error) {
      req.flash('alertMessage', `${error.message}`)
      req.flash('alertStatus', 'danger')
      res.redirect(`/admin/item/detail-item/${itemId}`)
    }
  },

  addFeature: async (req, res) => {
    const { name, qty, itemId } = req.body
    try {
      if (!req.file) {
        req.flash('alertMessage', "Image don't have empty")
        req.flash('alertStatus', 'danger')
        res.redirect(`/admin/item/detail-item/${itemId}`)
      }

      const feature = await Feature.create({
        name,
        qty,
        itemId,
        imageUrl: `images/${req.file.filename}`,
      })

      const item = await Item.findOne({ _id: itemId })
      item.featureId.push({ _id: feature._id })
      await item.save()

      req.flash('alertMessage', 'Success Add Feature')
      req.flash('alertStatus', 'success')
      res.redirect(`/admin/item/detail-item/${itemId}`)
    } catch (error) {
      req.flash('alertMessage', `${error.message}`)
      req.flash('alertStatus', 'danger')
      res.redirect(`/admin/item/detail-item/${itemId}`)
    }
  },

  editFeature: async (req, res) => {
    const { id, name, qty, itemId } = req.body
    try {
      const feature = await Feature.findOne({ _id: id })
      if (req.file === undefined) {
        feature.name = name
        feature.qty = qty
        feature.save()
        req.flash('alertMessage', 'Success Update Feature')
        req.flash('alertStatus', 'success')
        res.redirect(`/admin/item/detail-item/${itemId}`)
      } else {
        await fs.unlink(path.join(`public/${feature.imageUrl}`))
        feature.name = name
        feature.qty = qty
        feature.imageUrl = `images/${req.file.filename}`
        feature.save()
        req.flash('alertMessage', 'Success Update Feature')
        req.flash('alertStatus', 'success')
        res.redirect(`/admin/item/detail-item/${itemId}`)
      }
    } catch (error) {
      req.flash('alertMessage', `${error.message}`)
      req.flash('alertStatus', 'danger')
      res.redirect(`/admin/item/detail-item/${itemId}`)
    }
  },

  deleteFeature: async (req, res) => {
    const { id, itemId } = req.params
    try {
      const feature = await Feature.findOne({ _id: id })

      const item = await Item.findOne({ _id: itemId })

      for (let i = 0; i < item.featureId.length; i++) {
        if (item.featureId[i]._id.toString() === feature._id.toString()) {
          item.featureId.pull({ _id: feature._id })
          await item.save()
        }
      }
      await fs.unlink(path.join(`public/${feature.imageUrl}`))
      feature.remove()
      req.flash('alertMessage', 'Success Delete Feature')
      req.flash('alertStatus', 'success')
      res.redirect(`/admin/item/detail-item/${itemId}`)
    } catch (error) {
      req.flash('alertMessage', `${error.message}`)
      req.flash('alertStatus', 'danger')
      res.redirect(`/admin/item/detail-item/${itemId}`)
    }
  },

  addActivity: async (req, res) => {
    const { name, type, itemId } = req.body
    try {
      if (!req.file) {
        req.flash('alertMessage', "Image don't have empty")
        req.flash('alertStatus', 'danger')
        res.redirect(`/admin/item/detail-item/${itemId}`)
      }

      const activity = await Activity.create({
        name,
        type,
        itemId,
        imageUrl: `images/${req.file.filename}`,
      })

      const item = await Item.findOne({ _id: itemId })
      item.activityId.push({ _id: activity._id })
      await item.save()

      req.flash('alertMessage', 'Success Add Activity')
      req.flash('alertStatus', 'success')
      res.redirect(`/admin/item/detail-item/${itemId}`)
    } catch (error) {
      req.flash('alertMessage', `${error.message}`)
      req.flash('alertStatus', 'danger')
      res.redirect(`/admin/item/detail-item/${itemId}`)
    }
  },

  editActivity: async (req, res) => {
    const { id, name, type, itemId } = req.body
    try {
      const activity = await Activity.findOne({ _id: id })
      if (req.file === undefined) {
        activity.name = name
        activity.type = type
        activity.save()
        req.flash('alertMessage', 'Success Update Activity')
        req.flash('alertStatus', 'success')
        res.redirect(`/admin/item/detail-item/${itemId}`)
      } else {
        await fs.unlink(path.join(`public/${activity.imageUrl}`))
        activity.name = name
        activity.type = type
        activity.imageUrl = `images/${req.file.filename}`
        activity.save()
        req.flash('alertMessage', 'Success Update Activity')
        req.flash('alertStatus', 'success')
        res.redirect(`/admin/item/detail-item/${itemId}`)
      }
    } catch (error) {
      req.flash('alertMessage', `${error.message}`)
      req.flash('alertStatus', 'danger')
      res.redirect(`/admin/item/detail-item/${itemId}`)
    }
  },

  deleteActivity: async (req, res) => {
    const { id, itemId } = req.params
    try {
      const activity = await Activity.findOne({ _id: id })

      const item = await Item.findOne({ _id: itemId })

      for (let i = 0; i < item.activityId.length; i++) {
        if (item.activityId[i]._id.toString() === activity._id.toString()) {
          item.activityId.pull({ _id: activity._id })
          await item.save()
        }
      }
      await fs.unlink(path.join(`public/${activity.imageUrl}`))
      activity.remove()
      req.flash('alertMessage', 'Success Delete Activity')
      req.flash('alertStatus', 'success')
      res.redirect(`/admin/item/detail-item/${itemId}`)
    } catch (error) {
      req.flash('alertMessage', `${error.message}`)
      req.flash('alertStatus', 'danger')
      res.redirect(`/admin/item/detail-item/${itemId}`)
    }
  },

  viewBooking: async (req, res) => {
    try {
      const booking = await Booking.find()
        .populate('memberId')
        .populate('bankId')

      const alertMessage = req.flash('alertMessage')
      const alertStatus = req.flash('alertStatus')
      const alert = { message: alertMessage, status: alertStatus }

      res.render('admin/booking/view_booking', {
        title: 'Staycation | Booking',
        user: req.session.user,
        booking,
        alert,
      })
    } catch (error) {
      req.flash('alertMessage', `${error.message}`)
      req.flash('alertStatus', 'danger')
      res.redirect('/admin/booking')
    }
  },

  showDetailBooking: async (req, res) => {
    const { id } = req.params
    try {
      const booking = await Booking.findOne({ _id: id })
        .populate('memberId')
        .populate('bankId')

      const alertMessage = req.flash('alertMessage')
      const alertStatus = req.flash('alertStatus')
      const alert = { message: alertMessage, status: alertStatus }
      res.render('admin/booking/show_detail_booking', {
        title: 'Staycation | Booking',
        user: req.session.user,
        booking,
        alert,
      })
    } catch (error) {
      req.flash('alertMessage', `${error.message}`)
      req.flash('alertStatus', 'danger')
      res.redirect(`/admin/booking`)
    }
  },

  actionConfirmation: async (req, res) => {
    const { id } = req.params
    try {
      const booking = await Booking.findOne({ _id: id })
      booking.payments.status = 'Accept'
      await booking.save()
      req.flash('alertMessage', 'Success Confirmation Payment')
      req.flash('alertStatus', 'success')
      res.redirect(`/admin/booking${id}`)
    } catch (error) {
      req.flash('alertMessage', `${error.message}`)
      req.flash('alertStatus', 'danger')
      res.redirect(`/admin/booking/${id}`)
    }
  },

  actionReject: async (req, res) => {
    const { id } = req.params
    try {
      const booking = await Booking.findOne({ _id: id })
      booking.payments.status = 'Reject'
      await booking.save()
      req.flash('alertMessage', 'Success Reject Payment')
      req.flash('alertStatus', 'success')
      res.redirect(`/admin/booking/${id}`)
    } catch (error) {
      req.flash('alertMessage', `${error.message}`)
      req.flash('alertStatus', 'danger')
      res.redirect(`/admin/booking/${id}`)
    }
  },
}
