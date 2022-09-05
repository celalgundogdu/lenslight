import express from 'express';
import * as pageController from '../controllers/pageController.js';

const router = express.Router();


router.route('/about').get(pageController.getAboutPage);
router.route('/contact')
    .get(pageController.getContactPage)
    .post(pageController.sendMail);
router.route('/register').get(pageController.getRegisterPage);
router.route('/login').get(pageController.getLoginPage);
router.route('/logout').get(pageController.getLogout);
router.route('/').get(pageController.getIndexPage);

export default router;