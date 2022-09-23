const router = require('express').Router()
const adminController = require('../controllers/adminController')
const auth = require('../middlewares/auth')

// import middleware
const { uploadSingle, uploadMultiple } = require('../middlewares/multer')
// authentication
router.get('/signin', adminController.viewSignin)
router.post('/signin', adminController.actionSignin)
router.use(auth)
router.get('/logout', adminController.actionLogout)
//endpoint dashboard
router.get('/dashboard', adminController.viewDashboard)

// endpoint category
router.get('/category', adminController.viewCategory)
router.post('/category', adminController.addCategory)
router.put('/category', adminController.editCategory)
router.delete('/category/:id', adminController.deleteCategory)

// endpoint bank
router.get('/bank', adminController.viewBank)
router.post('/bank', uploadSingle, adminController.addBank)
router.put('/bank', uploadSingle, adminController.editBank)
router.delete('/bank/:id', adminController.deleteBank)

// endpoint item
router.get('/item', adminController.viewItem)
router.post('/item', uploadMultiple, adminController.addItem)
router.get('/item/image-item/:id', adminController.showImageItem)
router.get('/item/:id', adminController.showEditItem)
router.put('/item/:id', uploadMultiple, adminController.editItem)
router.delete('/item/:id/delete', adminController.deleteItem)

// endpoint detail item
router.get('/item/detail-item/:itemId', adminController.viewDetailItem)
router.post('/item/add/feature', uploadSingle, adminController.addFeature)
router.put('/item/edit/feature', uploadSingle, adminController.editFeature)
router.delete('/item/:itemId/feature/:id', adminController.deleteFeature)

router.post('/item/add/activity', uploadSingle, adminController.addActivity)
router.put('/item/edit/activity', uploadSingle, adminController.editActivity)
router.delete('/item/:itemId/activity/:id', adminController.deleteActivity)

router.get('/booking', adminController.viewBooking)
router.get('/booking/:id', adminController.showDetailBooking)
router.put('/booking/:id/confirmation', adminController.actionConfirmation)
router.put('/booking/:id/reject', adminController.actionReject)

module.exports = router
